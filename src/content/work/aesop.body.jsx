/**
 * AESOP body, detail-page content for src/content/work/aesop.meta.js.
 *
 * Export shape: a plain JSX fragment as the default export (not a
 * component function). src/content/work/index.js's bodyModules glob does
 * `import.meta.glob('./*.body.jsx', { eager: true, import: 'default' })`
 * and types the result directly as `import('react').ReactNode`, the
 * registry never calls the default export as a function, it hands it
 * straight to the consuming page as a node. A component function default
 * export would be a function value, not a ReactNode, until invoked as
 * `<Body/>`, which the registry does not do. Exporting the fragment
 * directly satisfies the documented contract with no extra indirection.
 * Six more systems will copy this file, keep this shape.
 */
import SectionHeading from '../../components/paper/SectionHeading';
import P from '../../components/paper/P';
import Sidenote from '../../components/paper/Sidenote';
import Ref from '../../components/paper/Ref';
import BooktabsTable from '../../components/paper/BooktabsTable';
import Figure from '../../components/paper/Figure';
import LimitationsBox from '../../components/paper/LimitationsBox';
import aesopScreenshot from '../../assets/work/aesop.png';

export default (
  <>
    <SectionHeading n={1}>Problem</SectionHeading>
    <P>
      Synthesizing evidence across biomedical papers to answer a single research
      question is slow, manual work: a researcher reading, grading, and cross-
      referencing sources by hand typically spends 4+ hours on one question. That cost
      compounds with every question a literature review has to answer, and most of the
      time goes to triage: deciding which retrieved papers are actually relevant before
      any real synthesis can start.
    </P>

    <SectionHeading n={2}>Approach</SectionHeading>
    <Figure n={1} caption="The AESOP mark: six agent nodes in a corrective retrieval loop.">
      <img
        src={aesopScreenshot}
        alt="The AESOP logo: six connected circular nodes arranged in a hexagonal network, representing the agent pipeline."
        width={1564}
        height={1564}
        className="w-full max-w-[280px] h-auto mx-auto"
      />
    </Figure>
    <P>
      AESOP is a production multi-agent Corrective RAG (C-RAG) platform, live at{' '}
      <Ref href="https://aesop.live">aesop.live</Ref>, in production and actively
      maintained since early 2025.{' '}
      <Sidenote n={1} label="ownership">
        Co-built with Saksham Dahake. <em>He owns Scout's scaffolding, the Synthesizer
        agent, the React/TypeScript frontend, CI/CD, and production deployment.</em> My
        scope is the Critic agent end-to-end, the pgvector memory layer, the Router
        Agent, the auth backend, async sessions, and the evaluation framework described
        below. This write-up covers only that scope in detail.
      </Sidenote>{' '}
      Orchestration is an explicit LangGraph state machine with a corrective retrieval
      loop: a Scout agent retrieves candidate papers, a Critic agent grades their
      relevance (CRAG/GRADE-inspired), and only papers that clear that grade reach the
      Synthesizer. A separate Router Agent routes user intent to the right flow; it
      does not select models; model assignment is a fixed, design-time decision made
      per agent by task stakes, not a runtime routing choice.
    </P>
    <P>
      Concretely: Scout runs on Claude 3 Haiku; the Critic and Synthesizer run on
      Amazon Nova Pro, cheaper models on low-stakes steps, larger models on
      high-stakes reasoning, assigned per agent at design time. The Critic is the
      corrective part of C-RAG: it filters 40–70% of low-relevance papers out before
      synthesis ever sees them, versus naive RAG that would pass everything through.{' '}
      <Sidenote n={2} label="not iterative in production">
        The retrieval loop is <em>corrective, not iteratively retried</em>: production
        runs with <em>max_iterations=1</em>. Relevance grading gates whether synthesis
        proceeds; it does not loop back to re-retrieve and re-grade within a single
        query in the deployed system.
      </Sidenote>{' '}
      The memory layer is pgvector with exponential time-decay weighting, so more
      recent literature is favored over older matches at equal similarity, backed by a
      hybrid Redis/PostgreSQL write-through chat memory. The backend is async FastAPI
      with Celery and Redis, running on Docker with GitHub Actions CI/CD, on AWS
      Bedrock and a single AWS EC2 t3.small instance.
    </P>

    <SectionHeading n={3}>Results</SectionHeading>
    <P>
      The headline number is turnaround: a literature-review task that takes a
      researcher 4+ hours by hand completes in under 45 seconds end-to-end. On
      evaluation quality, a custom LLM-as-judge harness scores AESOP's answers at 0.83
      answer relevance and 0.79 faithfulness on a 0–1 scale.{' '}
      <Sidenote n={3} label="sample size">
        That harness ran <em>12 evaluation queries, of which 10 succeeded</em>: a
        small, custom benchmark, not RAGAS or G-Eval, and not a claim of
        large-scale evaluation coverage.
      </Sidenote>{' '}
      There is no externally validated chance-level or floor baseline for an
      LLM-as-judge relevance/faithfulness score the way there is for, say, a
      classifier's no-skill rate, so these are reported here as plain numbers rather
      than plotted against a fabricated comparison point. Operationally, the system
      holds sub-3-second latency and 99.9% uptime for 50–100 concurrent users, on a
      single t3.small EC2 instance, not a distributed or enterprise-scale deployment.
    </P>
    <BooktabsTable
      n={1}
      columns={['Metric', 'Value']}
      rows={[
        ['Literature review time', '4+ hrs → <45 s'],
        ['Critic pre-synthesis rejection rate', '40–70%'],
        ['Answer relevance (LLM-as-judge, 0–1)', '0.83'],
        ['Faithfulness (LLM-as-judge, 0–1)', '0.79'],
        ['Query latency', '<3 s'],
        ['Uptime', '99.9%'],
        ['Concurrent users', '50–100'],
      ]}
      caption="Operational and evaluation numbers, single AWS EC2 t3.small instance. Relevance/faithfulness from a custom LLM-as-judge harness, 12 queries / 10 successes, not RAGAS or G-Eval, and not a large-sample benchmark."
    />

    <SectionHeading n={4}>What didn't hold / limitations</SectionHeading>
    <LimitationsBox>
      <p className="mb-2">
        The evaluation harness is small and self-built: 12 queries, 10 successes, no
        RAGAS/G-Eval, no held-out human-labeled test set. The 0.83/0.79 scores describe
        performance on that harness, not a validated benchmark result.
      </p>
      <p className="mb-2">
        The corrective retrieval loop is not iterative in production:{' '}
        <em>max_iterations=1</em> means a low relevance grade filters a source out of
        synthesis; it does not trigger a re-retrieval attempt within the same query.
      </p>
      <p>
        The deployment is a single AWS EC2 t3.small instance serving 50–100 concurrent
        users, real production traffic, but not distributed or enterprise scale. And
        this write-up covers only the half of the system I own: Critic agent, pgvector
        memory, Router Agent, auth backend, async sessions, and evaluation framework.
        Scout's scaffolding, the Synthesizer, the frontend, and CI/CD are Saksham
        Dahake's work.
      </p>
    </LimitationsBox>

    <SectionHeading n={5}>Stack</SectionHeading>
    <P>
      Orchestration: LangGraph, LangChain. Models (AWS Bedrock): Claude 3 Haiku
      (Scout), Amazon Nova Pro (Critic, Synthesizer). Backend: Python, async FastAPI,
      Celery, Redis, PostgreSQL, pgvector. Infra: Docker, GitHub Actions, AWS EC2.
      Observability: LangSmith.
    </P>
  </>
);
