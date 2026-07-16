/**
 * Equation, a numbered display equation. `children` is rendered as
 * authored (plain text/JSX math notation, no LaTeX rendering); `(n)` is
 * right-aligned on the same line, mono, text-faint.
 */
export default function Equation({ n, children }) {
  return (
    <div className="text-center italic text-[15px] text-ink my-[14px] clear-both">
      <span className="float-right font-mono not-italic text-[11px] text-faint">({n})</span>
      <span>{children}</span>
    </div>
  );
}
