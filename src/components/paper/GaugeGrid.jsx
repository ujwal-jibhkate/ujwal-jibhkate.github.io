/**
 * GaugeGrid, a simple 2-up wrapper for <Gauge> pairs, matching
 * a4-work.html `.gauges` (grid-template-columns:1fr 1fr; gap:26px;
 * margin-top:13px; max-width:640px). Drops to 1-up under ~500px.
 */
export default function GaugeGrid({ children }) {
  return (
    <div className="clear-both grid grid-cols-1 min-[500px]:grid-cols-2 gap-x-[26px] gap-y-[26px] max-w-[640px] mt-[13px]">
      {children}
    </div>
  );
}
