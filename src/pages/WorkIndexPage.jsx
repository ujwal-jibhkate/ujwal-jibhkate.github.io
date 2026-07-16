/**
 * WorkIndexPage, `/work`, the "Index of systems" page.
 *
 * Ported from a4-work.html. Renders one entry per `workMetas` item (already
 * sorted by `section` ascending by the registry). Each entry's header row
 * (§ number / title / status) is its own small grid, `.eh` in the mockup,
 * which is safe to build with CSS grid because it never contains a
 * <Sidenote>. The entry BODY (`.ebody`), by contrast, holds `meta.summary`,
 * which frequently DOES contain a <Sidenote>, so it and everything below it
 * is plain block markup with margins, per CLAUDE.md's gotcha and
 * Sidenote.jsx's own header comment: floats don't escape flex/grid
 * containers, so wrapping sidenote-bearing prose in one would silently
 * break every note.
 *
 * Index entries intentionally do NOT reuse <SectionHeading>, that
 * component is the body-page section-heading treatment (17.5px bold, `n`
 * inline as a mono prefix immediately before the text). a4-work.html's
 * `.eh` is a different, wider treatment: a 3-column grid (§n / h3 title /
 * status tag), with the number in its own faint mono column and a 20px
 * bold serif title, confirmed by reading the mockup CSS, not assumed.
 */
import { Link } from 'react-router-dom';
import Sheet from '../components/paper/Sheet';
import RunningHead from '../components/paper/RunningHead';
import PageTitle from '../components/paper/PageTitle';
import StatusTag from '../components/paper/StatusTag';
import Gauge from '../components/paper/Gauge';
import GaugeGrid from '../components/paper/GaugeGrid';
import { workMetas } from '../content/work/index.js';

export default function WorkIndexPage() {
  return (
    <>
      <RunningHead left="Ujwal Jibhkate · Selected Systems" center="Contents" page="2" />
      <Sheet>
        <PageTitle size="h1">Index of systems</PageTitle>
        <div className="border-t-[1.6px] border-ink mt-6">
          {workMetas.map((meta, i) => (
            <div
              key={meta.slug}
              className={`clear-both py-[22px] ${i !== workMetas.length - 1 ? 'border-b-[0.5px] border-[#E2DCCC]' : ''}`}
            >
              <div className="grid grid-cols-[34px_1fr_auto] gap-x-[14px] items-baseline">
                <span className="font-mono text-[11.5px] text-faint">§{meta.section}</span>
                <h3 className="font-serif font-bold text-[20px] tracking-[-0.01em]">{meta.title}</h3>
                <StatusTag status={meta.status} label={meta.statusLabel} />
              </div>

              <div className="ml-12 mt-[7px]">
                <p
                  className="font-serif text-[13.8px] leading-[1.66] text-soft max-w-[640px] mb-[9px] [&_b]:text-ink [&_b]:font-bold [&_em]:italic"
                  style={{ textAlign: 'justify' }}
                >
                  {meta.summary}
                </p>

                {meta.metrics.length > 0 && (
                  <GaugeGrid>
                    {meta.metrics.map((metric, mi) => (
                      <Gauge key={mi} {...metric} />
                    ))}
                  </GaugeGrid>
                )}

                <div className="font-mono text-[10px] text-faint tracking-[0.03em] mt-2">
                  {meta.stack.join(' · ')}
                </div>

                {meta.hasDetail && (
                  <div className="mt-[9px]">
                    <Link
                      to={`/work/${meta.slug}`}
                      className="font-serif italic text-[12px] text-accent underline-offset-2 hover:underline focus:underline"
                    >
                      Full write-up →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="clear-both bg-wash border-l-[2.5px] border-mark px-4 py-[14px] mt-[30px]">
          <h4 className="font-serif font-bold text-[12.5px] mb-[6px] text-ink">
            <Link to="/about#errata" className="hover:underline focus:underline">
              See also: Errata, p. 6
            </Link>
          </h4>
          <p className="font-serif text-[12px] leading-[1.6] text-soft">
            A record of retracted, corrected, and superseded results, kept visible rather than
            quietly edited away, lives on the{' '}
            <Link to="/about#errata" className="text-accent hover:underline focus:underline">
              About page
            </Link>
            . <em className="italic text-ink">The retraction is the work.</em>
          </p>
        </div>
      </Sheet>
    </>
  );
}
