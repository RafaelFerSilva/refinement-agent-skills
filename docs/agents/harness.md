# Control layer (harness)

What keeps this package consistent, and where to change each thing. Instructions for agents live in `AGENTS.md`; this page covers what a script or a manifest enforces.

## Source and distribution

| Concern | Where |
| --- | --- |
| Skill source | `skills/<name>/` |
| Claude Code plugin manifest | `.claude-plugin/plugin.json` (explicit list of `skills/`) |
| Own marketplace | `.claude-plugin/marketplace.json` (fallback to install straight from the repository) |
| Codex metadata | `skills/<name>/agents/openai.yaml` |
| Installation by copy | `skills/*` into the agent skills folder of the workspace |
| Chat and instruction-based agents | `prompts/<flow>.md`, generated from `skills/` by `scripts/build-prompts.mjs` |

There is no copy of the skills inside this repository for any CLI. To use the skills here, `scripts/link-skills.sh` creates symlinks in `~/.claude/skills/` and `~/.agents/skills/`; a `git pull` keeps the links current. `--unlink` removes them.

## Validation

- `node scripts/validate-skills.mjs`: valid frontmatter with `name` matching the folder; `description` present and within the limit; `openai.yaml` present and consistent with `disable-model-invocation`; `plugin.json`, `README.md`, and `which-flow` knowing every skill; every Skill tool call pointing to a skill in `skills/`; no em-dash in the prose; `SKILL.md` under 500 lines; every file referenced by `evals/*.json` existing, with a configuration fixture in each case; every fixture in `evals/fixtures/artifacts/` passing the grader; `prompts/` identical to what the build would generate.
- `claude plugin validate . --strict`: the plugin manifest.

Run both before committing, because the local run is currently the only one that happens. `.github/workflows/ci.yml` declares the three Definition of Done commands on every push to `main`, every pull request, and on demand, but the account that owns the repository is locked for billing, so GitHub refuses to start the job: a red run there reads "The job was not started because your account is locked due to a billing issue" and means the commands never ran, not that they failed. The workflow starts working on its own once billing is restored. `.githooks/pre-commit` runs the same three commands before a commit lands, which makes it the only enforcement that happens today; enable it once per clone with `git config core.hooksPath .githooks`. It checks the working tree rather than the staged tree, skips the plugin step when the Claude Code CLI is absent, and `git commit --no-verify` bypasses it on purpose.

## Evals

`evals/<skill>.json` follows the schema of Anthropic's `skill-creator` (prompt, expected_output, files, assertions). `evals/fixtures/` holds fictional material only, with the language of the material declared in the file name. Examination workflows are evaluated by their first round; syntheses, by the artifact. Every case carries a workspace configuration fixture (`refinement-no-code-<language>.md`), read in place of `docs/agents/refinement.md`; without it the workflow stops asking for `/configure-refinement`.

`scripts/grade-output.mjs <artifact> --skill <name> [--lang <en-US|pt-BR>]` runs the mechanical assertions and serves as the grader, in both languages; without `--lang` it detects the language of the artifact. `evals/fixtures/artifacts/<skill>[-actions]-<language>.md` are published artifacts that serve as the grader's own regression: the validator grades every one of them and fails if any check fails. See `evals/README.md`.

## Self-containment

No skill from outside. The validator checks that every Skill tool call in the `SKILL.md` files points to a skill of this package; a call to an unknown name fails.
