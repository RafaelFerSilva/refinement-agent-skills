# Synthesis Rules

## Retraction and supersedence

Real-world meeting transcripts change their mind.

- The final commitment or decision on a topic always takes precedence.
- Superseded statements do not disappear: the active line carries the note `[supersedes: previous version, speaker, ~minute]` (or in pt-BR `[substitui: versão anterior, falante, ~minuto]`). An action item assumed by Carlos at 12min and transferred to Priya at 30min is a single line, assigned to Priya, carrying the note. Never create two lines for the same commitment.
- Decision reversed during the meeting: record only the final decision, noting the reversal in Context.
- Conditional acceptance without counter-response ("I can do it, but only next week"): the conditional version holds, with the condition recorded on the line, and acceptance of the new timeline by others becomes an open question.
- Ambiguous retraction where the transcript ends without clarifying which version holds: open question, never a silent choice.

## Action item granularity

- An individual commitment is a single line. Two attendees taking action on the same topic are two separate lines. Different assignees are never grouped into one row.
- "Let's think about this", "it would be good to look into", without an owner or actionable verb: mark as `[TRACKING]` (pt-BR: `[ACOMPANHAMENTO]`) in the table, with no object in the JSON output.
- An action item that follows logically from a decision but was not verbally assumed: section 5 (Presumed Actions), citing the basis. Does not enter the table.

## Priority

A single unified scale across both outputs: Highest, High, Medium, Low.

- `[CTX]` when urgency was verbally stated ("this blocks the sprint", "before the 20th"); cite in observations.
- `[EST]` when inferred from deadline or context using this baseline: Highest blocks delivery or sprint, explicitly stated or evident from dependency chains; High has an explicit deadline within 48h of the meeting date; Medium has a deadline within the mentioned current cycle; Low has no urgency mentioned.
- Date arithmetic is always exposed in observations: "meeting 2026-04-14 + 'by Thursday' = 2026-04-16, less than 48h, High [EST]".
- Without deadline and without stated urgency: Low `[EST: no urgency stated]`.

## Decisions

- The Recorded Decisions section accepts STATED only: someone explicitly verbalized the decision or agreement ("agreed", "let's go that route", "approved").
- Silence following a proposal, "uh-huh", or changing the subject without objection: presumed agreement (section 4), citing the excerpt and who must confirm. Detecting this conversational pattern is legitimate analysis; recording it as an established decision would certify what never occurred.

## Example walkthrough

Metadata: alignment meeting, Fleet Project, 2026-04-14. Marcus (consultant), Carlos (operations director), Priya (IT). Glossary: "telemetry", which transcript spells "telimetry".

Transcript snippet: at ~05min Carlos says "speed alerts must be in the MVP, without this I cannot present to the board" and Marcus replies "agreed, speed alerts in the MVP then". At ~12min Marcus: "I will gather telemetry requirements with the vendor by Thursday". At ~18min Priya: "I suggest leaving SAP integration out of the MVP, making it a separate project", no one responds and discussion moves to timeline. At ~30min Marcus: "thinking it over, Priya has vendor contacts, Priya can you gather telemetry?" and Priya: "I can, but only next week". Carlos: "we should think about some driver training at some point".

Output breakdown:

- Triage: INTACT. `[POSSIBLE TRANSCRIPTION ERROR: "telimetry" -> "telemetry", per glossary, 2 occurrences]`.
- Decision: speed alerts are included in the MVP. `[STATED: Carlos, "must be in MVP, without this I cannot present to board"; confirmed by Marcus, "agreed"]`.
- A01: gather telemetry requirements with vendor. Assignee: Priya. Deadline: week of 2026-04-20. Medium [EST]. `[STATED: Priya, "I can, but only next week"] [supersedes: Marcus, ~12min, "by Thursday"]`. Observation: "next week" from 04-14 is week of 04-20, within current cycle, Medium [EST].
- A02: evaluate driver training format. `[TRACKING]`. `[STATED: Carlos, "we should think about training at some point"]`. No assignee or deadline, no JSON object.
- Presumed agreement: SAP integration excluded from MVP. `[ASSUMED: Priya proposal at ~18min followed by subject change without objection or confirmation]`. Confirm with Carlos and Marcus. If confirmed, becomes MVP scope decision.
- JSON: one object, A01, assignee "Priya", priority "Medium", dueDate null (week without fixed day, textual description in description).
- Self-audit: OK, 1 real table action, 1 JSON object, tracking and presumed excluded from JSON, identical priorities.
