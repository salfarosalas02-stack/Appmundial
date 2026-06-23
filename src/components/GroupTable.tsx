import type { Group, Team, DataProvenance } from '@/types';

export function GroupTable({ group, teams, provenance }: { group: Group; teams: Record<string, Team>; provenance: DataProvenance }) {
  return (
    <div className="gcard">
      <div className="gh">
        <h3>Grupo {group.id}</h3>
        <span className={`badge b-${provenance}`}>{provenance === 'confirmado' ? 'Tabla real' : 'Tabla simulada'}</span>
      </div>
      <table>
        <thead><tr><th>#</th><th className="l">Selección</th><th>PJ</th><th>G-E-P</th><th>DG</th><th>Pts</th></tr></thead>
        <tbody>
          {group.standings.map((s, i) => {
            const t = teams[s.teamId];
            const qcls = i === 0 ? 'q1' : i === 1 ? 'q2' : i === 2 ? 'q3' : 'q4';
            return (
              <tr key={s.teamId}>
                <td><span className={`pos ${qcls}`}>{i + 1}</span></td>
                <td className="l"><div className="tm"><span className="fl">{t?.flag}</span><span className="nm">{t?.name}</span></div></td>
                <td>{s.played}</td><td>{s.won}-{s.drawn}-{s.lost}</td>
                <td className={s.goalDifference > 0 ? 'gd-pos' : s.goalDifference < 0 ? 'gd-neg' : ''}>{s.goalDifference > 0 ? '+' : ''}{s.goalDifference}</td>
                <td className="pts">{s.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
