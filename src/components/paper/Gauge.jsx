/**
 * Gauge, the signature component. A horizontal bar showing a measured
 * value against one or more real baselines, entirely typographic (hairline
 * rules + italic labels) rather than a decorative "instrument panel" style.
 *
 * Pixel/color values ported from a4-work.html `.gz`/`.track`/`.fill`/`.tick`
 * (the work-index gauges, the mockups' most complete Gauge instance):
 *   - label: serif italic 11.5px text-soft
 *   - value: mono 13px font-bold, text-ink (text-mark if tone==='mark')
 *   - track: 1px full-width hairline rule
 *   - fill: 4px tall bar, bg-ink (bg-mark if tone==='mark')
 *   - baseline ticks: 1x9px, text-mark if tone==='warn' else text-soft,
 *     with an 8.5px italic label centered underneath
 *   - caption: 9.5px italic text-faint
 *
 * THE GAUGE RULE (enforced, not just conventional): a Gauge with no real
 * baseline to compare against is exactly the decorative, meaningless bar
 * this design argues against, so it throws in dev rather than rendering.
 *
 * Baseline label collision: labels are centered on their tick's %
 * position, so two baselines that sit close together on the scale (e.g.
 * fraud-risk's 0.035 floor and 0.211 logistic, ~17.6 points apart on a
 * narrow gauge) can have overlapping text boxes even though their anchor
 * points don't touch, the label's own width extends past its anchor in
 * both directions. Fixed with a simple vertical stagger: odd-indexed
 * baselines drop to a second row, so any two adjacent labels are
 * guaranteed non-overlapping regardless of proximity or text length,
 * without needing per-instance tuning of label text.
 */
export default function Gauge({
  label,
  value,
  display,
  scaleMax = 1,
  scaleNote = null,
  tone = 'ink',
  baselines,
  caption,
}) {
  if (import.meta.env.DEV && (!baselines || baselines.length === 0)) {
    throw new Error(
      'Gauge requires at least one baseline, no real baseline means no gauge, use prose instead'
    );
  }
  if (import.meta.env.DEV && scaleMax !== 1 && !scaleNote) {
    throw new Error(
      'Gauge with a non-default scaleMax must pass scaleNote, a non-standard scale must always disclose itself in the caption text'
    );
  }

  const isBad = tone === 'mark';
  const pct = clampPct((value / scaleMax) * 100);
  const captionText = [caption, scaleNote].filter(Boolean).join(' ');

  return (
    <div className="pt-[2px]">
      <div className="flex justify-between items-baseline mb-[9px]">
        <span className="font-serif italic text-[11.5px] text-soft">{label}</span>
        <span className={`font-mono text-[13px] font-bold ${isBad ? 'text-mark' : 'text-ink'}`}>
          {display}
        </span>
      </div>

      <div className="relative h-px bg-hairline">
        <div
          className={`absolute -top-[1.5px] left-0 h-[4px] ${isBad ? 'bg-mark' : 'bg-ink'}`}
          style={{ width: `${pct}%` }}
        />
        {baselines.map((baseline, i) => {
          const isWarn = baseline.tone === 'warn';
          const bpct = clampPct((baseline.value / scaleMax) * 100);
          const staggerRow = i % 2; // 0 = first row, 1 = second row (collision avoidance)
          return (
            <div
              key={i}
              className={`absolute -top-[4px] w-px h-[9px] ${isWarn ? 'bg-mark' : 'bg-soft'}`}
              style={{ left: `${bpct}%` }}
            >
              <span
                className={`absolute left-0 -translate-x-1/2 text-[8.5px] italic whitespace-nowrap font-serif ${
                  staggerRow === 0 ? 'top-[11px]' : 'top-[22px]'
                } ${isWarn ? 'text-mark' : 'text-soft'}`}
              >
                {baseline.label}
              </span>
            </div>
          );
        })}
      </div>

      {captionText && (
        <div
          className={`text-[9.5px] italic text-faint font-serif ${
            baselines.length > 1 ? 'mt-[30px]' : 'mt-[19px]'
          }`}
        >
          {captionText}
        </div>
      )}
    </div>
  );
}

function clampPct(n) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}
