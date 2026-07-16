/**
 * Dynamic Multi-Modal Recommender System body, detail-page content for
 * src/content/work/recsys.meta.js.
 *
 * Export shape: a plain JSX fragment as the default export (not a
 * component function), see the header comment in aesop.body.jsx for why
 * (src/content/work/index.js's bodyModules glob hands the default export
 * straight to the consuming page as a ReactNode, never invoking it as a
 * component). Same shape here.
 */
import SectionHeading from '../../components/paper/SectionHeading';
import P from '../../components/paper/P';
import Sidenote from '../../components/paper/Sidenote';
import Ref from '../../components/paper/Ref';
import BooktabsTable from '../../components/paper/BooktabsTable';
import Figure from '../../components/paper/Figure';
import LimitationsBox from '../../components/paper/LimitationsBox';
import Gauge from '../../components/paper/Gauge';
import recsysEmbeddingPlot from '../../assets/work/recsys.png';

export default (
  <>
    <SectionHeading n={1}>Problem</SectionHeading>
    <P>
      Recommender systems that key off interaction history run into two related
      problems. First, cold-start: a newly added item has no clicks, ratings, or
      watches yet, so any model that recommends by collaborative signal alone has
      nothing to go on for it. Second, the relevance–diversity tradeoff: optimizing
      purely for predicted relevance tends to collapse a recommendation list toward
      near-duplicates of what a user already watches, at the cost of catalog coverage
      and list diversity. Both problems show up together in a real movie catalog:
      new titles need a way in, and a relevance-only ranking needs a counterweight.
    </P>

    <SectionHeading n={2}>Approach</SectionHeading>
    <P>
      Item embeddings here are content-only: a PyTorch multi-triplet contrastive
      network fuses CLIP visual features (poster art) with Sentence-BERT textual
      features (metadata) across 44K movies into a single embedding space. Because
      an embedding is derived purely from a title's content rather than its
      interaction history, a brand-new movie has a usable embedding and is
      recommendable the moment it's added, with no wait for accumulated clicks.
    </P>
    <P>
      Retrieval is two-stage: FAISS approximate nearest-neighbor search over the
      content embeddings produces a candidate set, which a Two-Tower model then
      reranks.{' '}
      <Sidenote n={1} label="pattern">
        Retrieve-then-rerank is the same shape underpinning production RAG pipelines:
        a fast approximate retrieval pass narrows the candidate pool before a slower,
        more expressive model reranks it.
      </Sidenote>{' '}
      On top of that reranking, Maximal Marginal Relevance (MMR) re-ranks the list a
      second time to explicitly trade off relevance against diversity, run at λ = 0.5
      and compared against a pure-relevance baseline at λ = 1.0, the real, measured
      comparison point behind every number in §3.
    </P>
    <Figure
      n={1}
      caption="3D plot of the movie content embeddings learned by the model, colored by cluster; movies close in poster art and metadata land close together in the embedding space."
    >
      <img
        src={recsysEmbeddingPlot}
        alt="3D scatter plot showing clusters of movie embeddings learned by the recommendation model."
        width={1375}
        height={1095}
        className="w-full h-auto"
      />
    </Figure>
    <P>
      A separate small network, internally nicknamed the "Living Taste Profile",
      handles updating a user's preferences over time. It's a 2-layer network with a
      residual connection: given a user's current embedding and the embedding of a
      movie they just watched, it outputs an updated user embedding.{' '}
      <Sidenote n={2} label="why residual">
        The residual connection means the network learns a <em>delta</em>, not a
        replacement: the updated embedding is the old one plus a learned correction,
        so one newly watched movie nudges a taste vector rather than overwriting
        months of accumulated signal.
      </Sidenote>{' '}
      It's trained with a triplet loss: the updated embedding (anchor) is pulled
      toward the next movie the user actually went on to watch (positive) and pushed
      away from a random unwatched movie (negative): a single-step "predict what
      they watch next" objective.
    </P>

    <SectionHeading n={3}>Results</SectionHeading>
    <P>
      Against the pure-relevance λ = 1.0 baseline, MMR re-ranking at λ = 0.5 lifts
      intra-list diversity (ILD@10) by +48% and roughly doubles catalog coverage, from
      2.17% to 4.49%.{' '}
      <Sidenote n={3} label="diversity, not relevance">
        +48% is a <em>diversity</em> gain, specifically ILD@10; it is not a claim that
        recommendations got more relevant. nDCG@10 was tracked as a guardrail metric
        across the same comparison and held stable, confirming relevance did not
        degrade while diversity rose, not that it improved.
      </Sidenote>{' '}
      The curated dataset behind this project is published on Hugging Face and
      Kaggle.
    </P>
    <div className="max-w-[300px] mt-[13px] mb-2">
      <Gauge
        label="Catalog coverage"
        value={4.49}
        display="4.49%"
        scaleMax={10}
        scaleNote="scale shown 0–10% for legibility"
        tone="ink"
        baselines={[{ label: '2.17% baseline (λ=1.0)', value: 2.17, tone: 'soft' }]}
        caption="Roughly doubled vs the pure-relevance (λ=1.0) baseline."
      />
    </div>
    <BooktabsTable
      n={1}
      columns={['Metric', 'λ=1.0 baseline', 'λ=0.5 (MMR)']}
      rows={[
        ['Intra-list diversity (ILD@10)', 'not recorded', '+48%'],
        ['Catalog coverage', '2.17%', '4.49%'],
        ['nDCG@10', 'stable', 'stable'],
      ]}
      caption="Diversity re-ranking (MMR, λ=0.5) vs a pure-relevance ranking (λ=1.0). ILD@10 is reported as a percentage delta only, no absolute baseline value was recorded. nDCG@10 held stable across the comparison; it is a guardrail confirming relevance did not degrade, not a metric that improved."
    />

    <SectionHeading n={4}>What didn't hold / limitations</SectionHeading>
    <LimitationsBox>
      <p className="mb-2">
        The +48% ILD@10 figure is a <em>diversity</em> result, not a relevance result:
        nDCG@10 was held stable, not improved, over the same λ=1.0 → λ=0.5 comparison.
        Describing this as "better recommendations" would misstate what was measured.
      </p>
      <p className="mb-2">
        Cold-start is addressed <em>structurally</em>: content-derived embeddings mean
        a new item needs no interaction history to be recommendable. That is a design
        property, not a measured result: there was no held-out cold-start evaluation
        (no cold recall@k on a held-out slice of new items or new users). In
        particular, user cold-start is unresolved in the current design: what a
        zero-interaction user's initial embedding should be is not defined.
      </p>
      <p>
        ILD@10 is reported here only as a percentage delta: the underlying absolute
        before/after ILD values were not recorded, so no absolute comparison is
        claimed beyond the +48% figure itself.
      </p>
    </LimitationsBox>

    <SectionHeading n={5}>Stack</SectionHeading>
    <P>
      Embeddings: PyTorch, CLIP, Sentence-BERT, multi-triplet contrastive learning.
      Retrieval and reranking: FAISS, Two-Tower architecture, MMR. Taste updates:
      residual triplet-loss network. Artifacts: curated dataset on Hugging Face and
      Kaggle.
    </P>
  </>
);
