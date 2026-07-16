/**
 * RunningHead, the small running header printed at the top of every page
 * ("left · center · page N"), mimicking a journal's page header.
 *
 * Rendered as a sibling ABOVE <Sheet>, not as a grid child inside it, both
 * share the same `max-w-[1140px] mx-auto` centering so they align visually,
 * without requiring Sheet to special-case a "full width" slot in its grid
 * (Sheet's own grid columns are reserved for the 1fr content + 250px margin
 * note column).
 */
export default function RunningHead({ left, center, page }) {
  return (
    <div className="mx-auto max-w-[1140px] px-6 min-[900px]:px-0 flex items-baseline justify-between gap-4 font-serif italic text-[11px] text-soft border-b border-hairline pb-[7px] mb-[30px]">
      <span>{left}</span>
      <span>{center}</span>
      <span>{page}</span>
    </div>
  );
}
