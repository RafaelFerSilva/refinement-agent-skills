# 07: Eval case for refine-story in mode com-codigo

Status: resolved
Blocked by: 06
Type: task
Origin: 2026-10-25 (commit 81547f6)

With a repository to read, measure the behavior the mode exists for: a fact found in code becomes a recommended answer citing the source file, not a question to the Product Owner.

The case asserts the difference from `sem-codigo` rather than repeating what that mode already covers: the fact that the code answers is not asked; the citation names the source file; a fact the code contradicts enters the round as a question rather than being resolved unilaterally, which is what `socratic-examination` requires; and the architecture questions that in `sem-codigo` go to a questionnaire are answered here.

## Acceptance criteria

- A case in `evals/refine-story.json` runs with the `com-codigo` configuration fixture.
- Its assertions cover: a code-sourced fact appearing as a recommendation with a file citation, that same fact not being asked of the PO, a contradiction between code and User Story entering the round as a question, and architectural facts inspectable in the codebase being answered from code with a file citation rather than routed to the engineering team.
- The case is run and its result recorded, over the number of runs ticket 04 sets.

## Comments

- 2026-10-27 Preflight (commit c303fe6): adjusted
  - Docs: `CONTEXT.md:9-11,51-61,99-101` defines User Story (`_Avoid_: card, item, task, story`), Fact, Recommended answer and Mode (`com-codigo` vs `sem-codigo`), and `docs/agents/build-domain.md` separates a repository ticket under `docs/tickets/` from a User Story refined by the package; `AGENTS.md` Invariants (no em-dash or en-dash), Writing style and Definition of Done apply; `docs/adr/0001-pacote-instalavel-com-dois-modos.md` defines the `com-codigo` branch where the agent inspects product code before asking, and `docs/adr/0005-what-pt-br-localizes.md` keeps `com-codigo` canonical; `evals/README.md:25-31` (from ticket 04) sets 5 runs and an 80% per-assertion threshold (4 of 5) for cases whose assertions are read-judged, and `evals/README.md:68` documents preserving `evals/fixtures/code-workspace/` inside isolated run copies; `docs/agents/harness.md` records what `scripts/validate-skills.mjs` checks on `com-codigo` cases and leaves behavioral measurement to this ticket; the rules under measurement live in `skills/refine-story/SKILL.md:31,34`, `skills/socratic-examination/SKILL.md:46,59`, and `evals/fixtures/refinement-with-code-en-US.md:10,18`.
  - Package: `Blocked by: 06` is resolved at `c303fe6`, with `evals/fixtures/refinement-with-code-en-US.md` and the four files of `evals/fixtures/code-workspace/` (`schema.sql`, `alert-evaluator.ts`, `alert-service.ts`, `operational-report.ts`) in place and guarded by `scripts/validate-skills.mjs:138-190`: confirmed. `evals/refine-story.json` holds four cases (1 to 4), all on `refinement-no-code-*`: confirmed. `git log 81547f6..HEAD` added `f383f39` (`socratic-examination` sweeps glossary constraints on touched concepts into the frontier) and `c303fe6` (ticket 06). Changed (1): line 10 said "the citation names file and line", whereas `skills/refine-story/SKILL.md:31` and `skills/socratic-examination/SKILL.md:46` require "citing the source", `skills/configure-refinement/refinement.md:11` and `evals/fixtures/refinement-with-code-en-US.md:10` require "citing the source file", and criterion 2 itself says "with a file citation"; following ticket 16 (do not fail an output for a rule no skill states), line 10 is adjusted to "the citation names the source file", while the measurement comment will still record how many runs also include line numbers. Changed (2): criterion 2 said "ticket" for the input requirement (`docs/agents/build-domain.md` reserves that word for `docs/tickets/`) and omitted the fourth clause of line 10 (architectural facts answered from code with a file citation rather than routed to the engineering team); criterion 2 is adjusted to say "User Story" and include that fourth clause. On `us-245-silence-alerts.md`, as ticket 06 recorded, AC2 moves to technical notes without a PO question and no business claim contradicts `code-workspace/`, so a dedicated RouteWise User Story fixture (`evals/fixtures/us-352-bulk-close-alerts.md`) is added to exercise code-grounded recommendations, suppressed factual questions, a contradiction between code and User Story (`alert-service.ts:56-62` has no closure lock), and code-answered schema/architecture facts (`schema.sql:21-33`).
  - Reproduction: not applicable; this ticket adds and measures a missing `com-codigo` eval case across 5 runs rather than fixing a claimed defect.
  - Criteria: 2 still hold, 0 already satisfied, 1 needs changing (adjusted above).
  - Conflicts: none; nothing under `skills/` is edited, so `prompts/`, `plugin.json`, `README.md`, and `which-flow` are untouched.
- 2026-10-27 Implemented and measured.
  - Added `evals/fixtures/us-352-bulk-close-alerts.md` (`US-352: Bulk-close active alerts of a vehicle`) and case 5 in `evals/refine-story.json`, paired with `evals/fixtures/refinement-with-code-en-US.md`, `evals/fixtures/CONTEXT-fleet.md`, and the four files of `evals/fixtures/code-workspace/`. The User Story leaves the role as "user", requires recording a reason, claims in AC2 that "the existing closure lock rejects the batch", and mixes an endpoint and conditional schema migration task into AC3.
  - Measured end to end over 5 independent `with_skill` sessions (`refinement-skills-workspace/code-mode-refine-story-5-en-US/with_skill/run-{1..5}/`), per the 5-run / 80% convention in `evals/README.md` for read-judged cases. Each session ran against its own isolated workspace copy preserving `evals/fixtures/code-workspace/*` and dispatched a read-only codebase subagent per `skills/refine-story/SKILL.md:31`. Transcript audit across all 10 conversations (5 parent sessions and 5 codebase subagents) confirmed zero reads outside `skills/` and each run's workspace, `.scratch/` absent after Round 1, and `CONTEXT.md` and `us-352-bulk-close-alerts.md` untouched. An independent grading pass verified every cited file and line against `code-workspace/` and wrote `grading.json` per run in the viewer `{expectations, summary}` shape.

```
node scripts/aggregate-runs.mjs refinement-skills-workspace/code-mode-refine-story-5-en-US
case: code-mode-refine-story-5-en-US, 5 runs, threshold 80%

  run-1: 5/5  100%
  run-2: 5/5  100%
  run-3: 5/5  100%
  run-4: 5/5  100%
  run-5: 5/5  100%

HELD     5/5  The response classifies the US as ANALYZABLE before any question and ends the first round in the ❓ Q<n> format waiting for the PO
HELD     5/5  At least one question carries a **Recommendation:** grounded on a fact read from evals/fixtures/code-workspace/ (such as CLOSE_REASONS or the dispatch_operator check in alert-service.ts, or alert_type in schema.sql) with a citation naming that source file
HELD     5/5  No question asks the PO to supply a fact that evals/fixtures/code-workspace/ already defines (such as what close reasons exist today, what alert types or statuses exist, which role closeAlert requires today, or whether a closure lock is implemented)
HELD     5/5  A question in the round surfaces the contradiction between AC2's claim of an existing closure lock and alert-service.ts (where closeAlert updates WHERE id = $1 with no lock and no status = 'active' guard), citing alert-service.ts rather than resolving the behavior unilaterally
HELD     5/5  Architectural facts inspectable in evals/fixtures/code-workspace/ (such as whether the alerts table already has closure metadata columns in schema.sql and how closeAlert persists closures in alert-service.ts) are answered from code citing the source file rather than routed as open questions to the engineering team

held: 5/5 assertions at or above 80%, pass rate over runs 100%
```

  - Behavioral observations across the 5 runs: (1) although the assertion requires naming the source file (matching `skills/configure-refinement/refinement.md:11`), 5 of 5 runs also cited verified line numbers alongside the file path (4 in prose, 1 via `#L<start>-L<end>` file anchors); (2) on AC2's closure-lock contradiction against `alert-service.ts:56-62`, runs 2, 3, and 4 gave `no recommendation` with two options while runs 1 and 5 recommended snapshot batch rejection `[INFERENCE: ...]` and still presented the alternative option waiting for the PO; (3) all 5 runs moved AC3 out of acceptance criteria, verified from `schema.sql:29-32` that `close_reason`, `closed_by`, and `closed_at` already exist so no closure-metadata migration is needed, and routed only genuine post-decision implementation choices (`409` in `ServiceResult<T>`, atomic CTE versus transaction support, indexing) to engineering; (4) all 5 runs also surfaced the retroactive `Reading` edge case from `CONTEXT.md` and `alert-evaluator.ts:25-49`, showing `f383f39` composes cleanly with `Mode: com-codigo`. The per-run files live in the git-ignored workspace tree, so the aggregate is quoted above.
  - What this result does and does not establish: Round 1 of `refine-story` in `Mode: com-codigo` holds at 5 of 5 in `en-US`. It does not measure a `no_skill` baseline on this case, sessions driven to synthesis in `com-codigo`, `pt-BR` in `com-codigo`, or `qa-plan` in `com-codigo` (ticket 08).
  - Review findings applied: corrected the `skills/configure-refinement/refinement.md` citation from `:12` to `:11`; replaced `without_skill`, `code-versus-story`, and `multi-turn` with canonical `no_skill`, `User Story`, and `sessions driven to synthesis`; and tightened assertion 5 so architectural facts resolved from code also require citing the source file (`schema.sql` / `alert-service.ts`), verified against all 5 existing runs and re-aggregated.
