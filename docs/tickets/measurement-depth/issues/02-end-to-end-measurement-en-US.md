# 02: Run the examination to synthesis and grade the published User Story

Status: resolved
Blocked by: 01
Type: task
Origin: 2026-10-25 (commit 81547f6)

The first end to end measurement of the package. Drive `refine-story` over US-245 with the scripted answers until the frontier empties, let it publish, and grade the artifact.

This is where the claim gets tested: that the rounds converge, that the verdict matches what the answers support, that every criterion is Gherkin a QA engineer could automate, that what the PO refused appears as `[TO CONFIRM: whom]` with a questionnaire, and that nothing the answers did not say turns into an assertion.

Defects found here are filed as their own tickets rather than fixed in place: this ticket measures, and a rule change needs its own preflight.

## Acceptance criteria

- A full session is recorded under `refinement-skills-workspace/`, with the published User Story and any questionnaire.
- `node scripts/grade-output.mjs <published US> --skill refine-story --lang en-US` runs and its output is recorded, pass or fail.
- The INVEST scorecard, the verdict and the open questions are read against the scripted answers, and every divergence is written down.
- Each defect found becomes a ticket in this effort, with the evidence quoted.

## Comments

- 2026-10-25 Preflight (commit 7c8fe9e): confirmed
  - Docs: `evals/README.md` "Scripted Product Owner answers" governs how the run is driven, including copying the fixtures into the run workspace and matching answers by subject; `harness.md` Evals says a synthesis is evaluated by the artifact, and its "What the harness does not check" says a `[SPECIFIED: excerpt]` style citation is judgment, so the reading of the artifact against the answers is done by hand here; `skills/refine-story/SKILL.md` steps 5 to 8 and `TEMPLATE.md` give the sections the artifact must carry; `skills/socratic-examination/SKILL.md` gives the round format and the `[TO CONFIRM: whom]` exit; `AGENTS.md` Definition of Done applies to the repository changes this ticket makes, which are the ticket records themselves.
  - Package: `evals/fixtures/po-answers-245-en-US.md` exists at HEAD (commit 7c8fe9e): confirmed, and ticket 01 in `Blocked by:` is resolved. `.gitignore` carries `*-workspace/` and `scripts/validate-skills.mjs` skips directories ending in `-workspace` when scanning prose: confirmed, so the recorded session stays out of the repository and the divergences have to be written into this ticket to survive. `scripts/grade-output.mjs:218` is the `refine-story` branch, and its checks are: a recipient on every open question, an open question behind any `[TO CONFIRM:` marker, `Given` as state, the six INVEST criteria, and a REFINE verdict that names the questions unblocking it: confirmed, these are the mechanical half of the third criterion.
  - Reproduction: this ticket is the reproduction. The run itself is the evidence, driven with the answers fixture and graded with `node scripts/grade-output.mjs <published US> --skill refine-story --lang en-US`.
  - Criteria: 4 still hold, 0 already satisfied, 0 need changing
  - Conflicts: none. No skill changes, so no manifest, router, prompt or localized token is in play. No case is added to `evals/refine-story.json`: the acceptance criteria ask for a recorded run and its reading, and a case that pins this run as a suite entry belongs with the threshold in ticket 04.
- 2026-10-25 Measured. First end to end run of the package. Setup: `refinement-skills-workspace/end-to-end-245-en-US/`, with `us-245-silence-alerts.md`, `CONTEXT-fleet.md` copied as `CONTEXT.md` and `refinement-no-code-en-US.md` copied as `docs/agents/refinement.md`, per the protocol in `evals/README.md`. The session ran as a subagent reading `skills/refine-story/SKILL.md`, blocked from `evals/` and `docs/tickets/`; the answers were matched by subject by the driver and delivered one round at a time. The full record is `refinement-skills-workspace/driver-record-245-en-US.md`, which is git ignored like the rest of that tree, so the readings below are the part that survives.
  - Attempt 1, on Opus 5, died twice on the same API error on resume (`invalid_request`, `[reasoning_extraction]`) before acting on the answers, and published nothing. Attempt 2, on Sonnet, is the measured run. The model is part of what was measured and is recorded rather than implied.
  - Convergence: one round of six questions, then synthesis. The rounds did converge, which is the claim this ticket set out to test, and they converged by closing early rather than by exhausting the material: see ticket 12.
  - Grader: `node scripts/grade-output.mjs refinement-skills-workspace/end-to-end-245-en-US/.scratch/245-silence-alerts/spec.md --skill refine-story --lang en-US` exits 0 with 14 of 14 PASS, including `gaps marked to confirm have an open question (0 markers, 0 questions)` and `verdict is READY, REFINE, BLOCKED (READY)`.
  - Verdict against the answers: `READY` is defensible for what was asked and wrong for what was not. Three subjects of the fixture were never asked, so never delivered: per operator or shared, the retroactive reading, and the re-fire at the end of the window. The retroactive reading is the refusal the fixture was built around, so `[TO CONFIRM: engineering team]` and the questionnaire were never exercised in this run. Attempt 1 did ask it, which makes this variance between runs rather than a rule the package lacks. Ticket 04 is where that stops being anecdote.
  - INVEST: all six criteria present, all six PASS. `Testable` PASS is the questionable one, since four scenarios assert a panel countdown nobody specified, and `Estimable` PASS sits beside a storage approach the PO explicitly declined to settle. Neither is contradicted by the scorecard rules as written.
  - Criteria: seven scenarios, `Given` as state throughout, no subjective term, and no number beyond the 15, 30 and 60 minutes the PO gave. Durations, scope, early cancellation and the operational report all trace to an answer. The exception is the countdown in the vehicle row: ticket 13.
  - Divergences written down as tickets, with the evidence quoted: 12 the frontier declared empty over a gap the glossary points at, 13 behavior the PO never stated asserted in `Then` clauses under an inference marker, 14 a PO answer contradicting the glossary recorded without the challenge `socratic-examination` requires, 15 the grader passing all three.
  - What the run also confirmed: the protocol written in ticket 01 earns its keep. The session wrote two new terms into `CONTEXT.md` during the examination, so a run against the fixture in place would have rewritten the glossary the next run starts from.
