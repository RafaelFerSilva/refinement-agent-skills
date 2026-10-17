# Minutes: <meeting title>

Status: draft
Azure: <ID or none>
Date: <YYYY-MM-DD> | Duration: <minutes> | Attendees: <name: role, ...>
Project: <one line>

### 0. Triage

<INTACT | DEGRADED with gap summary | INSUFFICIENT>. Transcription errors detected. Glossary applied: <metadata terms applied to minutes>. Note on personal content omitted, if any, without sensitive details.

### 1. Executive Summary

4 to 6 bullet points, each capturing a decision, alignment, or blocker, clear to someone who was not present. Presumed agreements appear only as "pending confirmation: ...".

### 2. Recorded Decisions (STATED only)

- **Decision:** <what was decided>
  **Provenance:** [STATED: speaker, "paraphrase"] (+ reversal note, if applicable)
  **Context:** <rationale>
  **Impact:** <what changes>

### 3. Action Items Table

| ID | Action | Assignee | Deadline | Priority | Provenance | Notes |
| --- | --- | --- | --- | --- | --- | --- |

Assignee: spoken name or [TO BE DEFINED]. Deadline: stated date in ISO; implicit date in words plus calculated ISO date when arithmetic is possible; missing, [TO BE DEFINED]. Priority: Highest, High, Medium, Low plus [CTX] or [EST], with date arithmetic in notes when [EST]. [TRACKING] for general intentions without an owner or actionable verb: Assignee and Deadline `[TO BE DEFINED]`, Priority `n/a`.

### 4. Presumed Agreements, to Confirm

- **Presumed agreement:** <what appears agreed>
  **Base:** [ASSUMED: pattern, with ~minute]
  **Confirm with:** <attendees>
  **If confirmed, becomes:** <decision | action item, for whom>

Empty section: "No presumed agreements detected."

### 5. Presumed Actions

- <task> -> follows from: decision <n> -> <natural candidate, if role in metadata indicates; otherwise "no candidate">

### 6. Open Questions

- <question or uncertainty> + provenance [STATED: speaker] | recipient (or [TO BE DEFINED]) | blocks action item <ID>?

Includes transcription gaps with possible actionable content, ambiguous retractions, unidentified speakers with commitments.

### 7. Action Items in JSON

Real action items from the table only, excluding [TRACKING] and presumed actions.

```json
[
  {
    "title": "clear and specific action description",
    "assignee": "spoken name or null",
    "priority": "Highest | High | Medium | Low",
    "dueDate": "YYYY-MM-DD or null",
    "epicLink": null,
    "labels": ["meeting-action"],
    "description": "context for assignee + provenance (speaker, ~minute) + dependencies"
  }
]
```

dueDate must be ISO 8601 or null; implicit deadlines without calculable dates go in textual description. Assignee [TO BE DEFINED] becomes null with first line of description "PENDING: assign owner before moving to In Progress". Priority matches table directly.

Import notes: (1) assignee uses spoken name; map to tracker accounts before importing; (2) epicLink: manually link to epic following import.

### 8. Self-Audit

"Self-Audit: OK" or details of corrections made.

> ⚠️ These minutes are an AI-generated draft derived from a transcript. They require attendee validation before circulating as an official record, particularly Presumed Agreements, which were not explicitly verbalized and require confirmation.

### Discovery Input

File `discovery-input.md` alongside minutes:

```md
# Discovery Input: <meeting title>

Status: draft
Azure: <ID or none>
Source: minutes at <path>

## <Speaker, role>

- <excerpt containing requirement content: stated need, capability, or constraint, with ~minute>

## Presumed Agreements (unconfirmed)

- <agreement> [ASSUMED: base]

## Gaps that discovery must close

- <what no one stated and a User Story will require>

> ⚠️ <same disclaimer as minutes>
```
