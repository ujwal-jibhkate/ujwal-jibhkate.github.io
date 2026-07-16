/**
 * MarginStamp, a rotated stamp-like element in the left margin, e.g.
 * "portfolio · v3 · rev 2026-07-15 · open to AI/ML roles". Ported from
 * a-preprint.html `.stamp` (rotate(-90deg), transform-origin left top,
 * mono, letter-spacing .09em). Renders `children` verbatim, never
 * hardcode the text here.
 *
 * Requires a `position: relative` ancestor to position against; Sheet
 * provides one.
 */
export default function MarginStamp({ children }) {
  return (
    <div
      className="absolute font-mono text-[10px] tracking-[0.09em] text-faint whitespace-nowrap select-none"
      style={{
        left: '-58px',
        top: '150px',
        transform: 'rotate(-90deg)',
        transformOrigin: 'left top',
      }}
    >
      {children}
    </div>
  );
}
