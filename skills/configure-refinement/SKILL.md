---
name: configure-refinement
description: "Configures a workspace for refinement workflows: operating mode (with or without code), local markdown tracker, publishing conventions, and agent instructions block in AGENTS.md or CLAUDE.md. Run once per workspace."
disable-model-invocation: true
---

# Configure workspace

Write the workspace-level configuration that `/bootstrap-context`, `/refine-story`, `/qa-plan`, `/requirements-discovery`, and `/meeting-minutes` assume. This is a conversation-guided skill, not an automated script: explore, present findings, confirm, and only then write files.

## Steps

1. **Explore.** Inspect existing files before making assumptions: `AGENTS.md` and `CLAUDE.md` in the root, `CONTEXT.md`, `docs/agents/refinement.md` and `docs/agents/issue-tracker.md` (previous outputs of this skill, including any codebase path(s) already listed under `## Fact sources`), `docs/product-overview.md`, `docs/reference/` and other documents in `docs/`, `.scratch/`, and signals of source code in the current workspace root (`package.json`, `pyproject.toml`, `src/`, `go.mod`, or anything a team compiles or executes).
   If `docs/agents/issue-tracker.md` already exists from another convention, preserve it: verify only that it specifies where to publish. If `docs/agents/refinement.md` already exists, accept both the canonical mode tokens (`with-code`, `without-code`) and the legacy tokens (`com-codigo`, `sem-codigo`) on read. If `CLAUDE.md` is merely a bridge with `@AGENTS.md`, the primary instruction file is `AGENTS.md`.
   Completed when: you know whether the workspace is already configured, the likely mode (`with-code` or `without-code`), any previously configured codebase path(s), the likely language (`en-US` or `pt-BR`), whether the product appears new or already in production, whether `CONTEXT.md`, `docs/product-overview.md`, or reference documents in `docs/` exist, whether the tracker exists, and which instruction file to edit.

2. **Inquire, one section at a time, leading with the recommended answer.**

   **Mode and codebase paths.** Recommend based on findings: if code is present in the workspace root, recommend `with-code` (defaulting to `.` and asking whether additional local repositories also belong to the product, such as sibling backend, frontend, or mobile repos); if code is absent from the workspace root, recommend `without-code` when no local codebase checkout is available, while noting that `with-code` also works from a dedicated refinement workspace by pointing to one or more local repository paths (for example `../product-api` and `../product-web`). Explain in one line: with code, the agent inspects source code read-only before asking; without code, the PO is the source of facts and architecture questions become questionnaires for the team. Whenever `with-code` uses external or additional repository path(s), ask for the local path(s) and check whether each path is readable right now: if readable, confirm the detected code signals; if outside the current session sandbox or not yet mounted, keep the confirmed path(s) for `docs/agents/refinement.md` and state how to grant read-only access before running workflows (adding the folder(s) to a Multi-root workspace in Antigravity, VS Code, or Cursor, or launching Claude Code with `claude --add-dir <path>`).

   **Language.** Recommend based on existing files or `en-US` by default: `en-US` or `pt-BR`. Explain in one line: defines the language of examination, question rounds, narratives, Gherkin criteria, and verdicts.

   **Work items.** Do User Stories originate in an external tracker? If yes, what is the base URL and field convention (for example `Azure: <ID>` for Azure DevOps work items). Every US originates there and each artifact carries this ID line.

   **Product stage and context.** Is this a **new (greenfield)** product or an **ongoing (brownfield)** product already in production or advanced development? Recommend based on explored code, `CONTEXT.md`, `docs/product-overview.md`, or documents in `docs/`:
   - **New product:** if `CONTEXT.md` does not exist yet, no action is needed now: the first examination that resolves a domain term will create it.
   - **Ongoing product:** explain that `docs/reference/` is where the team places existing product manuals, business rules, specifications, or exported backlog stories so the agent does not enter story refinement blind, and ask whether existing documentation will be placed in `docs/reference/`, in another path under `docs/` to list in `## Fact sources`, or whether none exists yet. Note that running `/bootstrap-context` after setup reads those documents (and source code in `with-code` mode, or conducts a short onboarding examination when neither exists) to build `CONTEXT.md` and `docs/product-overview.md` before the first `/refine-story`.

   Completed when: mode, any `with-code` codebase path(s), language, work item convention, base URL, and product stage (including any reference documentation path for ongoing products) are confirmed.

3. **Confirm and write.** Present the draft of `docs/agents/refinement.md` based on [refinement.md](refinement.md) (always writing `Mode: with-code` or `Mode: without-code`, migrating legacy `com-codigo` or `sem-codigo` in place when reconfiguring, listing any custom reference path under `## Fact sources`, and filling the `source code in` clause of `## Fact sources` per [refinement.md](refinement.md), keeping `.` alongside any sibling repository paths when the current workspace also holds source code and omitting that clause in `without-code` mode), `docs/agents/issue-tracker.md` based on [issue-tracker.md](issue-tracker.md) (only when it does not already exist), and the `## Refinement` block for the agent instructions file. Allow adjustments. Then write the files, and when confirmed for an ongoing product with reference documentation, create `docs/reference/` (or the confirmed custom reference path, with an empty `.gitkeep` when the folder does not yet exist) so the team sees immediately where to drop reference files. For the instructions file: if `CLAUDE.md` exists and imports `AGENTS.md` (`@AGENTS.md`), edit `AGENTS.md`; otherwise edit `CLAUDE.md` if it exists; otherwise `AGENTS.md` if it exists; if neither exists, ask which to create. If the `## Refinement` block already exists, update it in place without modifying the rest of the file.

   The block:

   ```markdown
   ## Refinement

   Socratic refinement workflows: run `/which-flow` to select a workflow. Mode and conventions live in `docs/agents/refinement.md`; tracker conventions in `docs/agents/issue-tracker.md`. Artifacts live in `.scratch/<slug>/` with `Status:` and work item ID.
   ```

   Completed when: `refinement.md`, the tracker file (new or preserved), the confirmed reference folder when ongoing with documentation, and the instruction block exist with confirmed content.

4. **Conclude.** Confirm the workspace is configured, list workflows that read `docs/agents/refinement.md`, remind the user to grant read-only session access first if any configured codebase path was unreadable in step 2, and direct the user to the next step: for ongoing products without baseline context, drop existing manuals, rules, or exported stories into `docs/reference/` (when confirmed) and run `/bootstrap-context` before `/refine-story`; for greenfield products, run `/which-flow`. Note that files can be edited manually later; re-running this skill is only required to switch modes, codebase paths, languages, or tracker conventions (already-configured workspaces carrying legacy `com-codigo` or `sem-codigo` continue to work without needing to re-run it).
   Completed when: workspace setup summary, workflows reading `docs/agents/refinement.md`, any pending codebase-access reminder from step 2, and the stage-appropriate next command (`/bootstrap-context` or `/which-flow`) are stated.
