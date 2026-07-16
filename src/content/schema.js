/**
 * Content contract for the "work" portfolio (the academic-preprint-styled
 * systems index + per-system detail pages).
 *
 * This file is plain JS (no TypeScript in this project), shapes are
 * documented with JSDoc `@typedef` blocks for editor/IDE hinting, and
 * enforced at runtime (dev-only) via `validateWorkMeta`.
 *
 * Other agents/content authors adding `<slug>.meta.jsx` files to
 * `src/content/work/` must satisfy the `WorkMeta` shape below. Read
 * `src/content/claims-discipline.md` before writing any `summary`/`caption`
 * copy that touches a metric or capability claim.
 */

/**
 * A single link shown alongside a work entry (e.g. "live demo", "repo").
 *
 * @typedef {Object} WorkLink
 * @property {string} text - Link label, e.g. "live demo".
 * @property {string} url  - Destination URL.
 */

/**
 * A single comparison point plotted against a `Gauge`'s primary value.
 *
 * @typedef {Object} GaugeBaseline
 * @property {string} label - Human-readable label, e.g. "0.035 floor".
 * @property {number} value - The baseline's numeric value, same units/scale as the parent gauge.
 * @property {'warn'|'soft'} tone - 'warn' renders in the red/mark color (e.g. a no-skill floor,
 *   chance line); 'soft' renders as a neutral comparison point.
 */

/**
 * Props for the `<Gauge>` component. Documented here, not implemented here.
 *
 * THE GAUGE RULE: a gauge with zero real measured baselines is meaningless
 * and is banned by design. If a system has no real measured baseline to
 * compare against, do not create a gauge for it, use prose in `summary`
 * instead. This is why `baselines` is required and must be non-empty, and
 * why `metrics` on `WorkMeta` must be an explicit empty array (never
 * omitted) when a system has nothing honest to gauge.
 *
 * @typedef {Object} GaugeMetric
 * @property {string} label - What is being measured, e.g. "PR-AUC, sealed test".
 * @property {number} value - The primary numeric value.
 * @property {string} display - Exact string to render for `value` (formatting is explicit,
 *   never computed/rounded at render time), e.g. "0.589".
 * @property {number} [scaleMax=1] - Upper bound of the gauge's scale. Defaults to 1.
 * @property {?string} scaleNote - Required (must be non-null) whenever `scaleMax` is set and
 *   is not 1, must describe the non-standard scale in words. Must be `null` (or omitted)
 *   when `scaleMax` is 1 or absent.
 * @property {'ink'|'mark'} tone - 'mark' means this value IS the honest/damning number being
 *   foregrounded; 'ink' is the default/neutral rendering.
 * @property {GaugeBaseline[]} baselines - Required, must be non-empty. See "THE GAUGE RULE" above.
 * @property {string} [caption] - Optional supporting caption rendered under the gauge.
 */

/**
 * One entry in the work portfolio, one "system", and the source of both
 * the index-page card and (optionally) the `/work/:slug` detail page.
 *
 * @typedef {Object} WorkMeta
 * @property {string} slug - Required, unique, kebab-case. Used for routing and file naming
 *   (`<slug>.meta.jsx` / `<slug>.body.jsx`).
 * @property {number} section - Required. The § number shown in the paper-styled index.
 * @property {string} title - Required. System title, e.g. "Fraud Risk Scoring".
 * @property {string} [subtitle] - Optional. Only used on detail pages, e.g.
 *   "with LLM-Assisted Explainability".
 * @property {'live'|'wip'|'off'} status - Required. Drives the `StatusTag` glyph.
 * @property {string} statusLabel - Required. Text shown next to the `StatusTag` glyph,
 *   e.g. "live demo · complete".
 * @property {boolean} hasDetail - Required. `false` means no `/work/:slug` page exists for
 *   this system, index-only entry.
 * @property {WorkLink[]} [links] - Optional, can be empty.
 * @property {import('react').ReactNode} summary - Required. The index-page blurb; a React
 *   node that may contain `<Sidenote/>`.
 * @property {string[]} stack - Required, can be empty. e.g. `['LightGBM', 'Optuna']`.
 * @property {GaugeMetric[]} metrics - Required. MUST be an explicit empty array (not
 *   omitted) when the system has no real measured baseline to show. See THE GAUGE RULE
 *   on `GaugeMetric`.
 */

const ALLOWED_STATUSES = ['live', 'wip', 'off'];

/**
 * Validates a `WorkMeta` object against the content contract described
 * above. Runs ONLY in dev (guarded by `import.meta.env.DEV`), this is a
 * development-time sanity check for content authors, not a production
 * runtime guard.
 *
 * Collects every problem found and throws a single combined `Error` so a
 * content author gets full feedback in one pass, rather than fixing one
 * issue at a time.
 *
 * @param {Partial<WorkMeta>} meta
 * @returns {void}
 */
export function validateWorkMeta(meta) {
  if (!import.meta.env.DEV) return;

  const errors = [];
  const id = meta && typeof meta.slug === 'string' && meta.slug ? meta.slug : '(unknown slug)';

  const isNonEmptyString = (v) => typeof v === 'string' && v.length > 0;

  if (!meta || typeof meta !== 'object') {
    throw new Error(`validateWorkMeta: meta for "${id}" is not an object.`);
  }

  if (!isNonEmptyString(meta.slug)) {
    errors.push('"slug" must be a non-empty string.');
  }

  if (!isNonEmptyString(meta.title)) {
    errors.push('"title" must be a non-empty string.');
  }

  if (!isNonEmptyString(meta.statusLabel)) {
    errors.push('"statusLabel" must be a non-empty string.');
  }

  if (typeof meta.section !== 'number' || Number.isNaN(meta.section)) {
    errors.push('"section" must be a number.');
  }

  if (!ALLOWED_STATUSES.includes(meta.status)) {
    errors.push(`"status" must be one of ${ALLOWED_STATUSES.map((s) => `"${s}"`).join(', ')}, got ${JSON.stringify(meta.status)}.`);
  }

  if (typeof meta.hasDetail !== 'boolean') {
    errors.push('"hasDetail" must be a boolean.');
  }

  if (!Array.isArray(meta.stack)) {
    errors.push('"stack" must be an array.');
  }

  if (!Array.isArray(meta.metrics)) {
    errors.push('"metrics" must be an array (use an empty array, not omission, when there is no real measured baseline to show).');
  } else {
    meta.metrics.forEach((gauge, i) => {
      const gaugeLabel = gauge && isNonEmptyString(gauge.label) ? gauge.label : `metrics[${i}]`;

      if (!Array.isArray(gauge?.baselines) || gauge.baselines.length === 0) {
        errors.push(`metrics[${i}] ("${gaugeLabel}"): "baselines" is required and must be a non-empty array (the Gauge Rule, no real measured baseline means no gauge; use prose in "summary" instead).`);
      }

      const scaleMax = gauge?.scaleMax === undefined ? 1 : gauge.scaleMax;
      if (scaleMax !== 1 && (gauge?.scaleNote === null || gauge?.scaleNote === undefined || gauge.scaleNote === '')) {
        errors.push(`metrics[${i}] ("${gaugeLabel}"): "scaleNote" is required (non-null, describing the non-standard scale in words) whenever "scaleMax" is not 1, got scaleMax=${JSON.stringify(gauge?.scaleMax)}.`);
      }
    });
  }

  if (errors.length > 0) {
    throw new Error(
      `validateWorkMeta: invalid WorkMeta for "${id}" (${errors.length} problem${errors.length === 1 ? '' : 's'}):\n` +
        errors.map((e) => `  - ${e}`).join('\n')
    );
  }
}
