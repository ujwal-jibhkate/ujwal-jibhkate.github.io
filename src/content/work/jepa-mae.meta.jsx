/**
 * JEPA vs. MAE, self-supervised representation learning for chest X-ray
 * classification, benchmarked on NIH ChestX-ray14.
 *
 * `hasDetail: false`, index-only entry, no `./jepa-mae.body.jsx` file and
 * no `/work/:slug` page for this system.
 *
 * See src/content/claims-discipline.md ("JEPA vs MAE as a finished result")
 * before touching this copy: this is unpublished, ongoing research, under a
 * pre-publication audit. "Comparable results between I-JEPA and MAE" is a
 * claim currently being stress-tested, NOT an established finding, do not
 * phrase it as one. The audit checklist (comparison fairness, statistical
 * defensibility, patient-level leakage, pipeline bugs) is the actual
 * content of this entry, not a caveat tacked onto a result.
 *
 * No gauge here, deliberately (see `metrics` below), this is one of three
 * systems in the site design explicitly called out as having no gauge
 * (the others: LoRA vs IA3, HIV pipeline).
 *
 * NOTE on `summary`: literal JSX. Meta files use the `.jsx` extension
 * specifically so this works in the real production build, not just the
 * dev server, see src/content/work/index.js's file-level comment for why.
 */
import Sidenote from '../../components/paper/Sidenote';

/** @type {import('../schema.js').WorkMeta} */
const jepaMaeMeta = {
  slug: 'jepa-mae',
  section: 6,
  title: 'JEPA vs. MAE',
  status: 'wip',
  statusLabel: 'research · under audit',
  hasDetail: false,
  links: [],
  summary: (
    <>
      An in-progress comparison of Joint-Embedding Predictive Architecture (I-JEPA)
      against Masked Autoencoders (MAE) for self-supervised representation learning on
      chest X-rays, on NIH ChestX-ray14 (~120K images). Both baselines are trained, and
      early runs put the two in the same range on held-out evaluation
      <Sidenote n={1} label="not a finding">
        "Comparable" describes where the numbers currently sit, not a conclusion:
        whether that comparison actually holds up is exactly what the audit is
        checking. Treat it as an open question, not a result, until it clears audit.
      </Sidenote>
      , but that comparison is not being reported as a result here. It is currently
      going through a pre-publication audit, held to NeurIPS/Nature-caliber rigor,
      against an explicit checklist: whether the I-JEPA–MAE comparison is fair (matched
      compute, augmentation, and evaluation protocol); whether "comparable" is
      statistically defensible or within noise; whether the patient-level train/val
      split has any leakage; and whether the evaluation pipeline has a silent bug
      inflating or deflating either side. That audit checklist is the actual state of
      this work, not a footnote on top of a finished one. The literature review behind
      it covers RadJEPA (the closest prior work), Rad-DINO, and hybrid CNN-Transformer
      architectures (ConvFormer currently reports the strongest published results on
      this dataset), plus ChestX-ray14-specific failure modes: severe class imbalance,
      NLP-mined label noise, and a per-class AUROC reporting requirement rather than one
      aggregate score. Training and checkpoints run on IU's Big Red 200 SLURM cluster.
    </>
  ),
  stack: [
    'PyTorch',
    'I-JEPA',
    'MAE',
    'DINOv2',
    'ConvFormer',
    'ViT',
    'Self-Supervised Learning',
    'NIH ChestX-ray14',
    'SLURM',
    'IU Big Red 200 HPC',
  ],
  // No gauge: there is no finished, defensible comparative result yet. The
  // entire point of this entry is that "comparable results" between I-JEPA
  // and MAE is an unaudited claim (fairness, statistical defensibility,
  // patient-level leakage, and pipeline correctness are all still open),
  // a gauge would visually assert a specific measured comparison that
  // doesn't exist yet. Per the Gauge Rule: no gauge without a real, settled
  // baseline; prose above carries this instead.
  metrics: [],
};

export default jepaMaeMeta;
