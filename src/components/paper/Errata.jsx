/**
 * Errata, a list of retracted/corrected/superseded results.
 * `entries` = [{ tag: 'RETRACTED'|'CORRECTED'|'SUPERSEDED', children }]
 */
export default function Errata({ entries }) {
  const lastIndex = entries.length - 1;
  return (
    <div className="clear-both border-t-[1.6px] border-b-[1.6px] border-ink py-[14px] mt-[10px]">
      {entries.map((entry, i) => (
        <div
          key={i}
          className={`grid grid-cols-[74px_1fr] gap-[14px] py-[7px] ${
            i !== lastIndex ? 'border-b border-dotted border-hairline' : ''
          }`}
        >
          <div className="font-mono text-[10px] text-mark pt-[2px]">{entry.tag}</div>
          <div className="font-serif text-[12.8px] leading-[1.58] text-soft [&_em]:italic [&_em]:text-ink">
            {entry.children}
          </div>
        </div>
      ))}
    </div>
  );
}
