'use client';
import type { Snapshot, Team } from '@/types';
import { useWorldCupData } from '@/hooks/useWorldCupData';
import { LastUpdatedBadge } from './LastUpdatedBadge';
import { MatchCard } from './MatchCard';
import { GroupTable } from './GroupTable';

// Componente cliente: recibe un snapshot inicial (render en servidor) y a partir de ahí
// se ACTUALIZA SOLO vía SWR. No hace falta recargar la página.
export function Dashboard({ initial }: { initial: Snapshot }) {
  const { snapshot, isLoading } = useWorldCupData(initial);
  const snap = snapshot ?? initial;
  const teams: Record<string, Team> = Object.fromEntries(snap.teams.map(t => [t.id, t]));

  const upcoming = snap.matches.filter(m => m.status !== 'finalizado').slice(0, 9);
  const recent = snap.matches.filter(m => m.status === 'finalizado').slice(0, 6);
  const isReal = snap.source === 'apifootball';

  return (
    <div className="wrap">
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 14 }}>
        <LastUpdatedBadge snapshot={snap} loading={isLoading} />
      </div>

      <div className="hero">
        <h1>Tu casa del <span>Mundial 2026</span></h1>
        <p>Grupos, tablas y análisis estadístico de cada partido con un modelo Poisson explicado. Se actualiza automáticamente {snap.hasLiveMatches ? 'cada 30 s (hay partidos en vivo)' : 'cada 5 minutos'}.</p>
        <div className={`banner ${isReal ? 'real' : ''}`}>
          {isReal
            ? <span>✅ Conectado a datos reales. Resultados y tablas confirmados; las probabilidades siguen siendo estimaciones del modelo.</span>
            : <span>🟡 <b>Modo demostración.</b> Grupos y selecciones reales; resultados y tablas simulados. Define <code>DATA_SOURCE=apifootball</code> y tu API key para datos confirmados.</span>}
        </div>
        {snap.notice && <p style={{ fontSize: 12, color: 'var(--muted2)' }}>{snap.notice}</p>}
      </div>

      <section>
        <div className="sec-h"><div className="bar" /><h2>Próximos partidos</h2>
          <div className="count">{snap.matches.filter(m => m.status !== 'finalizado').length} pendientes</div></div>
        <div className="grid g-match">{upcoming.map(m => <MatchCard key={m.id} match={m} teams={teams} />)}</div>
      </section>

      <section>
        <div className="sec-h"><div className="bar" /><h2>Últimos resultados</h2>
          <span className={`badge b-${snap.provenance}`}>{isReal ? 'Confirmado' : 'Simulado'}</span></div>
        <div className="grid g-match">{recent.map(m => <MatchCard key={m.id} match={m} teams={teams} />)}</div>
      </section>

      <section>
        <div className="sec-h"><div className="bar" /><h2>Los 12 grupos</h2></div>
        <div className="grid g-group">{snap.groups.map(g => <GroupTable key={g.id} group={g} teams={teams} provenance={snap.provenance} />)}</div>
      </section>
    </div>
  );
}
