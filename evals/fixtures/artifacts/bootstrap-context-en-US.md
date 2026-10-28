# Product Overview: RouteWise Fleet

Status: PARTIAL
Source: evals/fixtures/legacy-fleet-manual.md, /bootstrap-context session on 2026-10-28

## Triage

PARTIAL SOURCES: legacy operator manual covers roles, telemetry ingestion, and speed alerts, while external ERP sync retry limits lack written specification.

## Product Purpose

RouteWise monitors commercial fleet telemetry to detect speed violations and coordinate dispatch responses across active routes [INFERENCE: evals/fixtures/legacy-fleet-manual.md].

## Roles and Permissions

| Role | Responsibility | Access or constraint | Provenance |
| --- | --- | --- | --- |
| Dispatch operator | Monitors live alerts and contacts drivers on active routes | Views and acknowledges alerts for assigned regional depot only | PO decision (2026-10-28) |
| Fleet manager | Configures route speed tolerances and reviews operational reports | Full read/write on route thresholds across all depots | [INFERENCE: evals/fixtures/legacy-fleet-manual.md] |

## Production Modules

| Module or capability | Current behavior | Provenance |
| --- | --- | --- |
| Telemetry ingestion | Receives vehicle position and speed readings every 30 seconds, including retroactive readings after signal loss | [INFERENCE: evals/fixtures/legacy-fleet-manual.md] |
| Speed alert evaluation | Creates an alert when a reading exceeds route limit plus configured tolerance | [INFERENCE: evals/fixtures/legacy-fleet-manual.md] |
| Operational reporting | Exports daily reading summaries per depot in CSV format | PO decision (2026-10-28) |

## Active Integrations

| External system | Direction and purpose | Known SLA or constraint | Provenance |
| --- | --- | --- | --- |
| TeleTrack gateway | Inbound vehicle GPS and speed feed over HTTPS webhook | Batch replay upon reconnection; max payload size [TO CONFIRM: DEV] | [INFERENCE: evals/fixtures/legacy-fleet-manual.md] |
| ERP billing sync | Outbound daily mileage summary | Availability and retry policy [TO CONFIRM: DEV] | [UNMAPPED DEPENDENCY] |

## Cross-Cutting Rules and SLAs

- Vehicle telemetry retention is 90 days in active storage [INFERENCE: evals/fixtures/legacy-fleet-manual.md].
- Retroactive readings carry original vehicle capture timestamps rather than server arrival timestamps (PO decision, 2026-10-28).
- Maximum TeleTrack replay batch size and ERP retry window remain [TO CONFIRM: DEV].

## Source Conflicts Resolved

- "Account" vs. "Depot" in legacy manual -> canonical term is Regional depot (`CONTEXT.md`); "Account" added under `_Avoid_` (PO, 2026-10-28).
- "Driver alert" vs. "Speed alert" -> alerts notify the dispatch operator, never the vehicle cabin directly (PO, 2026-10-28).

## Examination Decisions

- Who receives speed alerts in production today? -> Dispatch operator only; fleet managers review operational reports asynchronously (PO, 2026-10-28).
- Is ERP billing sync active in all depots? -> Active only for contracted freight routes, technical retry behavior routed to engineering (PO, 2026-10-28).

## Open Questions

1. [DEV] What is the maximum batch size accepted on TeleTrack reconnection webhooks? -> sizes edge cases for alert flood stories (questionnaire: questionnaire-dev.md)
2. [DEV] Does ERP billing sync retry failed daily exports automatically or require manual trigger? -> determines failure handling for mileage stories (questionnaire: questionnaire-dev.md)

## Verdict

🔶 PARTIAL, unblocks with questions 1, 2

> ⚠️ This output is an analytical baseline of product context, not a replacement for team validation. Decisions on domain vocabulary, active rules, and scope belong strictly to the PO and team.
