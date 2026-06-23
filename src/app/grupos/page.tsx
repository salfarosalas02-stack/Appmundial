import Link from 'next/link';
import { getProvider } from '@/lib/providers';
import { GroupTable } from '@/components/GroupTable';
import type { Team } from '@/types';

export const revalidate = 300;

export default async function GruposPage({ searchParams }: { searchParams: { g?: string } }) {
  const snap = await getProvider().getSnapshot();
  const teams: Record<string, Team> = Object.fromEntries(snap.teams.map(t => [t.id, t]));
  const sel = searchParams.g;
  const groups = sel ? snap.groups.filter(g => g.id === sel) : snap.groups;
  return (
    <div className="wrap">
      <div className="hero" style={{ paddingBottom: 6 }}>
        <h1>Fase de <span>grupos</span></h1>
        <p>12 grupos · 48 selecciones. Posiciones automáticas por reglas FIFA (puntos, diferencia de gol, goles a favor).</p>
      </div>
      <div className="filters">
        <Link href="/grupos" className={!sel ? 'active' : ''}>Todos</Link>
        {snap.groups.map(g => <Link key={g.id} href={`/grupos?g=${g.id}`} className={sel === g.id ? 'active' : ''}>Grupo {g.id}</Link>)}
      </div>
      <div className="grid g-group">
        {groups.map(g => <GroupTable key={g.id} group={g} teams={teams} provenance={snap.provenance} />)}
      </div>
    </div>
  );
}
