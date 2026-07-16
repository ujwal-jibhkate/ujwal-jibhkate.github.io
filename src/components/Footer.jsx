import { Link } from 'react-router-dom';
import { contact } from '../content/profile';

/**
 * Footer, small, quiet site-wide closing chrome.
 *
 * Mailto, LinkedIn, GitHub, and a link to the Colophon (rendered on the
 * About page, see src/components/paper/Colophon.jsx). Styled as mono
 * chrome (matching Navigation) rather than the serif-italic voice used for
 * in-content editorial elements, since this is structural nav, not prose.
 * A single hairline top rule is the only ornament.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="clear-both border-t border-hairline mt-20">
      <div className="mx-auto max-w-[1140px] px-6 min-[900px]:px-0 py-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
        <span>&copy; {year} Ujwal Jibhkate</span>

        <div className="flex items-baseline gap-x-6">
          <a href={`mailto:${contact.email}`} className="hover:text-soft transition-colors">
            Email
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-soft transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-soft transition-colors"
          >
            GitHub
          </a>
          <Link to="/about#colophon" className="hover:text-soft transition-colors">
            Colophon
          </Link>
        </div>
      </div>
    </footer>
  );
}
