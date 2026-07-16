/**
 * SectionHeading, an `h2` with a mono section-number prefix, e.g. "3.1".
 *
 * Mockups use two sizes for section h2s: 19px on the home page
 * (a-preprint.html `h2.sec`) and 17.5px everywhere else (a2/a3/a4
 * `h2.sec`). The base props are frozen at `{n, children}`; `size` is an
 * additive, optional prop (defaults to the more common 17.5px tier) so
 * existing call sites without it still work.
 */
export default function SectionHeading({ n, children, size = 'default' }) {
  const fontSize = size === 'lg' ? 'text-[19px]' : 'text-[17.5px]';
  return (
    <h2 className={`clear-both font-serif font-bold ${fontSize} mt-7 mb-[11px]`}>
      {n != null && (
        <span className="font-mono font-normal text-[13px] text-faint mr-[10px]">{n}</span>
      )}
      {children}
    </h2>
  );
}
