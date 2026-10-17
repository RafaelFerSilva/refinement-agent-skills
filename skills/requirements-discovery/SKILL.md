---
name: requirements-discovery
description: "Examines raw stakeholder input (transcripts, briefs, emails, feature ideas) into epics and candidate user stories published to the tracker; when scope exceeds a single session, opens a decision map and resolves one decision per session."
disable-model-invocation: true
argument-hint: "[input path or paste text; or path to spec with an open map]"
---

# Discovery

Convert unstructured stakeholder input into traceable requirements through **socratic examination**. You are not a transcriber: capture what was stated and what was implied, flag ambiguities, and produce candidate stories that `/refine-story` carries to sprint planning. What the input does not support does not enter; what it hints at enters as a grounded inference; what it leaves open becomes a question.

Input: $ARGUMENTS

## Before starting

Read `docs/agents/refinement.md` in the workspace: it defines the operating mode, language (`en-US` or `pt-BR`, default `en-US`), and publishing paths. If missing, request `/configure-refinement` and stop. If the argument is a spec with `Status: open map` (or `Status: mapa aberto`), jump directly to "Resume decision map". If the input originated from `/meeting-minutes`, it already separates stated facts from presumptions: treat presumed agreements as unconfirmed. Examination and generated specs follow the configured workspace language.

## Steps

1. **Load and triage.** Read the input, `CONTEXT.md`, and invoke the Skill tool for `requirements-rigor`. Scan for anti-patterns (read `ANTI-PATTERNS.md` in `requirements-rigor` separately) and terms that always trigger questions: this scan grounds triage. Classify by counting excerpts, not text volume: USABLE (every excerpt structures a requirement), PARTIALLY USABLE (at least one excerpt structures a requirement and at least one does not), UNUSABLE (no excerpt structures a requirement). UNUSABLE: state this with excerpt-by-excerpt rationale, list 3 to 5 minimal questions with recipients (whoever provided the input, unless a domain role in the glossary is identifiable), write a questionnaire following `QUESTIONNAIRE.md` in `requirements-rigor`, inform the user that `/requirements-discovery` will re-run with responses, and stop without publishing further artifacts; filler stories help no one. PARTIAL: proceed, and the final artifact opens with a list of unused excerpts and what is missing in each.
   Completed when: classification is stated in a single line, followed by excerpt-by-excerpt rationale when not USABLE.

2. **Breadth-first mapping.** Before generating any story, scan the full input: business domains with confidence ratings (High, Medium, Low; Low marks where discovery requires a follow-up conversation), stakeholders with type (business, technical, end-user) and what each advocates, epics with complexity S, M, L, or XL justified in a single line; excerpts without closed lists or measurable criteria do not become epics yet, remaining in partial processing until examination sizes them. When input is second-hand, the note-taker enters the stakeholders table with type "source". Two voices in opposing positions on the same requirement: add `[CONFLICT]`, recording both positions without resolving unilaterally. A requirement stated by a single voice receives `[VALIDATE WITH TEAM]` where confirmation is critical: unmet role needs, scope decisions made by non-decision-makers; do not mark everything when two voices address disjoint topics. Business needs and technical constraints originate from different stakeholders and carry different weight: distinguish them.
   Completed when: each input excerpt is mapped to a domain and epic, or listed as unexploited.

3. **Search for facts before asking.** Check glossary, previous stories in `.scratch/`, workspace documents, and in code mode, the codebase: does the mentioned integration already exist? Is the threshold already implemented? A found fact becomes a recommended answer with cited source. In no-code mode, search is restricted to workspace files without subagents; if nothing is found, state this in a single line at the top of round 1.
   Completed when: each candidate question is marked as answered by a source or open.

4. **Decide scope size.** Invoke the Skill tool for `socratic-examination` and examine breadth first: the target outcome (what this discovery delivers), scope boundaries, conflicts, and factors affecting epic size. SLAs, channels, and edge cases represent depth and are deferred to step 5. If at the end of this round the frontier fits in a single session, proceed to step 5. If substantial **fog** remains (decisions anticipated but not yet formulateable because they depend on pending answers), open the map: publish the spec following [TEMPLATE.md](TEMPLATE.md) with `Status: open map`, one pending decision per file in `issues/NN-decision-<slug>.md` for each formulateable question, marking `Blocked by:` when dependent on another, and unformulateable fog in "Not yet specified". The distinction between a decision and fog is whether you can formulate the question with precision right now, not whether you can answer it. Mapping the fog is the goal of one session: stop and inform the user that `/requirements-discovery <spec-path>` resolves one decision per session.
   Completed when: either the question frontier fits in a single session, or the spec with an open map and pending decision files exists.

5. **Examine.** Continue rounds of `socratic-examination` in depth, epic by epic: roles, capabilities, outcomes, edge cases suggested by input, dependencies. Domain terms resolved are added to `CONTEXT.md` immediately. A fact that no attendee knows receives `[TO CONFIRM: whom]` (or `[A CONFIRMAR: quem]`) and leaves the frontier.
   Completed when: the frontier is empty, or the user requests closing.

6. **Synthesize.** Write the discovery spec following [TEMPLATE.md](TEMPLATE.md) and one candidate story per file following `skills/refine-story/TEMPLATE.md`, with `Status: candidate` (or `Status: candidata`) and a preliminary INVEST scorecard. A story failing INVEST does not become a clean card: it remains a candidate with `[INVEST-FAIL]` and resolution guidance. Include undeclared dependencies: integrations, external services, and architectural decisions required for stories to be implementable, each paired with the blocked story and required action. Every line in candidate stories matches input or a valid `[INFERENCE: base]`; unbacked additions are gold plating and must be removed.
   Completed when: spec and candidate stories exist at the path defined in `docs/agents/refinement.md`, with final disclaimer.

7. **Route open items.** Open `[TO CONFIRM]` items with recipients outside the session: write one questionnaire per recipient following `QUESTIONNAIRE.md` in `requirements-rigor`, alongside the spec.
   Completed when: no open question remains without a recipient or questionnaire.

8. **Report.** Epics created, candidate story count, open conflicts, and next steps: `/refine-story` per story, or `/requirements-discovery <spec-path>` if map is open.

## Resume decision map

When the argument is a spec with `Status: open map`:

1. Read the full spec and pending decisions in `issues/`. A decision is **unblocked** when it is open and all decisions in `Blocked by:` are resolved.
   Completed when: you know which decisions are unblocked.
2. Select the decision: named by the user, or the first unblocked by number. Mark `Status: in examination` in the file before starting, preventing concurrent sessions from picking it.
   Completed when: file status is updated.
3. Resolve it with `socratic-examination`, one decision per session. Research-type decisions are resolved by reading external sources with citations, without examination rounds. Record the answer directly in the file under `## Answer`, mark `Status: resolved`, and add a line with summary and path in the "Examination decisions" section of the spec.
   Completed when: decision is resolved and linked from spec.
4. The answer may clear surrounding fog: newly formulateable items leave "Not yet specified" and become new pending decisions; items outside the scope move to "Out of scope". Any decision invalidated by the answer is closed with a one-line rationale.
   Completed when: no pending decision contradicts the answer and fog is reassessed.
5. With no pending decisions open: update spec to `Status: in progress` and proceed to step 5 of main steps, in the same session if context permits, otherwise in the next session using the same command.
   Completed when: spec leaves open map status, or you report how many decisions remain.

Pending decision format:

```md
# Decision NN: <question in one sentence>

Status: <open | in examination | resolved | closed>
Blocked by: <NN, NN or none>
Type: <examination | research>

## Question

<what must be decided and why it blocks progress>

## Answer

<upon resolution: decision, who decided, date>
```

## Final notice

> ⚠️ This output is an analytical draft. It requires human review before entering a sprint. Validate: technical feasibility, compliance, and unmapped dependencies.
