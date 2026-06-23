import type { Team } from '@/types';
import { predictMatch } from '@/lib/probability/predictMatch';

export interface Tie { a: Team; b: Team; winner: Team; winProb: number; }
export interface Round { name: string; ties: Tie[]; }
export interface BracketResult { rounds: Round[]; champion: Team; }

const strength = (t: Team) => t.attack / t.defense;

// 2 primeros de cada grupo (por nivel proyectado) + 8 mejores terceros = 32.
function projectedQualifiers(teams: Team[]): Team[] {
  const byGroup: Record<string, Team[]> = {};
  teams.forEach(t => { (byGroup[t.groupId] ??= []).push(t); });
  const firsts: Team[] = [], seconds: Team[] = [], thirds: Team[] = [];
  Object.values(byGroup).forEach(g => {
    const ranked = [...g].sort((a, b) => strength(b) - strength(a));
    firsts.push(ranked[0]); seconds.push(ranked[1]); thirds.push(ranked[2]);
  });
  const bestThirds = thirds.sort((a, b) => strength(b) - strength(a)).slice(0, 8);
  return [...firsts, ...seconds, ...bestThirds].sort((a, b) => strength(b) - strength(a));
}

// Posiciones de siembra clásicas para un cuadro de n (potencia de 2).
function seedOrder(n: number): number[] {
  let pots = [1, 2];
  while (pots.length < n) {
    const len = pots.length * 2 + 1, np: number[] = [];
    pots.forEach(p => { np.push(p); np.push(len - p); });
    pots = np;
  }
  return pots;
}

export function buildBracket(teams: Team[]): BracketResult {
  const seeds = projectedQualifiers(teams);
  const slots = seedOrder(32).map(s => seeds[s - 1]);
  const names = ['16avos', 'Octavos', 'Cuartos', 'Semifinal', 'Final'];
  const rounds: Round[] = [];
  let cur = slots;
  for (let r = 0; r < 5; r++) {
    const ties: Tie[] = [], next: Team[] = [];
    for (let i = 0; i < cur.length; i += 2) {
      const a = cur[i], b = cur[i + 1];
      const pr = predictMatch(`${r}-${i}`, a, b);
      const aWins = pr.winHome >= pr.winAway;
      const winner = aWins ? a : b;
      const winProb = Math.round((aWins ? pr.winHome + pr.draw / 2 : pr.winAway + pr.draw / 2) * 100);
      ties.push({ a, b, winner, winProb }); next.push(winner);
    }
    rounds.push({ name: names[r], ties }); cur = next;
  }
  return { rounds, champion: cur[0] };
}
