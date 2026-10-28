# Getting Started

> Leia em português: [docs/getting-started.pt-BR.md](getting-started.pt-BR.md)

Practical guide to adopting **Refinement Skills** in day-to-day product and engineering work across **new (greenfield)** products, **ongoing (brownfield)** products, and **chat-based AI platforms**.

---

## 1. Target Workspace Anatomy

When you install this package into a product repository (or into a dedicated workspace in `without-code` mode), workflows read and write a predictable set of files so context compounds from session to session:

```text
my-product/
├── CONTEXT.md                     # Domain glossary ONLY (roles, entities, events, _Avoid_ synonyms)
├── docs/
│   ├── agents/
│   │   ├── refinement.md          # Mode (with-code | without-code), language (en-US | pt-BR), fact sources
│   │   └── issue-tracker.md       # Work item ID convention and local publishing rules
│   ├── adr/                       # Architectural and product decisions that are hard to reverse
│   ├── product-overview.md        # Consolidated baseline of an ongoing product (created by /bootstrap-context)
│   └── reference/                 # Drop existing manuals, rules, specs, or exported stories here
└── .scratch/                      # Published workflow artifacts (minutes, discovery specs, refined USs, QA plans)
```

Before asking the Product Owner any factual question, every workflow searches these sources in priority order:
1. `CONTEXT.md` (domain vocabulary and roles)
2. `docs/adr/` (settled structural decisions)
3. `docs/product-overview.md` (current modules, permissions, active integrations, cross-cutting rules, and SLAs)
4. `.scratch/` (previously refined stories, specs, minutes, and QA plans)
5. `docs/reference/` and `docs/` (raw manuals, regulations, wireframes, requirements sheets)
6. Product source code via read-only subagent (when `Mode: with-code`)

---

## 2. Greenfield Products (Starting from Zero)

On a brand-new product, context grows naturally alongside discovery and story refinement:

1. **Configure once:** run `/configure-refinement`, choose `with-code` or `without-code`, select `en-US` or `pt-BR`, and set your tracker URL/ID prefix. Leave `CONTEXT.md` absent for now.
2. **Start from raw input:**
   - Have a kickoff or alignment transcript? Run `/meeting-minutes`. It separates explicitly stated decisions from presumed agreements, generates stakeholder questionnaires, and writes `discovery-input.md`.
   - Have a briefing, feature idea, or `discovery-input.md`? Run `/requirements-discovery` to map domains, size epics, and generate candidate stories in `.scratch/<topic>/issues/`.
3. **Refine and plan tests:** run `/refine-story` per story and `/qa-plan` on the refined story.
4. **Automatic memory growth:** the first time the PO resolves a domain role or entity during examination, the agent creates `CONTEXT.md` and updates it on the spot. Subsequent stories automatically reuse those terms as grounded recommendations.

---

## 3. Ongoing Products / Brownfield (Starting Mid-Flight)

Joining a product that is already in production is the hardest test for requirements refinement, especially in `without-code` workspaces where a new User Story arrives without surrounding context.

### Why missing context causes questions instead of silent inventions

Standard AI prompts fill context gaps with plausible-sounding inventions (invented SLAs, assumed permissions, generic "user" roles). Refinement Skills blocks silent invention through three rules enforced by `requirements-rigor` and `socratic-examination`:

- **Inference vs. invention:** the agent can only mark `[INFERENCE: base]` when it can point to a specific sentence in the story or a workspace file. Anything else is classified as an **invention** and forbidden, even if considered "industry best practice".
- **No blind defaults:** when workspace files contain no baseline for a question, the agent must write **`no recommendation`** and list options with their implications rather than guessing.
- **Visible gaps and routing:** if the PO does not know an existing system detail during the session, the item is marked `[TO CONFIRM: whom]` (for example, `[TO CONFIRM: DEV]`) and exported into an asynchronous questionnaire (`questionnaire-dev.md`) rather than smoothed over in prose.

**What this means in practice:** if you jump straight into `/refine-story` on an advanced product with an empty workspace, the agent will not invent missing facts, **but Round 1 will ask many baseline questions** about roles, existing modules, and permissions that your team already treats as obvious.

### How to eliminate cold-start friction in 3 steps

1. **Run `/configure-refinement` and select "ongoing product":**
   The setup skill configures `docs/agents/refinement.md` and, when you have existing product material, creates `docs/reference/` as its home.
2. **Drop existing material into `docs/reference/` (15 minutes, optional):**
   Copy whatever already exists without reformatting it: onboarding manuals, Confluence/wiki exports, regulation sheets, API contracts, or 3 to 5 well-written legacy User Stories.
3. **Run `/bootstrap-context` before your first User Story:**
   `/bootstrap-context` supports all three brownfield realities:
   - **With legacy docs (`docs/reference/`):** scans the documents, flags competing synonyms (for example, "Account" vs. "Depot") and potentially stale rules, runs a short curation round with the PO so outdated terminology never enters the glossary silently, and publishes `CONTEXT.md` plus `docs/product-overview.md`.
   - **With codebase access (`Mode: with-code`):** dispatches a subagent to inspect schemas, roles, thresholds, and integrations directly in code, citing source files as recommendations and surfacing contradictions between legacy docs and live code.
   - **No docs and no code (`TACIT ONLY`):** runs a focused 10-minute onboarding examination with the PO to capture product purpose, active roles, the 5 to 10 core domain entities, production modules, and external integrations before any story is refined.

### Day-to-day tips for ongoing teams

- **Batch your first 2 to 3 stories in the same module:** because every `/refine-story` session updates `CONTEXT.md` and saves specs in `.scratch/`, refining a cluster of stories in one domain builds dense local memory immediately.
- **Keep `CONTEXT.md` pure:** `CONTEXT.md` holds domain definitions and `_Avoid_` synonyms only. Operational capabilities, active integrations, and cross-cutting SLAs belong in `docs/product-overview.md`.
- **Re-run `/bootstrap-context` per legacy area:** months later, when the team tackles an unfamiliar legacy module, drop that module's docs into `docs/reference/` and run `/bootstrap-context` again; existing glossary terms are protected against silent rewrites.
- **Clear chat history between workflows:** run `/clear` between `/bootstrap-context`, `/refine-story`, and `/qa-plan`. Each workflow reads the published markdown files on disk, keeping context sharp and token usage low.

---

## 4. Using Standalone Chat Prompts (`prompts/`) and Platform Memory

Teams without a local repository or CLI agent can run the generated standalone prompts in [`prompts/`](../prompts/) inside **Claude Projects, Custom GPTs, Gemini Gems, Copilot Studio**, or standard web chats:

- `prompts/which-flow.md` (router instructions)
- `prompts/bootstrap-context.md`
- `prompts/meeting-minutes.md`
- `prompts/requirements-discovery.md`
- `prompts/refine-story.md`
- `prompts/qa-plan.md`

### Keeping platform Memory / Knowledge Base in sync

In a web platform, your product's `CONTEXT.md`, `product-overview.md`, and ADRs typically live in the platform's **Project Knowledge, Agent Memory, or Knowledge Base files**. Because chat models cannot overwrite platform configuration files automatically, every examination prompt (`bootstrap-context`, `refine-story`, `requirements-discovery`, `qa-plan`) follows a dedicated **Memory / Knowledge Base Updates** protocol:

1. **Initial setup:** paste `prompts/bootstrap-context.md` (or add the `prompts/*.md` files to your agent) along with any legacy notes, complete the short curation round, and upload the generated `CONTEXT.md` and `product-overview.md` blocks into your platform's Knowledge Base / Memory.
2. **Clean examination rounds:** while examining a new User Story with you, the agent acknowledges newly settled terms in one brief line without cluttering intermediate rounds with file blocks.
3. **Consolidated handoff at synthesis:** whenever a session resolves new domain terms, flags a glossary widening, updates a baseline rule, or records an ADR, the final synthesis response appends a **`Memory / Knowledge Base Updates`** section right below the main artifact, and reminds you in the final report to update your agent's configuration before the next story:
   - **Full replacement block:** emitted when creating a file from scratch or when you pasted the complete prior file inline in that conversation, ready to replace the file in one copy-paste.
   - **Safe append / delta block (`Append to CONTEXT.md`):** emitted when prior context came from platform memory or RAG search chunks (where the model may not see every entry in your file), giving you only the new or flagged entries to append at the end so pre-existing terms are never erased by mistake.
