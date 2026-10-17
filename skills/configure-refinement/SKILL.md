---
name: configure-refinement
description: "Configures a workspace for refinement workflows: operating mode (with or without code), local markdown tracker, publishing conventions, and agent instructions block in AGENTS.md or CLAUDE.md. Run once per workspace."
disable-model-invocation: true
---

# Configure workspace

Write the workspace-level configuration that `/refine-story`, `/qa-plan`, `/requirements-discovery`, and `/meeting-minutes` assume. This is a conversation-guided skill, not an automated script: explore, present findings, confirm, and only then write files.

## Steps

1. **Explore.** Inspect existing files before making assumptions: `AGENTS.md` and `CLAUDE.md` in the root, `CONTEXT.md`, `docs/agents/refinement.md` and `docs/agents/issue-tracker.md` (previous outputs of this skill), `.scratch/`, and signals of source code: `package.json`, `pyproject.toml`, `src/`, `go.mod`, or anything a team compiles or executes.
   If `docs/agents/issue-tracker.md` already exists from another convention, preserve it: verify only that it specifies where to publish. If `CLAUDE.md` is merely a bridge with `@AGENTS.md`, the primary instruction file is `AGENTS.md`.
   Completed when: you know whether the workspace is already configured, the likely mode, the likely language (`en-US` or `pt-BR`), whether a glossary exists, whether the tracker exists, and which instruction file to edit.

2. **Inquire, one section at a time, leading with the recommended answer.**

   **Mode.** Recommend based on findings: if code is present, `com-codigo` (with code); if absent, `sem-codigo` (without code). Explain in one line: with code, the agent inspects source code before asking; without code, the PO is the source of facts and architecture questions become questionnaires for the team.

   **Language.** Recommend based on existing files or `en-US` by default: `en-US` or `pt-BR`. Explain in one line: defines the language of examination, question rounds, narratives, Gherkin criteria, and verdicts.

   **Work items.** Do User Stories originate in an external tracker? If yes, what is the base URL and field convention (for example `Azure: <ID>` for Azure DevOps work items). Every US originates there and each artifact carries this ID line.

   **Product glossary.** Does `CONTEXT.md` already exist? If not, no action needed now: the first examination that resolves a domain term will create it. State this clearly.

   Completed when: mode, language, work item convention, and base URL are confirmed.

3. **Confirm and write.** Present the draft of `docs/agents/refinement.md` based on [refinement.md](refinement.md), `docs/agents/issue-tracker.md` based on [issue-tracker.md](issue-tracker.md) (only when it does not already exist), and the `## Refinement` block for the agent instructions file. Allow adjustments. Then write the files. For the instructions file: if `CLAUDE.md` exists and imports `AGENTS.md` (`@AGENTS.md`), edit `AGENTS.md`; otherwise edit `CLAUDE.md` if it exists; otherwise `AGENTS.md` if it exists; if neither exists, ask which to create. If the `## Refinement` block already exists, update it in place without modifying the rest of the file.

   The block:

   ```markdown
   ## Refinement

   Socratic refinement workflows: run `/which-flow` to select a workflow. Mode and conventions live in `docs/agents/refinement.md`; tracker conventions in `docs/agents/issue-tracker.md`. Artifacts live in `.scratch/<slug>/` with `Status:` and work item ID.
   ```

   Completed when: `refinement.md`, the tracker file (new or preserved), and the instruction block exist with confirmed content.

4. **Conclude.** Confirm the workspace is configured, list workflows that read `docs/agents/refinement.md`, and note that files can be edited manually later; re-running this skill is only required to switch modes, languages, or tracker conventions.
