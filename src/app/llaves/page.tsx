import { getProvider } from '@/lib/providers';
import { buildBracket } from '@/lib/bracket/buildBracket';

export const revalidate = 300;

export default async function LlavesPage() {
  const snap = await getProvider().getSnapshot();
  const { rounds, champion } = buildBracket(snap.teams);
  return (
    <div className="wrap">
      <div className="hero" style={{ paddingBottom: 6 }}>
        <h1>Llaves de <span>eliminación</span></h1>
        <p>El cuadro real se fija con las posiciones finales de grupos. Esta es la <b style={{ color: 'var(--pink2)' }}>proyección del modelo</b>: 32 clasificados (2 por grupo + 8 mejores terceros) y el ganador estimado de cada cruce. Es una simulación, no un pronóstico cerrado.</p>
      </div>
      <div className="champ-box">
        <div className="tro">🏆</div>
        <div>
          <div className="lab">Campeón proyectado por el modelo</div>
          <div className="ch"><span className="fl">{champion.flag}</span>{champion.name}</div>
        </div>
      </div>
      <div style={{ overflowX: 'auto', paddingBottom: 14 }}>
        <div className="bracket">
          {rounds.map((rd) => (
            <div key={rd.name} className={`round ${rd.name === 'Final' ? 'r-final' : ''}`}>
              <div className="round-h">{rd.name}</div>
              {rd.ties.map((t, i) => {
                const aw = t.winner.id === t.a.id;
                return (
                  <div className="tie" key={i}>
                    <div className={`row ${aw ? 'win' : 'out'}`}><span className="fl">{t.a.flag}</span><span className="nm">{t.a.name}</span>{aw && <span className="pb">{t.winProb}%</span>}</div>
                    <div className={`row ${!aw ? 'win' : 'out'}`}><span className="fl">{t.b.flag}</span><span className="nm">{t.b.name}</span>{!aw && <span className="pb">{t.winProb}%</span>}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <span className="badge b-prediccion">Proyección</span>{' '}
        <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>El emparejamiento usa siembra por nivel; el cruce oficial FIFA sigue un cuadro predeterminado. Cada llave se resuelve con el modelo Poisson.</span>
      </div>
    </div>
  );
}
