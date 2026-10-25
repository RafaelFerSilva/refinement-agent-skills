# 15: The grader passes an artifact carrying every defect of the first end to end run

Status: ready-for-agent
Blocked by: 16
Type: task
Origin: 2026-10-25 (commit 7c8fe9e)

The run of ticket 02 produced an artifact with the defects of tickets 12, 13 and 14 in it. The grader scored it 14 of 14, three of those lines quoted here and the other eleven passing the same way:

```
node scripts/grade-output.mjs refinement-skills-workspace/end-to-end-245-en-US/.scratch/245-silence-alerts/spec.md --skill refine-story --lang en-US
PASS  gaps marked to confirm have an open question  (0 markers, 0 questions)
PASS  INVEST scorecard lists the six criteria
PASS  verdict is READY, REFINE, BLOCKED  (READY)
...
14/14
```

That is not a grader bug: no mechanical check can read a `Then` clause against what a PO said in a conversation, and `docs/agents/harness.md` already states the principle for citations. What is missing is the record. The "What the harness does not check" section was written when no case reached synthesis, so it does not say that a published User Story is graded on shape alone: section presence, marker syntax, verdict vocabulary, `Given` as state, six INVEST rows. Nothing ties a criterion to an answer, nothing questions a `READY` reached in one round, and nothing notices a glossary that contradicts itself.

A reader of a green run today can reasonably believe more was checked than was.

## Evidence

- The grader output above, against `scripts/grade-output.mjs:218`, the `refine-story` branch and its five checks.
- Tickets 12, 13 and 14, all three invisible to that run.

## What a fix has to decide

The honest half is documentation: `harness.md` gains what a synthesis grade does and does not cover, which is a small edit and needs no new mechanism. The checkable half is narrower than it looks and needs its own preflight: a `READY` verdict with an empty Open Questions section is legitimate, so the candidate check is not the verdict but the glossary, where a term defined twice in incompatible ways is mechanically detectable.

## Comments

- 2026-10-25 Triaged: ready-for-agent, scoped to the documentation half. `harness.md` gains what a synthesis grade does and does not cover, which needs no new mechanism and no measurement. The mechanical half, a glossary term defined twice in incompatible ways, is left out of this ticket on purpose: it is a new check, so it starts from the condition it must reject and deserves its own preflight, and it only makes sense once ticket 14 decides whether that contradiction is prevented at the source. Blocked by 16, because 16 removes a check from the grader and this ticket describes what the grader covers.
