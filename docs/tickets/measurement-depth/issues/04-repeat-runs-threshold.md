# 04: Measure each case over repeat runs against a threshold

Status: resolved
Blocked by: none
Type: task
Origin: 2026-10-25 (commit 81547f6)

One run per case cannot separate a fix from variance. The sessions recorded in ADR 0005 measured the same behavior at zero of five runs and at three of three, and only repetition made the difference visible.

Make repetition the convention rather than something improvised: a case is measured over N runs, each run graded as it is today, and the case reports a pass rate against a declared threshold. The directory layout for several runs of one configuration already exists in the workspace convention (`with_skill/run-1/`, `run-2/`), though those directories hold the response alone today and no per run grading file, so this is a convention, a per run grading file, and an aggregation over them, not a new runner.

Pick N per case rather than globally: a case whose assertions are mechanical needs fewer runs than one judged by reading.

## Acceptance criteria

- `evals/README.md` states how many runs a case is measured over, and the threshold at which an assertion counts as held.
- A case's result is reported as a pass rate over runs, with the per-run results kept.
- At least one case is measured this way end to end, and its pass rate recorded.
- The grading summary per run keeps the shape the viewer and the aggregation already read.

## Comments

- 2026-10-25 Preflight (commit 53f950f): adjusted
  - Docs: `evals/README.md` "How to run" is where the convention lands, beside the `grade-output.mjs` invocation it already documents; `docs/agents/harness.md` Evals is the mirror that says what a script enforces; `AGENTS.md` Definition of Done covers the new script, and the `/implement` rule that a harness change starts from the failing case decides the order of the work; the spec Seams section allows "a convention in `evals/README.md` and a field in the grading summary, not a new runner", which an aggregation over existing per run files respects.
  - Package: the `with_skill/run-N/` layout exists, in `refinement-skills-workspace/iteration-3/refine-story-1-en-US/`, with four runs: confirmed. **Changed**: those run directories hold `outputs/response.md` only, and no `grading.json` anywhere under a `run-N/` path, so the per run grading file the aggregation reads does not exist yet and is part of this ticket rather than a given. The grading shape the viewer reads is `{expectations: [{text, passed, evidence}], summary: {passed, failed, total, pass_rate}}`, in `refinement-skills-workspace/iteration-1/refine-story-1-en-US/with_skill/grading.json`, while `scripts/grade-output.mjs --json` emits `{file, skill, language, language_source, pass_rate, expectations}`: two shapes, both in use, so the aggregation reads both and neither changes.
  - **False**, and it does not change the work: the ticket cites ADR 0005 as measuring "0 of 5 and at 4 of 4". ADR 0005 says "zero of five runs to three of three", for the anti-pattern tag. The numbers in the ticket come from the spec, not from the ADR. The point the ticket makes, that repetition is what made the difference visible, is exactly what the ADR records.
  - Reproduction: not applicable. Nothing here claims a behavior defect; the ticket asks for a convention, an aggregation and one measurement.
  - Criteria: 0 still hold, 0 already satisfied, 4 need changing
  - Conflicts: none in the invariants, and one ordering constraint from `/implement`: the aggregation is harness, so it starts from fixture run files whose aggregate is known, with a check in `scripts/validate-skills.mjs` that fails before the script exists.
- 2026-10-25 Implemented and measured. Order followed the `/implement` rule for a harness change: the fixture set first, then the check that fails, then the script.
  - `evals/fixtures/runs/aggregate-example/` holds three per run grading files with a known aggregate: one assertion holding in every run, one in a third, one in two thirds. Run 3 of the set deliberately uses the `--json` shape of `grade-output.mjs` rather than the viewer shape, so the aggregation is pinned to read both. `scripts/validate-skills.mjs` aggregates the set at a threshold of 0.66 and fails if the numbers move. Confirmed failing before the script existed: `error: aggregate-runs.mjs did not emit JSON over evals/fixtures/runs/aggregate-example`.
  - `scripts/aggregate-runs.mjs <case> [--threshold] [--json]` reports each run's pass rate, each assertion's rate across runs with the runs it failed in named, and one verdict: `held` with exit 0 only when every assertion meets the threshold. An assertion absent from a run counts as not held there and is named as absent, because a grading file that skips an assertion is not evidence that it passed. Nothing in `grade-output.mjs` changed, so the viewer shape and the `--json` shape both stay as they were.
  - Convention in `evals/README.md`, mirrored in `harness.md`: 3 runs for a case graded by the mechanical grader alone, 5 for a case whose assertions are read, 3 for a driven session because each costs a full session plus the driving. An assertion holds at 80% of runs or above, which means unanimity at three runs and one permitted miss at five.
  - Measured case, end to end: `refine-story` case 3, the NOT A US triage over `517-not-a-us-database-migration.md`, en-US, read judged, so five runs. Five independent sessions, each over its own copy of the fixtures, then one grading pass that read the five responses and the trail each session wrote into the item, writing `grading.json` per run.

```
node scripts/aggregate-runs.mjs refinement-skills-workspace/repeat-refine-story-3-en-US
case: repeat-refine-story-3-en-US, 5 runs, threshold 80%
  run-1: 4/4  100%   run-2: 4/4  100%   run-3: 4/4  100%   run-4: 4/4  100%   run-5: 4/4  100%
HELD     5/5  The response classifies the item as NOT A US and states it is a technical task
HELD     5/5  It recommends reclassifying the item as a task and mentions the `Status: not a US` trail
HELD     5/5  It does not open an examination round, and asks no refinement question
HELD     5/5  It does not write a narrative or acceptance criteria for the item
held: 4/4 assertions at or above 80%, pass rate over runs 100%
```

  - What this result does and does not establish. The triage exit of `refine-story` holds at 5 of 5 in en-US, which is the first behavior of this package measured over repetition rather than asserted. It says nothing about the behaviors that vary: a case at 100% never exercises the threshold's discriminating power, which is why the fixture set exists and is checked. The case that needs this most is the synthesis pair of tickets 02 and 03, where one run published `READY` and the other `REFINAR`; measuring it over three runs per language is the next application, and it costs five to six driven sessions rather than five single turns.
  - The per run files live in the git ignored workspace tree, so the aggregate above is quoted here rather than linked.
  - Review findings applied to the aggregation, each reproduced before the fix and verified after: a grading file beside the run directories was counted as one more run, which is the normal history of a case measured once and then repeated; each run's pass rate used its own assertion count, so an incomplete grading file reported 100% on a case the same output called not held; an assertion listed twice in one run resolved to the first verdict silently; and `--threshold` with no value fell back to 0.8 instead of refusing. Fixing the first of those introduced a regression that dropped the case directory from the arguments whenever `--threshold` was absent, caught by rerunning every invocation path rather than only the one the validator uses. The measured aggregate above is unchanged.

