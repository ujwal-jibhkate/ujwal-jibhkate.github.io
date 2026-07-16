/**
 * Fraud Risk Scoring body, detail-page content for
 * src/content/work/fraud-risk.meta.js.
 *
 * Export shape: a plain JSX fragment as the default export (not a
 * component function), see the header comment in aesop.body.jsx for why
 * this shape is required by src/content/work/index.js's bodyModules glob.
 *
 * Figures below are real matplotlib output from the project repo's
 * evaluation notebooks, re-encoded for web weight; the live demo (see
 * fraud-risk.meta.js) remains the interactive artifact, these are static
 * evaluation plots supplementing the prose in §2–§4.
 */
import SectionHeading from '../../components/paper/SectionHeading';
import P from '../../components/paper/P';
import Sidenote from '../../components/paper/Sidenote';
import Ref from '../../components/paper/Ref';
import BooktabsTable from '../../components/paper/BooktabsTable';
import Figure from '../../components/paper/Figure';
import LimitationsBox from '../../components/paper/LimitationsBox';
import Gauge from '../../components/paper/Gauge';
import GaugeGrid from '../../components/paper/GaugeGrid';
import prCurve from '../../assets/work/fraud-pr-curve.png';
import shapBeeswarm from '../../assets/work/fraud-shap-beeswarm.png';
import costTransfer from '../../assets/work/fraud-cost-transfer.png';
import calibrationCurve from '../../assets/work/fraud-calibration.png';

export default (
  <>
    <SectionHeading n={1}>Problem</SectionHeading>
    <P>
      Transaction fraud detection sits on severely imbalanced data: in the IEEE-CIS
      Fraud Detection dataset (Kaggle, Vesta Corporation), only about 3.5% of the
      590,540 labeled transactions are fraudulent. A classifier that never predicts
      fraud is 96.5% accurate, and completely useless, since it catches zero fraud.{' '}
      <Sidenote n={1} label="metric choice">
        Accuracy is close to meaningless on this label distribution. Every result
        reported here is precision/recall/PR-AUC on the positive (fraud) class
        instead, see §3.
      </Sidenote>{' '}
      The dataset compounds the problem: of its 433 raw columns, most of the V, C, D,
      M, and id_ blocks are anonymized with no published definitions, so a model built
      on them has to be validated by behavior, not by feature-level intuition. And a
      fraud score alone isn't enough in a deployed setting: a human analyst reviewing
      a flagged transaction needs to know <em>why</em> it was flagged, in language
      grounded in evidence, not just a number.
    </P>

    <SectionHeading n={2}>Approach</SectionHeading>
    <P>
      The dataset is IEEE-CIS Fraud Detection: 590,540 labeled transactions, 433 raw
      features, ~3.5% fraud base rate.{' '}
      <Sidenote n={2} label="not a leaderboard result">
        The competition's own 506k-row test set is unlabeled, so no leaderboard score
        is possible against it. Every number in this write-up is self-computed on a
        sealed slice carved out of the labeled training data, not a Kaggle placement.
      </Sidenote>{' '}
      Evaluation uses a time-sorted three-way split: the first 80% of transactions (by
      timestamp) form a DEV set used for a custom 4-fold walk-forward expanding
      cross-validation, and the last 20% form a sealed TEST set, opened exactly once
      after all modeling decisions were frozen. The splitter is custom, not
      scikit-learn's <code>TimeSeriesSplit</code>, which splits by row index and would
      leak batched same-timestamp events across a fold boundary; fold boundaries are
      instead snapped to timestamps, with an assertion that{' '}
      <code>max(train_time) &lt; min(val_time)</code> enforced per fold. Walk-forward
      CV on DEV estimated ~0.61 PR-AUC; the sealed TEST result came in at 0.589, a
      small, expected drift on the furthest-future period rather than a collapse, and
      the two numbers agreeing is the evidence against leakage, not just an
      assumption.
    </P>
    <P>
      The model is LightGBM, tuned with Optuna using a MedianPruner. On the identical
      split and metric, a Logistic Regression baseline, which needed a full
      impute+scale+one-hot+target-encode <code>ColumnTransformer</code> just to run,
      scored 0.211 PR-AUC; LightGBM scored 0.589, with native categorical handling and
      almost no preprocessing.{' '}
      <Sidenote n={3} label="scope of the comparison">
        This is a LightGBM-vs-logistic-regression comparison, not a
        LightGBM-vs-XGBoost one. LightGBM was chosen up front for native categorical
        handling and training speed; no head-to-head against XGBoost was run.
      </Sidenote>
    </P>
    <P>
      On top of the 430 raw columns, 8 hand-built behavioral features were added, all
      computed backward-only (no look-ahead): a proxy card identity (
      <code>card_uid</code>, with a singleton fallback), spend-vs-history ratios (
      <code>amt_ratio</code>, <code>amt_card_mean_prev</code>, via a cumulative sum
      excluding the current row), recency (<code>dt_prev_txn</code>, via{' '}
      <code>groupby().diff()</code>), trailing velocity (<code>txn_1h</code>,{' '}
      <code>txn_24h</code>), <code>is_new_card</code>, <code>addr1_missing</code>, and
      an expanding, smoothed, backward-only target encoding of the card ID (
      <code>card1_target_enc</code>). Their value is proven by ablation, not
      intuition: pooled out-of-fold PR-AUC was 0.604 with the engineered features
      versus 0.561 without, a +0.043 gain, positive in all 4 folds, with a 95%
      bootstrap CI of [+0.040, +0.046] and p ≈ 0.{' '}
      <Sidenote n={4} label="why ablation, not a SHAP ranking">
        Global SHAP importance ranked the engineered features outside the top 20,
        confounded by redundancy with IEEE's built-in C/D blocks, which capture
        overlapping signal. An importance ranking alone would have called them
        useless; ablation plus a significance test show they aren't. Feature value
        was measured by removing features and re-scoring, not by reading an
        importance plot.
      </Sidenote>
    </P>
    <Figure
      n={1}
      caption="Global SHAP feature-importance beeswarm, top 20 features by mean |SHAP value|, sealed test set. Reading this ranking directly is exactly the trap described above: the engineered features' real contribution was established by ablation testing, not by where they land here."
    >
      <img
        src={shapBeeswarm}
        alt="SHAP beeswarm plot showing the top 20 global feature importances for the fraud model, colored by feature value from low (blue) to high (pink/red)."
        width={1600}
        height={1918}
        className="w-full h-auto"
      />
    </Figure>
    <P>
      The explainability layer, entirely my own design and implementation, pairs a
      SHAP <code>TreeExplainer</code>, which produces per-transaction attributions,
      with an LLM (Groq-hosted Llama-3.3, provider-agnostic, with a documented local
      Ollama path for PII-sensitive deployments) that turns those attributions into a
      plain-language explanation for an analyst. Three constraints shaped it: the
      model decides, the LLM only explains: block/review/approve is a deterministic
      threshold function on the model's score, and the LLM is never in a position to
      override it; the explanation is split into two separated sections, a "model
      reasoning" section grounded strictly in SHAP values (honest that most
      anonymized features have no public meaning to explain), and an "analyst
      context" section surfacing the interpretable features instead; and the
      deployment story is privacy-aware, via the local Ollama path. It earned its
      keep twice in practice: it surfaced a missed high-value fraud case (17× the
      card's normal spend), and it caught a silent bug:{' '}
      <code>card1_target_enc</code> was being typed as a 471,958-category
      categorical and was effectively dead. Fixing that moved test PR-AUC from 0.569
      to 0.589, and moved that feature's own ablation contribution from 0.017 to
      0.043.
    </P>

    <SectionHeading n={3}>Results</SectionHeading>
    <P>
      PR-AUC, average precision, is the metric that matters on 3.5%-positive data;
      the no-skill floor at this base rate is 0.035, so a real result should be read
      against that floor, not against 1.0. LightGBM reaches 0.589 PR-AUC on the sealed
      test set, about 17× the no-skill floor.{' '}
      <Sidenote n={5} label="why not the headline">
        ROC-AUC on the same test set is 0.918, a superficially more impressive
        number, but ROC-AUC is flattering on imbalanced data because it's dominated
        by the (huge) negative class. It's reported below deliberately, next to the
        metric that actually matters, not as the headline result.
      </Sidenote>
    </P>
    <GaugeGrid>
      <Gauge
        label="PR-AUC (average precision), sealed test"
        value={0.589}
        display="0.589"
        tone="ink"
        baselines={[
          { label: '0.035 no-skill floor', value: 0.035, tone: 'warn' },
          { label: '0.211 logistic', value: 0.211, tone: 'soft' },
        ]}
        caption="~17× above chance. ROC-AUC was 0.918: see the gauge to the right, and that's the flattering number, not this."
      />
      <Gauge
        label="ROC-AUC, sealed test"
        value={0.918}
        display="0.918"
        tone="mark"
        baselines={[{ label: '0.50 chance line', value: 0.5, tone: 'warn' }]}
        caption="Looks impressive, but ROC-AUC is flattering on 96.5%-negative data. PR-AUC (left) is the metric that actually matters here."
      />
    </GaugeGrid>
    <Figure
      n={2}
      caption="Precision-recall curve, sealed test set. AUC = 0.589, ~17× the 0.035 no-skill baseline (dashed line) at this base rate."
    >
      <img
        src={prCurve}
        alt="Precision-recall curve for the fraud model on the sealed test set, with area under the curve of 0.589 against the 0.035 no-skill baseline."
        width={1600}
        height={1200}
        className="w-full h-auto"
      />
    </Figure>
    <P>
      The deployed threshold is chosen with a cost model, not by maximizing F1 or
      accuracy: a missed fraud (false negative) costs the full transaction amount (a
      missed $4,000 fraud is 100× as costly as a missed $40 one), while a false
      positive costs a flat ~$25 friction/churn penalty. At the deployed operating
      point, the model catches 64.2% of fraud by count and 58.6% of fraud by dollar
      value, at 42.1% precision, and avoids roughly $267,596 in realized fraud loss on
      the sealed test set versus running no model at all.
    </P>
    <BooktabsTable
      n={1}
      columns={['Metric', 'Value']}
      rows={[
        ['PR-AUC (average precision), sealed test', '0.589'],
        ['ROC-AUC, sealed test (not the headline metric)', '0.918'],
        ['Precision at deployed threshold', '42.1%'],
        ['Recall, by count', '64.2%'],
        ['Recall, by dollar value', '58.6%'],
        ['Fraud loss avoided vs. no model, sealed test', '~$267,596'],
        ['Deployed threshold', "0.5 (class_weight='balanced')"],
      ]}
      caption="Operational numbers on the sealed test set, deployed threshold 0.5 with class_weight='balanced'. See §4 for why the calibration-set-optimal threshold of 0.26 was not used."
    />

    <SectionHeading n={4}>What didn't hold / limitations</SectionHeading>
    <LimitationsBox>
      <p className="mb-2">
        The cost-optimal threshold fit on the calibration set was 0.26, but it did
        not transfer to the sealed test set: it over-blocked and lost more money than
        the naive default of 0.5. The cause: raw-probability thresholds are
        calibration-dependent, and the 4-fold CV ensemble used during calibration has
        a different probability scale than the single model refit and shipped for
        deployment. The system deployed at the calibration-robust threshold of 0.5
        with <em>class_weight='balanced'</em> instead of the theoretically optimal
        0.26; isotonic or Platt calibration is the principled fix, not yet
        implemented.
      </p>
      <p className="mb-2">
        The live in-browser demo exports the tuned LightGBM model to ONNX and runs it
        client-side via onnxruntime-web/WASM, with SHAP values and LLM rationales
        pre-computed offline as static JSON for 13 example transactions. That
        export/deployment plumbing was AI-generated, and I don't claim deep
        understanding of the ONNX/WASM internals. The SHAP-to-LLM explainability
        layer described in §2 is the part of this system that's genuinely my own
        work.
      </p>
      <p className="mb-2">
        The explainability layer is a notebook-based analyst tool, not a
        productionized microservice: there is no deployed API serving live
        explanations.
      </p>
      <p>
        None of the numbers above are a Kaggle leaderboard placement: the
        competition's true test set is unlabeled, and every metric here is
        self-computed on a sealed slice of the labeled training data.
      </p>
    </LimitationsBox>
    <Figure
      n={3}
      caption="Threshold cost, DEV calibration set vs. sealed TEST, each curve normalized to its own minimum. The DEV-optimal threshold (0.26, dotted) sits well past the TEST curve's minimum: it does not transfer. The deployed threshold (0.5, dashed) sits near both curves' minima instead."
    >
      <img
        src={costTransfer}
        alt="Line chart comparing relative cost versus decision threshold on the DEV calibration set and the sealed TEST set, showing the DEV-optimal threshold of 0.26 does not align with the TEST set's cost minimum, while the deployed threshold of 0.5 does."
        width={1600}
        height={1200}
        className="w-full h-auto"
      />
    </Figure>
    <Figure
      n={4}
      caption="Calibration reliability, sealed test set: predicted probability vs. true fraud fraction. Scores bow well below the diagonal because of class_weight='balanced', which is why a raw-probability threshold fit on the calibration set doesn't transfer cleanly, the same point the cost-transfer plot above makes from the deployment-cost side."
    >
      <img
        src={calibrationCurve}
        alt="Calibration reliability curve for the fraud model on the sealed test set, showing predicted probabilities bowing well below the perfectly-calibrated diagonal due to class_weight='balanced'."
        width={1600}
        height={1200}
        className="w-full h-auto"
      />
    </Figure>

    <SectionHeading n={5}>Stack</SectionHeading>
    <P>
      Modeling: Python, LightGBM, Optuna (MedianPruner), SHAP (TreeExplainer),
      scikit-learn, pandas, NumPy. Explainability: Llama-3.3 (Groq), with a
      documented local Ollama path for PII-sensitive deployments. Demo: ONNX,
      onnxruntime-web (WASM), Vercel.
    </P>
  </>
);
