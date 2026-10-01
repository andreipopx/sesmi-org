# CLAUDE.md — sesmi.org
> Agent reference for the sesmi.org frontend repo. Last updated: 2026-09-29.

---

## Stack

| Layer | Tool |
|-------|------|
| Framework | React 18 + Vite 5 (SWC plugin) |
| Language | TypeScript 5 |
| Styling | Plain CSS: tokens + `@font-face` in `src/index.css`, the grid in `src/styles/sesmi.css` (ported from the approved "Rejilla" prototype). Tailwind 3 stays configured **without preflight** (no `@tailwind base`) only for shadcn |
| Components | shadcn/ui (Radix UI primitives) — in `src/components/ui/`, do not edit manually; the site pages do not use them |
| Routing | React Router v6 (`src/AppRoutes.tsx`) |
| Animation | Hand-rolled: SVG frame swaps on a vsync-aligned `requestAnimationFrame` ticker (`src/lib/ticker.ts`; no Framer Motion in the site) |
| i18n | None — the site is Spanish only (the old `LanguageContext` / `translations.ts` were removed) |
| Build | `npm run build` → `dist/` |
| Tests | Vitest (`src/test/routes.test.tsx`: routes, redirects, 404, waitlist mock) + Playwright |

> `@tanstack/react-query`, `framer-motion`, `react-hook-form`/`zod` are still in `package.json` but unused by the site.

---

## Key Pages and Components

### Routes

Layout route `SiteLayout` wraps every page. Anchors are real hashes (`/investigacion#sesmi-001`);
on navigation the layout scrolls to the anchor (or to the top) and sets `document.title` and the
route favicon.

| Path | Component | Title · favicon | Anchors |
|------|-----------|-----------------|---------|
| `/` | `src/pages/Index.tsx` | `sesmi · Sociedad Económica de San Miguel` · `/favicon.svg` | `#aviso-inicio` |
| `/investigacion` | `src/pages/Investigacion.tsx` | `Investigación · sesmi` · `/favicon-buho.svg` | `#sesmi-001`, `#sesmi-002`, `#metodo`, `#aviso` |
| `/servicios` | `src/pages/Servicios.tsx` | `Servicios · sesmi` · `/favicon-caballo.svg` | `#hablamos` |
| `/divulgacion` | `src/pages/Divulgacion.tsx` | `Divulgación · sesmi` · `/favicon-paloma.svg` | — |
| `/nosotros` | `src/pages/Nosotros.tsx` | `Nosotros · sesmi` · `/favicon.svg` | `#contacto` |
| `*` | `src/pages/NotFound.tsx` | `Página no encontrada · sesmi` | — |

Redirects (`<Navigate replace>`): `/research` → `/investigacion`, `/research/:id` → `/investigacion#sesmi-001`,
`/services` → `/servicios`, `/learning` and `/academia` → `/divulgacion`.
Titles/favicons live in the `META` map in `SiteLayout.tsx` — add new routes there too.

### Custom Components (`src/components/`)

| File | Purpose |
|------|---------|
| `SiteLayout.tsx` | Shell: `.frame` grid, sticky top bar (wordmark, org name, nav, «Contacto» cell), 4-cell mobile nav, `<Outlet/>`, footer. Also route meta (title, favicon) and scroll-to-top/anchor |
| `Sprite.tsx` | `<Sprite/>` hidden SVG symbols (`#arr` arrow, `#f-buho/#f-caballo/#f-paloma`) + `<Arrow/>` |
| `Fig.tsx` | Brand figure (`name` buho/caballo/paloma, `variant` menor <64px / mayor ≥64px, `anim`, `label`). Decorative (aria-hidden) unless `label` |
| `Wordmark.tsx` | `<Wordmark dot="red|ink"/>` vector wordmark (i-dot = red square); `<Sesmi/>` for «sesmi» inside running text |
| `Hero.tsx` | Home hero: «s e s m i» letter pattern + big wordmark; square magnifier inverts to «debemos saber.» over a figure pattern (mouse follows); on touch there is no magnifier: a tap flips the whole hero to that hidden face (stepped reveal from the tap point) and another tap flips it back; red square cursor; toggles `html.hero-wm-visible` so the top-bar wordmark hides while the hero wordmark is visible (not while flipped, `html.hero-flip`) |
| `Illustration.tsx` | Line illustrations `rings` (SESMI-001, 750 M€) and `stall` (SESMI-002); animate at 5 steps/s only while on screen; the stall marker vanishes at the end of the series and reappears at the start after a pause |
| `MethodDiagram.tsx` | «Cómo trabajamos» cell diagram (datos → análisis → paper + divulgativa) with the red marker running the flow |
| `PillarHeader.tsx` | Page header of each pillar: back cell, signature (figure · wordmark · section), h1, lema, intro, big figure (`fig="all"` = three) |
| `RowLink.tsx` | Numbered grid row that is one link (internal `<Link>` or `mailto:`) |
| `WaitlistRow.tsx` | Waitlist form row — **mock** (preventDefault, «Apuntado. Te avisamos cuando salga.») |

Brand data: `src/brand/brand.json` (figure paths in a 100×100 box, animation frames, wordmark) and
`src/brand/index.ts` (typed access + `SEQ` animation sequences). SVG exports in `public/brand/`.

### Figures and animation

- Three figures = three pillars: **búho** Investigación («Debemos saber»), **caballo** Servicios («Fuerza aplicada»), **paloma** Divulgación («Socorre enseñando»).
- At rest a figure is the clean vector. `anim` figures play a few-fps hand-drawn loop (búho 5 fps blink + sway; caballo 6 fps, the original 5 gallop poses + one in-between back to the flying gallop (= rest drawing) so it joins when it loops or stops; paloma 6 fps, 6-frame symmetric wing flap) on mouse hover over the figure **or its nearest `[data-anim-host]` ancestor**, on focus, or ~2.2 s on touch; they finish the cycle and stop on leave, so loops and endings join without a jump. `anim="loop"` loops while on screen.
- Timing: `src/lib/ticker.ts` steps on `requestAnimationFrame`; every fps must divide 60 (5, 6, 10, 12, 15…) so all frames last the same number of screen refreshes.
- **Brand decision:** animations run even with `prefers-reduced-motion` (figures, illustrations, method marker, hero transitions). Only smooth scrolling is turned off for those users. Intervals are cleared on unmount and illustrations pause off-screen.
- Frame sources (not in the repo): the gallop and flap are generated parametrically and traced to paths; the output lives in `src/brand/brand.json` → `frames`.

---

## Visual Identity

**sesmi is the exact opposite of scalinn aesthetically.** Never apply scalinn's blue palette, glassmorphism, or rounded corners here.

### Design Tokens (`src/index.css`)

Three colours only — paper, ink, red — plus mixes of them.

| Token | Value | Usage |
|-------|-------|-------|
| `--paper` | `#F7F3EE` | Page background — warm paper, never pure white |
| `--paper-2` / `--paper-3` | `#EFE9E1` / `#E6DED3` | Secondary surfaces (cards, figure panels) |
| `--ink` | `#1C1814` | Text and all grid lines (1px) |
| `--ink-2` / `--ink-3` | ink 70% / 48% on paper | Secondary / muted text |
| `--red` | `#7A1F10` | Accent: i-dot square, lemas, status squares, focus ring, markers |
| `--rule` | ink 14% | Soft inner dividers |
| `--radius` | `0px` | Sharp corners everywhere |

Grid variables live in `src/styles/sesmi.css` (`--c1` first column, `--c4` arrow column, `--pad`); breakpoints 1100px (tablet) and 860px (mobile).

### Typography

| CSS Var | Font | Usage |
|---------|------|-------|
| `--display` / `--label` | Apfel Grotezk Mittel (`'Apfel'`, 500) | Headlines, nav, labels (11px uppercase tracked), numbers, wordmark text |
| `--display-strong` | Apfel Grotezk Fett (`'Apfel Fett'`, 700) | Hero «debemos saber.» |
| `--text` | Instrument Sans (variable 400–700, roman + italic) | All body text — 17px / 1.58 |

All fonts are self-hosted woff2 in `public/fonts/` (OFL, licences alongside), `font-display: swap`,
Apfel Mittel and Instrument Sans preloaded in `index.html`. Junicode, Alte Haas Grotesk and
Liberation Mono are gone.

### Tone and Voice

An open society: research, services and teaching, starting with economics and mathematics (the founders' field) but open to students, teachers and people from any discipline — say so, never present sesmi as closed or economics-only. Editorial, rigorous, and direct — written for any intelligent reader, not just economists. Founding principle: *"debemos saber."* The site is Spanish only.

### Design Rules

- Sharp corners everywhere; 1px ink grid lines, full-bleed frame
- Warm paper background — never white, never blue; three colours only
- Labels: uppercase Apfel Mittel 11px, tracked; research IDs `SESMI-001` with tabular numbers
- Figures are decorative (`aria-hidden`) unless given a `label`; one `h1` per page; visible focus (2px red outline)
- No glassmorphism, blobs, canvas animations, or parallax
- «sesmi» in running text: `<Sesmi/>` (a `.wm` span in Apfel); as a logo: `<Wordmark/>` (never type it as text)
- Favicon per route: red square (`/favicon.svg`), with the pillar figure in paper on its pillar pages

---

## External Integrations

| Integration | Status | Notes |
|-------------|--------|-------|
| Waitlist rows | Mock only | `WaitlistRow.tsx` validates and confirms client-side — no backend/email service connected |
| Contact | `mailto:hola@sesmi.org` | No contact form |
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
| SESMI-001 full article | Content pending (currently a card + chapter strip on `/investigacion`) |
| Waitlist rows | Need real backend (Resend / n8n webhook) |
| Divulgación resources | Section under construction |
| Umami analytics | Script tag not yet added |
| Social image | `og:image` still points to the old Lovable preview |
| Web manifest | `public/icon-192.png` / `icon-512.png` exist but no manifest yet |

---

## Brand Rules

- **sesmi is always lowercase** — never "Sesmi", never "SESMI" in prose (only in IDs like `SESMI-001`)
- In components, write it as `<Sesmi/>` in text or `<Wordmark/>` as the logo, so it always renders in Apfel Grotezk
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
