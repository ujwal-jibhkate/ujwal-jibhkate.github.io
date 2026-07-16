/**
 * StatusTag, small italic status label with a leading glyph.
 *   live → ● hardcoded #3F7A4F (the ONE place green appears on the site)
 *   wip  → ◐ text-mark
 *   off  → ○ text-faint
 */
export default function StatusTag({ status, label }) {
  let glyph;
  let glyphClassName = '';
  let glyphStyle;

  if (status === 'live') {
    glyph = '●';
    glyphStyle = { color: '#3F7A4F' };
  } else if (status === 'wip') {
    glyph = '◐';
    glyphClassName = 'text-mark';
  } else {
    glyph = '○';
    glyphClassName = 'text-faint';
  }

  return (
    <span className="font-serif italic text-[11px] text-soft whitespace-nowrap">
      <span className={`mr-[5px] ${glyphClassName}`} style={glyphStyle}>
        {glyph}
      </span>
      {label}
    </span>
  );
}
