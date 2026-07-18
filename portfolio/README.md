# Portfolio — Building Intelligent Software Worth Remembering

A production-grade developer portfolio built with **Next.js 15 (App Router)**, **React 19**,
**TypeScript**, **Tailwind CSS v4**, and **Framer Motion**. The homepage is a single
cinematic narrative — hero → story → architecture → work → AI philosophy → principles →
journey → metrics → terminal → testimonials → writing → contact — each section numbered
like a spec document, with one signature animation (an SVG system map) making "I think in
systems" literal instead of decorative.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Requires **Node.js 20+** (see `.nvmrc`). Deploys as-is to Vercel with zero configuration.

```bash
npm run build       # production build
npm run start        # serve the production build locally
npm run typecheck    # tsc --noEmit
npm run lint          # eslint
npm run format        # prettier --write
```

## Design system

Full rationale lives in `app/globals.css` under `@theme`. Summary:

| Token | Value | Use |
|---|---|---|
| `--color-base` | `#0A0C10` | Page background |
| `--color-surface` | `#12151C` | Cards, panels |
| `--color-signal` | `#FFB454` | Primary accent — CTAs, focus states, key data |
| `--color-dataline` | `#4FD1C5` | Secondary accent — graphs, node-map, links only |
| `--font-display` | Space Grotesk | Headings |
| `--font-body` | Inter (variable) | Body copy |
| `--font-mono` | JetBrains Mono | Labels, nav, numeric/tabular data |

All fonts are self-hosted via `@fontsource` packages — no runtime requests to Google Fonts.

**Signature element:** `components/motion/system-map.tsx` — an animated SVG node graph
representing four engineering domains converging on a central node. Paired in the hero with
`components/motion/animated-background.tsx` (grid, floating particles, aurora gradients,
cursor spotlight, floating code fragments) — all atmospheric, all skipped entirely under
`prefers-reduced-motion`.

## Homepage narrative (`app/(site)/page.tsx`)

```
Hero                  Headline, subtext, Explore Projects / Read My Story
01  Why I Build         Compact story teaser -> links to /about for the full version
02  Toolchain            Animated architecture diagram (frontend -> backend -> cloud -> ai -> data)
03  Selected work        Product-launch style project cards
AI  Artificial intelligence   AI as a product ingredient, not a feature bolt-on
04  Philosophy            Six engineering principles
05  Journey               Animated career timeline (Estate Management -> Entrepreneurship)
06  By the numbers        Animated counters
07  Terminal               whoami / interests / current_goal, typed out on scroll
08  Testimonials          Glass-morphism recommendation cards
09  Blog                   Latest 3 articles, links to /writing
10  Contact                "Let's Build Something Worth Remembering."
```

## Information architecture

```
/              Index      — the full narrative above
/about         Why I Build — full story, principles, journey, and work history
/work          Work       — full project grid
/work/[slug]   Work detail — problem / architecture / challenges / results / lessons / stack
/writing       Log        — build-log / notes index
/contact       Contact    — contact form (POSTs to /api/contact)
```

## Folder structure

```
app/
  layout.tsx               Root layout: fonts, metadata, JSON-LD, skip link
  globals.css               Design tokens (Tailwind v4 @theme) + base styles
  sitemap.ts / robots.ts / manifest.ts
  error.tsx                 Global error boundary
  api/contact/route.ts      Contact form handler (Zod-validated)
  (site)/                   Route group — all public pages share the root layout
    page.tsx                 Homepage (full narrative)
    about/page.tsx            Why I Build
    work/page.tsx
    work/[slug]/page.tsx        generateStaticParams + generateMetadata per project
    writing/page.tsx
    contact/page.tsx
    not-found.tsx / loading.tsx

components/
  ui/                       Primitive, presentational components (shadcn/ui pattern)
  motion/                   Reusable Framer Motion wrappers: reveal, stagger-list,
                             system-map (signature), animated-background, role-rotator,
                             counter (animated metrics)
  sections/                 Page sections: hero, nav, footer, why-i-build,
                             architecture-diagram, featured-work, project-card,
                             ai-section, philosophy, journey-timeline, metrics,
                             terminal, testimonials, blog-preview, timeline
                             (work history), writing-list, contact-form, cta

content/                    CMS-ready, typed content modules
  projects/index.ts          Project data + getFeaturedProjects/getProjectBySlug helpers
  experience/index.ts        Work history + writing entries

types/content.ts            Shared content contracts (Project, ExperienceEntry, etc.)
lib/
  site-config.ts             Single source of truth: nav, socials, domains, journey,
                              principles, metrics, AI capabilities, architecture layers,
                              terminal content, testimonials
  motion.ts                  Animation specification: shared variants & transitions
  utils.ts                   cn(), date formatting, clamp
```

## Making content CMS-ready

Every content type in `types/content.ts` is decoupled from its source. Project data lives
in `content/projects/index.ts`; site-wide narrative content (journey, principles, metrics,
AI capabilities, architecture layers, terminal copy, testimonials) lives in
`lib/site-config.ts`. To connect a real CMS later, replace the relevant exports with async
fetchers that resolve to the same shapes — no component changes required.

To add a project today: add one object to the `projects` array in
`content/projects/index.ts`, including a `coverImage` (drop an image in
`public/images/projects/`). Its detail page at `/work/[slug]` — with the full
problem/architecture/challenges/results/lessons/stack layout — is generated automatically
via `generateStaticParams`.

## Accessibility

- Visible focus rings everywhere (`:focus-visible`), never suppressed.
- Skip-to-content link, semantic landmarks (`header`, `main`, `nav`, `footer`).
- All motion — including the animated background, counters, and terminal typing —
  respects `prefers-reduced-motion` and falls back to a static, fully-legible state.
- Form fields have associated `<label>`s, `aria-invalid`, and `aria-describedby` wired to
  inline error messages.

## SEO

- Full metadata via the App Router `Metadata` API in `app/layout.tsx` and per-page
  `generateMetadata`.
- `app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and `/robots.txt`.
- `Person` JSON-LD in the root layout.
- Open Graph + Twitter card metadata (replace `/public/og-image.png` with a real 1200×630
  image before launch).

## Contact form

`app/api/contact/route.ts` validates submissions with Zod and currently logs them
server-side, so the form works with **zero required environment variables**. To send real
email:

1. `npm install resend`
2. Set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in `.env` (see `.env.example`)
3. Uncomment the Resend block in `app/api/contact/route.ts`

## Deployment (Vercel)

1. Push to a GitHub repo, import into Vercel.
2. Vercel auto-detects Next.js; the `engines.node >= 20.0.0` field in `package.json` and
   `.nvmrc` (`20`) both pin the build to Node 20, matching Vercel's current build image.
3. Set environment variables from `.env.example` in the Vercel dashboard if using the
   Resend integration.
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain so metadata, sitemap, and JSON-LD
   resolve to absolute URLs.

## Extending the system

- **New section type:** add a component to `components/sections/`, compose it into a page
  in `app/(site)/`.
- **New animation:** add a variant to `lib/motion.ts` rather than inlining one-off
  Framer Motion config in a component, so motion stays centrally auditable.
- **New content type:** define the shape in `types/content.ts`, add a module under
  `content/`, and it's immediately swappable for a real CMS later.
