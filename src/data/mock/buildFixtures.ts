import type { Match } from '@/types';
import { TEAMS_BY_GROUP } from './teams';
import { MOCK_TEAMS } from './teams';

const VENUES = ['Estadio Azteca, CDMX','MetLife, Nueva Jersey','SoFi, Los Ángeles','AT&T, Dallas','Mercedes-Benz, Atlanta','Hard Rock, Miami','Arrowhead, Kansas City','Lincoln Financial, Filadelfia','Gillette, Boston','BMO Field, Toronto','BC Place, Vancouver','NRG, Houston'];
const RR: [number, number, number][] = [[0,1,1],[2,3,1],[0,2,2],[3,1,2],[3,0,3],[1,2,3]]; // i, j, jornada

const teamMap = Object.fromEntries(MOCK_TEAMS.map(t => [t.id, t]));
let rngState = 20260611;
const rand = () => { rngState = (rngState * 1103515245 + 12345) & 0x7fffffff; return rngState / 0x7fffffff; };
function samplePoisson(l: number) { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= rand(); } while (p > L); return k - 1; }

// Genera el fixture de grupos. La jornada 1 se simula como "finalizada" para poblar tablas.
// Todo marcado como 'simulado'.
export function buildMockMatches(): Match[] {
  const matches: Match[] = [];
  let vi = 0, mid = 0;
  for (const [gid, ids] of Object.entries(TEAMS_BY_GROUP)) {
    for (const [i, j, md] of RR) {
      const home = teamMap[ids[i]], away = teamMap[ids[j]];
      const finalized = md === 1;
      let score;
      if (finalized) {
        const lh = home.attack * away.defense * 1.35;
        const la = away.attack * home.defense * 1.35;
        score = { home: samplePoisson(lh), away: samplePoisson(la) };
      }
      matches.push({
        id: `M${++mid}`, groupId: gid, stage: 'grupos', matchday: md,
        kickoff: new Date(Date.UTC(2026, 5, 10 + md * 2, 18)).toISOString(),
        venue: VENUES[vi++ % VENUES.length],
        homeTeamId: home.id, awayTeamId: away.id,
        status: finalized ? 'finalizado' : 'programado',
        score, provenance: 'simulado',
      });
    }
  }
  return matches;
}
