// Distribución de Poisson: P(k goles | media lambda).
export function poissonPMF(k: number, lambda: number): number {
  let fact = 1;
  for (let i = 2; i <= k; i++) fact *= i;
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / fact;
}

export const TOURNAMENT_AVG_GOALS = 1.35; // mu: goles promedio por equipo y partido (estimación)

// Goles esperados (lambda) de cada equipo cruzando su ataque con la defensa rival.
export function expectedGoals(
  home: { attack: number; defense: number },
  away: { attack: number; defense: number },
  mu = TOURNAMENT_AVG_GOALS
): [number, number] {
  const lh = Math.max(0.25, home.attack * away.defense * mu);
  const la = Math.max(0.25, away.attack * home.defense * mu);
  return [lh, la];
}
