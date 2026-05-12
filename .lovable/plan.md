# Plan — Instalar fuentes self-hosted

## Archivos a copiar a `public/fonts/`

De los uploads, solo se usan estos:

- `ApfelGrotezk-Mittel.woff2` → `public/fonts/ApfelGrotezk-Mittel.woff2`
- `ApfelGrotezk-Mittel.woff` → `public/fonts/ApfelGrotezk-Mittel.woff` (fallback)
- `Junicode.ttf` → `public/fonts/Junicode-Regular.ttf`
- `Junicode-Bold.ttf` → `public/fonts/Junicode-Bold.ttf`
- `Junicode-Italic.ttf` → `public/fonts/Junicode-Italic.ttf`
- `Junicode-BoldItalic.ttf` → `public/fonts/Junicode-BoldItalic.ttf`

`AlteHaasGrotesk*` y `FoulisGreek` **no se copian** (no se usarán).
`ApfelGrotezk-Mittel.otf` se descarta (formato menos óptimo, ya tenemos woff2).

## Cambios en `index.html`

Actualizar los `@font-face` ya existentes:

- **Apfel Grotezk Mittel**: añadir `.woff` como segundo `src` después de `.woff2` para compatibilidad.
- **Junicode**: cambiar `format('woff2')` → `format('truetype')` y las extensiones de los 4 archivos a `.ttf` (Regular/Bold/Italic/BoldItalic), porque las versiones subidas son TTF, no WOFF2.
- **Liberation Mono**: dejar los `@font-face` como están (apuntan a archivos que aún no existen) — el navegador hará fallback silenciosamente a `monospace` hasta que subas la mono.

## Cambios en `src/index.css`

Ajustar la variable mono para que tenga fallback funcional mientras llega el archivo:

```css
--font-mono: 'Liberation Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
```

Sin cambios en `--font-grotezk` ni `--font-editorial`.

## Sin cambios

- `tailwind.config.ts` — los aliases `font-grotezk`, `font-editorial`, `font-mono` ya están bien.
- Cualquier componente React.

## Notas

- Los TTF de Junicode pesan más que WOFF2 (~400KB vs ~120KB cada uno). Si quieres, en una segunda pasada los convierto a `.woff2` con `fonttools` para reducir peso ~70%.
- Cuando subas la mono, en una sola edición: copio el archivo a `public/fonts/` y ajusto el `@font-face` correspondiente.
