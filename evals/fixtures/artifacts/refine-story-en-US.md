# 245: As a dispatch operator, I want to silence speed alerts

Status: REFINE
Azure: 245
Source: .scratch/245-silence-alerts/us.md, /refine-story session on 2026-04-20

## Narrative

As a dispatch operator, I want to silence speed alerts for a vehicle, so that recurring alerts from a known maintenance route stop hiding new events.

## INVEST Scorecard

| Criterion | Result | Rationale (when not PASS) |
| --- | --- | --- |
| Independent | PASS | |
| Negotiable | PASS | |
| Valuable | PASS | |
| Estimable | INDETERMINATE | depends on question 1 |
| Small | PASS | |
| Testable | INDETERMINATE | silencing window undefined |

## Acceptance Criteria

Scenario: operator silences alerts for a vehicle
  Given vehicle PLT-1023 has an active speed alert
  When the operator confirms silencing for the vehicle
  Then the vehicle stops producing speed alerts for the silencing window
  And the alert panel shows the vehicle as silenced

Scenario: silencing window expires
  Given vehicle PLT-1023 is silenced
  When the silencing window reaches its end
  Then the vehicle produces speed alerts again

## Original Text Audit

- AC1: BEFORE "button must work properly" -> AFTER scenario above (unverifiable outcome corrected)
- Moved: "create silencing service on backend" -> suggested technical tasks
- Anti-patterns: [ANTI-PATTERN: unverifiable outcome] in "in a simple way"

## Examination Decisions

- Who silences? -> dispatch operator (PO, 2026-04-20)

## Open Questions

1. [PO] What is the maximum silencing window in minutes? -> without it the window is untestable (questionnaire: none)
2. [DEV] Does an alert arriving during the window get discarded or queued? -> defines expected state after expiry (questionnaire: questionnaire-dev.md)

## Notes

- Story points: [CALIBRATE IN PLANNING] window rules still open
- Dependencies: telemetry ingestion [INFERENCE: alerts derive from telemetry per CONTEXT.md]

## Verdict

🔶 REFINE, unblocks with questions 1, 2

> ⚠️ This output is preparation for refinement, not a replacement. Decisions on scope, value, and priority belong strictly to the PO and team.
