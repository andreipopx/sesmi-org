# Plan — Añadir Liberation Mono

## Copiar a `public/fonts/`

- `LiberationMono-Regular.ttf`
- `LiberationMono-Bold.ttf`
- `LiberationMono-Italic.ttf`
- `LiberationMono-BoldItalic.ttf`

## Cambios en `index.html`

Reemplazar los dos `@font-face` actuales de `Liberation Mono` (que apuntan a `.woff2` inexistentes) por cuatro `@font-face` con `format('truetype')` para los cuatro estilos: Regular 400, Bold 700, Italic 400, BoldItalic 700.

## Sin cambios

- `src/index.css` — `--font-mono` ya es correcto.
- `tailwind.config.ts`, componentes — sin tocar.

## Nota

Los TTF pesan más que WOFF2. Si quieres optimización, en una segunda pasada los convierto.
