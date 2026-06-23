import type { DataProvider } from './DataProvider';
import { MockProvider } from './MockProvider';
import { ApiFootballProvider } from './ApiFootballProvider';

// Selector de fuente por variable de entorno. Un solo punto de cambio.
export function getProvider(): DataProvider {
  const source = (process.env.DATA_SOURCE ?? 'mock').toLowerCase();
  if (source === 'apifootball') return new ApiFootballProvider();
  return new MockProvider();
}
