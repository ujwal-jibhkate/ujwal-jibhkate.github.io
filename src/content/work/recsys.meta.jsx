/**
 * Dynamic Multi-Modal Recommender System, content-only embeddings, a
 * two-stage retrieve-then-rerank pipeline, and a residual "Living Taste
 * Profile" update network for incremental user preference updates.
 *
 * See ./recsys.body.jsx for the full §1–§5 write-up and
 * src/content/claims-discipline.md for the hard constraints this content
 * must not violate: cold-start is addressed structurally (content-derived
 * embeddings need no interaction history) and was never empirically
 * measured, never write "solved the cold-start problem"; the +48% figure
 * is intra-list diversity (ILD@10), never "better recommendations", since
 * nDCG@10 (relevance) was held stable, not improved, over the same
 * comparison.
 *
 * NOTE on `summary`: literal JSX. Meta files use the `.jsx` extension
 * specifically so this works in the real production build, not just the
 * dev server, see src/content/work/index.js's file-level comment for why.
 */
import Sidenote from '../../components/paper/Sidenote';
import Ref from '../../components/paper/Ref';

/** @type {import('../schema.js').WorkMeta} */
const recsysMeta = {
  slug: 'recsys',
  section: 3,
  title: 'Dynamic Multi-Modal Recommender System',
  subtitle: 'Content-Only Embeddings, Two-Stage Reranking, and a Residual Taste-Update Network',
  status: 'off',
  statusLabel: 'complete · not deployed',
  hasDetail: true,
  links: [
    { text: 'repo', url: 'https://github.com/ujwal-jibhkate/Dynamic-Embedding-RecSys' },
    {
      text: 'article',
      url: 'https://medium.com/@ujwaljibhkate/from-clicks-to-connections-building-a-smarter-recommender-with-embeddings-cb0f8ca61aaf',
    },
  ],
  summary: (
    <>
      A recommender system built around content-only item embeddings: CLIP visual
      features fused with Sentence-BERT text features across 44K movies via a PyTorch
      multi-triplet contrastive network, so a brand-new title is recommendable on day
      one, without waiting on interaction history. Retrieval is FAISS approximate
      nearest-neighbor search followed by a Two-Tower reranker, then MMR re-ranking at
      λ = 0.5 against a pure-relevance λ = 1.0 baseline. Against that baseline, MMR
      lifts intra-list diversity (ILD@10) by +48% and roughly doubles catalog coverage
      (2.17% → 4.49%), while nDCG@10 holds stable: relevance did not degrade.{' '}
      <Sidenote n={1} label="framing">
        The +48% figure is a <em>diversity</em> gain, not a relevance improvement:
        nDCG@10 was tracked as a guardrail and held constant, not raised. Cold-start is
        addressed <em>structurally</em>, by deriving embeddings from content rather than
        interactions; there was no held-out cold-start evaluation, and a zero-interaction
        user's initial embedding is not defined in the current design. See{' '}
        <Ref href="/work/recsys">the full write-up</Ref> §4.
      </Sidenote>{' '}
      A small residual update network, internally nicknamed the "Living Taste
      Profile", takes a user's current embedding plus a newly-watched movie's
      embedding and outputs an incremental update, so one new movie nudges a taste
      vector rather than overwriting it.
    </>
  ),
  stack: [
    'PyTorch',
    'CLIP',
    'Sentence-BERT',
    'FAISS',
    'Two-Tower architecture',
    'MMR',
    'Contrastive / triplet learning',
    'Hugging Face',
    'Kaggle',
  ],
  metrics: [
    {
      label: 'Catalog coverage',
      value: 4.49,
      display: '4.49%',
      scaleMax: 10,
      scaleNote: 'scale shown 0–10% for legibility',
      tone: 'ink',
      baselines: [{ label: '2.17% baseline (λ=1.0)', value: 2.17, tone: 'soft' }],
      caption: 'Roughly doubled vs the pure-relevance (λ=1.0) baseline.',
    },
  ],
};

export default recsysMeta;
