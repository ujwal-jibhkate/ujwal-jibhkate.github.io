/**
 * Figure, wraps an image/visual (`children`) with a numbered caption
 * below. This component does not size or otherwise style `children`,
 * if it's an <img>, the consumer owns width/height/aspect-ratio.
 */
export default function Figure({ n, caption, children }) {
  return (
    <figure className="clear-both my-4 py-[14px] border-t border-b border-hairline">
      {children}
      {caption != null && (
        <figcaption className="font-serif text-[11.5px] leading-[1.55] text-soft mt-[8px]">
          <span className="text-ink font-bold">Figure {n}.</span> {caption}
        </figcaption>
      )}
    </figure>
  );
}
