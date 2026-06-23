import type { DataProvider } from './DataProvider';
import type { Snapshot, Group } from '@/types';
import { MOCK_TEAMS, TEAMS_BY_GROUP } from '@/data/mock/teams';
import { buildMockMatches } from '@/data/mock/buildFixtures';
import { computeStandings } from '@/lib/standings/computeStandings';

export class MockProvider implements DataProvider {
  async getSnapshot(): Promise<Snapshot> {
    const matches = buildMockMatches();
    const groups: Group[] = Object.entries(TEAMS_BY_GROUP).map(([id, teamIds]) => ({
      id, teamIds,
      standings: computeStandings(teamIds, matches.filter(m => m.groupId === id)),
    }));
    return {
      source: 'mock',
      provenance: 'simulado',
      lastUpdated: new Date().toISOString(),
      teams: MOCK_TEAMS,
      groups,
      matches,
      hasLiveMatches: matches.some(m => m.status === 'en-juego'),
      notice: 'Datos simulados de demostración. Conecta una API real para datos confirmados.',
    };
  }
}
