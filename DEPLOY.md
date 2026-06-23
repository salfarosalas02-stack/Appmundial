# Subir la web a internet (gratis)

La forma más rápida y gratuita es **Vercel** (los creadores de Next.js). Dos caminos:

## Opción A — Sin instalar nada (recomendada, ~3 min)
1. Sube esta carpeta a un repositorio nuevo en https://github.com (botón "New repository" → arrastra los archivos, o usa GitHub Desktop).
2. Entra a https://vercel.com y crea una cuenta con ese mismo GitHub.
3. "Add New… → Project" → elige el repositorio → **Deploy**. Vercel detecta Next.js solo.
4. (Opcional, datos reales) En Vercel: Settings → Environment Variables, añade:
   `DATA_SOURCE=apifootball`, `FOOTBALL_API_KEY=tu_key`, `FOOTBALL_LEAGUE_ID`, `FOOTBALL_SEASON`.
   Redeploy. La key queda solo en el servidor de Vercel.
5. Te dan una URL pública del tipo `https://mundial-2026-app.vercel.app`. Listo.

## Opción B — Desde la terminal
```bash
npm i -g vercel
cd mundial-2026-app
vercel        # primer deploy (te pide login en el navegador)
vercel --prod # publicar a producción
```

## Notas
- En modo demo funciona online sin ninguna key (datos simulados, etiquetados).
- La actualización automática sigue funcionando en producción: ISR en el servidor +
  polling SWR en el cliente (se acelera con partidos en vivo).
- Alternativas equivalentes: Netlify o Cloudflare Pages (mismo flujo desde GitHub).
