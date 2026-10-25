---
name: qa-plan
description: "Examines a User Story from a testing perspective and publishes the test plan baseline: conditions with declared techniques, risk levels, testing layers, automation blockers, and questions with assigned recipients."
disable-model-invocation: true
argument-hint: "[refined US file path or ID]"
---

# QA Plan

Derive the baseline test plan for a User Story through **socratic examination**: test conditions with declared design techniques, expected results asserted only when specifications support them, and questions directed to whoever can resolve the rest. You do not ask "is this story well-written?", that is `/refine-story`. You answer: what can break, how do I prove it works, and what must exist for me to execute that proof.

A mid-level QA engineer should be able to implement tests directly from this artifact; a senior QA engineer should agree with its prioritization.

US: $ARGUMENTS

## Three-layer boundary

Deriving unwritten conditions is the essence of QA, provided it follows established methods. Therefore, the boundary here operates across three layers; the foundation remains `requirements-rigor`. Every condition in the plan belongs to exactly one layer:

- `[SPECIFIED: excerpt]` (pt-BR: `[ESPECIFICADO: trecho]`): condition and expected result originate directly from text. Cite the source.
- `[DERIVED: technique]` (pt-BR: `[DERIVADO: técnica]`): the condition follows from a test design technique applied to what was specified. Always name the technique; a condition without a declared technique is a guess and must not enter. Expected results may only be asserted if they follow logically from the specification.
- `[UNDEFINED -> Question n]` (pt-BR: `[INDEFINIDO → Pergunta n]`): a legitimate condition whose expected result the specification does not define. The condition enters the matrix; the result becomes a numbered question.

The layer qualifies the pair, condition and expected result, and the two halves may sit in different layers: a condition derived from boundary analysis whose outcome the text does state carries `[DERIVED: technique]` as its origin and `[SPECIFIED: excerpt]` on the result. What `[SPECIFIED]` claims on a result is strict: the cited excerpt states that outcome in words. An excerpt merely compatible with the outcome does not specify it, and an outcome nobody wrote is `[UNDEFINED -> Question n]` however obvious it looks.

A result that an open question asks about is never also asserted. Asking what happens and answering it in the same plan hands the reader two answers with nothing to choose between them, and it is the undefined half that is true: the question exists because the specification is silent. The open questions section is where this becomes checkable rather than a matter of care: each question lists the conditions whose expected result waits on its answer, so the two lists are read against each other, and a condition a question names carries `[UNDEFINED -> Question n]` in its result. A question that settles a layer, an automation blocker or the regression impact says so instead of listing a condition, because those leave the result alone.

Quick test: "which technique generated this condition, from which excerpt does it stem, and does that excerpt state the outcome I wrote?" If any of the three cannot be answered, the condition stays with its result undefined, or leaves the plan.

## Before starting

Read `docs/agents/refinement.md` in the workspace: it defines the operating mode (with or without code), language (`en-US` or `pt-BR`, default `en-US`), and publishing paths. The mode dictates who answers architectural questions: with code, you resolve them by inspecting the codebase; without code, the engineering team resolves them via questionnaires. Socratic examination and the QA plan are authored in the configured language. If the file is missing, request `/configure-refinement` and stop.

## Steps

1. **Load.** Read the US, `CONTEXT.md`, domain ADRs, [TEST-DESIGN.md](TEST-DESIGN.md), and invoke the Skill tool for `requirements-rigor`. If `.scratch/<slug>/spec.md` exists from `/refine-story`, start from it: decisions from that session already answer many questions. Without this file, treat the US as unrefined, even if `Status:` says READY.
   Completed when: testability triage is stated in a single line: TESTABLE (every expected outcome has an observation point and no dependencies are pending confirmation), TESTABLE WITH RESERVATIONS (conditions can be derived, but at least one outcome lacks an observation point or depends on unconfirmed dependencies), or NOT TESTABLE.

2. **Triage.** NOT TESTABLE (criteria fail to describe observable behavior: exclusively tasks, or subjective terms without metrics across all criteria): explain what is missing, list 3 to 5 minimal questions, and recommend `/refine-story`. Stop here; analyzing untestable material produces facade plans. If the US has not undergone refinement, state this and proceed, noting that many questions would be resolved by `/refine-story`.
   Completed when: triage is declared.

3. **Derive conditions.** For each criterion, apply applicable techniques from [TEST-DESIGN.md](TEST-DESIGN.md), avoiding forcing inapplicable techniques, and review silent angles, reporting only applicable ones. Build the matrix: condition, origin, expected result or `[UNDEFINED -> Question n]`, priority, layer. Undefined conditions remain in the matrix: visible future coverage is far better than hidden gaps. Number questions in a single sequence across PO and DEV combined, so `[UNDEFINED -> Question n]` resolves unambiguously. Every number the matrix points to is written out as a question with its recipient, DEV questions included, even though those never enter the PO round: a pointer to a question that exists only as a promise of a questionnaire leaves the reader of the matrix with no way to learn what is undefined. Priority rationales (half-line per condition) go in a list within the risk analysis section, not inside the table.
   Completed when: every condition has a declared origin, every `[UNDEFINED]` has an assigned question number, every number in the sequence exists as a written question carrying recipient PO or DEV, and the condition numbers the questions list match, one for one, the conditions whose result is undefined.

4. **Search for facts before asking.** Separate questions by recipient. **PO**: undefined business behavior. **DEV**: architecture, observability, testing layer, isolation of external dependencies, time control, test data provisioning, API error response, persistence after failure, technical idempotency. In code mode, dispatch a subagent to answer DEV questions by reading code: is notification synchronous or asynchronous? is there a lock on approval? does a mock exist for the external system? A found fact becomes an expected result or defined layer, with source citation. In no-code mode, search is restricted to workspace files without subagents; if nothing is found, state this in a single line at the top of round 1.
   Completed when: each question is marked as answered by a source or open, with assigned recipient.

5. **Examine PO.** Invoke the Skill tool for `socratic-examination`. The question round accompanies the current matrix, as questions reference specific conditions. The frontier consists of PO questions, blocking items first (those that unblock P1 conditions), each with a recommended answer when specifications provide grounding; when absent, provide "no recommendation" (or "sem recomendação" in pt-BR) and options. PO answers update the matrix immediately. Challenge terms against the glossary, but record in `CONTEXT.md` only what the PO resolves.
   Completed when: PO question frontier is empty, or PO requests closing.

6. **Synthesize.** Write the plan following [TEMPLATE.md](TEMPLATE.md): matrix, risk analysis, P1 scenarios in Gherkin with self-audit, automatability audit, regression impact based strictly on existing system documentation (without context, list impact questions for DEV), remaining questions by recipient, coverage verdict.
   Completed when: file exists at path defined by `docs/agents/refinement.md` with final disclaimer present.

7. **Route open items.** Open DEV questions in no-code mode and open PO questions that could not be answered: write one questionnaire per recipient following `QUESTIONNAIRE.md` in `requirements-rigor`, alongside the plan, and link files from open questions.
   Completed when: no open question remains without a recipient or questionnaire.

8. **Report.** Verdict, where the plan was published, count of executable P1 conditions, and what each questionnaire unblocks.

## Final notice

Published artifacts only. A triage that stops the workflow and an examination round publish nothing, so they carry no notice: the notice qualifies an artifact someone may circulate.

> ⚠️ This output provides the analytical baseline for a test plan, not the final test plan. Decisions on coverage, prioritization, and effort belong to the QA team, with validation from PO (undefined behaviors) and Dev (architecture and layers).

In a pt-BR workspace:

> ⚠️ Este output é a base analítica do plano de teste, não o plano final. A decisão de cobertura, priorização e esforço é do time de QA, com validação de PO (comportamentos indefinidos) e Dev (arquitetura e camadas).
