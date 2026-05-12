## Cambios en `src/components/Footer.tsx`

### 1. Copyright
- `© 2025` → `© 2026` en el bloque inferior.

### 2. Mover "NOSOTROS" a la columna de contacto
- Quitar `{ type: 'internal', to: '/nosotros', key: 'about' }` del array `navItems` (queda: Investigación, Academia, Servicios).
- En la columna 3 (Contacto), añadir un `<Link to="/nosotros">` debajo de `sesmi.org`, sin label propio, con el mismo estilo que los links de navegación (font-haas, 13px, uppercase, letter-spacing 0.10em, color ink, hover opacity 0.6).

### 3. Subir tamaños

| Elemento | Antes | Después |
|---|---|---|
| `linkStyle.fontSize` (nav links) | 11px | 13px |
| `contactStyle.fontSize` (mail + sesmi.org + nosotros) | 11px | 13px |
| Wordmark "sesmi" col. izquierda | 16px | 20px |
| `orgLineStyle.fontSize` (org + location) | 9px | 10px |
| `labelStyle.fontSize` ("NAVEGACIÓN", "CONTACTO") | 9px (ya era 9, pedías 8→9, mantener 9) | 9px |
| Copyright `<p>` fontSize | 9px | 10px |

Nota: el spec dice "Labels de 8px a 9px", pero en el código actual ya están a 9px, así que se mantienen en 9px.

### Archivo afectado
- `src/components/Footer.tsx` — única modificación.

### Sin cambios
- Estructura de columnas, gaps, padding, bordes, colores y comportamiento responsive intactos.
