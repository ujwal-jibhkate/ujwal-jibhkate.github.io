import { Link } from 'react-router-dom';
import { contact } from '../content/profile';

/**
 * Navigation, static site header.
 *
 * A paper doesn't have a floating translucent nav bar: this renders inline
 * at the top of the document flow (no `fixed`, no `backdrop-blur`, no
 * scroll listeners) and scrolls away with the page like ordinary content.
 * Each page's own <RunningHead> (src/components/paper/RunningHead.jsx)
 * carries the "journal page header" convention further down; this is the
 * one piece of persistent site-wide chrome above it.
 *
 * Wordmark on the left (links home), three links on the right, Work,
 * About, and a mailto contact link sourced from src/content/profile.js so
 * the address is never hardcoded twice. Wraps to a second line at narrow
 * widths rather than hiding behind a hamburger menu; three links don't
 * need a disclosure pattern.
 */
export default function Navigation() {
  return (
    <header className="border-b border-hairline">
      <div className="mx-auto max-w-[1140px] px-6 min-[900px]:px-0 py-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <Link
          to="/"
          className="font-serif text-[17px] text-ink no-underline hover:text-soft transition-colors"
        >
          Ujwal Jibhkate
        </Link>

        <nav
          aria-label="Site"
          className="flex items-baseline gap-x-6 font-mono text-[11px] uppercase tracking-[0.1em] text-soft"
        >
          <Link to="/work" className="hover:text-ink transition-colors">
            Work
          </Link>
          <Link to="/about" className="hover:text-ink transition-colors">
            About
          </Link>
          <a href={`mailto:${contact.email}`} className="hover:text-ink transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
