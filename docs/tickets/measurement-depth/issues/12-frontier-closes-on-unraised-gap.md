# 12: The frontier is declared empty while a gap the glossary points at was never raised

Status: ready-for-agent
Blocked by: none
Type: task
Origin: 2026-10-25 (commit 7c8fe9e)

Found by the end to end run of ticket 02. The session asked six questions, the PO answered all six, and the session concluded "The frontier is empty: proceeding to synthesis", publishing with `Status: READY` and an Open Questions section reading "None: every question raised during examination was answered by the PO."

The frontier was empty of questions it had asked. It was not empty of gaps. `CONTEXT.md` of the workspace defines:

> **Reading**: One record sent by the tracker: position, speed, and timestamp. It can arrive retroactively when the tracker loses signal.

A story about suppressing alerts for a time window, over a data source the glossary says can arrive late, has an edge case sitting in the glossary: a reading stamped inside the window that lands after it closed. The session read that entry, cited it in Q6 for a different purpose, and never asked about it.

The earlier attempt of the same run, on Opus 5, did raise it, which is what makes this variance between runs rather than something the material does not support. That attempt died on an API error before it could act on the answers and published nothing, and its round 1 lives only in the session that drove it, so its question is quoted here in full:

> ❓ **Q8. A reading timestamped inside the window that arrives after it ended**
> `CONTEXT.md` states a reading can arrive retroactively when the tracker loses signal. So a speeding reading stamped 14:20, inside a silence window that ended at 14:30, can land at 14:40. Silenced, or alerted?
> **Recommendation:** decide by the reading's own timestamp, so a reading stamped inside the window stays silenced [INFERENCE: `CONTEXT.md` states the reading carries its timestamp and can arrive retroactively]. The option is to decide by arrival time, which means an operator can be alerted about speeding they already handled and deliberately silenced.

The cost is not the missing question. It is that `READY` is published over it, and `READY` is the package telling a team the story can enter a sprint.

## Evidence

- `refinement-skills-workspace/end-to-end-245-en-US/rounds.md`, the Frontier check section.
- `refinement-skills-workspace/end-to-end-245-en-US/.scratch/245-silence-alerts/spec.md`, the Open Questions and Verdict sections.
- `skills/socratic-examination/SKILL.md`: "The **frontier** comprises questions whose prerequisites are resolved", and the examination "ends when the frontier is empty". Nothing in the definition asks whether the frontier was complete when it was drawn.

## What a fix has to decide

Whether completeness of the frontier is checkable at all, and where it would live: a sweep of the glossary entries the story touches before declaring the frontier empty, in `socratic-examination`, or a verdict rule in `requirements-rigor` that bars `READY` when a round count of one closed a story the audit flagged in more than one criterion. Both are rule changes, so both need their own preflight and their own measurement.

## Comments

- 2026-10-25 Corroborated by the pt-BR run of ticket 03, same package commit, same model, different language. That session ran two rounds, raised the audit trail and the re-silencing of an already silenced vehicle on its own, and routed the automatic return to the engineering team with a questionnaire. It still never asked about the retroactive reading, whose glossary entry (`Leitura`: "Pode chegar retroativa quando o rastreador fica sem sinal") is the pt-BR twin of the one quoted above. Two runs, two languages, the same gap unraised, against one run on another model that raised it.
- 2026-10-25 Triaged: ready-for-agent, and last of the three rule changes. The defect is real and corroborated in two languages, but how often it happens is unknown, and a rule changed against a behavior seen twice is a guess. The apparatus to settle that landed in ticket 04: measure `refine-story` case 1 over repeat runs and count how many raise the retroactive reading, then decide. A fix that bars a verdict after one round would also change the shape of every round, which would invalidate a measurement of tickets 13 and 14 taken mid flight, so this one goes after them.
