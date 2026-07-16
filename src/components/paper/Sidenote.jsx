import { useLayoutEffect } from 'react';

/**
 * Sidenote, a Tufte-style margin note authored INLINE in prose, e.g.:
 *
 *   <p className="font-serif ...">
 *     Some claim.<Sidenote n={1} label="scope">The frontend is <em>not</em> mine.</Sidenote>
 *     The sentence continues after the note.
 *   </p>
 *
 * Three implementation traps this component exists to avoid (see CLAUDE
 * task spec for the full rationale):
 *
 * 1. The floated note's root element is a <span> with `display: block`,
 *    never <aside>/<div>. A <p> cannot legally contain block-level flow
 *    content; a <div>/<aside> inside a <p> gets silently "fixed" by the
 *    browser (closing the <p> early), which wrecks layout in ways that
 *    don't reproduce in dev tools' inspector (which shows the *parsed*,
 *    already-corrected tree). A <span> is phrasing content by tag name
 *    regardless of its computed `display`, so it's legal inside <p>.
 *
 * 2. Desktop: float:right; clear:right; width:250px; margin-right:-302px
 *    (250px note width + 52px Sheet gap = -302px, pulling the note into
 *    the reserved 250px margin column Sheet's grid sets up). `clear:right`
 *    stacks consecutive sidenotes top-to-bottom instead of overlapping.
 *    Mobile (<900px, matching Sheet's collapse breakpoint): float:none;
 *    display:block so the note renders inline right after the paragraph.
 *    No <details>/click-to-reveal, the caveat must be visible by default.
 *
 * 3. These rules are plain CSS, not Tailwind utilities, and deliberately
 *    live in this file (not src/index.css, which this wave doesn't own)
 *    via a single injected <style> tag, so floats aren't nested inside any
 *    flex/grid ancestor a consumer might reach for, floats do not escape
 *    flex/grid formatting contexts, which would silently break the whole
 *    mechanism.
 */

const STYLE_ID = 'paper-sidenote-styles';

const CSS = `
.paper-sidenote {
  display: block;
  float: right;
  clear: right;
  width: 250px;
  margin-right: -302px;
  margin-bottom: 28px;
  padding-left: 13px;
  border-left: 2px solid var(--color-hairline);
}
.paper-sidenote-num {
  display: block;
  font-family: 'iA Writer Quattro', ui-monospace, SFMono-Regular, monospace;
  font-size: 10px;
  color: var(--color-mark);
  margin-bottom: 5px;
}
.paper-sidenote-body {
  display: block;
  font-family: 'Source Serif 4', 'Source Serif Fallback', Georgia, serif;
  font-size: 12px;
  line-height: 1.62;
  color: var(--color-soft);
}
.paper-sidenote-body em {
  color: var(--color-ink);
  font-style: italic;
}
@media (max-width: 899px) {
  .paper-sidenote {
    float: none;
    clear: none;
    display: block;
    width: auto;
    margin: 12px 0;
  }
}
`;

function useSidenoteStyles() {
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);
}

export default function Sidenote({ n, label, children }) {
  useSidenoteStyles();

  return (
    <>
      <sup className="font-mono text-[9px] text-mark align-super">{n}</sup>
      <span className="paper-sidenote">
        <span className="paper-sidenote-num">
          {n}: {label}
        </span>
        <span className="paper-sidenote-body">{children}</span>
      </span>
    </>
  );
}
