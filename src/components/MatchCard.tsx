import Link from 'next/link';
import type { Match, Team } from '@/types';
import { predictMatch } from '@/lib/probability/predictMatch';
import { ProbabilityBar } from './ProbabilityBar';

export function MatchCard({ match, teams }: { match: Match; teams: Record<string, Team> }) {
  const home = teams[match.homeTeamId], away = teams[match.awayTeamId];
  if (!home || !away) return null;
  const pr = predictMatch(match.id, home, away);
  const done = match.status === 'finalizado' && match.score;
  return (
    <Link href={`/partido/${match.id}`} className="plain">
      <div className="mcard">
        <div className="top">
          <span className="grp">Grupo {match.groupId} · J{match.matchday}</span>
          <span>{done ? 'Finalizado' : match.status === 'en-juego' ? 'En juego' : 'Programado'}</span>
        </div>
        <div className="teams">
          <div className="team"><div className="fl">{home.flag}</div><div className="nm">{home.name}</div></div>
          <div className="mid">
            <div className="sc">{done ? `${match.score!.home}·${match.score!.away}` : 'vs'}</div>
            <div className="ko">{match.venue?.split(',')[0]}</div>
          </div>
          <div className="team"><div className="fl">{away.flag}</div><div className="nm">{away.name}</div></div>
        </div>
        <ProbabilityBar h={pr.winHome} d={pr.draw} a={pr.winAway} />
        <div className="foot">
          <span className="badge b-prediccion">Predicción</span>
          <span>Conf.</span><span className={`conf-tag conf-${pr.confidence}`}>{pr.confidence}</span>
          <span style={{ marginLeft: 'auto' }}>Ver análisis →</span>
        </div>
      </div>
    </Link>
  );
}
