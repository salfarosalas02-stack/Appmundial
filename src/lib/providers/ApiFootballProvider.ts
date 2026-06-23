import type { DataProvider } from './DataProvider';
import type { Snapshot, Match, Group, Team, MatchStatus } from '@/types';
import { MOCK_TEAMS, TEAMS_BY_GROUP } from '@/data/mock/teams';
import { computeStandings } from '@/lib/standings/computeStandings';
import { MockProvider } from './MockProvider';

// Adaptador para API-Football (api-sports.io). Solo corre en el SERVIDOR.
// Mapea la respuesta externa al modelo interno y marca los datos como 'confirmado'.
// IMPORTANTE: nunca lanza error. Si la API falla o no trae partidos del Mundial,
// devuelve datos de demostracion (mock) con un aviso, para no romper la web.

// La API devuelve los nombres en ingles; nuestra UI los tiene en espanol.
// Esta tabla traduce: id interno -> posibles nombres que puede usar la API (en minusculas).
const API_NAME_ALIASES: Record<string, string[]> = {
  MEX: ['mexico'], RSA: ['south africa'], KOR: ['south korea', 'korea republic', 'korea'],
  CZE: ['czechia', 'czech republic'], CAN: ['canada'], BIH: ['bosnia and herzegovina', 'bosnia'],
  QAT: ['qatar'], SUI: ['switzerland'], BRA: ['brazil'], MAR: ['morocco'], HAI: ['haiti'],
  SCO: ['scotland'], USA: ['usa', 'united states'], PAR: ['paraguay'], AUS: ['australia'],
  TUR: ['turkey', 'turkiye'], GER: ['germany'], CUW: ['curacao'],
  CIV: ['ivory coast', 'cote divoire'], ECU: ['ecuador'],
  NED: ['netherlands'], JPN: ['japan'], SWE: ['sweden'], TUN: ['tunisia'],
  BEL: ['belgium'], EGY: ['egypt'], IRN: ['iran'], NZL: ['new zealand'],
  ESP: ['spain'], CPV: ['cape verde', 'cape verde islands', 'cabo verde'], KSA: ['saudi arabia'],
  URU: ['uruguay'], FRA: ['france'], SEN: ['senegal'], IRQ: ['iraq'], NOR: ['norway'],
  ARG: ['argentina'], ALG: ['algeria'], AUT: ['austria'], JOR: ['jordan'],
  POR: ['portugal'], COD: ['dr congo', 'congo dr', 'democratic republic of congo'],
  UZB: ['uzbekistan'], COL: ['colombia'], ENG: ['england'], CRO: ['croatia'],
  GHA: ['ghana'], PAN: ['panama'],
};

// Normaliza un nombre para comparar (minusculas, sin acentos ni signos).
function norm(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z ]/g, '')
    .trim();
}

const NAME_TO_ID = new Map<string, string>();
for (const [id, aliases] of Object.entries(API_NAME_ALIASES)) {
  for (const a of aliases) NAME_TO_ID.set(norm(a), id);
}

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

  private idFromName(name: string): string | undefined {
    return NAME_TO_ID.get(norm(name));
  }

  private mapStatus(short: string): MatchStatus {
    if (['1H', '2H', 'HT', 'ET', 'BT', 'LIVE', 'P'].includes(short)) return 'en-juego';
    if (['FT', 'AET', 'PEN'].includes(short)) return 'finalizado';
    return 'programado';
  }

  // Devuelve la demo con un aviso. Se usa como respaldo si la API no sirve datos reales.
  private async fallback(notice: string): Promise<Snapshot> {
    const snap = await new MockProvider().getSnapshot();
    snap.notice = notice;
    return snap;
  }

  async getSnapshot(): Promise<Snapshot> {
    if (!this.key) return this.fallback('Sin API key: mostrando datos de demostracion.');

    try {
      const teams: Team[] = MOCK_TEAMS;
      const data = await this.call(`/fixtures?league=${this.league}&season=${this.season}`);
      const response: any[] = data.response ?? [];

      const matches: Match[] = response.map((fx: any, idx: number): Match | null => {
        const homeId = this.idFromName(fx.teams?.home?.name);
        const awayId = this.idFromName(fx.teams?.away?.name);
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

      // La API respondio pero sin partidos del Mundial reconocibles -> demo con aviso.
      if (matches.length === 0) {
        return this.fallback('La fuente real no devolvio partidos del Mundial (el plan gratuito de la API no lo cubre). Mostrando datos de demostracion.');
      }

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
    } catch (err) {
      return this.fallback(`No se pudo leer la fuente real (${(err as Error).message}). Mostrando datos de demostracion.`);
    }
  }
}
