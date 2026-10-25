# 01: Scripted Product Owner answers for US-245, en-US

Status: resolved
Blocked by: none
Type: task
Origin: 2026-10-25 (commit 81547f6)

A session cannot reach synthesis because nobody answers the round. Write the answers once, as a fixture, so any run can be driven to the end.

The fixture answers the questions `refine-story` asks of `evals/fixtures/us-245-silence-alerts.md`: who silences, the silencing window, what the window suppresses, whether the silence is per operator or shared, early reactivation, and the retroactive reading. It cannot answer by question number, because numbering varies between runs; it answers by subject, so a run matches its own questions against it.

Answers must be the kind a Product Owner gives, including the ones that refuse: at least one "I do not know, ask the engineering team" so that `[TO CONFIRM: whom]` and a questionnaire are exercised, and at least one decision with no basis in the source text, so the artifact has to carry it as a decision rather than as an inference.

## Acceptance criteria

- `evals/fixtures/po-answers-245-en-US.md` exists, answers by subject rather than by number, and covers every subject the round opens.
- It contains at least one refusal that routes to the engineering team, and at least one scope decision the source text does not support.
- `evals/README.md` documents the protocol: how a run uses the fixture, and that answers are matched by subject.
- Nothing in `skills/` changes.

## Comments

- 2026-10-25 Preflight (commit 38492bd): confirmed
  - Docs: `CONTEXT.md` gives the canonical terms the answers must use (dispatch operator, reading, operational report, alert, decision vs fact); `AGENTS.md` Writing style and the no-dash rule apply to the fixture prose; ADR 0005 applies only to the pt-BR twin (ticket 03), since nothing here is localized vocabulary; `harness.md` "What the harness does not check" applies: a round publishes nothing, so no grader check can cover this fixture, and `scripts/validate-skills.mjs` only checks files a case references in `files`, which this fixture is not yet; `skills/refine-story/SKILL.md:5` and `skills/socratic-examination/SKILL.md` give the round format and the `[TO CONFIRM: whom]` route the answers have to exercise.
  - Package: `evals/fixtures/` holds no `po-answers-*` file: confirmed. `evals/refine-story.json:1` case 1 ends its assertions at "The response waits for the PO to answer": confirmed, no case reaches synthesis. `evals/README.md` "What is evaluated" states the workflows are evaluated by the first round "With no PO answering": confirmed. `git log 81547f6..HEAD -- evals/ docs/agents/harness.md` is empty: nothing moved since the `Origin:` commit. The six subjects the ticket names are each supported by `evals/fixtures/us-245-silence-alerts.md` or by `evals/fixtures/CONTEXT-fleet.md` (the retroactive reading comes from the glossary entry **Reading**): confirmed.
  - Reproduction: not applicable, the ticket claims a missing fixture rather than a behavior defect. The absence was verified by listing `evals/fixtures/` and by reading the assertions of `evals/refine-story.json`, which stop at the first round.
  - Criteria: 1 still holds (nothing in `skills/` changes), 0 already satisfied, 3 need changing (the fixture, its refusal and unsupported decision, the protocol in `evals/README.md`)
  - Conflicts: none. No skill changes, so no manifest, router or `build-prompts.mjs` rule is in play; no shared rule moves; no localized token is added, since the pt-BR twin is ticket 03; no eval assertion changes, since the end to end case belongs to ticket 02. The fixture is checkable by reading only, which `harness.md` already records as the limit for anything a round does not publish.
- 2026-10-25 Implemented: `evals/fixtures/po-answers-245-en-US.md` and the protocol section of `evals/README.md`. Nothing under `skills/` changed, so `prompts/` was unaffected; `node scripts/validate-skills.mjs`, `node scripts/build-prompts.mjs --check` and `claude plugin validate . --strict` are green. No eval run is reported here: the fixture changes no rule, and the first measurement with it is ticket 02.
  - Subjects covered: who silences, the silencing window with the end of window behavior, what the window suppresses, per operator or shared, early reactivation, retroactive readings, "in a simple way" of AC1, and the AC2 and AC4 criteria. The refusal routed to the engineering team is the retroactive reading; the decisions with no basis in the story text are the window, what it suppresses, and the shared silencing.
  - Not checkable mechanically, as `harness.md` records for anything a round does not publish: whether the answers in fact cover every subject a given run opens, and whether a run matched them by subject rather than improvising. Both are read from the recorded session. The fixture is not referenced by any `evals/*.json` case yet, so the validator does not even check that it exists; the case that references it arrives with ticket 02.
  - Review findings applied: the two answers that labelled themselves as not written in the story were removed, since they handed the session the inference versus decision classification that ticket 02 measures; the protocol gained the line that fixtures are copied into the run workspace, because a session records resolved glossary terms in `CONTEXT.md` and would otherwise write into `CONTEXT-fleet.md` and spoil the next run, and the line that the driver records whether the session opened the answers file.
