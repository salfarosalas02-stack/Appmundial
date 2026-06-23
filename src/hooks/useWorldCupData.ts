'use client';
import useSWR from 'swr';
import type { Snapshot } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

// Actualización automática: SWR repregunta /api/snapshot.
// El intervalo se ACELERA si hay partidos en vivo y se relaja si no hay ninguno.
export function useWorldCupData(initial?: Snapshot) {
  const { data, error, isLoading, mutate } = useSWR<Snapshot>('/api/snapshot', fetcher, {
    fallbackData: initial,
    refreshInterval: (latest) => (latest?.hasLiveMatches ? 30_000 : 300_000),
    revalidateOnFocus: true,
    keepPreviousData: true,
  });
  return { snapshot: data, error, isLoading, refresh: mutate };
}
