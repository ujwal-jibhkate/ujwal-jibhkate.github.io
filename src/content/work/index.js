/**
 * Registry for the "work" portfolio.
 *
 * This module intentionally does NOT hand-import individual system files.
 * Other agents/content authors add sibling `<slug>.meta.jsx` (a `WorkMeta`
 * default export, see `../schema.js`) and optional `<slug>.body.jsx`
 * (a React component/node default export, used on the `/work/:slug`
 * detail page) files to this directory in parallel, a hand-maintained
 * import list would be a guaranteed merge-conflict magnet. `import.meta.glob`
 * discovers them instead, so this file never needs to change as content is
 * added.
 *
 * NOTE: meta files use `.jsx`, not `.js`, even though they're "just data",
 * every `summary` field is JSX (`import('react').ReactNode`, may contain
 * `<Sidenote>`/`<Ref>`), and Vite's default esbuild-in-Rollup pipeline only
 * reliably transforms JSX in `.jsx`/`.tsx` files. A `.js` file with literal
 * JSX parses fine in the dev server but throws "Expression expected" in the
 * actual production build the moment a page imports the registry (confirmed
 * the hard way, see vite.config.js's history/comments if that's ever
 * resurrected). Don't fight this convention; name new meta files `.jsx`.
 */

import { validateWorkMeta } from '../schema.js';

// Eagerly import every meta/body module co-located in this directory.
// `import: 'default'` unwraps straight to each module's default export.
const metaModules = import.meta.glob('./*.meta.jsx', { eager: true, import: 'default' });
const bodyModules = import.meta.glob('./*.body.jsx', { eager: true, import: 'default' });

/**
 * Given a glob path like './fraud-risk.meta.jsx' or './fraud-risk.body.jsx',
 * extract the slug ('fraud-risk') so metas and bodies can be matched up.
 *
 * @param {string} path
 * @param {string} suffix - e.g. '.meta.jsx' or '.body.jsx'
 * @returns {string}
 */
function slugFromPath(path, suffix) {
  const file = path.split('/').pop() ?? path;
  return file.endsWith(suffix) ? file.slice(0, -suffix.length) : file;
}

/** @type {Map<string, import('../schema.js').WorkMeta>} */
const metasBySlug = new Map();
for (const [path, meta] of Object.entries(metaModules)) {
  if (import.meta.env.DEV) {
    validateWorkMeta(meta);
  }
  const slug = meta?.slug ?? slugFromPath(path, '.meta.jsx');
  metasBySlug.set(slug, meta);
}

/** @type {Map<string, import('react').ReactNode>} */
const bodiesBySlug = new Map();
for (const [path, body] of Object.entries(bodyModules)) {
  const slug = slugFromPath(path, '.body.jsx');
  bodiesBySlug.set(slug, body);
}

/**
 * All `WorkMeta` entries, sorted by `section` ascending, the order they
 * should be rendered in on the paper-styled index page.
 *
 * @type {import('../schema.js').WorkMeta[]}
 */
export const workMetas = Array.from(metasBySlug.values()).sort((a, b) => a.section - b.section);

/**
 * Look up a single work system by slug.
 *
 * @param {string} slug
 * @returns {{ meta: import('../schema.js').WorkMeta, body: (import('react').ReactNode|undefined) } | undefined}
 *   `undefined` if no meta exists for `slug`. When a meta exists, `body` is
 *   `undefined` if `meta.hasDetail` is `false` or no matching `.body.jsx`
 *   file was found.
 */
export function getWorkBySlug(slug) {
  const meta = metasBySlug.get(slug);
  if (!meta) return undefined;

  const body = meta.hasDetail ? bodiesBySlug.get(slug) : undefined;
  return { meta, body };
}
