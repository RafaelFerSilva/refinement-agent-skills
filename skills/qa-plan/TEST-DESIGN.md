# Test design

Reference for `/qa-plan`: techniques that generate test conditions, silent angles that stories omit, and baseline criteria for risk, layer, and automatability that prioritize the plan.

## Derivation techniques

For each criterion, evaluate which techniques apply and derive conditions. Never force inapplicable techniques.

- **Equivalence partitioning**: classes of input or state with identical expected behavior. One condition per valid class and one per invalid class.
- **Boundary value analysis**: for every specified range, limit, or size, verify the boundary value, immediately below, and immediately above. Unspecified boundary: the existence of the boundary is `[UNDEFINED -> Question]`.
- **Decision table**: when behavior depends on combinations (rules with AND or OR, profile × state). Combinations without defined outcomes in the specification: `[UNDEFINED]`.
- **State transition**: entities with lifecycles (status changes, approval workflows). Map valid states and transitions, and derive tests for invalid transitions, where state corruption bugs typically occur. Unmentioned transition: `[UNDEFINED]`.
- **Pairwise**: three or more independent variables with multiple values where full combinatorial testing is infeasible. Propose pairwise sets and explicitly document what is excluded.
- **Negative testing**: for each specified action, test unauthorized execution, non-existent resource, duplicate execution (idempotency), malformed input. Unspecified outcome: `[UNDEFINED]`.

## Silent angles

Review all; report only applicable angles. Listing irrelevant angles creates noise that encourages teams to ignore the section. Each applicable angle generates a condition `[DERIVED: silent angle]` or a question `[UNDEFINED]`.

- **Authorization**: who cannot execute this action? Is access denial covered?
- **Sensitive data**: does data from this US appear in logs, error messages, URLs, or exports? Are regulations applicable in this context?
- **Concurrency**: two actors operating on the same resource concurrently. Which wins? Is there a lost update risk?
- **Idempotency**: does performing the same action twice (double-click, network retry) produce duplicate effects?
- **Partial failure**: multi-step operation or external system failing midway. What is the resulting state? Is it recoverable?
- **Time and timezone**: dates, deadlines, scheduling. Midnight cutoffs, client timezone versus server timezone, daylight saving time shifts.
- **Encoding**: accents, emojis, special characters in free-form text fields.

## Risk and priority

For each condition, assess probability of failure (High, Medium, Low: logic complexity, area history if provided in context, external integrations involved) and impact (High, Medium, Low: business consequence as declared in US and context, avoiding invented catastrophe scenarios).

- **P1**: automate and run on every execution cycle.
- **P2**: automate; can run in broader, spaced regression suites.
- **P3**: candidate for exploratory testing or spot verification.

Justify in half a line per condition in a list within the risk analysis section. Impact dependent on missing business information: INDETERMINATE plus question.

## Layer

The lowest-cost layer that verifies the condition with high confidence:

- **UNIT**: pure business logic, calculations, isolated validation.
- **INTEGRATION/API**: contracts between components, persistence, cross-module workflows.
- **E2E/UI**: only where user journey itself is the subject of verification: happy path of the primary journey and conditions where visual flow is the requirement.

Pushing all testing to E2E is an anti-pattern to eliminate. Conditions verifiable in lower layers belong there, with explicit rationale. Layers dependent on unknown architecture: `[LAYER TO VALIDATE WITH DEV]` with available options.

## Automatability

Impeccable Gherkin can be unautomatable. For each P1 and P2 scenario, evaluate the four blockers:

- **External dependency**: third-party service without confirmed mock, stub, or sandbox in context: `[BLOCKER: external dependency without isolation strategy]`.
- **Test data**: initial state in `Given` that exists only in production or must be generated manually: `[BLOCKER: test data provisioning]`.
- **Observability**: outcome in `Then` invisible externally: `[BLOCKER: unobservable outcome]`.
- **Time control**: scenario dependent on elapsed time, scheduling, or expiration without controllable clocks: `[BLOCKER: uncontrollable clock]`.

Scenarios with blockers do not default to manual testing: first formulate the question or action item that removes the blocker; `[MANUAL-ONLY]` is a last resort requiring explicit justification.

## Regression impact

Derived strictly from what the US and context declare regarding the existing system: touched flows, what could silently break, and which verification covers it. Without existing system context, state this and list impact questions for DEV; unfamiliar architecture triggers questions, not assumptions.

## Example matrix

Refined US: "As a financial analyst, I want to approve reimbursement requests up to $500.00, so low-value reimbursements do not depend on manager approval. AC1: Given a reimbursement request under or equal to $500.00 in 'pending' status, When the analyst approves, Then status changes to 'approved' and requester is notified. AC2: Given a request exceeding $500.00, When the analyst attempts to approve, Then system blocks action and indicates manager approval is required."

| # | Condition | Origin | Expected Result | Priority | Layer |
| --- | --- | --- | --- | --- | --- |
| 1 | Approve pending request for $499.99 | [SPECIFIED: AC1] | Status 'approved' and notification sent | P1 | INTEGRATION/API |
| 2 | Approve request for exactly $500.00 | [DERIVED: boundary value] | Status 'approved' (AC1 states "up to", inclusive) | P1 | INTEGRATION/API |
| 3 | Attempt approving $500.01 | [DERIVED: boundary value] | Blocked with manager message [SPECIFIED: AC2] | P1 | INTEGRATION/API |
| 4 | Approve request for $0.00 | [DERIVED: boundary value] | [UNDEFINED -> Question 1] | P2 | INTEGRATION/API |
| 5 | Attempt approving already 'approved' request | [DERIVED: state transition] | [UNDEFINED -> Question 2] | P1 | INTEGRATION/API |
| 6 | User without analyst role attempts approval | [DERIVED: silent angle, authorization] | [UNDEFINED -> Question 3] | P1 | INTEGRATION/API |
| 7 | Notification delivery fails after status change | [DERIVED: silent angle, partial failure] | [UNDEFINED -> Question 4] | P2 | [LAYER TO VALIDATE WITH DEV: synchronous or asynchronous] |
| 8 | Complete journey: analyst locates, approves, sees confirmation | [SPECIFIED: narrative] | Workflow concludes with status and notification from AC1 | P1 | E2E |

Questions: 1. [PO] Can a request for $0.00 or negative value exist and be approved? 2. [PO] What happens when attempting to approve a request not in 'pending' status? Condition 5 is P1 due to duplicate payment risk. 3. [PO] Can any other role approve up to $500? 4. [DEV] Is notification synchronous or asynchronous? If delivery fails, does approval persist?
