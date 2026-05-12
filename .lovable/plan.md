## Problema

El rectángulo lateral "sesmi" se ve borroso porque:

1. `transform: translateY(-50%) rotate(180deg)` deja el elemento en coordenadas sub-píxel (la mitad de su altura no es entera) → el navegador interpola y emborrona el texto.
2. La combinación `writing-mode: vertical-rl` + `rotate(180deg)` agrava el efecto en algunos navegadores (sobre todo Chrome en Windows/Linux).

## Solución propuesta (en `src/components/Layout.tsx`)

1. Quitar `translateY(-50%)` y centrarlo verticalmente con un wrapper:
   - Wrapper `position: fixed; right: 0; top: 0; height: 100vh; display: flex; align-items: center; pointer-events: none;`
   - El `<Link>` dentro con `pointer-events: auto`, sin `translateY`, solo `transform: rotate(180deg)`.
2. Forzar rasterizado nítido en el link:
   - `transform: rotate(180deg) translateZ(0)`
   - `backface-visibility: hidden`
   - `-webkit-font-smoothing: antialiased`
   - `text-rendering: geometricPrecision` (mejor para texto rotado que `optimizeLegibility`)
3. Mantener tamaños actuales (padding 4px 1px, font 16px).

Con esto el texto cae en píxeles enteros y se renderiza limpio.

¿Aplico el fix?