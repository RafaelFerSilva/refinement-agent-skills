# US-318: Close a speed alert

Status: READY
Azure: 318

## Narrative

As a dispatch operator, I want to close a speed alert stating the reason, so that alerts already handled leave the active dispatch queue.

## Acceptance Criteria

Scenario: closing an active alert
  Given a speed alert in "active" state in the dispatch operator queue
  When the operator closes the alert stating a reason from the list (driver contacted, false positive, vehicle stopped)
  Then the alert moves to "closed" state
  And the system records the reason, the operator, and the closing time

Scenario: closing without a reason
  Given a speed alert in "active" state
  When the operator attempts to close the alert without stating a reason
  Then the alert remains "active"
  And the system states that the reason is mandatory
