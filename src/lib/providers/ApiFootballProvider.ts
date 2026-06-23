import type { DataProvider } from './DataProvider';
import type { Snapshot, Match, Group, Team, MatchStatus } from '@/types';
import { MOCK_TEAMS, TEAMS_BY_GROUP } from '@/data/mock/teams';
import { computeStandings } from '@/lib/standings/computeStandings';

// Adaptador para API-Football (api-sports.io). Solo corre en el SERVIDOR.
// Mapea la respuesta externa al modelo interno y marca los datos como 'confirmado'.
// NOTA: el mapeo de IDs externos a nuestros códigos de equipo se hace por nombre;
// en producción conviene una tabla de equivalencias. Si algo falla, hace fallback a mock.
export class ApiFootballProvider implements DataProvider {
  private base = process.env.FOOTBALL_API_BASE ?? 'https://v3.football.api-sports.io';
  private key = process.env.FOOTBALL_API_KEY ?? '';
  private league = process.env.FOOTBALL_LEAGUE_ID ?? '1';
  private season = process.env.FOOTBALL_SEASON ?? '2026';

  private async call(path: string) {
    const res = await fetch(`${this.base}${path}`, {
      headers: { 'x-apisports-key': this.key },
      next: { revalidate: Number(process.env.REVALIDATE_SECONDS ?? 300) },
    });
    if (!res.ok) throw new Error(`API-Football ${res.status}`);
    return res.json();
  }

  private mapStatus(short: string): MatchStatus {
    if (['1H', '2H', 'HT', 'ET', 'LIVE', 'P'].includes(short)) return 'en-juego';
    if (['FT', 'AET', 'PEN'].includes(short)) return 'finalizado';
    return 'programado';
  }

  async getSnapshot(): Promise<Snapshot> {
    if (!this.key) throw new Error('FOOTBALL_API_KEY no configurada');

    // Mantenemos nuestros equipos/grupos (composición conocida) y solo traemos
    // resultados/fixtures reales para enriquecerlos.
    const teams: Team[] = MOCK_TEAMS;
    const byName = new Map(teams.map(t => [t.name.toLowerCase(), t.id]));

    const data = await this.call(`/fixtures?league=${this.league}&season=${this.season}`);
    const matches: Match[] = (data.response ?? []).map((fx: any, idx: number): Match | null => {
      const homeId = byName.get(String(fx.teams?.home?.name).toLowerCase());
      const awayId = byName.get(String(fx.teams?.away?.name).toLowerCase());
      if (!homeId || !awayId) return null;
      const status = this.mapStatus(fx.fixture?.status?.short);
      return {
        id: `F${fx.fixture?.id ?? idx}`,
        groupId: teams.find(t => t.id === homeId)?.groupId,
        stage: 'grupos',
        kickoff: fx.fixture?.date,
        venue: fx.fixture?.venue?.name,
        homeTeamId: homeId, awayTeamId: awayId, status,
        score: status === 'programado' ? undefined
          : { home: fx.goals?.home ?? 0, away: fx.goals?.away ?? 0 },
        provenance: 'confirmado',
      };
    }).filter(Boolean) as Match[];

    const groups: Group[] = Object.entries(TEAMS_BY_GROUP).map(([id, teamIds]) => ({
      id, teamIds,
      standings: computeStandings(teamIds, matches.filter(m => m.groupId === id)),
    }));

    return {
      source: 'apifootball',
      provenance: 'confirmado',
      lastUpdated: new Date().toISOString(),
      teams, groups, matches,
      hasLiveMatches: matches.some(m => m.status === 'en-juego'),
    };
  }
}
