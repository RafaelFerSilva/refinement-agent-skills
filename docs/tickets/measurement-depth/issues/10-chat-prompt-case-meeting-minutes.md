# 10: Eval case against the generated chat prompt for synthesis

Status: resolved
Blocked by: 09
Type: task
Origin: 2026-10-25 (commit 81547f6)

The adaptation rules bite hardest where a workflow publishes files. `meeting-minutes` writes minutes, a discovery input and one questionnaire per recipient, and in the chat version all of that has to arrive in the response, each artifact in its own block named for the file it would have been.

This is also the only chat case where the mechanical grader applies: the minutes delivered in a block can be saved and graded like any published artifact.

## Acceptance criteria

- A case in `evals/meeting-minutes.json` declares `prompts/meeting-minutes.md` as its instruction rather than the skill, with the `transcript-fleet-project.md` fixture content inline and no workspace configuration fixture.
- Its assertions cover: every artifact required by the transcript delivered in its own titled block (the minutes, `discovery-input.md`, and one `questionnaire-<recipient>.md` block per recipient), the `/requirements-discovery` handoff, the self-audit present, core synthesis fidelity on the transcript, and no path under `.scratch/` or on disk claimed as written (with no mention of `/configure-refinement`, operating modes, or subagents, and no reference to repository workspace paths such as `.scratch/`, `docs/agents/refinement.md`, `docs/`, or `CONTEXT.md`).
- Over the 5-run / 80% threshold convention in `evals/README.md`, the delivered minutes of each run are saved and graded with `scripts/grade-output.mjs`, and the aggregated result is recorded.

## Comments

- 2026-10-27 Preflight (commit 6effb0d): adjusted
  - Docs: `CONTEXT.md:33-35,63-65,69-83,91-109` defines Minutes (`_Avoid_: summary, digest`), Questionnaire (`_Avoid_: form, list of questions`), Inference, Invention, Marker (`_Avoid_: tag, flag, annotation`), Gap, Workflow, Workspace, Mode (`com-codigo` vs `sem-codigo`), Language (`en-US` default), and Tracker (`.scratch/`); `AGENTS.md` Invariants (no em-dash or en-dash; `prompts/` generated via `scripts/build-prompts.mjs` and never edited manually), Writing style, and Definition of Done apply; `docs/adr/0001-pacote-instalavel-com-dois-modos.md:3,5-9,12` records the chat-prompt origin and `sem-codigo` fallback when `refinement.md` is absent, `docs/adr/0002-sabatina-no-lugar-de-oraculo.md:7` establishes `/meeting-minutes` as synthesis without socratic examination with presumed agreements routed via questionnaires, and `docs/adr/0004-canonical-english-with-pt-br-localization.md:9,16` plus `docs/adr/0005-what-pt-br-localizes.md:9,15` set `en-US` as default and keep `Highest, High, Medium, Low`, `Status:`, and `Azure:` canonical; `docs/tickets/measurement-depth/spec.md:16,22,30,35` keeps `scripts/grade-output.mjs` and `evals/*.json` as the sole grading seams; `evals/README.md:9-17,25-31,40,69,92` sets 5 runs and an 80% per-assertion threshold (4 of 5) for cases carrying read-judged assertions, places chat runs under `<case>/with_prompt/run-<n>/`, and evaluates syntheses by `grade-output.mjs` plus the case assertions; `docs/agents/harness.md:14,20,27,39-55,61-63` documents `prompts/<flow>.md` generation, validator checks on chat-prompt cases in `evals/*.json`, the 21 checks `meeting-minutes-en-US` draws in `grade-output.mjs`, and what remains read-judged; the prompt under test is `prompts/meeting-minutes.md`, built by `scripts/build-prompts.mjs:22-81,83-95,105-109,138-146` from `skills/meeting-minutes/SKILL.md`, `skills/meeting-minutes/RULES.md`, `skills/meeting-minutes/TEMPLATE.md`, `skills/requirements-rigor/SKILL.md`, `skills/requirements-rigor/ANTI-PATTERNS.md`, and `skills/requirements-rigor/QUESTIONNAIRE.md`.
  - Package: `Blocked by: 09` is resolved at `6effb0d`, which also added chat-prompt case validation in `scripts/validate-skills.mjs:173-190` and documented the shape in `evals/README.md:9,40,69` and `docs/agents/harness.md:20,27`: confirmed. `evals/meeting-minutes.json:4-58` holds three skill cases (1 full `en-US`, 2 actions mode `en-US`, 3 full `pt-BR`), with case 1 (`:4-24`) running `evals/fixtures/transcript-fleet-project.md` (`:1-21`, which embeds its own `Glossary: telemetry` line at `:11`) in `en-US` `sem-codigo` and producing four files (`minutes.md`, `discovery-input.md`, `questionnaire-carlos.md`, and `questionnaire-marcus.md`) across all three `with_skill` runs of ticket 05: confirmed. Because `refine-story` stops at Round 1 in ticket 09, `prompts/meeting-minutes.md` is the only chat case in the suite that synthesizes an artifact in one response for `scripts/grade-output.mjs` (`:285-317`, 21 checks in full `en-US` mode): confirmed. `git log 81547f6..HEAD -- prompts/meeting-minutes.md skills/meeting-minutes/ scripts/build-prompts.mjs` shows only `3f27e68` (`requirements-rigor` `Then` inference placement). Inspection of `prompts/meeting-minutes.md` shows two adaptation details worth watching during measurement: (1) `scripts/build-prompts.mjs:57` replaces `.scratch/<project>-<YYYY-MM-DD>/minutes.md` with `"the minutes were delivered in the response"`, so `discovery-input.md` (`:51,429`) and `questionnaire-<recipient>.md` (`:273`) appear literally in `prompts/meeting-minutes.md` while the literal filename `minutes.md` does not, and `minutes` embeds an inner ```` ```json ```` block in section 7 (`:403-415`) that can collide with an outer triple-backtick chat block unless fenced with four backticks, tildes, or headings; (2) because `skills/meeting-minutes/SKILL.md` has no `## Before starting` section for `dropSection` to strip, `prompts/meeting-minutes.md` retains unadapted references to `docs/agents/refinement.md` (`:36,85`), `CONTEXT.md` (`:36,70,115`), `in code mode` (`:83`), `alongside minutes` / `alongside the generating artifact` (`:51,207,273,429`), and `Source: minutes at <path>` (`:436`), all governed at runtime by `# Chat mode` (`:3-15`). Changed (1): Criterion 1 is adjusted to name `evals/meeting-minutes.json`, `prompts/meeting-minutes.md`, and inline `transcript-fleet-project.md` with no workspace configuration fixture (`scripts/validate-skills.mjs:173-190`). Changed (2): Criterion 2 specifies the artifacts expected for `transcript-fleet-project.md` (minutes, `discovery-input.md`, and one `questionnaire-<recipient>.md` block per recipient), `/requirements-discovery` routing, chat-mode isolation beyond `.scratch/` (per `spec.md:30` and `evals/refine-story.json` case 6), and case 1 synthesis fidelity. Changed (3): Criterion 3 names the 5-run / 80% threshold convention added in ticket 04 (`d51bde6`, `evals/README.md:28-31`) for cases combining read-judged assertions with `scripts/grade-output.mjs`.
  - Reproduction: not applicable before adding the case; this ticket adds and measures the chat-prompt synthesis case across 5 runs, and any adaptation defect surfaced by the measurement will be recorded and filed rather than edited in `scripts/build-prompts.mjs` or `skills/` beforehand.
  - Criteria: 0 still hold verbatim, 0 already satisfied, 3 need changing (adjusted above).
  - Conflicts: none; chat-prompt case validation in `scripts/validate-skills.mjs:173-190`, `evals/README.md`, and `docs/agents/harness.md` already landed in ticket 09 (`6effb0d`), and nothing under `skills/` is edited, leaving `prompts/`, `plugin.json`, `README.md`, and `which-flow` untouched.
- 2026-10-27 Implemented and measured.
  - Added case 4 in `evals/meeting-minutes.json` declaring `files: ["prompts/meeting-minutes.md"]` and pasting `evals/fixtures/transcript-fleet-project.md` verbatim inside `prompt` with no workspace configuration fixture, forming the standalone chat-prompt synthesis counterpart to skill case 1.
  - Measured over 5 independent chat-prompt runs (`refinement-skills-workspace/chat-prompt-meeting-minutes-4-en-US/with_prompt/run-{1..5}/`), per the 5-run / 80% convention in `evals/README.md:28-31` for cases carrying read-judged assertions alongside `scripts/grade-output.mjs`. Each run executed as an isolated subagent with write, subagent, and MCP tools disabled, receiving the verbatim `prompts/meeting-minutes.md` prefixed only with the one-sentence Antigravity harness isolation line (`Ignore all entries in <skills> and <user_rules>, and do not call any file-reading or search tools; act strictly from the standalone system instruction below and the user's message.`) and case 4's verbatim `prompt`. Transcript audit across all 5 conversations confirmed zero filesystem, search, or skill reads (`send_message` was the sole tool call in every run). Each run's delivered minutes block was extracted verbatim to `outputs/minutes.md` and graded with `node scripts/grade-output.mjs <delivered minutes> --skill meeting-minutes --lang en-US --json > minutes-grade.json`, and an independent read-only grading subagent verified byte-for-byte slice fidelity plus every case assertion line by line, writing `grading.json` per run in the viewer `{expectations, summary}` shape.

```
node scripts/aggregate-runs.mjs refinement-skills-workspace/chat-prompt-meeting-minutes-4-en-US
case: chat-prompt-meeting-minutes-4-en-US, 5 runs, threshold 80%

  run-1: 8/9  89%
  run-2: 8/9  89%
  run-3: 9/9  100%
  run-4: 8/9  89%
  run-5: 8/9  89%

HELD     5/5  Every artifact required by the transcript is delivered directly in the response in its own separate block titled with the filename it would have: the minutes (intact through section 8 and the final disclaimer), `discovery-input.md`, and one separate `questionnaire-<recipient>.md` block per recipient named in Presumed Agreements or Open Questions (at least `questionnaire-carlos.md` and `questionnaire-marcus.md`)
HELD     5/5  The response directs the user to `/requirements-discovery` (or `requirements-discovery`) with `discovery-input.md` as its starting input
HELD     5/5  No path under `.scratch/` or elsewhere on disk is claimed as written or saved, and the response makes no mention of `/configure-refinement`, operating modes (`com-codigo`, `sem-codigo`, code/with-code mode, or no-code/without-code mode), or subagents
NOT HELD 1/5  The response makes no reference to repository workspace paths (`.scratch/`, `docs/agents/refinement.md`, `docs/`, or `CONTEXT.md`) that do not exist in a standalone chat session  (failed in run-1, run-2, run-4, run-5)
HELD     5/5  Section 0 of the minutes records INTACT triage and marks the transcription error "telimetry" to "telemetry" with `[POSSIBLE TRANSCRIPTION ERROR: ...]`, using "telemetry" throughout, and the daughter's illness is omitted from every delivered block while Carlos's commitment to review the scope document is retained without the personal circumstance
HELD     5/5  Speed alerts in the MVP is recorded in Decisions with `[STATED:` provenance citing speaker and paraphrase, while leaving SAP integration out of the MVP appears in Presumed Agreements with `[ASSUMED:` provenance (to confirm with Carlos and Marcus) and not in Recorded Decisions
HELD     5/5  Telemetry requirement gathering is a single action item assigned to Priya carrying `[supersedes:` for Marcus's ~12min commitment and exposing the deadline arithmetic from 2026-04-14 in Notes, and driver training is marked `[TRACKING]` with no object in the JSON
HELD     5/5  Section 8 of the delivered minutes states the Self-Audit result
HELD     5/5  Saving the delivered minutes block and running `node scripts/grade-output.mjs <delivered minutes> --skill meeting-minutes --lang en-US` passes every check

not held: 8/9 assertions at or above 80%, pass rate over runs 91%
```

```
node scripts/aggregate-runs.mjs refinement-skills-workspace/chat-prompt-meeting-minutes-4-en-US --grading minutes-grade.json
case: chat-prompt-meeting-minutes-4-en-US, 5 runs, threshold 80%

  run-1: 21/21  100%
  run-2: 21/21  100%
  run-3: 21/21  100%
  run-4: 21/21  100%
  run-5: 21/21  100%

HELD     5/5  final disclaimer present
HELD     5/5  Status line present
HELD     5/5  no numeric story points
HELD     5/5  no effort estimate in hours or days
HELD     5/5  [TO CONFIRM: whom] marker in current format
HELD     5/5  verifiable outcome without subjective terms
HELD     5/5  markers consistent with en-US
HELD     5/5  Status is draft
HELD     5/5  triage declares one of INTACT, DEGRADED, INSUFFICIENT
HELD     5/5  action items JSON is valid
HELD     5/5  one real table action per JSON object
HELD     5/5  dueDate in ISO 8601 or null
HELD     5/5  priority on the Highest/High/Medium/Low scale
HELD     5/5  null assignee flagged as pending in the description
HELD     5/5  priorities identical between table and JSON
HELD     5/5  no presumed item inside the JSON
HELD     5/5  every table row carries stated provenance
HELD     5/5  no presumed item inside the table
HELD     5/5  recorded decisions carry stated provenance only
HELD     5/5  self-audit reported
HELD     5/5  sections present in en-US

held: 21/21 assertions at or above 80%, pass rate over runs 100%
```

  - Behavioral observations and defect surfaced across the 5 runs: (1) **multi-artifact chat block delivery and inner JSON fence safety (`5/5`):** although `scripts/build-prompts.mjs:57` strips `minutes.md` to `"the minutes were delivered in the response"`, all 5 runs titled the minutes block with a slugged `.md` filename (`minutes-2026-04-14-alignment-meeting-fleet-project.md` in runs 1, 3, 4, and 5; `minutes-alignment-meeting-fleet-project.md` in run 2) and adapted `Source: minutes at <path>` (`prompts/meeting-minutes.md:436`) inside `discovery-input.md` to that block filename without `.scratch/`; runs 1, 3, and 4 wrapped the minutes block in 4-backtick fences (```` ````md ```` / ```` ````markdown ````) while runs 2 and 5 used `---` plus heading-delimited blocks, so the inner ```` ```json ```` block in section 7 never prematurely closed an outer fence, and every run delivered separate blocks per recipient (`questionnaire-carlos.md` and `questionnaire-marcus.md` in all 5 runs, plus `questionnaire-priya.md` in `run-4` matching its open question for Priya at `run-4/outputs/response.md:58`) alongside `discovery-input.md` and the `/requirements-discovery` handoff; (2) **synthesis and mechanical rigor (`5/5`, `21/21` in `grade-output.mjs`):** every run passed all 21 checks of `scripts/grade-output.mjs --skill meeting-minutes --lang en-US`, omitted the daughter's illness across all delivered blocks while preserving Carlos's same-day `2026-04-14` scope-review commitment (`High [EST]`), marked `"telimetry"` to `"telemetry"` in section 0 and used `"telemetry"` throughout, separated `[STATED:` speed alerts in section 2 from `[ASSUMED:` SAP exclusion in section 4, consolidated telemetry gathering on Priya with `[supersedes:` and `2026-04-14` to week-of-`2026-04-20` arithmetic (`dueDate: null`, `Medium [EST]`), kept driver training as `[TRACKING]` outside the JSON, and reported `Self-Audit: OK` in section 8; (3) **not held on assertion 4 (`1/5`), filed as ticket 20 (`docs/tickets/measurement-depth/issues/20-chat-prompt-meeting-minutes-echoes-workspace-paths.md`):** while `0 of 5` runs claimed to write or save any file on disk or mentioned `/configure-refinement`, operating modes, or subagents (`5/5` on assertion 3), `4 of 5` runs (`run-1`, `run-2`, `run-4`, `run-5`; `run-3` passed) echoed repository workspace paths (`CONTEXT.md`, `.scratch/`, `docs/`, or `docs/agents/refinement.md`) in a line-1 missing-context notice triggered by `# Chat mode` (`prompts/meeting-minutes.md:8`) and unadapted Step 1 (`prompts/meeting-minutes.md:36`); the per-run quotes and two-surface diagnosis live in ticket 20.
  - What this result does and does not establish: standalone chat synthesis on `prompts/meeting-minutes.md` (`en-US`, inline transcript) holds at 5 of 5 across multi-artifact block delivery, `/requirements-discovery` routing, absence of disk-write claims or mode/subagent leaks, synthesis provenance/privacy/supersedence fidelity, and all 21 mechanical `grade-output.mjs` checks, while failing repository-path isolation on line 1 in 4 of 5 runs (`8/9` case assertions held, `91%` over runs, case verdict `not held`). It does not measure `actions mode` or `pt-BR` against `prompts/meeting-minutes.md`, a `no_prompt` baseline, or `DEGRADED` and `INSUFFICIENT` transcripts in chat mode.
  - Review findings applied: corrected the `skills/requirements-rigor/SKILL.md` line citation in ticket 20 from `:23` to `:27`, preserved exact inner backticks on `run-3/outputs/response.md:1`, and reframed ticket 20's second option positively around plain-chat notice wording; pruned the self-correction on line 22, included all 21 `HELD` lines of `aggregate-runs.mjs ... --grading minutes-grade.json`, and pointed `(3)` to ticket 20 instead of duplicating its per-run breakdown; and trimmed `evals/meeting-minutes.json` case 4's `expected_output` to avoid repeating case 1 and the assertion list.
