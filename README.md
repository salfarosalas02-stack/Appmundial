# Mundial 2026 · Centro de Análisis (Next.js)

Plataforma de análisis del Mundial 2026: grupos, tablas automáticas y predicciones
estadísticas (modelo Poisson) con **actualización automática**. Construida sobre la
arquitectura del documento de diseño.

## Cómo ejecutarlo

```bash
npm install
cp .env.example .env.local   # funciona tal cual en modo "mock"
npm run dev                  # http://localhost:3000
```

Arranca en **modo demostración** (datos simulados, etiquetados). No necesita API key.

## Conectar datos reales (API-Football)

1. Crea una cuenta en https://www.api-football.com/ (api-sports.io) y copia tu key.
2. En `.env.local`:
   ```
   DATA_SOURCE=apifootball
   FOOTBALL_API_KEY=tu_key_aqui
   FOOTBALL_LEAGUE_ID=<id de la World Cup según /leagues>
   FOOTBALL_SEASON=2026
   ```
3. Reinicia. La key vive solo en el servidor (`/api/snapshot`); nunca se expone al navegador.

> Para cambiar de proveedor (Football-Data, SportMonks…), crea una clase que implemente
> `DataProvider` en `src/lib/providers/` y regístrala en `index.ts`. La UI no cambia.

## Cómo funciona la actualización automática

1. **Servidor (ISR):** `src/app/page.tsx` exporta `revalidate = 300`; la página se
   regenera sola cada 5 min con datos frescos.
2. **Cliente (SWR):** `src/hooks/useWorldCupData.ts` repregunta `/api/snapshot`. El
   intervalo **se acelera a 30 s si hay partidos en vivo** y se relaja a 5 min si no.
3. **Resiliencia:** si la fuente real falla, `/api/snapshot` hace *fallback* a datos
   simulados con un aviso, en vez de romper la pantalla.
4. **`LastUpdatedBadge`** muestra la hora real de la última actualización y la fuente.

## Procedencia de datos (regla central)

Cada dato declara su origen mediante `DataProvenance`: `confirmado`, `estimado`,
`simulado` o `prediccion`. Se propaga hasta los badges de la UI. Las probabilidades
son **estimaciones estadísticas, no certezas**, y esto no constituye asesoría de apuestas.

## Metodología (resumen)

Modelo Poisson: fuerza ofensiva × defensa rival → goles esperados (λ) → matriz de
marcadores → 1X2, ambos anotan, valla cero, over/under y marcador más probable.
Detalle en `src/lib/probability/`.

## Estructura

```
src/
  app/            layout, page (ISR), api/snapshot (proxy + key oculta)
  components/     Header, Dashboard (cliente, auto-refresh), MatchCard, GroupTable, badges
  hooks/          useWorldCupData (SWR polling adaptable)
  lib/
    probability/  poisson + predictMatch (con tests recomendados)
    providers/    DataProvider (interfaz) + Mock + ApiFootball + selector
    standings/    computeStandings (reglas FIFA)
  data/mock/      equipos, grupos y fixtures simulados
  types/          modelo de datos
```

## Siguientes etapas (pendientes)

Página por grupo y por partido, panel de metodología, llaves de eliminación,
gráficos (xG), filtros y tests (Vitest/Playwright). Ver documento de arquitectura.
