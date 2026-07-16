/**
 * P, the only paragraph wrapper content bodies should use for prose.
 *
 * Ported from a2-project.html `p.body`: 14.5px/1.72, justified, hyphenated.
 * Measure (max-width ~640px) is capped here so justified+hyphenated text
 * stays legible regardless of the Sheet column's actual width.
 *
 * Prose rhythm comes from this component's own margin-bottom, never wrap
 * a sequence of <P> in a flex/grid container for spacing (see Sidenote.jsx
 * and CLAUDE.md): floats used by <Sidenote> do not escape flex/grid
 * ancestors, and a `gap` utility on the prose container would silently
 * break every sidenote inside it.
 */
export default function P({ children, className = '' }) {
  return (
    <p
      className={`font-serif text-[14.5px] leading-[1.72] text-ink max-w-[640px] mb-[11px] ${className}`}
      style={{ textAlign: 'justify', hyphens: 'auto' }}
    >
      {children}
    </p>
  );
}
