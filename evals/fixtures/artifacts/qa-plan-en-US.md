# QA Plan: 318 close speed alert

Status: PARTIAL
Azure: 318
Source: .scratch/318-close-alert/spec.md, /qa-plan session on 2026-04-21

## Testability Triage

TESTABLE WITH RESERVATIONS: outcomes have observation points, notification delivery depends on unconfirmed architecture.

## Test Conditions Matrix

| # | Condition | Origin | Expected Result | Priority | Layer |
| --- | --- | --- | --- | --- | --- |
| 1 | Close an active alert with a justification | [SPECIFIED: AC1] | Status becomes 'closed' and justification is persisted | P1 | INTEGRATION/API |
| 2 | Close an alert with an empty justification | [DERIVED: equivalence partitioning] | Action blocked with validation message [SPECIFIED: AC2] | P1 | INTEGRATION/API |
| 3 | Close an already closed alert | [DERIVED: state transition] | [UNDEFINED -> Question 1] | P1 | INTEGRATION/API |
| 4 | Operator without dispatch role closes an alert | [DERIVED: silent angle, authorization] | [UNDEFINED -> Question 2] | P1 | INTEGRATION/API |
| 5 | Two operators close the same alert concurrently | [DERIVED: silent angle, concurrency] | [UNDEFINED -> Question 3] | P2 | INTEGRATION/API |

## Risk Analysis

P1: 4, P2: 1, P3: 0. Highest risk sits on conditions 3 and 5: both can corrupt alert state.

Condition rationales: `#1`: primary journey. `#3`: duplicate closure risk. `#5`: lost update risk.

## P1 Scenarios in Gherkin

Scenario: operator closes an active alert
  Given alert AL-77 is active for vehicle PLT-1023
  When the operator closes it with the justification "maintenance route"
  Then the alert status becomes 'closed'
  And the justification is stored with the operator identifier

## Automatability Audit

Condition 5 needs concurrent request control: [BLOCKER: test data provisioning] until a seeded alert fixture exists. Action: ask DEV for a fixture endpoint.

## Regression Impact

The alert panel listing filters by status, so closure affects panel counters. Verification: condition 1 plus the existing panel listing suite.

## Examination Decisions

- Is a justification mandatory? -> yes, free text, minimum one character (PO, 2026-04-21)

## Open Questions

1. [PO] What happens when closing an alert that is already closed? -> unblocks #3 (questionnaire: none)
2. [PO] Which roles besides dispatch operator can close an alert? -> unblocks #4 (questionnaire: none)
3. [DEV] Is there a lock on alert closure? -> unblocks #5, and settles its layer (questionnaire: questionnaire-dev.md)

## Coverage Verdict

🔶 PARTIALLY EXECUTABLE: P1 conditions 1 and 2 executable; conditions 3, 4 await questions 1, 2 and condition 5 awaits blocker removal.

> ⚠️ This output provides the analytical baseline for a test plan, not the final test plan. Decisions on coverage, prioritization, and effort belong to the QA team, with validation from PO (undefined behaviors) and Dev (architecture and layers).
