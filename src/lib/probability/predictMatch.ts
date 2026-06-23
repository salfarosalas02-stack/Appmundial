import { poissonPMF, expectedGoals } from './poisson';
import type { Team, MatchPrediction, ConfidenceLevel } from '@/types';

const GRID = 8; // marcadores 0..8 por lado

// Calcula todas las estadísticas de un partido a partir del modelo Poisson.
// Documentación de método: ver /metodologia. Salida SIEMPRE 'prediccion'.
export function predictMatch(matchId: string, home: Team, away: Team): MatchPrediction {
  const [lh, la] = expectedGoals(home, away);
  let winHome = 0, draw = 0, winAway = 0, btts = 0, csHome = 0, csAway = 0;
  let best = { home: 0, away: 0, prob: 0 };
  const dist = [0, 0, 0, 0, 0];

  for (let i = 0; i <= GRID; i++) {
    for (let j = 0; j <= GRID; j++) {
      const p = poissonPMF(i, lh) * poissonPMF(j, la);
      if (i > j) winHome += p; else if (i === j) draw += p; else winAway += p;
      if (i >= 1 && j >= 1) btts += p;
      if (j === 0) csHome += p;
      if (i === 0) csAway += p;
      if (p > best.prob) best = { home: i, away: j, prob: p };
      dist[Math.min(4, i + j)] += p;
    }
  }

  const over25 = dist[3] + dist[4];
  // Confianza: a mayor diferencia de nivel, más confianza; con techo por muestra pequeña.
  const gap = Math.abs(lh - la);
  const confidence: ConfidenceLevel = gap > 1.1 ? 'alto' : gap > 0.5 ? 'medio' : 'bajo';

  return {
    matchId,
    winHome, draw, winAway,
    expectedGoalsHome: lh, expectedGoalsAway: la,
    mostLikelyScore: best,
    bttsProbability: btts,
    cleanSheetHome: csHome, cleanSheetAway: csAway,
    over25,
    goalsDistribution: dist,
    confidence,
    provenance: 'prediccion',
  };
}
