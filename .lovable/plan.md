## Plan: Simplificar cabecera de portada

Objetivo: En `Index.tsx`, reducir la cabecera al mínimo — solo el wordmark "sesmi" grande y el separador, eliminando el tagline y aumentando el tamaño del wordmark.

### Cambios en `src/pages/Index.tsx`

1. **Eliminar tagline**
   - Borrar la variable `tagline` (líneas 29-32).
   - Borrar el párrafo `<p>` con `font-editorial italic` que renderiza el tagline (líneas 51-61).

2. **Agrandar wordmark**
   - Subir los valores del `clamp()` en la clase `.home-wm`:
     - Mobile: de `clamp(72px, 20vw, 110px)` a un rango mayor (ej. `clamp(90px, 22vw, 130px)`).
     - Desktop: de `clamp(64px, 10vw, 96px)` a un rango mayor (ej. `clamp(80px, 12vw, 120px)`).
   - Ajustar proporcionalmente el espaciado (`marginBottom` del `<span>` o `marginTop` del separador) para que no quede un hueco excesivo donde estaba el tagline.

3. **Revisar espaciado vertical**
   - Al desaparecer el tagline, el separador bajo el wordmark puede quedar demasiado lejos. Reajustar `marginBottom` del wordmark o `marginTop` del `<div>` separador para mantener una composición ajustada.

No hay cambios en otros archivos ni en lógica de negocio.