/**
 * LimitationsBox, boxed callout for "what did not hold." `bg-wash` fill
 * with a mark-colored left border only (one of the few places `mark` red
 * is allowed, border only, never fill or text).
 */
export default function LimitationsBox({ title = 'Limitations', children }) {
  return (
    <div className="clear-both bg-wash border-l-[2.5px] border-mark px-5 py-4 mt-4">
      <h4 className="font-serif font-bold text-[13px] mb-2 text-ink">{title}</h4>
      <div className="font-serif text-[13px] leading-[1.66] text-soft [&_em]:italic [&_em]:text-ink">
        {children}
      </div>
    </div>
  );
}
