/**
 * HomePage, `/`, the masthead / front-matter page of the "academic
 * preprint" portfolio.
 *
 * Ported from a-preprint.html: margin stamp, animated motto-as-title,
 * byline/affiliation, an Abstract, a headline-results Table 1, and a
 * Limitations box. See that mockup for the pixel/spacing source of truth
 * for everything except the title, which is delegated to <MottoAnimation>
 * (built in parallel by another agent) instead of <PageTitle>, see the
 * comment above that usage below for the assumed prop contract.
 *
 * Table 1's rows are computed from `workMetas`' own `metrics`/`baselines`
 * fields (never hand-typed), so the numbers can't drift from the actual
 * work content. AESOP is deliberately excluded from the table: its meta
 * carries `metrics: []` by design (its 0.83 LLM-as-judge score has no
 * externally validated baseline to plot against, see aesop.meta.jsx's own
 * comment), the Gauge Rule that governs the work pages applies here too,
 * so a per-system caption note explains the omission instead of inventing
 * a baseline for it.
 */
import Sheet from '../components/paper/Sheet';
import RunningHead from '../components/paper/RunningHead';
import MarginStamp from '../components/paper/MarginStamp';
import SectionHeading from '../components/paper/SectionHeading';
import P from '../components/paper/P';
import BooktabsTable from '../components/paper/BooktabsTable';
import LimitationsBox from '../components/paper/LimitationsBox';
import MottoAnimation from '../components/MottoAnimation';
import { bio, experience, contact } from '../content/profile.js';
import { workMetas } from '../content/work/index.js';

const TODAY = '2026-07-16';

const ibm = experience.find((e) => e.id === 'ibm');

// --- Table 1: pull real numbers from the workMetas registry -------------
const fraudRisk = workMetas.find((w) => w.slug === 'fraud-risk');
const recsys = workMetas.find((w) => w.slug === 'recsys');

const prAuc = fraudRisk?.metrics.find((m) => m.label.includes('PR-AUC'));
const rocAuc = fraudRisk?.metrics.find((m) => m.label.includes('ROC-AUC'));
const coverage = recsys?.metrics[0];

const prAucFloor = prAuc?.baselines.find((b) => b.tone === 'warn');
const prAucLogistic = prAuc?.baselines.find((b) => b.tone === 'soft');
const rocChance = rocAuc?.baselines[0];
const coverageBaseline = coverage?.baselines[0];

const tableRows = [];
if (fraudRisk && prAuc && prAucFloor) {
  tableRows.push([
    fraudRisk.title,
    prAuc.label,
    prAuc.display,
    prAucFloor.label,
    `~${Math.round(prAuc.value / prAucFloor.value)}×`,
  ]);
}
if (fraudRisk && prAuc && prAucLogistic) {
  tableRows.push([
    fraudRisk.title,
    'vs. logistic regression',
    prAuc.display,
    prAucLogistic.label,
    `+${(prAuc.value - prAucLogistic.value).toFixed(3)}`,
  ]);
}
if (fraudRisk && rocAuc && rocChance) {
  tableRows.push([
    fraudRisk.title,
    rocAuc.label,
    rocAuc.display,
    rocChance.label,
    <span key="roc-delta" className="text-mark">
      {`+${(rocAuc.value - rocChance.value).toFixed(3)}`}
    </span>,
  ]);
}
if (recsys && coverage && coverageBaseline) {
  tableRows.push([
    recsys.title,
    coverage.label,
    coverage.display,
    coverageBaseline.label,
    `~${(coverage.value / coverageBaseline.value).toFixed(1)}×`,
  ]);
}

function HomePage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <RunningHead left="Ujwal Jibhkate · Selected Systems" center="" page="1" />

      <Sheet>
        <MarginStamp>
          {`portfolio · v3 · rev ${TODAY} · open to AI/ML roles`}
        </MarginStamp>

        {/*
          MottoAnimation renders the hero-tier title itself (in place of
          <PageTitle size="hero">) and owns its own scroll-triggered
          entrance. `title` accepts a string OR JSX with nested inline
          markup (its per-letter split recurses through element children,
          e.g. the mockup's italic on "learn" survives the split); `<strong>`
          in `subtitle` gets the mark-colored underline treatment
          automatically.
        */}
        <MottoAnimation
          title={
            <>
              I like to <i>learn</i> new things.
            </>
          }
          subtitle={
            <>
              Especially the ones that <strong>prove me wrong.</strong>
            </>
          }
        />

        <div className="font-serif text-[17px] mb-[3px]">{bio.name}</div>
        <div className="font-serif italic text-[13.5px] text-soft mb-[34px] leading-[1.55]">
          {bio.currentRole} · {bio.currentProgram}
          <br />
          Previously: {ibm?.title}, {ibm?.org} ({ibm?.dateRange}) · {contact.email}
        </div>

        <div className="border-t-[1.5px] border-ink border-b-[1.5px] pt-[18px] pb-5 mb-[38px]">
          <h4 className="font-mono text-[11px] tracking-[0.16em] uppercase mb-[9px] text-soft">
            Abstract
          </h4>
          <P>
            I am an {bio.positioning} This portfolio documents that work directly: production
            systems built end to end,
            alongside the results that failed to replicate, failed to transfer, or turned
            out to be artifacts once I looked for the reason they shouldn&rsquo;t be
            trusted. Every headline metric below is reported against the baseline it has
            to beat, not in isolation, and negative results are included by design,
            not omission.
          </P>
        </div>

        <SectionHeading n="1" size="lg">
          Selected systems
        </SectionHeading>
        {tableRows.length > 0 && (
          <BooktabsTable
            n={1}
            columns={['System', 'Metric', 'Result', 'Baseline', 'Δ']}
            rows={tableRows}
            caption={
              <>
                Headline results reported against their honest baselines, sourced directly
                from each system&rsquo;s own recorded metrics. AESOP is omitted here by
                design: it has no gauge-eligible baseline to plot against (see its own
                write-up), so its results stay prose-only rather than being forced into a
                fabricated comparison.
              </>
            }
          />
        )}

        <SectionHeading n="2" size="lg">
          Limitations
        </SectionHeading>
        <LimitationsBox title="What this portfolio does and doesn't claim">
          <p>
            This is a personal presentation of real, individually-built systems, not
            a set of peer-reviewed publications, and not a claim that every number below
            was produced under identical rigor. Evaluation quality varies project to
            project: some numbers come from sealed test sets and ablations with confidence
            intervals, others from a single validation split or an internal LLM-as-judge
            score. Each system&rsquo;s own write-up states its evaluation method and scope
            plainly, including where a result did not hold up: read that section
            before taking any single metric on this page at face value.
          </p>
        </LimitationsBox>
      </Sheet>
    </div>
  );
}

export default HomePage;
