/**
 * HIV Drug-Resistance Pipeline, earlier research, Guan Lab, Indiana
 * University. Separate from (and prior to) the ongoing Shen Lab
 * drug-repurposing work covered on the About page, see
 * src/content/profile.js's `shen-lab` experience entry.
 *
 * `hasDetail: false`, index-only entry, no `./hiv-pipeline.body.jsx` file.
 * The source material here is genuinely brief (pipeline stages + one
 * deployment-hardware fact, no measured numbers at all), so `summary`
 * is written short and is not padded out, see src/content/claims-discipline.md's
 * general rule against inferring/extrapolating claims beyond what's given.
 */
import Sidenote from '../../components/paper/Sidenote';

/** @type {import('../schema.js').WorkMeta} */
const hivPipelineMeta = {
  slug: 'hiv-pipeline',
  section: 7,
  title: 'HIV Drug-Resistance Pipeline',
  status: 'off',
  statusLabel: 'complete · earlier research',
  hasDetail: false,
  links: [],
  summary: (
    <>
      An Oxford Nanopore sequencing pipeline for HIV drug-resistance detection, built in the
      Guan Lab at Indiana University: raw FASTQ reads are processed, aligned with{' '}
      <code>minimap2</code>, and passed through FDR correction before generating
      clinician-facing resistance reports. The pipeline runs on an NVIDIA Jetson AGX Orin for
      edge inference, rather than cloud or server-side compute.
      <Sidenote n={1} label="scope">
        Guan Lab work, completed earlier and separate from the ongoing Shen Lab drug-repurposing
        research described on the About page: different lab, different project.
      </Sidenote>
    </>
  ),
  stack: ['Python', 'Oxford Nanopore', 'minimap2', 'FDR correction', 'Jetson AGX Orin'],
  // No gauges: the source material describes pipeline stages and an
  // edge-inference deployment target only, no accuracy, sensitivity,
  // latency, or any other measured performance number exists to plot.
  // Per the Gauge Rule, this stays prose-only in `summary`.
  metrics: [],
};

export default hivPipelineMeta;
