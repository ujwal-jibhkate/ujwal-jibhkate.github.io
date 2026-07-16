/**
 * AboutPage, `/about`, the author + errata page.
 *
 * Ported from a3-about.html: drop-cap bio opening, Appointments, Education,
 * Publications, Achievements, Errata, and a Colophon. RunningHead content
 * (left/center/page) is copied verbatim from that mockup.
 *
 * Field-name reconciliation: `errata` entries in profile.js are shaped
 * `{id, tag, title, body}`, but <Errata> wants `{tag, children}`, mapped
 * below by rendering `<em>{title}.</em> {body}` as `children`, matching the
 * `<em>` emphasis pattern the mockup itself uses for retracted/corrected
 * titles.
 *
 * Per CLAUDE.md / Sidenote.jsx: every prose block below is plain block
 * markup (no flex/grid wrapping a run of <P>s) so Sidenote's floats keep
 * working. The one exception is <LimitationsBox>/<Errata>/<Colophon>
 * "boxed" children, which take raw <p> tags rather than <P>, since those
 * components own their own text styling and aren't the 640px-measure
 * justified body-copy treatment <P> provides.
 */
import Sheet from '../components/paper/Sheet';
import RunningHead from '../components/paper/RunningHead';
import PageTitle from '../components/paper/PageTitle';
import SectionHeading from '../components/paper/SectionHeading';
import P from '../components/paper/P';
import Sidenote from '../components/paper/Sidenote';
import Ref from '../components/paper/Ref';
import BooktabsTable from '../components/paper/BooktabsTable';
import Errata from '../components/paper/Errata';
import Colophon from '../components/paper/Colophon';
import {
  bio,
  experience,
  education,
  publications,
  achievements,
  errata,
  colophon,
  contact,
} from '../content/profile.js';

const shenLab = experience.find((e) => e.id === 'shen-lab');
const ibm = experience.find((e) => e.id === 'ibm');

const errataEntries = errata.map((entry) => ({
  tag: entry.tag,
  children: (
    <p>
      <em>{entry.title}.</em> {entry.body}
    </p>
  ),
}));

function CvEntry({ dateRange, title, org, children }) {
  return (
    <div className="mb-5">
      <div className="font-mono text-[11.5px] text-soft mb-[2px]">{dateRange}</div>
      <div className="font-serif font-bold text-[15px]">{title}</div>
      {org && (
        <div className="font-serif italic text-[13.5px] text-soft mb-[6px]">{org}</div>
      )}
      {children}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <RunningHead
        left="Ujwal Jibhkate · Selected Systems"
        center="Author & Errata"
        page="6"
      />

      <Sheet>
        <PageTitle size="h1">About the author</PageTitle>

        <P className="first-letter:text-[52px] first-letter:float-left first-letter:leading-[0.84] first-letter:font-normal first-letter:pt-[5px] first-letter:pr-2 first-letter:pb-0 first-letter:pl-0">
          I am an {bio.positioning} I am an {bio.summary[0]} Previously, I was a Software
          Engineer at IBM (May 2022 – Apr 2024, 2 years), building production-oriented
          GenAI proof-of-concept applications for enterprise clients. I am currently a
          Research Assistant in the Shen Lab at the Indiana University School of
          Medicine (Aug 2025 – Present), supervised by Prof. Jia Shen, working on
          AI-driven drug repurposing for pediatric brain tumors (DIPG/DMG).
        </P>

        <SectionHeading n="A.1" size="default">
          Appointments
        </SectionHeading>

        {shenLab && (
          <CvEntry dateRange={shenLab.dateRange} title={shenLab.title} org={`${shenLab.org} · ${shenLab.supervisor}`}>
            <P>{shenLab.summary}</P>
            {shenLab.highlights.map((h, i) => {
              const isLast = i === shenLab.highlights.length - 1;
              return (
                <P key={h.label}>
                  <b>{h.label}.</b> {h.body}
                  {isLast && shenLab.note && (
                    <Sidenote n={1} label="scope">
                      {shenLab.note}
                    </Sidenote>
                  )}
                </P>
              );
            })}
          </CvEntry>
        )}

        {ibm && (
          <CvEntry dateRange={ibm.dateRange} title={ibm.title} org={ibm.org}>
            <P>
              {ibm.summary}
              {ibm.claimsNote && (
                <Sidenote n={2} label="claims note">
                  {ibm.claimsNote}
                </Sidenote>
              )}
            </P>
            {ibm.highlights.map((h) => (
              <P key={h.label}>
                <b>{h.label}.</b> {h.body}
              </P>
            ))}
          </CvEntry>
        )}

        <SectionHeading n="A.2" size="default">
          Education
        </SectionHeading>
        {education.map((ed) => (
          <CvEntry
            key={ed.id}
            dateRange={ed.dateRange}
            title={ed.degree}
            org={`${ed.institution} · GPA ${ed.gpa}`}
          >
            {(ed.coursework || ed.capstone || ed.note) && (
              <P>
                {ed.capstone && <>Capstone: {ed.capstone} </>}
                {ed.coursework && ed.coursework.length > 0 && (
                  <>Coursework: {ed.coursework.join(', ')}. </>
                )}
                {ed.note}
              </P>
            )}
          </CvEntry>
        ))}

        <SectionHeading n="A.3" size="default">
          Publications
        </SectionHeading>
        <BooktabsTable
          n={2}
          columns={['Title', 'Venue', 'Year', 'Field']}
          rows={publications.map((pub) => [
            <Ref href={pub.url}>{pub.title}</Ref>,
            pub.venue,
            String(pub.year),
            pub.field,
          ])}
          caption={
            <>
              Citation-style listing of peer-reviewed publications, both arising from
              the undergraduate capstone (see Education, §A.2).{' '}
              {publications[0]?.note} Neither is ML research.
            </>
          }
        />

        <SectionHeading n="A.4" size="default">
          Achievements
        </SectionHeading>
        {achievements.map((a) => (
          <P key={a.id}>
            <b>{a.title}</b>
            {a.context && <> ({a.context})</>}
            {a.body && <>. {a.body}</>}
          </P>
        ))}

        <SectionHeading n="A.5" size="default">
          Errata
        </SectionHeading>
        <P>
          Results I published to myself, then retracted. Included because the
          retraction is the work.
        </P>
        <Errata entries={errataEntries} />

        <SectionHeading n="A.6" size="default">
          Contact
        </SectionHeading>
        <P>
          <Ref href={`mailto:${contact.email}`}>{contact.email}</Ref> ·{' '}
          <Ref href={contact.linkedin}>LinkedIn</Ref> ·{' '}
          <Ref href={contact.github}>GitHub</Ref>
          <br />
          {bio.location}.
        </P>

        <Colophon>
          Set in {colophon.typefaces.map((t) => t.name).join(' and ')}, self-hosted.{' '}
          {colophon.stack} {colophon.hosting} {colophon.sourceNote}{' '}
          <Ref href={colophon.sourceUrl}>{colophon.sourceUrl.replace('https://', '')}</Ref>.
        </Colophon>
      </Sheet>
    </div>
  );
}

export default AboutPage;
