import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProvider } from '@/lib/providers';
import { predictMatch } from '@/lib/probability/predictMatch';
import type { Team } from '@/types';

export const revalidate = 120;
const pct = (x: number) => Math.round(x * 100);

export default async function MatchPage({ params }: { params: { matchId: string } }) {
  const snap = await getProvider().getSnapshot();
  const match = snap.matches.find(m => m.id === params.matchId);
  if (!match) notFound();
  const teams: Record<string, Team> = Object.fromEntries(snap.teams.map(t => [t.id, t]));
  const A = teams[match.homeTeamId], B = teams[match.awayTeamId];
  const pr = predictMatch(match.id, A, B);
  const done = match.status === 'finalizado' && match.score;
  const fav = pr.winHome > pr.winAway ? A : B;
  const pf = Math.max(pr.winHome, pr.winAway);
  const cerrado = Math.abs(pr.winHome - pr.winAway) < 0.18;

  return (
    <div className="wrap">
      <Link href="/" className="back">← Volver</Link>
      <div className="mh">
        <div className="mh-teams">
          <div className="t"><div className="fl">{A.flag}</div><div className="nm">{A.name}</div></div>
          <div className="t" style={{ width: 100 }}>
            {done ? <div className="sc">{match.score!.home} · {match.score!.away}</div> : <div className="vs">vs</div>}
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Grupo {match.groupId} · Jornada {match.matchday}</div>
          </div>
          <div className="t"><div className="fl">{B.flag}</div><div className="nm">{B.name}</div></div>
        </div>
        <div className="mh-meta">
          <span>📍 {match.venue}</span><span>🏟️ Sede neutral</span>
          <span>{done ? `✅ Finalizado${snap.source === 'mock' ? ' (simulado)' : ''}` : '🕑 Programado'}</span>
        </div>
      </div>

      <div className="block">
        <h4>Probabilidad de resultado <span className="badge b-prediccion">Predicción · conf. {pr.confidence}</span></h4>
        <div className="bigprob">
          <i className="h" style={{ width: `${pct(pr.winHome)}%` }}>{pct(pr.winHome)}%</i>
          <i className="d" style={{ width: `${pct(pr.draw)}%` }}>{pct(pr.draw)}%</i>
          <i className="a" style={{ width: `${pct(pr.winAway)}%` }}>{pct(pr.winAway)}%</i>
        </div>
        <div className="bp-lab"><span>Gana {A.name}</span><span>Empate</span><span>Gana {B.name}</span></div>
      </div>

      <div className="block">
        <h4>Marcador y goles esperados <span className="badge b-prediccion">Predicción</span></h4>
        <div className="sgrid">
          <div className="stat hl"><div className="n">{pr.mostLikelyScore.home}-{pr.mostLikelyScore.away}</div><div className="k">Marcador más probable</div></div>
          <div className="stat"><div className="n">{pr.expectedGoalsHome.toFixed(2)}</div><div className="k">Goles esp. {A.name.split(' ')[0]}</div></div>
          <div className="stat"><div className="n">{pr.expectedGoalsAway.toFixed(2)}</div><div className="k">Goles esp. {B.name.split(' ')[0]}</div></div>
          <div className="stat"><div className="n">{pct(pr.over25)}%</div><div className="k">Más de 2.5 goles</div></div>
        </div>
      </div>

      <div className="block">
        <h4>Distribución de goles totales <span className="badge b-prediccion">Predicción</span></h4>
        <div className="dist">
          {pr.goalsDistribution.map((p, i) => (
            <div className="col" key={i}>
              <div className="pc">{pct(p)}%</div>
              <div className="bar" style={{ height: `${Math.max(3, p * 150)}px` }} />
              <div className="gl">{i === 4 ? '4+' : i}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="block">
        <h4>Mercados de gol <span className="badge b-prediccion">Predicción</span></h4>
        <div className="sgrid">
          <div className="stat"><div className="n">{pct(pr.bttsProbability)}%</div><div className="k">Ambos anotan</div></div>
          <div className="stat"><div className="n">{pct(pr.cleanSheetHome)}%</div><div className="k">Valla cero {A.name.split(' ')[0]}</div></div>
          <div className="stat"><div className="n">{pct(pr.cleanSheetAway)}%</div><div className="k">Valla cero {B.name.split(' ')[0]}</div></div>
        </div>
      </div>

      <div className="block">
        <h4>Conclusión estadística</h4>
        <div className="concl">
          {cerrado
            ? <>El modelo proyecta un partido <b>parejo</b>, con leve ventaja para {fav.name} ({pct(pf)}%). </>
            : <>El modelo ve a <b>{fav.name}</b> como favorito ({pct(pf)}% de victoria). </>}
          Escenario más probable: <b>{pr.mostLikelyScore.home}-{pr.mostLikelyScore.away}</b>.{' '}
          {pr.over25 > 0.5 ? `Se proyecta un partido con goles (${pct(pr.over25)}% de superar 2.5). ` : 'Se proyecta un partido más cerrado en goles. '}
          {pr.bttsProbability > 0.5 ? 'Buena chance de que ambos marquen.' : 'Una de las dos defensas podría dejar su valla a cero.'}
          {' '}<span style={{ color: 'var(--muted)' }}>Confianza: {pr.confidence}. Es una estimación, no una certeza.</span>
        </div>
      </div>
    </div>
  );
}
