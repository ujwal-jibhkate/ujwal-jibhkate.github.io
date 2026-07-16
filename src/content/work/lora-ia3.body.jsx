/**
 * LoRA vs. IA³ body, detail-page content for
 * src/content/work/lora-ia3.meta.jsx.
 *
 * Export shape: a plain JSX fragment as the default export (not a
 * component function), see the header comment in aesop.body.jsx for why
 * this shape is required by src/content/work/index.js's bodyModules glob.
 *
 * No <Figure>/<Gauge>: no screenshot exists for this system, and per
 * lora-ia3.meta.jsx's own comment and src/content/schema.js's Gauge Rule,
 * "~100x fewer trainable parameters" and "LoRA wins on generation" are
 * qualitative architecture comparisons, not a single measured value against
 * a real baseline on a shared scale, so the findings stay prose + a
 * <BooktabsTable> instead of a fabricated gauge.
 */
import SectionHeading from '../../components/paper/SectionHeading';
import P from '../../components/paper/P';
import Sidenote from '../../components/paper/Sidenote';
import Ref from '../../components/paper/Ref';
import BooktabsTable from '../../components/paper/BooktabsTable';
import LimitationsBox from '../../components/paper/LimitationsBox';

export default (
  <>
    <SectionHeading n={1}>Problem</SectionHeading>
    <P>
      As a Graduate Research Assistant at Indiana University&apos;s Guan Lab, I came across a
      genomics paper, on Nucleotide Transformer v2, that fine-tuned with IA³ instead of the
      far more popular LoRA.{' '}
      <Sidenote n={1} label="the trigger">
        The question that stuck with me: why was a cutting-edge paper reaching for this niche
        method instead of the default everyone else uses?
      </Sidenote>{' '}
      LoRA is the adapter most practitioners reach for by default when full fine-tuning is too
      expensive, largely because it's the popular choice, not because there's much public
      evidence for when it actually beats the alternatives. That's a bad reason to pick a
      method. This project runs 12 controlled supervised fine-tuning experiments to find out
      whether IA³ is genuinely competitive with LoRA, or just less popular, and if the answer
      depends on the task.
    </P>

    <SectionHeading n={2}>Approach</SectionHeading>
    <P>
      The two methods modify a frozen pretrained model in structurally different ways. LoRA is
      a <em>bypass</em>: it adds new trainable low-rank matrices <em>A</em> and <em>B</em>{' '}
      alongside the original frozen weight matrix <em>W₀</em>, injecting additional parameters
      that create a new path for the signal to flow through:{' '}
      <code>h(x) = W₀x + (BA)x</code>. IA³ is a <em>volume knob</em>: it learns a vector{' '}
      <em>l</em> that rescales the model's existing activations in place, adding no new
      pathway and only thousands of parameters instead of millions:{' '}
      <code>h_new(x) = l ⊙ h_original(x)</code>. The distinction matters for what each method
      is structurally suited to: LoRA can route around what the frozen weights already encode,
      IA³ can only turn what's already there up or down.
    </P>
    <P>
      To test what that distinction means in practice, the setup holds tasks, splits, and
      metrics fixed across three architectures spanning both classification and generation,
      comparing LoRA against IA³ head-to-head on each:{' '}
      <em>DistilBERT</em> on SST-2 sentiment classification (encoder-only),{' '}
      <em>T5-small</em> on SAMSum dialogue summarization (encoder-decoder), and{' '}
      <em>Pythia-2.8B</em> on Dolly-15k instruction-following (decoder-only).{' '}
      <Sidenote n={2} label="not the original plan">
        The decoder-only slot was originally Gemma-2B, not Pythia-2.8B; it was swapped out
        after a training-stability crisis that's its own story, see §4.
      </Sidenote>{' '}
      Every run is tracked in Weights &amp; Biases: the classification sweep is recorded in{' '}
      <Ref href="https://api.wandb.ai/links/iu-aml-hw4-team/80hgmhpn">
        the DistilBERT dashboard
      </Ref>
      , and the summarization sweep, including the rank ablation at r=8/32/128, in{' '}
      <Ref href="https://api.wandb.ai/links/iu-aml-hw4-team/e2h3feyf">the T5 dashboard</Ref>.
    </P>

    <SectionHeading n={3}>Results</SectionHeading>
    <P>
      The result is task-dependent, not a universal winner. On classification, IA³ reached a
      lower eval loss than LoRA while training roughly 100× fewer parameters. On both
      generation tasks, summarization and instruction-following, LoRA won outright, and its
      margin grew with rank: r=128 beat r=32, which beat r=8, on the same summarization task.
    </P>
    <BooktabsTable
      n={1}
      columns={['Task / architecture', 'IA³ eval loss', 'LoRA eval loss', 'Winner']}
      rows={[
        ['Classification: DistilBERT, SST-2', '0.3196', '0.3594 (r=8)', 'IA³, ~100× fewer params'],
        ['Summarization: T5-small, SAMSum', '0.4652', '0.3624 (r=128)', 'LoRA'],
        ['Instruction-following: Pythia-2.8B, Dolly-15k', '2.2410', '1.9838 (r=128)', 'LoRA'],
      ]}
      caption="Eval loss by architecture and method, lower is better. IA³ trained ~0.01% of parameters on DistilBERT vs. LoRA r=8's ~1.09%; LoRA's reported rows use its best-performing rank per task (r=128 on both generation tasks)."
    />
    <P>
      The pattern lines up with the mechanics in §2. Classification only needs to sharpen a
      decision the pretrained model can more or less already make, refining knowledge that's
      already there, which is exactly what a volume-knob adjustment is suited for. Generation
      tasks ask the model to produce structurally new output, summaries or instruction-shaped
      responses it wasn't already primed to produce, which needs a new pathway, not a
      rescaling of an old one. The practical takeaway: adapter choice should follow what kind
      of task it is, refining existing knowledge versus teaching new behavior, not follow
      whichever method is more popular.
    </P>

    <SectionHeading n={4}>What didn&apos;t hold / limitations</SectionHeading>
    <LimitationsBox>
      <p className="mb-2">
        The decoder-only experiment was originally supposed to run on Gemma-2B, quantized to
        8-bit with fp16 mixed precision on a single T4 GPU, the same commodity-hardware
        constraint as the other two architectures. It produced catastrophic NaN losses from
        the first step, with eval loss plateauing at ~128.5 and never moving. Five fixes were
        tried, in order, and four of them did nothing:{' '}
        <em>lowering the learning rate</em> from 5e-4 to 5e-5 (eval loss stayed at 128.5);{' '}
        <em>disabling fp16</em> outright, which turned out to be incompatible with the loaded
        8-bit model and failed immediately;{' '}
        <em>switching optimizers</em> to <code>paged_adamw_8bit</code> (no change);{' '}
        <em>adding gradient clipping</em> at <code>max_grad_norm=0.3</code> (no change); and
        finally <em>forcing the <code>lm_head</code> layer to float32</em>, which didn&apos;t
        just fail to help, it raised a <code>ValueError</code> and was a dead end outright.
      </p>
      <p className="mb-2">
        None of that pointed to a fixable configuration problem, it pointed to a
        model-specific incompatibility between Gemma-2B and 8-bit quantization on T4 hardware.
        The resolution was to stop trying to fix Gemma-2B and swap the decoder-only slot for
        Pythia-2.8B instead, which turned out to be fully compatible with the same stability
        stack that had failed on Gemma: 8-bit loading, fp16=True, the{' '}
        <code>paged_adamw_8bit</code> optimizer, gradient clipping, and a more conservative
        2e-5 learning rate, together. The failed Gemma runs are preserved in{' '}
        <Ref href="https://api.wandb.ai/links/iu-aml-hw4-team/7rbfxg7h">
          a separate W&amp;B dashboard
        </Ref>{' '}
        rather than deleted, since the debugging trail is as much the result as the eventual
        fix.
      </p>
      <p>
        This is 12 experiments across 3 specific architectures and tasks, not an exhaustive
        PEFT survey: it says nothing directly about other adapter methods, other model
        families, or other task types, and the classification/generation split observed here
        is a pattern found in this setup, not a proven general law of PEFT behavior.
      </p>
    </LimitationsBox>

    <SectionHeading n={5}>Stack</SectionHeading>
    <P>
      PyTorch, Hugging Face Transformers, PEFT (LoRA, IA³), bitsandbytes. Models: DistilBERT,
      T5-small, Pythia-2.8B. Tracking: Weights &amp; Biases. Hardware: T4 GPU.
    </P>
  </>
);
