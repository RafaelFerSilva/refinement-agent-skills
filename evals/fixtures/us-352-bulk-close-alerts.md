# US-352: Bulk-close active alerts of a vehicle

Status: open
Azure: 352

As a user, I want to close all active alerts of a vehicle in one action after handling an incident, so that repeated alerts from the same trip stop cluttering the queue.

Acceptance criteria:

- AC1: The user selects a vehicle in the queue and closes all of its active alerts at once, recording a reason.
- AC2: If an alert of that vehicle was already closed by another operator, the existing closure lock rejects the batch and preserves the original closure.
- AC3: Add a bulk-close endpoint on the alerts service and migrate the alerts table if closure metadata is missing.
