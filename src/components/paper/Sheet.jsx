/**
 * Sheet, the page-level container for the "academic preprint" layout.
 *
 * Establishes a 1140px centered CSS grid with two tracks: `1fr` for the
 * main content column and a fixed `250px` margin column. The margin
 * column is intentionally left empty of grid items, it exists purely as
 * reserved visual space for <Sidenote> instances (authored inline inside
 * paragraphs in the 1fr column) to float into via a negative right margin.
 * See Sidenote.jsx for the mechanism.
 *
 * At viewports under 900px the grid collapses to a single column;
 * Sidenote's own media query (same 900px breakpoint) switches notes from
 * floated-margin to inline-block at the same point, so the two stay in sync.
 */
export default function Sheet({ children }) {
  return (
    <div className="relative mx-auto max-w-[1140px] px-6 min-[900px]:px-0 py-11 min-[900px]:py-[44px] min-[900px]:pb-[70px] grid grid-cols-1 min-[900px]:grid-cols-[1fr_250px] gap-x-[52px]">
      <div className="min-w-0">{children}</div>
    </div>
  );
}
