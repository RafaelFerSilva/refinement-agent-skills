# 14: A PO answer that contradicts the glossary is recorded without the challenge the primitive requires

Status: ready-for-agent
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
