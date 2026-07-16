/**
 * Ref, an inline external-link reference for use inside <P>/<Sidenote>
 * prose (e.g. "Live demo: <Ref href="...">aesop.live</Ref>").
 *
 * Ported from a2-project.html `.meta a`: accent-colored, underline only on
 * hover/focus (matches the site's restrained link treatment, `accent` is
 * reserved for links only, per the color rule).
 */
export default function Ref({ href, children }) {
  const isExternal = /^https?:\/\//.test(href ?? '');
  return (
    <a
      href={href}
      className="text-accent underline-offset-2 hover:underline focus:underline"
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}
