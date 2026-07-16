/**
 * PageTitle, the big serif title.
 *
 * `size="hero"` (default) is the home masthead treatment: 66px/1.02,
 * -0.018em tracking, with an optional italic `subtitle` line below it
 * (31px/1.15 serif italic). This tier is used exactly once, on Home.
 *
 * `size="h1"` is the smaller title used at the top of every other page
 * (project detail, about, work index): 38px/1.14, -0.015em tracking, no
 * subtitle slot. Mockup source: a-preprint.html `.title`/`.sub` for hero,
 * a2/a3/a4 `h1` for the h1 tier.
 */
export default function PageTitle({ children, subtitle, size = 'hero' }) {
  if (size === 'h1') {
    return (
      <h1 className="font-serif font-normal text-[38px] leading-[1.14] tracking-[-0.015em] mb-2">
        {children}
      </h1>
    );
  }

  return (
    <div>
      <h1 className="font-serif font-normal text-[66px] leading-[1.02] tracking-[-0.018em] mb-[10px]">
        {children}
      </h1>
      {subtitle != null && (
        <div className="font-serif italic text-soft text-[31px] leading-[1.15] mb-[30px]">
          {subtitle}
        </div>
      )}
    </div>
  );
}
