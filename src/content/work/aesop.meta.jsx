/**
 * AESOP, Agentic Evidence Synthesis & Observation Platform.
 *
 * Flagship system, co-built with Saksham Dahake. See ./aesop.body.jsx for
 * the full §1–§5 write-up and src/content/claims-discipline.md for the
 * hard constraints this content must not violate (ownership scope, model
 * assignment framing, corrective-loop framing, eval harness honesty,
 * single-instance scale).
 *
 * NOTE on `summary`: literal JSX. Meta files use the `.jsx` extension
 * specifically so this works in the real production build, not just the
 * dev server, see src/content/work/index.js's file-level comment for why.
 */
import Sidenote from '../../components/paper/Sidenote';
import Ref from '../../components/paper/Ref';

/** @type {import('../schema.js').WorkMeta} */
const aesopMeta = {
  slug: 'aesop',
  section: 1,
  title: 'AESOP',
  subtitle: 'Agentic Evidence Synthesis & Observation Platform',
  status: 'live',
  statusLabel: 'live · production',
  hasDetail: true,
  links: [{ text: 'live demo', url: 'https://aesop.live' }],
  summary: (
    <>
      AESOP cuts biomedical literature review, normally 4+ hours of manual synthesis
      across papers, down to under 45 seconds, via a production multi-agent Corrective
      RAG (C-RAG) pipeline orchestrated as an explicit LangGraph state machine. A Critic
      agent grades source relevance before synthesis is allowed to run, rejecting
      40–70% of weak sources; retrieval and synthesis are split across Claude 3 Haiku
      and Amazon Nova Pro, assigned per agent at design time by task stakes, not routed
      dynamically at runtime. Live at <Ref href="https://aesop.live">aesop.live</Ref>,
      currently serving 50–100 concurrent users off a single AWS EC2 t3.small instance.
      <Sidenote n={1} label="scope">
        Co-built with Saksham Dahake, who owns the frontend, CI/CD, and production
        deployment.{' '}
        <em>
          The Critic agent, pgvector memory layer, Router Agent, auth backend, async
          sessions, and evaluation framework are mine
        </em>
        {' '}(see §2 for the exact split).
      </Sidenote>
    </>
  ),
  stack: [
    'Python',
    'LangGraph',
    'LangChain',
    'AWS Bedrock',
    'Claude 3 Haiku',
    'Amazon Nova Pro',
    'FastAPI',
    'Celery',
    'Redis',
    'PostgreSQL',
    'pgvector',
    'Docker',
    'GitHub Actions',
    'AWS EC2',
    'LangSmith',
  ],
  // No gauges: the 0.83 / 0.79 LLM-as-judge scores have no externally
  // validated chance/floor baseline to plot against (unlike, e.g., a
  // classifier's no-skill rate), per the Gauge Rule, that means prose in
  // the body/summary, not a fabricated bar. See aesop.body.jsx §3.
  metrics: [],
};

export default aesopMeta;
