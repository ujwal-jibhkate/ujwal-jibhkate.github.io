# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (HMR)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the repo

There is no test suite.

## Architecture

Single-page personal portfolio: **React 18 + Vite + Tailwind CSS**, deployed as a fully static site on **GitHub Pages**. Written in plain JSX (no TypeScript; `@types/*` packages are fully removed from `package.json` — there is no lingering TS tooling anywhere in this repo).

Fonts (Source Serif 4 + iA Writer Quattro, both SIL OFL licensed) are self-hosted as hand-subset `.woff2` files in `public/fonts/` and preloaded from `index.html` — they are **not** loaded from the Google Fonts CDN; there is no Google Fonts `<link>` tag anywhere in the markup.

### Design

The site is styled as an academic preprint: cream paper background, serif body type, booktabs-style tables, and Tufte-style margin sidenotes. A signature `Gauge` component renders a measured-bar comparison, but only ever when a real measured baseline exists to compare against — never as a decorative or unbacked bar.

Color tokens live in `tailwind.config.js` under `theme.extend.colors` and are mirrored as CSS custom properties in `src/index.css`: `paper`, `ink`, `soft`, `faint`, `hairline`, `mark`, `accent`, `rule`, `wash`. **`mark` (a red) is reserved exclusively for epistemic negatives** — numbers that undermine rather than flatter, sidenote anchors/headers, Errata tags, Limitations box borders. Never use it for decoration or emphasis.

Reusable design-system primitives live in `src/components/paper/` (`Sheet`, `Sidenote`, `Gauge`, `BooktabsTable`, `Figure`, `Equation`, `LimitationsBox`, `StatusTag`, `Errata`, `MarginStamp`, `Colophon`, etc.). There is deliberately **no barrel/`index.js`** in that directory (avoids merge conflicts) — always import the explicit file path, e.g. `import Sidenote from '../components/paper/Sidenote'`.

**Hard gotcha — no lint rule catches this:** `Sidenote` (`src/components/paper/Sidenote.jsx`) relies on CSS floats to push margin notes into a dedicated column, and **floats do not escape flex/grid containers**. Any component wrapping prose paragraphs in `flex flex-col gap-*` or a CSS grid will silently break every sidenote inside it. Paragraph vertical rhythm in prose content must come from margins, not flex/grid `gap`.

### Content model — bundled JSX modules, not runtime-fetched JSON

Content used to live in `public/projects.json`, fetched at runtime with `fetch()`. **That's gone.** Content now lives in bundled JSX modules under `src/content/`:

- `src/content/work/<slug>.meta.jsx` — structured metadata (title, status, stack, metrics/Gauge data) for each of the 7 "systems" in the work portfolio.
- `src/content/work/<slug>.body.jsx` — optional, paired with a meta file, holds the rich prose body (with inline `<Sidenote>` components) for systems that have a full detail page.
- `src/content/work/index.js` — the registry. Uses Vite's `import.meta.glob('./*.meta.jsx', ...)` to auto-discover meta files. There is no hand-maintained list — adding a new system is just dropping two files in this directory, nothing else needs editing. Meta files use `.jsx` (not `.js`) because every `summary` field is JSX and Vite's production build only reliably transforms JSX in `.jsx`/`.tsx` files.
- `src/content/schema.js` — documents the content shapes via JSDoc and exports a dev-only `validateWorkMeta()` that throws on malformed content.
- `src/content/profile.js` — bio, experience, education, publications, errata, and colophon data for the About page.
- `src/content/claims-discipline.md` — a committed, verbatim copy of a "Claims Discipline" table from the site owner's private (gitignored) profile notes: the list of things that must never be claimed about his work (e.g. don't overstate ownership of a collaborative project, don't round up a metric). **Check any future content work against this file before publishing new claims about the owner's projects.**

### Routing & layout

- `src/main.jsx` defines a `createBrowserRouter`. Routes: `/`, `/work`, `/work/:slug`, `/about`, plus a catch-all 404. There is no `/contact` route (contact is a footer `mailto:` link) and no `/publications` route (publications now live as a section on `/about`).
- An unknown slug at `/work/:slug`, or a slug whose meta has `hasDetail: false`, both render the same NotFound page rather than a broken/empty shell.
- `src/App.jsx` is the persistent shell; pages live in `src/pages/`, reusable pieces in `src/components/`.
- `ScrollToTop` resets scroll on every route change (SPA navigation would otherwise preserve scroll).

### Hosting — static export to GitHub Pages

- `.github/workflows/deploy.yml` builds and deploys on every push to `main`: checkout → Node 20 setup → `npm ci` → `npm run build` → `actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4`.
- `vite.config.js` sets `base: '/'` explicitly. This is a user-site-at-root deployment — the repo is `ujwal-jibhkate.github.io`, not a project-page repo, so there's no subpath basename.
- A Vite `closeBundle` plugin in `vite.config.js` copies `dist/index.html` to `dist/404.html` at build time, so GitHub Pages' 404 fallback correctly boots the SPA shell and lets client-side routing take over for deep links (e.g. `/work/fraud-risk`).
- `public/.nojekyll` disables Jekyll processing (GitHub Pages runs content through Jekyll by default, which ignores underscore-prefixed files/directories).
- No custom domain, no `CNAME` file.

### No serverless, no contact form, no env vars

The site is fully static. There is no `/api` directory, no `vercel.json`, no Resend/serverless email, and no contact form component — a prior step in this rebuild deleted all of that. Contact is a `mailto:` link in the footer. Do not reintroduce `VITE_EMAIL_TO`, `RESEND_API_KEY`, or a POST to `/api/send` — none of that exists anymore.

### Animation

GSAP is kept but scoped narrowly: only a home-page "motto" letter-scatter-then-settle animation on load, plus a scroll-triggered subtitle reveal. It is **not** used anywhere else on the site (a prior design had much heavier GSAP/ScrollTrigger usage across many components; that's gone). If you do add a `ScrollTrigger`-based animation, register the plugin and wrap timelines in `gsap.context(...)` with a `ctx.revert()` cleanup in the `useEffect` return, to avoid leaks across route changes.

### Styling

Tailwind (config in `tailwind.config.js`) with the academic-preprint palette described above (paper/ink/etc., not the old dark `bg-black` aesthetic). PostCSS + autoprefixer via `postcss.config.js`.
