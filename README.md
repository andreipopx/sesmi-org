# sesmi.org

Sitio web de sesmi (proyecto editorial/organización vinculado a Scalinn).

## Qué es

Presencia web pública de sesmi.org. Incluye secciones de contenido editorial, formularios de waitlist y navegación estática.

## Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS 3 + shadcn/ui
- **Build**: Vite (spa output)

## Desarrollo local

Requisitos: Node.js 20+, npm o bun.

```bash
npm install
npm run dev
```

El servidor de desarrollo arranca en `http://localhost:5173`.

## Despliegue

Desplegado automáticamente vía **Coolify** (`sesmi-org` → `sesmi.org` y `www.sesmi.org`).

Push a `main` dispara un nuevo deploy en Coolify.
