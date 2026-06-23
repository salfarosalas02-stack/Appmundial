import type { DataProvenance } from '@/types';
const LABEL: Record<DataProvenance, string> = {
  confirmado: 'Confirmado', estimado: 'Estimado', simulado: 'Simulado', prediccion: 'Predicción',
};
export function ProvenanceBadge({ kind }: { kind: DataProvenance }) {
  return <span className={`badge b-${kind}`}>{LABEL[kind]}</span>;
}
