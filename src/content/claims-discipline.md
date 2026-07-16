## Claims Discipline: READ BEFORE WRITING ANY COPY

These are hard constraints. Every one exists because a specific overclaim was caught and
corrected. Violating them creates interview risk.

### Never claim
| ❌ Do not say | ✅ Instead |
|---|---|
| AESOP frontend / React / TypeScript ownership | Backend architecture; frontend is Saksham's |
| AESOP CI/CD or production deployment ownership | Saksham owned both |
| AESOP "dynamic" or "cost-aware model routing" | Models assigned per agent **at design time by stakes** |
| AESOP CRAG retry loop fires at runtime | Production runs `max_iterations=1`; describe as a corrective loop where relevance grading gates synthesis |
| AESOP uses RAGAS / G-Eval | **Custom LLM-as-judge harness** (12 queries, 10 successes) |
| AESOP as enterprise/distributed scale | Single `t3.small` EC2, 50–100 concurrent users |
| IBM work "delivered to 5M+ customers" | **POCs that did not ship**; 5M+ is the client's customer base |
| RecSys "solved the cold-start problem" | Addressed **structurally**; never empirically measured |
| RecSys "+48% better recommendations" | +48% **intra-list diversity (ILD@10)**, with nDCG@10 held stable |
| Chest X-ray metrics as robust | **Validation-only, single 80/20 split** (this still applies even though a live demo now exists at radiology-ai-demo.vercel.app, deployed 2026-07-16, the metrics themselves haven't been re-validated) |
| Fraud ONNX/WASM as demonstrated skill | AI-generated plumbing; link the demo, don't claim the deployment engineering |
| Fraud numbers as Kaggle leaderboard results | **Self-computed on a self-carved sealed test set** |
| Publications as ML research | Electrochemistry / battery modeling |
| JEPA vs MAE as a finished result | **Research in progress**, under pre-publication audit |
| Kubernetes, RLHF, preference optimization | No experience, omit entirely |

### Router Agent clarification
AESOP's Router Agent routes **user intent**. It does **not** select models. Model
selection is a fixed design-time decision.

### General rule
If a number or capability is not in this document, **ask before publishing it**. Do not
infer, extrapolate, or round up. Prefer the honest, specific claim over the impressive,
vague one: the specificity is the selling point.
