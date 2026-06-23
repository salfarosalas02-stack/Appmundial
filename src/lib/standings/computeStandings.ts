import type { Match, Standing } from '@/types';

// Calcula la tabla de un grupo desde los partidos finalizados.
// Orden FIFA: puntos -> diferencia de gol -> goles a favor.
export function computeStandings(teamIds: string[], matches: Match[]): Standing[] {
  const table: Record<string, Standing> = {};
  teamIds.forEach((id, idx) => {
    table[id] = {
      teamId: id, position: idx + 1, played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
    };
  });

  for (const m of matches) {
    if (m.status !== 'finalizado' || !m.score) continue;
    const h = table[m.homeTeamId], a = table[m.awayTeamId];
    if (!h || !a) continue;
    const gh = m.score.home, ga = m.score.away;
    h.played++; a.played++;
    h.goalsFor += gh; h.goalsAgainst += ga;
    a.goalsFor += ga; a.goalsAgainst += gh;
    if (gh > ga) { h.won++; a.lost++; h.points += 3; }
    else if (gh < ga) { a.won++; h.lost++; a.points += 3; }
    else { h.drawn++; a.drawn++; h.points++; a.points++; }
  }

  const sorted = Object.values(table).sort((x, y) =>
    y.points - x.points ||
    (y.goalsFor - y.goalsAgainst) - (x.goalsFor - x.goalsAgainst) ||
    y.goalsFor - x.goalsFor
  );
  sorted.forEach((s, i) => { s.position = i + 1; s.goalDifference = s.goalsFor - s.goalsAgainst; });
  return sorted;
}
