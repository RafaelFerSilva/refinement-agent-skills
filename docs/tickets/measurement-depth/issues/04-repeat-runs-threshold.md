# 04: Measure each case over repeat runs against a threshold

Status: ready-for-agent
Blocked by: none
Type: task
Origin: 2026-10-25 (commit 81547f6)

One run per case cannot separate a fix from variance. The sessions in ADR 0005 measured the same behavior at 0 of 5 and at 4 of 4, and only repetition made the difference visible.

Make repetition the convention rather than something improvised: a case is measured over N runs, each run graded as it is today, and the case reports a pass rate against a declared threshold. The layout for several runs of one configuration already exists in the workspace convention (`with_skill/run-1/`, `run-2/`), so this is a convention plus an aggregation, not a new runner.

Pick N per case rather than globally: a case whose assertions are mechanical needs fewer runs than one judged by reading.

## Acceptance criteria

- `evals/README.md` states how many runs a case is measured over, and the threshold at which an assertion counts as held.
- A case's result is reported as a pass rate over runs, with the per-run results kept.
- At least one case is measured this way end to end, and its pass rate recorded.
- The grading summary per run keeps the shape the viewer and the aggregation already read.

## Comments
