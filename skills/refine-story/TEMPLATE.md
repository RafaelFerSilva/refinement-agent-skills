# <ID or short title>: As a <role>, I want <capability>

Status: <READY | REFINE | BLOCKED>
Azure: <work item ID or none>
Source: <path, ID, or "pasted text">, /refine-story session on <YYYY-MM-DD>

## Narrative

As a <role>, I want <capability>, so that <verifiable outcome>.

## INVEST Scorecard

| Criterion | Result | Rationale (when not PASS) |
| --- | --- | --- |
| Independent | PASS | |
| Negotiable | | |
| Valuable | | |
| Estimable | | |
| Small | | |
| Testable | | |

## Acceptance Criteria

Scenario: <happy path>
  Given <state>
  When <event>
  Then <verifiable outcome>

Scenario: <edge case>
  Given <state>
  When <event>
  Then <verifiable outcome>

## Original Text Audit

- Narrative: <original> -> <problem> -> <proposed version>
- AC1: BEFORE <text> -> AFTER <scenario> (<violation corrected>)
- Moved: <criterion that was a task, DoD, or orphan> -> <destination>
- Anti-patterns: <type> in <excerpt>

## Examination Decisions

- <question> -> <PO answer> (<who>, <date>)

## Open Questions

1. [<recipient>] <question> -> <impact if unanswered> (questionnaire: <path or none>)

## Notes

- Solutions suggested by PO, preserved as reference: <...>
- Suggested technical tasks, moved from criteria: <...>
- Story points: <team points, if any> [ESTIMATE AT RISK: <gap>] | [CALIBRATE IN PLANNING] <context for team>
- Dependencies: <declared> + <detected [INFERENCE: base]>

## Decomposition Proposal

<only when [DECOMPOSE] or double requirement exists: narrative for each part, mapping of original criteria, which part bears dependencies>

## Verdict

<✅ READY | 🔶 REFINE, unblocks with questions <n>, <m> | ⛔ BLOCKED: <rationale>>

> ⚠️ This output is preparation for refinement, not a replacement. Decisions on scope, value, and priority belong strictly to the PO and team.

## Section names in pt-BR

Not part of the artifact. When `Language: pt-BR`, the headings above are written in this form, so that a later workflow reading this artifact finds the section it expects:

| Heading (en-US, default) | Heading (pt-BR) |
| --- | --- |
| Narrative | Narrativa |
| INVEST Scorecard | Scorecard INVEST |
| Acceptance Criteria | Critérios de aceite |
| Original Text Audit | Auditoria do texto original |
| Examination Decisions | Decisões da sabatina |
| Open Questions | Perguntas em aberto |
| Notes | Notas |
| Decomposition Proposal | Proposta de decomposição |
| Verdict | Veredito |
