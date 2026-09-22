# CLAUDE.md — sesmi.org
> Agent reference for the sesmi.org frontend repo. Last updated: 2026-05-20.

---

## Stack

| Layer | Tool |
|-------|------|
| Framework | React 18 + Vite 5 (SWC plugin) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + custom CSS design tokens (`src/index.css`) |
| Components | shadcn/ui (Radix UI primitives) — in `src/components/ui/`, do not edit manually |
| Routing | React Router v6 |
| State / data | TanStack React Query v5 |
| Animation | Framer Motion 12 |
| Forms | React Hook Form + Zod |
| i18n | Custom context (`src/contexts/LanguageContext.tsx` + `src/i18n/translations.ts`) |
| Build | `npm run build` → `dist/` |
| Tests | Vitest + Playwright |

---

## Key Pages and Components

### Routes

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `src/pages/Index.tsx` | Hero, featured research (SESMI-001), about blurb, waitlist |
| `/research` | `src/pages/Research.tsx` | Research index — SESMI-001 featured, SESMI-002 upcoming |
| `/research/:id` | `src/pages/ResearchArticle.tsx` | Individual article via slug |
| `/services` | `src/pages/Services.tsx` | Consulting services (5 offerings) |
| `/servicios` | `src/pages/Services.tsx` | ES alias for /services |
| `/learning` | `src/pages/Learning.tsx` | Free learning materials (scaffolded) |
| `/academia` | `src/pages/Academia.tsx` | Academic section (scaffolded) |
| `/nosotros` | `src/pages/Nosotros.tsx` | Team + contact form |
| `*` | `src/pages/NotFound.tsx` | 404 |

### Custom Components

| File | Purpose |
|------|---------|
| `src/components/Layout.tsx` | Shell: Navbar + slot + Footer |
| `src/components/Navbar.tsx` | Top nav, language toggle (ES/EN) |
| `src/components/Footer.tsx` | Minimal footer |
| `src/components/AnimatedEntry.tsx` | Scroll-triggered fade-in (Framer Motion) |
| `src/components/SectionHeader.tsx` | Consistent section header style |
| `src/components/WaitlistForm.tsx` | Email notification signup (currently mock — no backend) |
| `src/components/NavLink.tsx` | Styled nav link with active state |
| `src/lib/wm.tsx` | `wm()` — wraps every "sesmi" occurrence in `.wm` span for Apfel font |

---

## Visual Identity

**sesmi is the exact opposite of scalinn aesthetically.** Never apply scalinn's blue palette, glassmorphism, or rounded corners here.

### Design Tokens (`src/index.css`)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#F7F3EE` | Page background — warm off-white, never pure white |
| `--bg-2` | `#F0EBE3` | Secondary surfaces |
| `--bg-3` | `#E8E1D6` | Tertiary surfaces |
| `--ink` | `#1C1814` | Primary text (near-black, warm) |
| `--ink-secondary` | `#2E2720` | Secondary text |
| `--accent` | `#7A1F10` | Dark red — links, highlights, progress bar, badges |
| `--muted` | `#8A7F74` | Muted text |
| `--muted-2` | `#B5AA9E` | Lighter muted |
| `--offwhite` | `#FAF8F5` | Button text on dark bg |
| `--line` | `rgba(28,24,20,0.1)` | Dividers and borders |
| `--radius` | `0px` | Sharp corners everywhere — no rounded cards, no pill buttons |
| `--max-prose` | `680px` | Content column max-width |

### Typography

| CSS Var | Font | Usage |
|---------|------|-------|
| `--font-editorial` | Junicode (serif) | Body text (18px / 1.85), article headings |
| `--font-grotezk` | Apfel Grotezk Mittel | Display / hero headers, wordmark |
| `--font-haas` | Alte Haas Grotesk | Labels (8–11px uppercase, tracked), nav, UI elements |
| `--font-mono` | Liberation Mono | Research IDs (`SESMI-001`), codes |

All fonts are self-hosted in `public/fonts/`.

### Tone and Voice

Independent economic research for mid-sized Spanish cities. Editorial, rigorous, and direct — written for any intelligent reader, not just economists. Founding principle: *"debemos saber."* The site is primarily in Spanish; EN is scaffolded but incomplete.

### Design Rules

- Sharp corners (`border-radius: 0px`) everywhere
- Warm paper background (`#F7F3EE`) — never white, never blue
- Dense typographic hierarchy: ink / ink-secondary / muted / accent
- Functional labels: uppercase, Alte Haas Grotesk, 8–9px, tracked
- Research IDs always in monospace: `SESMI-001`, `S-01`
- No glassmorphism, blobs, canvas animations, or parallax
- `wm()` utility must wrap all "sesmi" text in components to render in Apfel Grotezk

---

## External Integrations

| Integration | Status | Notes |
|-------------|--------|-------|
| Waitlist form | Mock only | `WaitlistForm.tsx` fakes submission with `setTimeout` — no backend/email service connected |
| Contact form | Mock only | `Nosotros.tsx` form — no backend call, no email service |
| Umami analytics | Not connected | Planned; no script tag in `index.html` yet |
| No other integrations | — | No GTM, no GA, no Hotjar, no Mailchimp, no Resend |

---

## Deploy Flow

The site is statically built and served by nginx behind a Cloudflare Tunnel — there
is no Coolify, no webhook and no auto-build. Pushing to `main` does **not** deploy;
a redeploy is an explicit step on the host.

```bash
# 1. Edit, commit, push
git add <files>
git commit -m "feat/fix: description"
git push origin main

# 2. Redeploy on the host (pulls main, rebuilds dist/)
./deploy.sh   # lives in the private infra repo, see below
```

The build runs `npm install && npm run build` inside a `node:20-alpine` container and
nginx serves `dist/` from a bind-mount, so a redeploy needs no container restart.

> `npm ci` does **not** work in this repo: `package-lock.json` is out of sync with
> `package.json` (missing `stackback`). Regenerate the lockfile if you want `npm ci` back.

GitHub repo: `andreipopx/sesmi-org`, branch `main`.
Hosting, DNS and tunnel runbook live in the private infra repo (`pop-servicios`,
`sesmi-web/CLOUDFLARE-SETUP.md`) — deliberately not documented here.

---

## Pending Work

| Item | Status |
|------|--------|
| Logo definitivo | Not yet in repo |
| `/investigacion/sesmi-001` page | Full article content pending |
| Favicon | TODO |
| i18n EN | Currently ES only — EN translations scaffolded but incomplete |
| Nosotros team section | Placeholder "Tu nombre aquí" — real team bios needed |
| Waitlist + contact forms | Need real backend (Resend / n8n webhook) |
| Umami analytics | Script tag not yet added |

---

## Brand Rules

- **sesmi is always lowercase** — never "Sesmi", never "SESMI" in prose
- In components, use `wm(text)` or `<span className="wm">sesmi</span>` so it always renders in Apfel Grotezk Mittel
- Organization full name: *Sociedad Económica de San Miguel*
- Location: Talavera de la Reina, Toledo, Spain
- Contact: hola@sesmi.org

---

## Keeping This File Updated
After completing any task that changes the structure of this project,
append a brief note or update the relevant section before finishing.
This includes: new components, removed files, changed routes, new integrations,
new env vars, config changes, or infra additions.
Commit the updated CLAUDE.md together with your code changes in the same commit.
Do NOT update this file for pure content changes (copy, translations, colors).
