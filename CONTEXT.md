# Refinement Skills

Skills package that drives software requirements, in en-US and pt-BR, from discussions to QA test plans via socratic examination. This glossary defines the package vocabulary; the domain vocabulary of the product under analysis lives in the `CONTEXT.md` of the workspace where the package is installed.

## Language

### Artifacts

**User Story**:
The unit of requirement written by the PO and brought to sprint planning: narrative plus acceptance criteria. Abbreviated as US in identifiers and skill names.
_Avoid_: card, item, task, story (alone)

**Narrative**:
The statement "As a [role], I want [capability], so that [outcome]" (or in pt-BR "Como [papel], quero [capacidade], para que [resultado]") that introduces a User Story.
_Avoid_: title, description, user story (for this sentence alone)

**Acceptance criterion**:
An observable behavior that proves the User Story is delivered, written in Gherkin. Abbreviated as AC in identifiers.
_Avoid_: requirement, rule, test, scenario (the scenario is the Gherkin form of a criterion)

**Candidate story**:
A User Story produced by `/requirements-discovery` from raw input, not yet examined with the PO.
_Avoid_: draft, rough story, proposal

**Discovery spec**:
The artifact produced by `/requirements-discovery`: domains, stakeholders, epics, decisions, dependencies, and candidate stories.
_Avoid_: PRD, requirements document, brief

**QA plan**:
The artifact produced by `/qa-plan`: test conditions matrix with provenance, risk level, layer, and automation blockers. It is the basis for the test plan, not the final test plan.
_Avoid_: test plan (reserved for the QA team's final artifact), test cases

**Minutes**:
The artifact produced by `/meeting-minutes`: decisions and action items with provenance, with presumed agreements separated from stated agreements.
_Avoid_: summary, digest (outside skill name)

**Product overview**:
The artifact produced by `/bootstrap-context` at `docs/product-overview.md`: product purpose, roles and permissions, production modules, active integrations, cross-cutting rules, and resolved source conflicts, keeping `CONTEXT.md` strictly a domain glossary.
_Avoid_: architecture doc, system spec, PRD

### Examination

**Socratic examination**:
The structured interview conducted in rounds with the PO until the question frontier is empty. The `socratic-examination` skill is the primitive that conducts it.
_Avoid_: interview, questionnaire (which is an async document), interrogation

**Round**:
A set of questions asked at once: the entire frontier, numbered, each with a recommended answer. The PO answers, the frontier recalculates, and the next round begins.
_Avoid_: turn, iteration

**Frontier**:
The questions whose prerequisites are resolved and can be asked now without guessing pending answers. The examination ends when the frontier is empty.
_Avoid_: question backlog, pending list

**Fact**:
Information that can be verified against a source: glossary, previous stories, documentation, code. Finding facts is the agent's job, never the PO's.
_Avoid_: information, data

**Decision**:
What only the PO or the team can resolve: scope, business value, priority, unspecified expected behavior. Never made by the agent.
_Avoid_: choice, definition

**Recommended answer**:
The suggestion accompanying each question in a round, citing the grounding evidence. This is how an inference manifests during examination.
_Avoid_: guess, hunch, default

**Questionnaire**:
The document generated for stakeholders not present in the session to answer asynchronously. Receives questions that examination could not close.
_Avoid_: form, list of questions

### Rigor

**Inference**:
A conclusion that directly follows from input text or a verified fact, which another person would reach reading the same material. Always cites its base.
_Avoid_: assumption, deduction, conjecture

**Invention**:
A value, rule, or behavior without backing in the source material, even if it is considered good practice. Strictly forbidden; must become a question or marker.
_Avoid_: hallucination, guess, gold plating (specific case of scope beyond request)

**Marker**:
A bracketed tag in the artifact that makes an inference or gap visible: `[INFERENCE: base]`, `[TO CONFIRM: whom]` (or in pt-BR `[INFERÊNCIA: base]`, `[A CONFIRMAR: quem]`), and others defined in `requirements-rigor`.
_Avoid_: tag, flag, annotation

**Gap**:
What the material does not state and the artifact requires. Remains visible as a marker; a clean artifact hiding gaps is worse than one with explicit gaps.
_Avoid_: missing item, pending, TBD

**Verdict**:
The final conclusion of a workflow on an artifact: READY, REFINE, or BLOCKED for a User Story (PRONTA, REFINAR, BLOQUEADA in pt-BR); EXECUTABLE, PARTIAL, or BLOCKED for a QA plan; candidate, open map, in progress, completed for discovery; BASELINE READY, PARTIAL, or BLOCKED for product context bootstrap (BASE PRONTA, PARCIAL, BLOQUEADO in pt-BR). Appears on the `Status:` line.
_Avoid_: status (as an isolated word), score, grade

### Operation

**Workflow**:
A user-invoked skill that runs an examination and publishes an artifact: `/bootstrap-context`, `/meeting-minutes`, `/requirements-discovery`, `/refine-story`, `/qa-plan`. Workflows run on top of the model-invoked primitives `socratic-examination` and `requirements-rigor`.
_Avoid_: copilot, prompt, command, agent

**Workspace**:
The repository where the package is installed and User Stories are analyzed. Contains the product's `CONTEXT.md`, `docs/agents/refinement.md` with operating mode, and `.scratch/` with generated artifacts.
_Avoid_: project (ambiguous with product), analysis repo

**Mode**:
How the workspace resolves factual questions, defined by `Mode:` in `docs/agents/refinement.md`. **With code** (`with-code`, or `com-codigo`): the agent inspects product code directly. **Without code** (`without-code`, or `sem-codigo`): the PO is the source of facts, and architecture questions are routed to the dev team via questionnaires.
_Avoid_: scenario, profile, environment

**Language**:
The language in which the examination takes place and artifacts are generated, defined by `Language:` (or `Idioma:`) in `docs/agents/refinement.md`: **en-US** (default) or **pt-BR**.
_Avoid_: locale, programming language

**Tracker**:
Where artifacts are published, as configured in `docs/agents/refinement.md`: local markdown files in `.scratch/` formatted with work item identifiers.
_Avoid_: backlog, Jira (tracker is configurable), board
