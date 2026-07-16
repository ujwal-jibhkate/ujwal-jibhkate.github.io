/**
 * BooktabsTable, LaTeX booktabs-style table. No vertical rules, no zebra
 * striping, no other cell borders, only toprule/midrule/bottomrule.
 *
 * @param {string[]} columns - header labels. First column renders
 *   left-aligned italic-soft; the rest render right-aligned italic-soft.
 * @param {Array<Array<import('react').ReactNode>>} rows - body rows, each
 *   an array of cell values aligned positionally with `columns`. First
 *   cell of each row renders serif/left-aligned; the rest render
 *   mono/right-aligned.
 * @param {import('react').ReactNode} caption - caption prose (the "Table
 *   N." prefix is rendered automatically, don't include it yourself).
 * @param {number|string} n - table number used in the caption prefix.
 */
export default function BooktabsTable({ columns, rows, caption, n }) {
  const lastRow = rows.length - 1;

  return (
    <div className="clear-both">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-[13px] my-[6px]">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`border-t-[1.6px] border-b-[0.8px] border-ink font-serif font-normal italic text-[12px] text-soft py-[7px] px-[9px] ${
                    i === 0 ? 'text-left' : 'text-right'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  const isLast = ri === lastRow;
                  const isFirst = ci === 0;
                  return (
                    <td
                      key={ci}
                      className={[
                        'py-[6px] px-[9px]',
                        isFirst
                          ? 'text-left font-serif text-[13.5px]'
                          : 'text-right font-mono text-[12px]',
                        isLast ? 'border-b-[1.6px] border-ink' : '',
                      ].join(' ')}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption != null && (
        <p className="font-serif text-[11.5px] text-soft leading-[1.55] mt-[9px]">
          <span className="text-ink font-bold">Table {n}.</span> {caption}
        </p>
      )}
    </div>
  );
}
