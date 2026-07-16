/**
 * Structured content for the About page, everything except the "work"
 * systems themselves (those live in `./work/`, one `<slug>.meta.jsx` +
 * optional `<slug>.body.jsx` per system, registered via `./work/index.js`).
 *
 * Plain JS objects/arrays, exported as named consts. No TypeScript in this
 * project, shapes are documented with JSDoc `@typedef` blocks below for
 * editor hinting. A later wave builds the actual About page component and
 * may adapt these shapes as needed; string/object fields here are treated
 * as content, not markup, unless noted otherwise.
 *
 * IMPORTANT: any copy here that touches a metric, deliverable, or capability
 * claim must be consistent with `../content/claims-discipline.md`. When in
 * doubt, that file is the source of truth, this file was written to align
 * with it, not the other way around.
 */

/**
 * @typedef {Object} Bio
 * @property {string} name
 * @property {string} location
 * @property {string} currentRole - Current primary role/title.
 * @property {string} currentProgram - Current degree program.
 * @property {string} positioning - The single positioning statement used near the top of
 *   the About page.
 * @property {string[]} summary - Short paragraph-length bullets summarizing the bio.
 */

/**
 * @typedef {Object} ExperienceHighlight
 * @property {string} label - Short name for the highlight/track.
 * @property {string} body - Explanatory prose.
 */

/**
 * @typedef {Object} ExperienceEntry
 * @property {string} id
 * @property {string} org
 * @property {string} title
 * @property {string} [supervisor]
 * @property {string} dateRange
 * @property {string} [location]
 * @property {string} summary - One-line summary of the role.
 * @property {ExperienceHighlight[]} highlights
 * @property {string[]} tech
 * @property {string} [claimsNote] - A guardrail reminder tying this entry back to
 *   `claims-discipline.md`, to be surfaced in copy or kept as an authoring note.
 * @property {string} [note] - Free-form editorial note (e.g. why this entry is/isn't a
 *   "system" in the work portfolio).
 */

/**
 * @typedef {Object} EducationEntry
 * @property {string} id
 * @property {string} institution
 * @property {string} degree
 * @property {string} dateRange
 * @property {string} gpa
 * @property {string[]} [coursework]
 * @property {string} [capstone]
 * @property {string} [note]
 */

/**
 * @typedef {Object} PublicationEntry
 * @property {string} id
 * @property {string} title
 * @property {string} venue
 * @property {number} year
 * @property {string} url
 * @property {string} field - The actual field of the work, stated plainly (see claims
 *   discipline: these are electrochemistry / battery modeling, never "ML research").
 * @property {string} [note]
 */

/**
 * @typedef {Object} AchievementEntry
 * @property {string} id
 * @property {string} title
 * @property {string} [context]
 * @property {?string} body
 * @property {string} [note]
 */

/**
 * @typedef {Object} ErrataEntry
 * @property {string} id
 * @property {'RETRACTED'|'CORRECTED'|'SUPERSEDED'} tag
 * @property {string} title
 * @property {string} body - Explanatory prose describing the correction.
 */

/**
 * @typedef {Object} TypefaceCredit
 * @property {string} name
 * @property {string} license
 * @property {string} usage
 */

/**
 * @typedef {Object} Colophon
 * @property {TypefaceCredit[]} typefaces
 * @property {string} stack
 * @property {string} hosting
 * @property {string} sourceNote
 * @property {string} sourceUrl
 */

/**
 * @typedef {Object} ContactInfo
 * @property {string} email
 * @property {string} linkedin
 * @property {string} github
 */

/** @type {Bio} */
export const bio = {
  name: 'Ujwal Jibhkate',
  location: 'Bloomington, Indiana, USA',
  currentRole: 'Research Assistant, Indiana University School of Medicine (Shen Lab)',
  currentProgram: 'M.S. Data Science, Indiana University Bloomington',
  positioning:
    'AI/ML engineer and researcher who works at the intersection of production engineering and research rigor: a portfolio of systems that emphasize honest evaluation, the right metric over a flattering one, controlled experiments over intuition, and measured claims over marketing.',
  summary: [
    'M.S. Data Science candidate at Indiana University Bloomington (Aug 2024 – May 2026, GPA 3.860/4.0).',
    'Previously a Software Engineer at IBM (May 2022 – Apr 2024, 2 years), building production-oriented GenAI proof-of-concept applications for enterprise clients.',
    'Currently a Research Assistant in the Shen Lab at the Indiana University School of Medicine (Aug 2025 – Present), supervised by Prof. Jia Shen, working on AI-driven drug repurposing for pediatric brain tumors (DIPG/DMG).',
  ],
};

/** @type {ExperienceEntry[]} */
export const experience = [
  {
    id: 'shen-lab',
    org: 'Indiana University School of Medicine, Shen Lab',
    title: 'Research Assistant',
    supervisor: 'Prof. Jia Shen',
    dateRange: 'Aug 2025 – Present',
    location: 'Bloomington, Indiana, USA',
    summary: 'AI-driven drug repurposing for pediatric brain tumors (DIPG/DMG).',
    highlights: [
      {
        label: 'Transcriptional pathway analysis',
        body: "Scored ~12,442 LINCS drugs by how strongly they reverse a DIPG disease signature via GSEA/ssGSEA. Found cross-cell-line concordance is fragile, e.g. one validated positive-control drug, panobinostat, ranked #74 in one cell line but #6,519 and #6,708 in two others, which motivated a pivot.",
      },
      {
        label: 'Drug response prediction (efficacy-jepa)',
        body: "Rebuilding on measured single-agent efficacy data (~1.58M drug×cell efficacy pairs across CTRPv2/GDSC2/PRISM) with a DrEval-based honest evaluation harness. Reproduced a published paper's finding that naive baselines are hard to beat, and that global R²≈0.80 collapses to normalized R²≈0.06 once drug-mean memorization is controlled for (Simpson's paradox). Research in progress, under pre-publication audit.",
      },
      {
        label: 'Pipeline correctness',
        body: 'Diagnosed and fixed a schema bug that would have silently collapsed a GSEA pipeline.',
      },
    ],
    tech: ['Python', 'PyTorch', 'scikit-learn', 'GSEA/ssGSEA', 'DrEval', 'ChemBERTa', 'DepMap', 'IU Big Red 200 HPC'],
    note:
      'Deliberately not one of the systems in the work portfolio (see src/content/work): this research role is ongoing and evolving, unlike the fixed case studies presented there.',
  },
  {
    id: 'ibm',
    org: 'IBM',
    title: 'Software Engineer',
    dateRange: 'May 2022 – Apr 2024',
    summary: 'Built production-oriented GenAI proof-of-concept applications for enterprise clients (2 years).',
    highlights: [
      {
        label: 'Complaint-routing classifier (POC)',
        body: 'Built a hierarchical GenAI proof-of-concept complaint-routing classifier (Azure OpenAI, IBM Watsonx) for a large UK utility client, cutting routing latency ~80% in the POC.',
      },
      {
        label: 'Energy-savings chatbot',
        body: 'Built a RAG-based energy-savings chatbot (LangChain, FAISS).',
      },
      {
        label: 'Internal enablement',
        body: 'Authored internal LLM integration guides.',
      },
    ],
    tech: ['Azure OpenAI', 'IBM Watsonx', 'LangChain', 'FAISS'],
    claimsNote:
      "These were proof-of-concepts that did not ship to production during this tenure. Never say 'delivered to 5M+ customers': the 5M+ figure is the client's customer base size, not a deployed user count.",
  },
];

/** @type {EducationEntry[]} */
export const education = [
  {
    id: 'ms-data-science',
    institution: 'Indiana University Bloomington',
    degree: 'M.S. Data Science',
    dateRange: 'Aug 2024 – May 2026',
    gpa: '3.860/4.0',
    coursework: ['Computer Vision', 'Applied Machine Learning', 'Data Mining', 'Statistics'],
    note: 'Teaching Assistant for I422 Data Visualization.',
  },
  {
    id: 'be-electrical-engineering',
    institution: 'Ramdeobaba University, Nagpur',
    degree: 'B.E. Electrical Engineering (Minor: Computer Science)',
    dateRange: 'Aug 2018 – May 2022',
    gpa: '8.58/10',
    capstone: 'Computational SOC-SOH estimation for lithium-ion batteries.',
    note: 'Capstone produced 2 peer-reviewed publications (see Publications).',
  },
];

/** @type {PublicationEntry[]} */
export const publications = [
  {
    id: 'ocv-modeling',
    title: 'OCV modeling',
    venue: 'Electrochimica Acta',
    year: 2022,
    url: 'https://doi.org/10.1016/j.electacta.2022.140944',
    field: 'Electrochemistry / battery modeling',
    note: 'From the undergraduate capstone. Not ML research.',
  },
  {
    id: 'soc-soh-estimation',
    title: 'SOC-SOH estimation for Li-ion batteries',
    venue: 'Springer ICAER',
    year: 2023,
    url: 'https://link.springer.com/chapter/10.1007/978-981-99-2283-3_6',
    field: 'Electrochemistry / battery modeling',
    note: 'From the undergraduate capstone. Not ML research.',
  },
];

/** @type {AchievementEntry[]} */
export const achievements = [
  {
    id: 'luddy-hackathon',
    title: '2nd Place, Luddy Hackathon',
    context: '55 teams',
    body: 'Built an AI-driven B2B triage tool ("IdeaGenie") for explainable feedback prioritization using Ollama, FAISS, and the ReAct framework.',
    note: 'An achievement bullet, not a standalone system or case study.',
  },
  {
    id: 'ta-i422',
    title: 'Teaching Assistant, I422 Data Visualization',
    context: 'Indiana University',
    body: null,
  },
];

/** @type {ErrataEntry[]} */
export const errata = [
  {
    id: 'recsys-metric',
    tag: 'CORRECTED',
    title: 'RecSys "+48% better recommendations"',
    body: 'An earlier draft stated the recommender system delivered "+48% better recommendations." The +48% figure is intra-list diversity (ILD@10); nDCG@10 was held stable across the same comparison. "Better recommendations" implied a general relevance improvement that was never measured: the honest claim is a diversity gain with relevance held constant.',
  },
  {
    id: 'ibm-customer-count',
    tag: 'CORRECTED',
    title: 'IBM work "delivered to 5M+ customers"',
    body: "An earlier draft implied the IBM GenAI proof-of-concept applications reached 5M+ end customers. They did not ship to production during this tenure. 5M+ is the size of the client's customer base, not a count of people the work reached.",
  },
  {
    id: 'aesop-model-routing',
    tag: 'CORRECTED',
    title: 'AESOP "dynamic" or "cost-aware model routing"',
    body: "An earlier draft described AESOP's model assignment as dynamic or cost-aware routing decided at runtime. Models are assigned per agent at design time, by task stakes. The Router Agent routes user intent; it does not select models.",
  },
  {
    id: 'portfolio-redesign',
    tag: 'SUPERSEDED',
    title: 'Portfolio visual identity',
    body: 'The previous version of this site used a "creative freelancer" visual style: bold color, marketing-adjacent framing. That presentation sat uneasily next to a claims discipline built on honest evaluation, so the design was rebuilt around this academic-preprint format: cream paper, serif type, numbered sections, a Limitations section, and this Errata page.',
  },
];

/** @type {Colophon} */
export const colophon = {
  typefaces: [
    { name: 'Source Serif 4', license: 'SIL Open Font License', usage: 'body text, self-hosted' },
    { name: 'iA Writer Quattro', license: 'SIL Open Font License', usage: 'monospace accents, self-hosted' },
  ],
  stack: 'Built with React, Vite, and Tailwind CSS.',
  hosting: 'Hosted on GitHub Pages.',
  sourceNote: 'Source available on GitHub.',
  sourceUrl: 'https://github.com/ujwal-jibhkate',
};

/** @type {ContactInfo} */
export const contact = {
  email: 'ujwaljibhkate06@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ujwal-jibhkate/',
  github: 'https://github.com/ujwal-jibhkate',
};
