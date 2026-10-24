---
name: refine-story
description: "Examines a User Story written by the PO until it is ready for sprint planning, publishing the refined version to the tracker with a readiness verdict."
disable-model-invocation: true
argument-hint: "[US file path, ID, or pasted text]"
---

# Refine User Story

Refine a User Story through **socratic examination**: interview the PO in structured rounds until the decision frontier is empty, then synthesize. An effective session transforms a 40-minute refinement discussion into a 10-minute confirmation, because the team arrives at planning with decisions recorded and gaps explicitly identified.

The story belongs to the PO. You audit, propose, and inquire; every edit preserves the original business objective, and any rewrite that would require scope decisions becomes a question, not an unilateral choice. The risk of invention is acute here: an existing US often appears "almost ready" and the temptation to complete it silently is strong. A US with visible gaps is far more valuable for refinement than a "complete" story with rules the PO never wrote.

US: $ARGUMENTS

## Before starting

Read `docs/agents/refinement.md` in the workspace: it defines the operating **mode** (with or without code), **language** (`en-US` or `pt-BR`, default `en-US`), slugs, and publishing paths. If missing, ask the user to run `/configure-refinement` and stop. All examination dialogue, questions, and the synthesized artifact follow the configured workspace language.

## Steps

1. **Load.** Read the US (file path, tracker ID, or pasted text), `CONTEXT.md`, domain ADRs, and invoke the Skill tool for `requirements-rigor`. If `.scratch/<slug>/` already exists for this US, inspect its contents: a previous session may have resolved questions, which you must not repeat. The slug follows conventions in `docs/agents/refinement.md`. If `docs/adr/` or `.scratch/` are absent, proceed without warning.
   Completed when: you can classify the US in a single line: ANALYZABLE (has narrative and some criteria, even if flawed), SKELETON (title only, or narrative without criteria), or NOT A US (disguised epic, technical task, standalone non-functional requirement).

2. **Triage.** NOT A US: state what kind of artifact it actually is, provide a 2 to 3 line rationale, and recommend appropriate handling: disguised epic, decompose with `/requirements-discovery`; technical task, reclassify as task; standalone non-functional requirement, move to non-functional requirements list. If the item lives in the workspace, add `Status: not a US` (or `Status: não é US`) and the rationale below the title to leave a trail. Stop here. SKELETON: proceed, and the first examination round asks for missing scenarios rather than inventing them.
   Completed when: classification is stated in a single line and, in the NOT A US case, rationale and handling are also provided.

3. **Audit silently.** Apply the rules of `requirements-rigor` to narrative and criteria: INVEST, Gherkin, anti-patterns, terms that always trigger questions. `ANTI-PATTERNS.md` of `requirements-rigor` is a separate read and holds the type names the tags below use, so the scan starts there. Each finding becomes a candidate question or a correction that preserves exact described behavior: converting prose to Gherkin, moving DoD out of criteria, moving implementation tasks to notes.
   Completed when: every criterion has a destination (keep, convert, move, question), each ambiguous term has a candidate question, and every anti-pattern occurrence carries its inline `[ANTI-PATTERN: type]` tag, with a type from that list and the excerpt quoted, including the occurrences a question already absorbs: the question closes the gap for this story, while the tag is what shows the PO which sentence of their text caused it.

4. **Search for facts before asking.** Facts are your responsibility, never the PO's. For each candidate question, search workspace sources: glossary, previous stories in `.scratch/`, documents attached by the PO. In code mode, dispatch a subagent to search the codebase for what the US asserts or assumes: does the rule exist? is the limit implemented? does the integration function? A found fact becomes a recommended answer citing the source. In no-code mode, search is restricted to workspace files without subagents; if nothing is found, state this in a single line at the top of round 1.
   Completed when: each candidate question is marked as answered by a source (with citation) or open for the PO.

5. **Examine.** Invoke the Skill tool for `socratic-examination` and follow its discipline: rounds, frontier, recommended answers with citations or "no recommendation", facts yours and decisions the PO's, glossary updated immediately. Round 1 opens with one-line triage, marks questions that block the verdict, and closes with notes on criteria moved without questions and questions routed to the engineering team. Architectural questions do not enter rounds with the PO: route them directly to open questions for the engineering team. Questions the PO cannot answer receive `[TO CONFIRM: whom]` (or `[A CONFIRMAR: quem]`) and leave the frontier.
   Completed when: the frontier is empty, or the PO requests closing with current information.

6. **Synthesize.** Write the refined US following [TEMPLATE.md](TEMPLATE.md), with remaining gaps visible as markers. Execute the Gherkin self-audit. Deliver the verdict: READY, REFINE with question numbers that unblock it, or BLOCKED with rationale. If `[DECOMPOSE]` is present, include the decomposition proposal: narrative for each part and mapping of original criteria.
   Completed when: file exists at path defined by `docs/agents/refinement.md`, with `Status:` matching the verdict and final disclaimer present.

7. **Route open items.** For each recipient outside the session with `[TO CONFIRM]`, write a questionnaire following `QUESTIONNAIRE.md` in `requirements-rigor`, alongside the refined US, and link the file from the open questions section.
   Completed when: no `[TO CONFIRM]` remains without a recipient or questionnaire.

8. **Report.** Inform the user concisely: verdict, where the US was published, which questions unblock it, and generated questionnaires.

## Round example

For the US "As a user, I want to export reports to PDF so sharing is easy. AC1: export button must work properly. AC2: create PDF generation service on backend. AC3: PDF must open fast. AC4: code reviewed and tests passing.", in a no-code workspace whose glossary lists operations analyst and account manager as report consumers, the first round looks like:

❓ **Q1. Who exports?** (blocking)
The narrative states "user". The glossary lists operations analyst and account manager as roles consuming reports. Which role exports, or both?
**Recommendation:** operations analyst [INFERENCE: role associated with "operational reports" in glossary]. Without this, permissions remain undefined and the narrative fails INVEST.

❓ **Q2. What does "open fast" mean?** (blocking)
AC3 is untestable and admits two readings: time between triggering export and download starting, or time for file to open in a reader. Which is intended, and what is the maximum time in seconds?
**Recommendation:** no recommendation: source text provides no baseline for interpretation or SLA numbers. If no expectation exists, record `[TO CONFIRM: PO]` and proceed.

❓ **Q3. Edge cases**
Source hints at empty reports and high-volume reports [INFERENCE: reports vary in volume]. Which matter for this delivery?
**Recommendation:** include both as scenarios [INFERENCE: follow from source text]. Specific behavior for each is your decision: no recommendation. Maximum volume depends on Q2.

AC2 and AC4 do not trigger questions: AC2 is an implementation task whose enabled behavior is covered by AC1, moving to notes; AC4 is team Definition of Done and is removed from criteria. Both appear in the final artifact audit section as moved, not deleted.

## Final notice

Every published artifact concludes with:

> ⚠️ This output is preparation for refinement, not a replacement. Decisions on scope, value, and priority belong strictly to the PO and team.

In a pt-BR workspace:

> ⚠️ Este output é preparação para o refinamento, não o substitui. A decisão sobre escopo, valor e prioridade é do PO e do time.
