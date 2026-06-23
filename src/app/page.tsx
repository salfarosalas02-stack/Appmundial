import { getProvider } from '@/lib/providers';
import { Dashboard } from '@/components/Dashboard';

// Revalidación incremental en servidor (ISR): la página se regenera sola.
export const revalidate = 300;

export default async function HomePage() {
  // Render inicial con datos del servidor (la API key nunca llega al cliente).
  const initial = await getProvider().getSnapshot();
  return <Dashboard initial={initial} />;
}
