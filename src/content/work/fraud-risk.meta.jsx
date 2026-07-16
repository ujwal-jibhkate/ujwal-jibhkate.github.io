/**
 * Fraud Risk Scoring with LLM-Assisted Explainability.
 *
 * See ./fraud-risk.body.jsx for the full §1–§5 write-up and
 * src/content/claims-discipline.md for the hard constraints this content
 * must not violate (self-computed sealed-test numbers vs. a Kaggle
 * leaderboard result; ONNX/WASM demo plumbing is AI-generated and not a
 * claimed engineering skill; the explainability layer is a notebook tool,
 * not a productionized microservice).
 *
 * NOTE on `summary`: literal JSX. Meta files use the `.jsx` extension
 * specifically so this works in the real production build, not just the
 * dev server, see src/content/work/index.js's file-level comment for why.
 */
import Sidenote from '../../components/paper/Sidenote';
import Ref from '../../components/paper/Ref';

/** @type {import('../schema.js').WorkMeta} */
const fraudRiskMeta = {
  slug: 'fraud-risk',
  section: 2,
  title: 'Fraud Risk Scoring',
  subtitle: 'with LLM-Assisted Explainability',
  status: 'live',
  statusLabel: 'live demo · complete',
  hasDetail: true,
  links: [{ text: 'live demo', url: 'https://live-fraud-model.vercel.app/' }],
  summary: (
    <>
      Transaction fraud detection on the IEEE-CIS dataset, where fraud is ~3.5% of
      590,540 labeled transactions: a classifier that never predicts fraud scores
      96.5% accuracy and catches nothing. LightGBM, tuned with Optuna, reaches 0.589
      PR-AUC on a sealed, time-ordered test set (~17× the 0.035 no-skill floor),
      against a logistic-regression baseline of 0.211 on the identical split.
      <Sidenote n={1} label="not a leaderboard result">
        The competition's own 506k-row test set is unlabeled. Every number here is
        self-computed on a sealed slice carved out of the labeled training data,
        never a Kaggle leaderboard placement.
      </Sidenote>{' '}
      Eight backward-only behavioral features add +0.043 PR-AUC over the raw columns,
      proven by ablation (95% CI [+0.040, +0.046]) rather than a SHAP importance
      ranking, which actually ranked them outside the top 20. A SHAP-TreeExplainer +
      LLM layer, my own design, on top of an AI-generated ONNX/WASM export I don't
      claim to deeply understand, turns per-transaction attributions into
      plain-language analyst explanations, with the block/review/approve decision
      always made by a deterministic threshold the LLM cannot override.
      <Sidenote n={2} label="the flattering number">
        ROC-AUC on the same test set is 0.918, deliberately reported alongside
        PR-AUC in §3 to show how misleading ROC-AUC is on 96.5%-negative data. It is
        not the headline metric here.
      </Sidenote>{' '}
      Static in-browser demo at{' '}
      <Ref href="https://live-fraud-model.vercel.app/">live-fraud-model.vercel.app</Ref>.
    </>
  ),
  stack: [
    'Python',
    'LightGBM',
    'Optuna',
    'SHAP',
    'scikit-learn',
    'pandas',
    'NumPy',
    'Llama-3.3 (Groq)',
    'Ollama',
    'ONNX',
    'onnxruntime-web',
    'Vercel',
  ],
  // Two gauges, both with real measured baselines (per the Gauge Rule):
  // PR-AUC against the dataset's own no-skill floor and a logistic-regression
  // baseline on the identical split, and ROC-AUC against the standard 0.5
  // chance line for a binary classifier, foregrounded (tone: 'mark') on
  // purpose, since the point is that this "impressive" number is the
  // flattering one, not the achievement. See fraud-risk.body.jsx §3.
  metrics: [
    {
      label: 'PR-AUC (average precision), sealed test',
      value: 0.589,
      display: '0.589',
      tone: 'ink',
      baselines: [
        { label: '0.035 no-skill floor', value: 0.035, tone: 'warn' },
        { label: '0.211 logistic', value: 0.211, tone: 'soft' },
      ],
      caption:
        '~17× above chance. ROC-AUC was 0.918: see the gauge alongside this one, and that’s the flattering number, not this.',
    },
    {
      label: 'ROC-AUC, sealed test',
      value: 0.918,
      display: '0.918',
      tone: 'mark',
      baselines: [{ label: '0.50 chance line', value: 0.5, tone: 'warn' }],
      caption:
        'Looks impressive, but ROC-AUC is flattering on 96.5%-negative data. PR-AUC (left) is the metric that actually matters here.',
    },
  ],
};

export default fraudRiskMeta;
