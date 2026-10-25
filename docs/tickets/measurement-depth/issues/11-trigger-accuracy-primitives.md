# 11: Measure the triggering of the two model-invoked primitives

Status: ready-for-agent
Blocked by: none
Type: task
Origin: 2026-10-25 (commit 81547f6)

`requirements-rigor` and `socratic-examination` are the only skills whose `description` decides whether they load. Every workflow depends on them, and if `requirements-rigor` under-triggers, the rigor layer silently does not arrive while the workflow still reports a result. That triggering has never been measured.

Build the trigger eval set the `skill-creator` loop expects, twenty queries per skill, half that should fire and half near misses that share vocabulary but need something else, and run the loop. Near misses are the valuable half: a code review request, minutes with no requirement content, a unit test for one function.

## Acceptance criteria

- A trigger eval set exists for each of the two primitives, with the should-fire and should-not-fire split recorded.
- The optimization loop runs and its per-iteration scores are recorded.
- Either the description is updated with the result, or the current one is recorded as the best measured, with the score.

## Comments
