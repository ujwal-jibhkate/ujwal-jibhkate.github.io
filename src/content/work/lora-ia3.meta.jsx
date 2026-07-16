/**
 * LoRA vs. IA³, a controlled comparison of two parameter-efficient
 * fine-tuning (PEFT) methods, run to answer a practical question rather
 * than to showcase either method: which adapter should you reach for, and
 * when. See src/content/claims-discipline.md for the hard constraints this
 * content must not violate.
 *
 * `hasDetail: true`, backed by `./lora-ia3.body.jsx`. `summary` still
 * carries the setup, both findings, and the task-dependent takeaway on its
 * own for the index page, but the full fp16/NaN engineering diagnosis now
 * lives in the body's §4, so the sidenote here is trimmed to a pointer
 * rather than re-telling the whole crisis.
 *
 * NOTE on `summary`: literal JSX. Meta files use the `.jsx` extension
 * specifically so this works in the real production build, not just the
 * dev server, see src/content/work/index.js's file-level comment for why.
 */
import Sidenote from '../../components/paper/Sidenote';

/** @type {import('../schema.js').WorkMeta} */
const loraIa3Meta = {
  slug: 'lora-ia3',
  section: 4,
  title: 'LoRA vs. IA³',
  status: 'off',
  statusLabel: 'complete · research',
  hasDetail: true,
  links: [{ text: 'GitHub', url: 'https://github.com/ujwal-jibhkate/lora-vs-ia3' }],
  summary: (
    <>
      Practitioners tend to reach for LoRA by default when fine-tuning is too expensive to run
      in full, without much evidence for when it actually beats the alternatives. This project
      runs 12 controlled supervised fine-tuning experiments across three architectures:
      DistilBERT, T5, and Pythia-2.8B, spanning both classification and generation tasks, with
      tasks, splits, and metrics held fixed across every run for an apples-to-apples comparison
      (all runs tracked in Weights &amp; Biases). The result is task-dependent, not a universal
      winner: IA³ reaches lower eval loss than LoRA on classification tasks with roughly 100×
      fewer trainable parameters, while LoRA dominates generation, with clear gains from scaling
      up rank. The practical takeaway is that adapter choice should follow task type, not
      default to whichever method is more popular.
      <Sidenote n={1} label="stability fix">
        The decoder-only experiment originally targeted Gemma-2B, which produced NaN losses
        under 8-bit quantization + fp16 on a single T4 GPU; five successive fixes failed before
        the model itself was swapped for Pythia-2.8B. Full diagnosis in §4 of the write-up.
      </Sidenote>
    </>
  ),
  stack: [
    'PyTorch',
    'Hugging Face Transformers',
    'PEFT',
    'LoRA',
    'IA³',
    'bitsandbytes',
    'DistilBERT',
    'T5',
    'Pythia-2.8B',
    'Weights & Biases',
    'T4 GPU',
  ],
  // No gauges: "~100x fewer trainable parameters" and "LoRA wins on generation"
  // are qualitative/architectural comparisons, not a single measured value with
  // a real numeric baseline on a shared scale, plotting either as a filled bar
  // would encode a baseline that doesn't exist (an earlier draft tried this and
  // it was rejected). Per the Gauge Rule, the findings stay prose-only.
  metrics: [],
};

export default loraIa3Meta;
