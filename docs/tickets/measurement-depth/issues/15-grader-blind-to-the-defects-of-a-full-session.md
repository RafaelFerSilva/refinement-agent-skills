# 15: The grader passes an artifact carrying every defect of the first end to end run

Status: resolved
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
- 2026-10-25 Amended after ticket 16, which this ticket is blocked on. The quoted run now reads 13 of 13 rather than 14 of 14, since the global `no em-dash` check left the grader. The argument is untouched and slightly sharper: one check fewer, and the three defects still pass.
- 2026-10-25 Preflight (commit 5aea2dc): confirmed
  - Docs: `docs/agents/harness.md` "What the harness does not check" is the section to extend, and its three existing bullets set the register: each names a thing the mechanical layer cannot see and says what covers it instead; `AGENTS.md` Writing style asks for a checkable completion criterion, which for a documentation change means the numbers in it have to be verifiable; ticket 16 left one sentence for this ticket, that the grader does not carry the prose rule by decision rather than by oversight.
  - Package: `scripts/grade-output.mjs:221` is the `refine-story` branch: confirmed, three lines later than the ticket says because ticket 16 replaced one line with a four line comment. The run quoted in the ticket now grades 13 of 13: confirmed, and the ticket already carries that amendment. Counting the checks each fixture draws: `refine-story` 14, `qa-plan` 16, `requirements-discovery` 13, `meeting-minutes` 21 and 20 in actions mode. **Changed**, and it sharpens the ticket: the count is per artifact, not per workflow, because some checks are conditional. The `refine-story` fixture draws 14 because its verdict is REFINE, while the READY artifact of ticket 02 draws 13. A documented count has to name what it counts over.
  - Reproduction: not applicable, nothing here claims a behavior defect. What the grader covers was read from its source and from `--json` over the nine committed fixtures.
  - Criteria: this ticket states no acceptance criteria; the work is the section, plus a guard so the numbers in it cannot quietly go stale, which is the same defect one level up.
  - Conflicts: none in the invariants. No skill changes, so `prompts/` is untouched. The mechanical half stays out, as the triage decided.
- 2026-10-25 Implemented, documentation half as the triage scoped it.
  - `docs/agents/harness.md` gains a section, "What a synthesis grade covers", saying in plain terms that the grader reads shape, naming the structural ties each workflow adds on top, and carrying the count of checks each committed fixture draws. Two bullets join "What the harness does not check": that nothing in the grade speaks to whether the artifact is true, with the run of ticket 02 named as the case where a clean grade sat on three defects, and that prose style is deliberately not carried into a published artifact, which is the sentence ticket 16 left here.
  - The guard came first and failed first, once per fixture: `docs/agents/harness.md does not say how many checks meeting-minutes-actions-en-US draws, and it draws 20`. The validator now grades each fixture with `--json`, counts its expectations, and compares against the table. A number in prose about what a check covers is exactly the thing this section exists to stop going stale, so it is not left to prose alone.
  - Drift caught from both sides, verified by breaking each in turn and restoring it. Changing one number in the table: `harness.md says qa-plan-en-US draws 15 checks, and it draws 16`. Adding a check to the grader: three failures at once, each naming the fixture whose count moved.
  - What this ticket does not do, on purpose: the mechanical half. A glossary term defined twice in incompatible ways is detectable and would be a new check, so it starts from the condition it must reject and gets its own preflight, and it only makes sense once ticket 14 decides whether the contradiction is prevented at the source.
  - Review findings applied, both reproduced before and after. A grader that throws left every fixture without a report, and the reverse loop then blamed the documentation for nine fixtures sitting on disk: it now compares against the directory listing, so a broken grader produces nine grader failures and no documentation noise. And `harness.md` was read with no existence check, so moving it ended the run in a Node stack trace with the aggregation, the comparison, the dash boundary and the prompt freshness never reached; it now reports a named failure and the rest of the validation still runs.

