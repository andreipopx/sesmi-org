# sesmi.org

Web de **sesmi** — Sociedad Económica de San Miguel (Talavera de la Reina). Una sociedad abierta:
conocimiento en abierto, para cualquiera. *Debemos saber.*

## Qué hay

- **Inicio**, **Investigación**, **Servicios**, **Divulgación** y **Nosotros** (solo en español).
- Las tres figuras de la marca —búho, caballo, paloma— animadas a pocos fps.
- Listas de aviso (de momento sin backend) y contacto por `mailto:hola@sesmi.org`.
- `promo/reel/`: los vídeos verticales de presentación (reels/stories) y todo lo necesario para
  regenerarlos. No forman parte de la web.

## Stack

- React 18 + TypeScript + Vite 5 (SWC), React Router 6.
- CSS propio: tokens y tipografías en `src/index.css`, la retícula en `src/styles/sesmi.css`.
  Tres colores (papel, tinta, rojo), tipografías autoalojadas (Apfel Grotezk, Instrument Sans).
- Tests: Vitest (`src/test/`) y Playwright.

## Desarrollo local

Requisitos: Node.js 20+ y npm.

```bash
npm install
npm run dev     # http://localhost:8080
npm test        # Vitest
npm run build   # → dist/
```

> `npm ci` no funciona ahora mismo: `package-lock.json` está desincronizado con `package.json`.

## Despliegue

La web es estática (`dist/`) y la sirve nginx en un servidor propio. Hacer push a `main` **no**
despliega: el redespliegue es un paso manual en el servidor (detalles en el repositorio privado de
infraestructura).

## Vídeos de presentación

```bash
./promo/reel/shared/build.sh sociedad   # o preguntas, 250, teaser, vuelta
```

Necesita Node con Playwright (Chromium), Python 3 con numpy y ffmpeg; para regrabar la voz,
`ELEVENLABS_API_KEY` en el entorno (nunca en el repo). Más detalle en `CLAUDE.md`.

## Más

`CLAUDE.md` es la referencia completa del proyecto: marca, componentes, rutas y convenciones.
