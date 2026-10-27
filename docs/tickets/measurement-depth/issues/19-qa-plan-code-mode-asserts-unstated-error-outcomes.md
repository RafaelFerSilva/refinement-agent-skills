# 19: In com-codigo mode, qa-plan asserts unstated error outcomes from code under [DERIVED]

Status: needs-triage
Blocked by: none
Type: task
Origin: 2026-10-27 (commit d869494)

Found by the `com-codigo` measurement of ticket 08 (`evals/qa-plan.json` case 4, over `evals/fixtures/us-318-close-alert.md` and `evals/fixtures/code-workspace/*`). Five of the six assertions hold at 5 of 5; the sixth holds at 0 of 5:

```
NOT HELD 0/5  Unstated input-rejection and negative-testing outcomes in us-318-close-alert.md (closing with an unlisted or unnormalized reason, where alert-service.ts returns 400 'Unsupported close reason', and closing a non-existent alert identifier, where alert-service.ts returns 404 'Alert not found') remain [UNDEFINED -> Question n] rather than being asserted as settled expected results from code under [DERIVED: ...]  (failed in run-1, run-2, run-3, run-4, run-5)
```

Literal `[SPECIFIED]` held in all five runs, and lifecycle, concurrency, retry, role authorization, `'geofence'` scope, `Operational report`, and retroactive `Reading` gaps stayed `[UNDEFINED -> Question n]` addressed to `PO` in all five runs. Yet on input-rejection and missing-resource conditions that `us-318-close-alert.md` leaves equally unstated, and that `sem-codigo` case 1 kept as `[UNDEFINED -> Question n]` for `PO`, the `com-codigo` runs asserted settled expected results read from `evals/fixtures/code-workspace/alert-service.ts` under `[DERIVED: ...]`:

- **Non-existent valid UUID (`404 'Alert not found'`, `alert-service.ts:63-65`):** 5 of 5 runs asserted `404 'Alert not found'` as the Expected Result under `[DERIVED: negative testing]`, whereas `sem-codigo` case 1 kept it as `[UNDEFINED -> Question 7]` (`[PO]`).
- **Unlisted close reason (`400 'Unsupported close reason'`, `alert-service.ts:10,53-55`):** 4 of 5 runs (`run-1`, `run-3`, `run-4`, `run-5`; only `run-2` `#12` asked `PO` in `Question 4`, matching `sem-codigo` case 1 `#4`) asserted `400 'Unsupported close reason'` as the Expected Result under `[DERIVED: equivalence partitioning]`.
- **Miscased or untrimmed listed close reason (`"False positive"`, `" false positive "`, `" driver contacted "`):** `us-318-close-alert.md:14` states the three allowed reasons without defining case sensitivity or surrounding-whitespace normalization (`alert-service.ts:50` trims for emptiness while `:53` checks `CLOSE_REASONS` untrimmed and case-sensitively). `run-2` (`#13`) asked `PO` in `Question 4` and `run-1` and `run-4` omitted a separate formatting row, while 2 of 5 runs (`run-3` `#6` and `run-5` `#5`) asserted settled `400 'Unsupported close reason'` rejections directly from `alert-service.ts:53-55`, with `run-3:30,44` also inserting `[INFERENCE: ... alert-service.ts:...]` inside Expected Result outside `skills/qa-plan/SKILL.md:18-24`.

`skills/qa-plan/SKILL.md` points both ways at once. In the three-layer boundary, `SKILL.md:21` states that under `[DERIVED: technique]`, *"Expected results may only be asserted if they follow logically from the specification"*, `SKILL.md:24` states *"an outcome nobody wrote is `[UNDEFINED -> Question n]` however obvious it looks"*, and `skills/qa-plan/TEST-DESIGN.md:14` states under **Negative testing** (*"unauthorized execution, non-existent resource, duplicate execution (idempotency), malformed input"*): *"Unspecified outcome: `[UNDEFINED]`."* Then Step 4 (`SKILL.md:45`) places `API error response` under `DEV` and instructs `com-codigo`: *"In code mode, dispatch a subagent to answer DEV questions by reading code ... A found fact becomes an expected result or defined layer, with source citation."* Reading `alert-service.ts` under Step 4 therefore promotes code-only `400`/`404` behavior into Expected Result cells without ever touching `[SPECIFIED]`.

## Evidence

- `node scripts/aggregate-runs.mjs refinement-skills-workspace/code-mode-qa-plan-4-en-US`, recorded in `docs/tickets/measurement-depth/issues/08-code-mode-case-qa-plan.md`.
- `refinement-skills-workspace/code-mode-qa-plan-4-en-US/with_skill/run-{1..5}/outputs/response.md` (`run-1` `#5`, `#8`; `run-2` `#12`, `#13`, `#18`; `run-3` `#6`, `#15`; `run-4` `#5`, `#6`; `run-5` `#5`, `#6`), contrasted with `refinement-skills-workspace/iteration-10/qa-plan-1-en-US/with_skill/outputs/response.md` (`#4`, `#14`).
- `skills/qa-plan/SKILL.md:20-24,45` and `skills/qa-plan/TEST-DESIGN.md:9,14`.

## What a fix has to decide

Whether code in `Mode: com-codigo` may ever supply an Expected Result that the specification did not state, or only ground how a specified outcome is observed and tested:

- **Strict boundary (`code grounds observation and layer, never an unstated outcome`):** narrow `skills/qa-plan/SKILL.md:45` so a code fact settles testing layers, observation points on already-specified outcomes (such as how AC2's mandatory-reason rejection is surfaced at `alert-service.ts:50-52`), automation blockers, and regression impact, while any unstated outcome (missing resource, unlisted reason message, or casing/whitespace normalization) stays `[UNDEFINED -> Question n]` with the code behavior offered only as context or a recommendation base.
- **Explicit `API error response` carve-out for technical transport contracts:** allow `com-codigo` to settle technical status/payload mappings (`404` on a non-existent UUID, or `400` when rejection itself already follows logically from a closed specification list) with a code citation, while keeping input-acceptance rules that decide whether an action succeeds or fails (such as `"False positive"` or `" driver contacted "`) strictly `[UNDEFINED -> Question n]` for `PO`. Taking this path requires reconciling `SKILL.md:21-24`, `TEST-DESIGN.md:14`, and assertion 6 of `evals/qa-plan.json` case 4 so all three state the same boundary.
