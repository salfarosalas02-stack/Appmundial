'use client';
import type { Snapshot } from '@/types';

export function LastUpdatedBadge({ snapshot, loading }: { snapshot?: Snapshot; loading: boolean }) {
  const live = snapshot?.hasLiveMatches;
  const time = snapshot ? new Date(snapshot.lastUpdated).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }) : '—';
  return (
    <div className="updated">
      <span className={`dot ${live ? 'live' : 'idle'}`} />
      {loading ? 'Actualizando…' : `${live ? 'EN VIVO · ' : ''}Actualizado ${time}`}
      <span style={{ opacity: .7 }}>· {snapshot?.source === 'apifootball' ? 'API real' : 'demo'}</span>
    </div>
  );
}
