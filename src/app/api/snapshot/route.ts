import { NextResponse } from 'next/server';
import { getProvider } from '@/lib/providers';
import { MockProvider } from '@/lib/providers/MockProvider';

// Endpoint que el cliente consulta para refrescar. La API key vive aquí (servidor),
// nunca viaja al navegador. Si la fuente real falla, hace fallback a mock con aviso.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const snapshot = await getProvider().getSnapshot();
    return NextResponse.json(snapshot);
  } catch (err) {
    const fallback = await new MockProvider().getSnapshot();
    fallback.notice = `No se pudo leer la fuente real (${(err as Error).message}). Mostrando datos simulados.`;
    return NextResponse.json(fallback, { status: 200 });
  }
}
