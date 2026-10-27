# 20: Generated chat prompt for meeting-minutes echoes repository workspace paths on line 1

Status: needs-triage
Blocked by: none
Type: task
Origin: 2026-10-27 (commit 6effb0d)

Found by the chat-prompt synthesis measurement of ticket 10 (`evals/meeting-minutes.json` case 4, executing `prompts/meeting-minutes.md` with `evals/fixtures/transcript-fleet-project.md` pasted inline). Eight of the nine case assertions hold at 5 of 5 (and all 21 mechanical checks of `scripts/grade-output.mjs` on the delivered minutes hold at 5 of 5); the fourth assertion holds at 1 of 5:

```
NOT HELD 1/5  The response makes no reference to repository workspace paths (`.scratch/`, `docs/agents/refinement.md`, `docs/`, or `CONTEXT.md`) that do not exist in a standalone chat session  (failed in run-1, run-2, run-4, run-5)
```

None of the five runs claimed to write or save any file on disk, and lines 2 onward of all five responses delivered clean, self-contained chat blocks (`minutes-*.md`, `discovery-input.md`, and `questionnaire-<recipient>.md`) with zero mention of `.scratch/`, `docs/agents/refinement.md`, `/configure-refinement`, operating modes, or subagents. Yet all five runs opened with a one-line missing-context notice on line 1, and four of the five named repository workspace paths that do not exist in a standalone chat conversation:

- **`run-1/outputs/response.md:1` (`CONTEXT.md`, `.scratch/`):** ``No workspace configuration, `CONTEXT.md`, ADRs, or prior `.scratch/` artifacts were provided in this chat session; defaulting to `en-US` and applying the glossary and metadata supplied in the prompt.``
- **`run-2/outputs/response.md:1` (`CONTEXT.md`, `docs/`, `.scratch/`):** ``No workspace repository documents (`CONTEXT.md`, `docs/`, ADRs, or `.scratch/`) were provided beyond the pasted metadata and glossary; synthesis below uses only the pasted transcript and glossary in `en-US`.``
- **`run-3/outputs/response.md:1` (passed, no repository paths):** ``No external workspace configuration, previous stories, or ADRs were provided; using default language `en-US` and the metadata and glossary (`telemetry`) supplied with the transcript.``
- **`run-4/outputs/response.md:1` (`CONTEXT.md`):** ``Workspace context: No external `CONTEXT.md`, ADRs, or prior workspace documents were provided; synthesis uses only the transcript, metadata, and glossary (`telemetry`) supplied in this conversation.``
- **`run-5/outputs/response.md:1` (`docs/agents/refinement.md`):** ``No workspace configuration (`docs/agents/refinement.md`), ADRs, or prior artifacts were provided in this conversation; default language (`en-US`) and the metadata and glossary from the transcript were applied.``

Two unadapted prompt surfaces in `prompts/meeting-minutes.md` combine to produce that line:

1. **Examination-oriented `# Chat mode` preamble applied verbatim to a synthesis-only workflow (`scripts/build-prompts.mjs:83-95`, `prompts/meeting-minutes.md:3-15`):** `CHAT(flow)` tells `Meeting Minutes` that the document *"combines the workflow, socratic examination, requirements rigor, and templates"* (`:5`) and describes round-by-round examination (`:14`), even though `FLOWS['meeting-minutes']` (`scripts/build-prompts.mjs:138-146`) uses `rigorOnly()` and `prompts/meeting-minutes.md:20` states *"This workflow is synthesis without interview."* Line 8 (`scripts/build-prompts.mjs:88`) then instructs: *"Where the workflow says 'read `CONTEXT.md`', use the glossary pasted, attached, or placed in knowledge base by the PO; without a glossary, ask for product domain roles in round 1. Where it says 'previous stories in `.scratch/`', 'ADRs', or 'documents in `docs/`', use only what the PO provided; if nothing was found, state this in one line at the top of round 1."* Because no `.scratch/`, ADR, or `docs/` material is pasted with a meeting transcript, all five runs obeyed *"state this in one line at the top"*, and `run-1`, `run-2`, and `run-4` quoted the literal path tokens (`CONTEXT.md`, `docs/`, `.scratch/`) from `# Chat mode` line 8 itself.
2. **Unadapted workspace reads inside `meeting-minutes` Step 1 (`skills/meeting-minutes/SKILL.md:28`, `prompts/meeting-minutes.md:36`):** unlike `refine-story`, `qa-plan`, and `requirements-discovery`, whose `## Before starting` section is stripped by `dropSection` (`scripts/build-prompts.mjs:115,123,132`), `skills/meeting-minutes/SKILL.md` has no `## Before starting` section and places its workspace reads inside `## Steps` item `1. **Metadata.**` (*"Read `docs/agents/refinement.md` in the workspace to identify the configured language (`en-US` or `pt-BR`, default `en-US`) and publishing path ... Read `CONTEXT.md` for glossary terms when present"*, alongside `docs/agents/refinement.md` in `prompts/meeting-minutes.md:85` from `skills/requirements-rigor/SKILL.md:27`). `run-5:1` echoed `docs/agents/refinement.md` directly from Step 1.

## Evidence

- `node scripts/aggregate-runs.mjs refinement-skills-workspace/chat-prompt-meeting-minutes-4-en-US`, recorded in `docs/tickets/measurement-depth/issues/10-chat-prompt-case-meeting-minutes.md`.
- `refinement-skills-workspace/chat-prompt-meeting-minutes-4-en-US/with_prompt/run-{1..5}/outputs/response.md` (line 1 in each run).
- `prompts/meeting-minutes.md:5,8,14,36,85`, `scripts/build-prompts.mjs:83-95,105-109,115,123,132,138-146`, `skills/meeting-minutes/SKILL.md:28`, and `skills/requirements-rigor/SKILL.md:27`.

## What a fix has to decide

How `scripts/build-prompts.mjs` should adapt synthesis-only workflows and workspace-path references in `prompts/`:

- **Split or parameterize `CHAT` for synthesis-only workflows and adapt `meeting-minutes` Step 1 in `RULES`:** tailor `CHAT` for `prompts/meeting-minutes.md` so it describes direct synthesis from pasted or attached transcript and optional glossary material (asking in one line only when mandatory metadata such as the meeting date is absent per Step 1), and add `RULES` adaptations in `scripts/build-prompts.mjs` for `skills/meeting-minutes/SKILL.md:28` (and `skills/requirements-rigor/SKILL.md:27` if `docs/agents/refinement.md` still leaks).
- **Keep a single `CHAT` preamble across all four workflow prompts, while adapting Step 1 and phrasing the missing-context notice in plain chat terms:** adapt `skills/meeting-minutes/SKILL.md:28` in `RULES` and reword `CHAT` line 8 so any missing-context notice names the absent chat inputs in plain language (for example, that no external glossary, ADRs, or prior artifacts were provided, as `run-3:1` wrote).
