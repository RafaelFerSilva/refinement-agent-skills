# 14: A PO answer that contradicts the glossary is recorded without the challenge the primitive requires

Status: resolved
Blocked by: none
Type: task
Origin: 2026-10-25 (commit 7c8fe9e)

Found by the end to end run of ticket 02. `CONTEXT.md` of the workspace defines the operational report over readings:

> **Operational report**: The daily consolidation of readings per vehicle, consumed by the dispatch operator and the operations director.

The session quoted that definition in its own Q6, then received a PO answer placing alerts in that report ("it still appears in the operational report at the end of the day, with the mark that the vehicle was silenced"), accepted it, published a scenario asserting it, and wrote a new glossary entry that embeds the contradiction:

> **Alert silencing**: ... It does not stop the alert from being recorded: the end-of-day operational report still includes it, marked as silenced at that time.

The `Operational report` entry was left untouched, so the glossary now says the report consolidates readings in one entry and includes alerts in another. `skills/socratic-examination/SKILL.md` asks for the opposite: "**Challenge against the glossary.** A PO term conflicting with `CONTEXT.md`: point it out immediately", with the example "The glossary defines 'alert' as X, but you seem to mean Y. Which of the two?".

The failure is quiet. The artifact reads as if the report always carried alerts, and the next workflow reading this glossary inherits both readings.

## Evidence

- `refinement-skills-workspace/end-to-end-245-en-US/CONTEXT.md`, the `Operational report` entry against the `Alert silencing` entry the session appended.
- `refinement-skills-workspace/end-to-end-245-en-US/.scratch/245-silence-alerts/spec.md`, the scenario "Silenced periods still reach the operational report".
- `refinement-skills-workspace/end-to-end-245-en-US/rounds.md`, Q6, which proves the session had the glossary definition in hand when the answer arrived.

## What a fix has to decide

Whether the challenge rule fires only on a term the PO names, which is how the current wording reads, or also on an answer that widens a term the glossary already defines, which is the case here. Either way the glossary write is the detectable moment: a new entry that contradicts an existing one is the artifact of the miss.

## Comments

- 2026-10-25 Triaged: ready-for-agent, first of the three rule changes, because it is the narrowest and its failure has a detectable moment: a new glossary entry that contradicts an entry already there. The decision the ticket leaves open, whether the challenge fires only on a term the PO names or also on an answer that widens a term the glossary defines, is inside the doctrine of `socratic-examination` and does not need the user to arbitrate it. Doing this one first also keeps it clear of ticket 12, which would change round shape.
- 2026-10-25 Preflight (commit fbd2386): confirmed
  - Docs: `skills/socratic-examination/SKILL.md:54` is the challenge bullet and `:58` the record bullet, the two the fix touches, and the invariant that a shared rule lives in one place holds here: `grep` finds no other skill stating a glossary rule, the workflows only point at the primitive. `GLOSSARY.md` beside it holds the `CONTEXT.md` format and says nothing about contradictions, which is consistent with the rule living in `SKILL.md`. `harness.md` "What the harness does not check" decides how this is verified, and `evals/README.md` carries the protocol for a driven run.
  - Package: the two entries of the run of ticket 02 are as the ticket quotes, `Operational report` over readings and `Alert silencing` putting alerts in it: confirmed. `rounds.md` Q6 quotes the glossary definition, so the session had it in hand: confirmed. Nothing moved in `skills/socratic-examination/` since the `Origin:` commit.
  - Reproduction: the recorded run is the reproduction, and it is one observation. The measurement below takes three before and three after, since a rule changed against a behavior seen once is what ADR 0005 exists to warn about.
  - Criteria: no acceptance criteria stated; the work is the rule, the measurement, and an honest record of what no check covers.
  - Conflicts: one that decides the shape of the work. There is no mechanical check for this rule and no eval assertion that can carry it. The grader reads one published artifact, and the glossary the session writes is a different file; the contradiction here is between two entries about different terms, which is semantic rather than detectable; and an eval case cannot express a driven session, because the protocol of ticket 01 forbids handing the answers file to the session under test. So this rule falls in `harness.md` "What the harness does not check", and the ticket says so rather than pretending a check covers it. What stands in for a test is the measurement: the same session, the same answers, before and after.
- 2026-10-25 Implemented and measured. The rule moved and the behavior moved with it, and it does not reach the package's own threshold. Both halves are recorded.
  - The rule, in `skills/socratic-examination/SKILL.md`, answers the question the ticket left open: the challenge fires on an answer that widens a term, not only on a term the PO names. "The conflict sits as often in the claim as in the word: an answer that asserts what an existing definition excludes widens that term, and a widening is a change to the glossary rather than a detail of the answer." The record bullet gained the detectable moment: re-read every entry a new one names or implies, and an entry that contradicts one already there is the challenge rather than a write. `prompts/` regenerated.
  - Measurement: nine driven sessions over the same story, the same answers delivered by subject, three per configuration. What was held constant: the story, the glossary, the workspace configuration, the model, the answers and the order they arrived in. What was controlled by instruction rather than enforced: the before runs were pinned to a snapshot of `skills/` taken before the change and told not to use the Skill tool, and the after runs were pointed at `skills/` as files with the same ban, which the recorded evidence cannot confirm every session honoured. The two run prompts also differ by the sentences that express the pin itself.

```
                              challenge raised    contradicting entry written
before, rule as it was             0 of 3                   2 of 3
after, first wording               2 of 3                   1 of 3
after, sharpened wording           2 of 3                   1 of 3
```

  - What the challenge looks like when it fires, from one of the after runs: "`CONTEXT.md` currently defines operational report as the daily consolidation of readings per vehicle. Your answer adds that the report also shows whether the vehicle was silenced. That is alert status, not a reading. Does the definition widen, or is the silenced mark a second thing?" Two of those runs also held the claim out of the glossary entry while the question was open, which is the behavior the rule asks for.
  - **The fix is not demonstrated.** `evals/README.md` holds an assertion at 80% of runs, which at three runs means all three, and this is 2 of 3 in both wordings. The second wording was written to close the gap the first one left, where the contradiction entered through a sentence inside a neighbouring entry, and the run that missed in the second wave missed the same way. Reporting 2 of 3 as a fix would be the error ADR 0005 exists to prevent.
  - The sharpened wording is the one that stays: it measures the same and it names the side door, which the first did not.
  - Filed as ticket 18: making the rule hold, with the ADR 0005 precedent as the hypothesis, that a rule starts holding when it moves to where the run always reads it.
