# AGENTS.md: package constitution

> Read this file before taking any action in this repository.

> Single source of truth for agents. `.claude/CLAUDE.md` (Claude Code) and `GEMINI.md` (Gemini CLI) only import this file; Codex, Cursor, and Copilot read it directly. AI workflow changes belong here.

## What this repository is

**refinement-skills** is an agent skills package for software requirements refinement in en-US and pt-BR: from meeting transcripts to QA test plans, driven by socratic examination. It is not the workspace where User Stories are analyzed; it is installed into target workspaces. Package vocabulary lives in `CONTEXT.md`; architectural decisions in `docs/adr/`.

- **Skill source:** `skills/<name>/SKILL.md`, one folder per skill, no buckets. Each folder contains `agents/openai.yaml` with Codex metadata.
- **Self-contained:** every skill invoked across workflows lives directly under `skills/`. No external third-party package dependencies, nor references to one.
- **Manifest:** `.claude-plugin/plugin.json` lists every skill in `skills/`; `marketplace.json` makes the repository its own marketplace.

## Invariants

- `name` in frontmatter matches the folder name. Canonical instructions in en-US; frontmatter keys in English.
- Workflows (`refine-story`, `qa-plan`, `requirements-discovery`, `meeting-minutes`, `which-flow`, `configure-refinement`) are user-invoked: `disable-model-invocation: true` and `policy.allow_implicit_invocation: false` in `openai.yaml`. The primitives `socratic-examination` and `requirements-rigor` are model-invoked: the `description` is the trigger that decides when they fire. A user-invoked skill cannot be called by another skill; what a workflow needs from another skill, it calls from a primitive or performs itself.
- Any rule used by more than one workflow lives in `requirements-rigor` or `socratic-examination`, once. Workflows point there; they do not repeat rules.
- No em-dash or en-dash in any repository prose. Rewrite with commas, colons, or periods.
- Any new or renamed skill must be added to `plugin.json`, `README.md`, and the `which-flow` router. A router that does not know a skill is a router that lies.
- `prompts/` is generated from `skills/` via `scripts/build-prompts.mjs` and never edited manually. When a skill changes, run the build; the validator rejects outdated prompts. Any new reference to a file or the Skill tool inside a skill requires an adaptation rule in the build script, otherwise it fails.

## Definition of Done

`node scripts/validate-skills.mjs` and `claude plugin validate . --strict` green; `node scripts/build-prompts.mjs` executed after any change in `skills/`. Commit messages follow Conventional Commits; commit and push only when requested by the user.

## Writing style

Every step concludes with a checkable, rigorous completion criterion. References used only by specific branches live in sibling files linked from `SKILL.md`; what every branch requires stays inline. Any sentence that does not change agent behavior is pruned. State the desired behavior instead of forbidding the undesired one. Keep each meaning in a single place.

## Dogfooding and evals

`scripts/link-skills.sh` links `skills/*` into `~/.claude/skills` and `~/.agents/skills` to dogfood skills within this repository. Evals live in `evals/`, following the Anthropic `skill-creator` format; `scripts/grade-output.mjs` runs automated assertions on artifacts. The complete harness layer is documented in `docs/agents/harness.md`.
