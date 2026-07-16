/**
 * Auditable Clinical Report Generation from Chest X-rays, a vision-language
 * model that pairs a Swin Transformer encoder with a BioBERT decoder, so
 * report generation and pathology classification share one learned
 * representation instead of running as two disconnected models.
 *
 * `hasDetail: false`, index-only entry, no `./radiology-audit.body.jsx`
 * pairs with this file. See src/content/claims-discipline.md for the hard
 * constraints this content must not violate: the 0.94 ROC-AUC / 0.88
 * BERTScore F1 / 100% consistency figures are validation-only, computed on
 * a single 80/20 split, never presented as cross-validated or externally
 * benchmarked.
 *
 * UPDATE: a static demo is now live at https://radiology-ai-demo.vercel.app/
 * (the site owner deployed this after the original PROFILE.md snapshot was
 * written, which had said a Hugging Face Spaces attempt failed and there was
 * no live demo, that caveat is now stale and has been removed).
 *
 * NOTE on `summary`: literal JSX. Meta files use the `.jsx` extension
 * specifically so this works in the real production build, not just the
 * dev server, see src/content/work/index.js's file-level comment for why.
 *
 * metrics: [], see the inline comment below for why no gauge is used here.
 */
import Sidenote from '../../components/paper/Sidenote';
import Ref from '../../components/paper/Ref';

/** @type {import('../schema.js').WorkMeta} */
const radiologyAuditMeta = {
  slug: 'radiology-audit',
  section: 5,
  title: 'Auditable Clinical Report Generation from Chest X-rays',
  status: 'live',
  statusLabel: 'live demo · complete',
  hasDetail: false,
  links: [
    { text: 'live demo', url: 'https://radiology-ai-demo.vercel.app/' },
    { text: 'GitHub', url: 'https://github.com/ujwal-jibhkate/auditable-radiology-ai' },
  ],
  summary: (
    <>
      A vision-language system for generating chest X-ray radiology reports under a hard
      constraint: the generated text must never contradict the model's own predictions;
      auditability is treated as a first-class design requirement, not a post-hoc check. A
      Swin Transformer encoder feeds both a pathology-classification head and a BioBERT
      decoder, trained jointly under a multi-task combined loss so one shared
      representation drives both outputs, rather than two disconnected models. On a
      held-out split, the classifier reaches 0.94 ROC-AUC across all 14 pathologies
      (including rare classes), generated reports score 0.88 BERTScore F1 against
      reference text, and an automated fairness-and-consistency auditing framework found
      100% logical consistency between predicted findings and generated report
      language.{' '}
      <Sidenote n={1} label="validation scope">
        All three numbers come from a single 80/20 validation split: there is no
        cross-validation and no external benchmark or held-out test set beyond that
        split. Read them as internal validation results, not as a robustly generalized
        or externally verified performance claim.
      </Sidenote>{' '}
      Packaged for serving with Docker, FastAPI, and a Streamlit client, and now live at{' '}
      <Ref href="https://radiology-ai-demo.vercel.app/">radiology-ai-demo.vercel.app</Ref>.
    </>
  ),
  stack: ['PyTorch', 'Swin Transformer', 'BioBERT', 'Multi-task learning', 'Docker', 'FastAPI', 'Streamlit'],
  // No gauges: 0.94 ROC-AUC is reported across a 14-pathology multi-label
  // problem, not a single clean binary classifier. A per-class chance line
  // of 0.5 is mathematically real for ROC-AUC regardless of prevalence, but
  // the source material gives no per-class breakdown or aggregation method
  // (macro vs. micro) to confirm that a single 0.5 floor would represent
  // the reported 0.94 faithfully, and, unlike recsys's λ=1.0 baseline,
  // 0.5 would not be a baseline actually computed within this project, just
  // a theoretical one asserted after the fact. The 0.88 BERTScore F1 and
  // 100% consistency figures have no stated comparison at all. Per THE
  // GAUGE RULE, that means prose (above) rather than a fabricated-for-the-
  // slot gauge.
  metrics: [],
};

export default radiologyAuditMeta;
