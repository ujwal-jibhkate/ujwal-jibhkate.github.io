/**
 * Colophon, small "about this document" footer prose block (typefaces,
 * tools used to build the site). Not present in any of the four reference
 * mockups verbatim; styled consistently with the rest of the type system
 * (small italic serif, text-soft, hairline top rule as a closing device).
 */
export default function Colophon({ children }) {
  return (
    <div className="clear-both font-serif italic text-[12px] leading-[1.6] text-soft border-t border-hairline pt-4 mt-8">
      {children}
    </div>
  );
}
