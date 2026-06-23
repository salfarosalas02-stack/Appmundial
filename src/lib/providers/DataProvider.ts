import type { Snapshot } from '@/types';

// Contrato único que usa toda la app. La UI nunca llama a una API concreta:
// llama al provider activo. Cambiar de fuente = cambiar la implementación, no la UI.
export interface DataProvider {
  getSnapshot(): Promise<Snapshot>;
}
