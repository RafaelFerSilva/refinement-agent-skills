# 13: Behavior the PO never stated is asserted in Then clauses under an inference marker

Status: ready-for-agent
Blocked by: none
Type: task
Origin: 2026-10-25 (commit 7c8fe9e)

Found by the end to end run of ticket 02. Four of the seven published scenarios assert a user interface element the PO never mentioned:

> And the vehicle's row shows it is silenced with 30 minutes remaining

The PO said where the silencing starts ("from the vehicle row in the dispatch panel") and who can end it early. Nothing in the answers, in the story text, or in `CONTEXT.md` says the row displays a countdown. The artifact carries it in Notes as:

> A vehicle row showing the silenced state and its remaining time (used in the scenarios above) is added `[INFERENCE: without it, another on-shift operator could not see which vehicles are silenced in order to end the silence early, per the PO's answer on early cancellation]`

The base is an argument from necessity, not a sentence anyone could point at. `skills/requirements-rigor/SKILL.md` defines an inference as "a conclusion that directly follows from an input statement, `CONTEXT.md`, or a verified fact, which another person reading the same material would reach", and its quick test is "can I point to the sentence or source that supports this?". Here the answer is no: a panel could mark a vehicle as silenced without showing remaining time, which is a different product and a different test.

Two aggravating details. The marker lives in Notes while the behavior lives in the `Then` of four scenarios, so a QA engineer automating the criteria never sees the marker. And the Gherkin rule of `requirements-rigor` says converting criteria "preserves the exact described behavior, without adding behavior".

## Evidence

- `refinement-skills-workspace/end-to-end-245-en-US/.scratch/245-silence-alerts/spec.md`, scenarios 1 to 3 and 6, and the third bullet of Notes.
- `refinement-skills-workspace/end-to-end-245-en-US/rounds.md`, the Frontier check section, which calls it "the only remaining editorial choice" and decides it "follows directly from Q5's answer rather than opening a new decision".

## What a fix has to decide

Whether an inference whose base is a necessity argument is an inference at all, and whether a marker in Notes may license an assertion inside a criterion. The second half looks like the sharper rule: behavior that only an inference supports belongs inside the scenario that asserts it, where the reader automating it sees the marker.

## Comments

- 2026-10-25 Triaged: ready-for-agent, second of the three rule changes. The defect needs no further evidence: the artifact asserts a countdown nobody specified, and `requirements-rigor` already says an inference cites a sentence and a Gherkin conversion adds no behavior, so the package contradicts itself rather than lacking a rule. The narrow half is the one to try first, since it is a placement rule rather than a judgment call: behavior that only an inference supports carries its marker inside the scenario that asserts it, where whoever automates the criterion sees it. Measure with the `refine-story` cases that reach synthesis, in both languages.
