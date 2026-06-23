// Modelo de datos central. La pieza clave es DataProvenance:
// cada dato sensible declara de dónde viene y se propaga hasta la UI.

export type DataProvenance = 'confirmado' | 'estimado' | 'simulado' | 'prediccion';
export type ConfidenceLevel = 'alto' | 'medio' | 'bajo';
export type MatchStatus = 'programado' | 'en-juego' | 'finalizado';
export type Stage = 'grupos' | '16avos' | 'octavos' | 'cuartos' | 'semis' | 'final';

export interface Team {
  id: string;          // código corto, p.ej. "ARG"
  name: string;
  flag: string;        // emoji bandera
  groupId: string;
  attack: number;      // fuerza ofensiva (1 = media del torneo)
  defense: number;     // goles que suele conceder (menos = mejor defensa)
  fifaRanking?: number;
}

export interface Match {
  id: string;
  groupId?: string;
  stage: Stage;
  matchday?: number;
  kickoff: string;     // ISO
  venue?: string;
  homeTeamId: string;
  awayTeamId: string;
  status: MatchStatus;
  score?: { home: number; away: number };
  provenance: DataProvenance;
}

export interface Standing {
  teamId: string;
  position: number;
  played: number; won: number; drawn: number; lost: number;
  goalsFor: number; goalsAgainst: number; goalDifference: number;
  points: number;
}

export interface Group {
  id: string;
  teamIds: string[];
  standings: Standing[];
}

export interface MatchPrediction {
  matchId: string;
  winHome: number; draw: number; winAway: number;
  expectedGoalsHome: number; expectedGoalsAway: number;
  mostLikelyScore: { home: number; away: number; prob: number };
  bttsProbability: number;
  cleanSheetHome: number; cleanSheetAway: number;
  over25: number;
  goalsDistribution: number[]; // [P(0),P(1),P(2),P(3),P(4+)]
  confidence: ConfidenceLevel;
  provenance: 'prediccion';
}

// Lo que el proveedor entrega a la app en cada actualización.
export interface Snapshot {
  source: 'mock' | 'apifootball';
  provenance: DataProvenance;   // 'simulado' o 'confirmado'
  lastUpdated: string;          // ISO
  teams: Team[];
  groups: Group[];
  matches: Match[];
  hasLiveMatches: boolean;
  notice?: string;              // aviso para mostrar al usuario (ej. fallo de API)
}
