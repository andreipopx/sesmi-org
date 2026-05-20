# CLAUDE.md — sesmi.org
> Agent reference for the sesmi.org frontend repo. Last updated: 2026-05-20.

---

## Stack

| Layer | Tool |
|-------|------|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + custom CSS vars |
| Components | shadcn/ui (Radix UI primitives) |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| i18n | Custom context (`src/contexts/LanguageContext.tsx`) |
| Build | `npm run build` → `dist/` |
| Tests | Vitest + Playwright |

---

## Key Components

| File | Purpose |
|------|---------|
| `src/pages/Index.tsx` | Homepage — hero, featured research (SESMI-001), about blurb |
| `src/pages/Research.tsx` | Research index — SESMI-001 featured, SESMI-002 upcoming |
| `src/pages/ResearchArticle.tsx` | Individual article (slug-based routing via `/research/:id`) |
| `src/pages/Services.tsx` | Consulting services (S-01–S-04) |
| `src/pages/Learning.tsx` | Free learning materials (scaffolded) |
| `src/pages/Academia.tsx` | Academic section (scaffolded) |
| `src/pages/Nosotros.tsx` | Team + principles (placeholder team member) |
| `src/components/Layout.tsx` | Shell: Navbar + slot + Footer |
| `src/components/Navbar.tsx` | Top nav, language toggle (ES/EN) |
| `src/components/Footer.tsx` | Minimal footer |
| `src/components/AnimatedEntry.tsx` | Scroll-triggered fade-in |
| `src/components/SectionHeader.tsx` | Consistent section header style |
| `src/components/WaitlistForm.tsx` | Email notification signup for research |
| `src/components/NavLink.tsx` | Styled nav link with active state |
| `src/i18n/translations.ts` | All copy in ES + EN (nested object) |
| `src/contexts/LanguageContext.tsx` | i18n context provider |
| `src/App.tsx` | Router setup |

---

## i18n

File: `src/i18n/translations.ts`
Context: `src/contexts/LanguageContext.tsx`

Usage:
```tsx
const { t, lang } = useLanguage();
// t.home.featured.title → "Bienvenido, Mr. Meta" (ES)
// t.nav.research → "Investigación" (ES) / "Research" (EN)
```

**To add a new key:**
```ts
// In translations.ts, add to both es and en objects at the same path:
es: { mySection: { myKey: "Texto en español" } },
en: { mySection: { myKey: "English text" } },
```

Note: EN translations are incomplete — many keys fall back to Spanish text.

---

## Visual Identity

**sesmi is the exact opposite of scalinn aesthetically.** Do NOT apply scalinn's blue palette, glassmorphism, or rounded corners here.

### Design Tokens (`src/index.css`)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#F7F3EE` | Page background (warm off-white) |
| `--bg-2` | `#F0EBE3` | Secondary background |
| `--bg-3` | `#E8E1D6` | Tertiary background |
| `--ink` | `#1C1814` | Primary text (near-black warm) |
| `--accent` | `#7A1F10` | Dark red — links, highlights, badges |
| `--muted` | `#8A7F74` | Muted text |
| `--line` | `rgba(28,24,20,0.1)` | Dividers |
| `--radius` | `0px` | No border radius — sharp corners everywhere |
| `--max-prose` | `680px` | Content max-width |

### Typography

| Variable | Font | Usage |
|----------|------|-------|
| `--font-editorial` | Junicode (serif) | Body text, article headings |
| `--font-grotezk` | Apfel Grotezk Mittel | Display / hero headers |
| `--font-haas` | Alte Haas Grotesk | Labels, nav, UI elements |
| `--font-mono` | Liberation Mono | Research IDs (SESMI-001), codes |

Body: `font-size: 18px`, `line-height: 1.85`

### Design Rules

- Sharp corners (`border-radius: 0px`) everywhere — no pill buttons, no rounded cards
- Dense typographic hierarchy with clear ink/muted/accent contrast
- Functional labels in uppercase with tracking
- Research IDs always in monospace: `SESMI-001`, `S-01`
- No glassmorphism, no blobs, no canvas animations, no parallax
- Warm paper-like background (`#F7F3EE`) — never white, never blue

---

## Research Content

**SESMI-001 — "Bienvenido, Mr. Meta" / "¿Bienvenido, Mr. Zuckerberg?"**
- Economic analysis of Meta's €750M data center investment in Talavera de la Reina
- 5 chapters: ch.01–02 EN CURSO, ch.03–05 PENDIENTE
- Waitlist form for notification when published
- Full article page at `/research/sesmi-001` (content TBD)

**SESMI-002 — "Talavera, la ciudad que no arranca"**
- Upcoming: economic diagnostic of a mid-sized Spanish city
- Shown as "PRÓXIMAMENTE" card on research page

---

## Routes

| Path | Component |
|------|-----------|
| `/` | `Index.tsx` |
| `/research` | `Research.tsx` |
| `/research/:id` | `ResearchArticle.tsx` |
| `/services` | `Services.tsx` |
| `/servicios` | `Services.tsx` (alias) |
| `/learning` | `Learning.tsx` |
| `/academia` | `Academia.tsx` |
| `/nosotros` | `Nosotros.tsx` |

---

## Deploy Flow

```bash
# 1. Edit source in repo
# 2. Commit & push:
git add <files>
git commit -m "feat/fix: description"
git push origin main
# Coolify webhook auto-triggers build

# 3. Manual redeploy via API:
curl -X POST "https://coolify.scalinn.com/api/v1/applications/b4wgg8wkko0wwgccsgsk8gc4/restart" \
  -H "Authorization: Bearer <COOLIFY_API_TOKEN>"
```

Coolify app UUID: `b4wgg8wkko0wwgccsgsk8gc4`
GitHub repo: `scalinn/sesmi-org`
Branch: `main`
Build: Nixpacks → `npm run build` → publish dir `dist/`

---

## Local Development

```bash
# Clone (with PAT):
git clone https://ghp_***@github.com/scalinn/sesmi-org.git
cd sesmi-org

# Install:
npm install  # or bun install

# Dev server:
npm run dev  # → http://localhost:5173

# Build:
npm run build  # → dist/

# Tests:
npm run test
```

---

## File Conventions

- Pages go in `src/pages/`
- Reusable UI in `src/components/`
- shadcn primitives in `src/components/ui/` (do not edit manually)
- Utilities in `src/lib/`
- i18n in `src/i18n/`
- Context providers in `src/contexts/`
- Static assets in `public/`

---

## Pending TODOs

| Item | Status |
|------|--------|
| SESMI-001 full article content | ⏸️ EN ELABORACIÓN |
| Logo definitivo | ⚠️ TODO |
| Favicon | ⚠️ TODO |
| EN translations (many incomplete) | ⚠️ TODO |
| `/research/sesmi-001` full article page | ⚠️ TODO |
| Nosotros team section | ⚠️ TODO — placeholder "Tu nombre aquí" |
| Umami analytics integration | ⚠️ TODO — not yet connected |
