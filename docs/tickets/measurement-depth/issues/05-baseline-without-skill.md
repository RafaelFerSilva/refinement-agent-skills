# 05: Record a baseline without the skills

Status: resolved
Blocked by: 04
Type: task
Origin: 2026-10-25 (commit 81547f6)

No case has ever run without the skills, so the package has no evidence that it beats a competent model reading the same fixture. That is the first question an adopter asks, and the one the suite cannot answer.

Run the four most informative cases with the fixture and the prompt but no skill, grade them with the same assertions, and record the comparison. The point is not to win: a baseline that scores well on some assertions tells us which rules the model already follows and which ones the package is actually buying.

## Acceptance criteria

- Four cases run without any skill loaded, on the same fixtures and prompts, recorded under a baseline configuration directory.
- The same assertions are graded, and a per-assertion comparison with the skill is recorded.
- The assertions where the baseline matches the package are named, since those are candidates for pruning from the skills.

## Comments

- 2026-10-25 Preflight (commit d51bde6): confirmed
  - Docs: `evals/README.md` "Repeat runs and the threshold", written in ticket 04, decides how many runs a configuration gets and what a held assertion is, so the baseline inherits it rather than inventing a second convention; `harness.md` Evals mirrors it; the `with_skill/` half of the layout exists already and `no_skill/` is its twin; `AGENTS.md` Definition of Done covers the comparison mode added to the aggregation.
  - Package: `Blocked by: 04` is resolved, and `scripts/aggregate-runs.mjs` exists with the per assertion rates the comparison needs: confirmed. `grep -rn "no_skill"` over `evals/`, `docs/agents/` and `scripts/` returns nothing, and no directory named `no_skill` exists in the workspace tree: confirmed, no case has ever run without the skills. The four cases picked are `refine-story` 1, 3 and 4 and `meeting-minutes` 1, which cover examination in en-US, the triage exit, localization in pt-BR and a published synthesis, 29 assertions in total; each is a single turn, so no case needs a driven PO.
  - Reproduction: not applicable. The ticket asks for a measurement that has never been taken, and the measurement is the work.
  - Criteria: 3 still hold, 0 already satisfied, 0 need changing
  - Conflicts: none in the invariants. Two things are recorded rather than hidden: the prompts are localized, with the fixtures placed at their workspace locations and the redirection clauses of the original prompt dropped, identically for both configurations; and `refine-story` case 3 already has five `with_skill` runs from ticket 04, which are reused instead of rerun, so that case compares five runs against three.
- 2026-10-25 Measured. Four cases, two configurations, three runs each, 21 sessions in all, plus the five `with_skill` runs of `refine-story` case 3 reused from ticket 04. Every run graded against the case's own assertions by a grading pass that was not told which configuration a run came from, then aggregated with `scripts/aggregate-runs.mjs --baseline`, which this ticket added along with its fixture pair and validator check.

```
refine-story case 1, en-US, first round
baseline: 5/9 assertions at or above 80%, pass rate over runs 70%
BOUGHT   with 100% vs baseline   0%  classifies the US as ANALYZABLE before any question
BOUGHT   with 100% vs baseline   0%  round in the Q<n> format, each with a recommendation or "no recommendation"
BOUGHT   with 100% vs baseline  67%  the role question recommends dispatch operator and cites the glossary
BOUGHT   with 100% vs baseline  67%  waits for the PO instead of writing the refined US
ALREADY  with 100% vs baseline 100%  the duration question recommends no number
ALREADY  with 100% vs baseline 100%  AC2 as implementation task and AC4 as Definition of Done
ALREADY  with 100% vs baseline 100%  "in a simple way" flagged as an unverifiable outcome
ALREADY  with 100% vs baseline 100%  no numeric value for duration, limit or SLA asserted
ALREADY  with 100% vs baseline 100%  questions and markers in English, per the workspace language

refine-story case 3, en-US, the NOT A US triage
baseline: 0/4 assertions at or above 80%, pass rate over runs 8%
BOUGHT   with 100% vs baseline  33%  classifies the item as NOT A US and states it is a technical task
BOUGHT   with 100% vs baseline   0%  recommends reclassifying it and mentions the `Status: not a US` trail
BOUGHT   with 100% vs baseline   0%  opens no examination round and asks no refinement question
BOUGHT   with 100% vs baseline   0%  writes no narrative and no acceptance criteria for the item

refine-story case 4, pt-BR, first round
baseline: 2/6 assertions at or above 80%, pass rate over runs 33%
BOUGHT   with 100% vs baseline   0%  round written in Portuguese with **Recomendação:**
BOUGHT   with 100% vs baseline   0%  the role question recommends "operador de despacho" citing the glossary
BOUGHT   with 100% vs baseline   0%  classifies as ANALISÁVEL, with AC2 and AC4 recognized
BOUGHT   with 100% vs baseline   0%  waits for the PO
ALREADY  with 100% vs baseline 100%  no numeric value asserted
LOST     with  33% vs baseline 100%  rigor markers in their Portuguese form

meeting-minutes case 1, en-US, published artifact
baseline: 0/10 assertions at or above 80%, pass rate over runs 7%
BOUGHT, all ten, with 100% against a baseline of 0% on eight of them and 33% on two
```

  - **What the package buys**, 22 of the 29 assertions. The whole of `meeting-minutes`: provenance markers, the action table against its JSON twin, the tracking marker, the self-audit, the omission of a personal circumstance while keeping the commitment inside it, and a published artifact that passes the mechanical grader. The whole of the triage exit: no baseline run stopped at NOT A US, all three refined the database migration instead, two of them publishing a spec with an invented narrative for it. In pt-BR, the examination format and the triage label, which the baseline never produced. In en-US, the format of a round and waiting for the PO.
  - **What the model already does without the package**, 6 of the 29, all at 100% in both configurations: five in `refine-story` case 1, which are refusing to invent a duration, moving AC2 to a task and AC4 to Definition of Done, flagging "in a simple way" as unverifiable, asserting no number anywhere, and following the configured language; and one in case 4, asserting no number in pt-BR. These are the candidates the ticket asks to name. Pruning any of them is a separate decision and not an obvious one, because the rules that produce them are also what the other 22 lean on, and this measurement cannot tell a rule that is redundant from a rule that is load bearing elsewhere.
  - **Where the package loses**, 1 of the 29: the pt-BR marker assertion, where two of three runs with the skill emitted `[INVEST-FAIL: V]` and the grading counted it as an English marker. ADR 0005 makes that marker canonical in both languages, so the assertion is what is wrong. Ticket 17.
  - **What this baseline is not.** It is the model plus the workspace configuration, not the model alone: `refinement-no-code-<language>.md` names the markers, the verdicts, the Gherkin keywords and the publishing paths, and the baseline runs used all of it, which is visible in their output. That is the fair comparison for an adopter, who installs the configuration with the package, and it means the gap measured here understates what the full package adds over a bare model. Three runs per configuration is a budget decision, including for the read judged cases that the run count table would otherwise give five, now recorded as such in `evals/README.md`; all runs were on Sonnet; the sessions read `SKILL.md` as a file rather than being invoked as a slash command; and the prompts were localized identically for both configurations, with the fixtures placed at their workspace locations.
