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
| Chat and instruction-based agents | `prompts/*.md` (self-contained single-chat prompts) and `prompts/project/*.md` (zero-duplication modular bundle for unified web workspaces), generated from `skills/` by `scripts/build-prompts.mjs` |

There is no copy of the skills inside this repository for any CLI. To use the skills here, `scripts/link-skills.sh` creates symlinks in `~/.claude/skills/`, `~/.agents/skills/`, and `~/.gemini/config/skills/`; a `git pull` keeps the links current. `--unlink` removes them.

## Validation

- `node scripts/validate-skills.mjs`: valid frontmatter with `name` matching the folder; `description` present and within the limit; `openai.yaml` present and consistent with `disable-model-invocation`; `plugin.json`, `README.md`, and `which-flow` knowing every skill; every Skill tool call pointing to a skill in `skills/`; no em-dash and no en-dash in the prose; `SKILL.md` under 500 lines; `skills/configure-refinement/refinement.md` writing canonical `with-code` and `without-code` while `configure-refinement` and `requirements-rigor` keep both canonical and legacy `com-codigo` and `sem-codigo` tokens on read; `evals/fixtures/code-workspace/` holding source files and linked from `evals/fixtures/refinement-with-code-en-US.md` (`Mode: with-code`, `Language: en-US`), alongside `refinement-no-code-en-US.md` and `refinement-no-code-pt-BR.md` (`Mode: without-code`); every entry in `evals/*.json` `files` existing as a file, with skill cases carrying one configuration fixture agreeing with `prompt` (except unconfigured cold-start cases required in `evals/ask-refinement.json`, and with `code-workspace/` files declared whenever a case runs `with-code` and absent otherwise) and chat-prompt cases declaring either `prompts/<skill>.md` (standalone) or `prompts/project/INSTRUCTIONS.md` plus `prompts/project/refinement-core.md` (for `ask-refinement` or `which-flow`, and with `prompts/project/<skill>.md` added for workflow suites) in `files`, a multi-line `prompt`, and no `evals/fixtures/` or `docs/agents/refinement.md` path in `prompt`; every fixture in `evals/fixtures/artifacts/` passing the grader; the known aggregates of `evals/fixtures/runs/`; the seven glossaries of `evals/fixtures/glossary/` grading as the cases they stand for; a trigger eval set in `evals/triggers/<skill>.json` for every model-invoked skill, at least ten queries on each side of `should_trigger`, no duplicates and no dashes; `prompts/project/` present with all six shared primitive sections in `prompts/project/refinement-core.md` and absent from `prompts/project/INSTRUCTIONS.md` and `prompts/project/<workflow>.md`; zero dead adaptation rules in `scripts/build-prompts.mjs`; `prompts/` (including `prompts/project/`) identical to what the build would generate.
- `claude plugin validate . --strict`: the plugin manifest.

Run both before committing, because the local run is currently the only one that happens. `.github/workflows/ci.yml` declares the three Definition of Done commands on every push to `main`, every pull request, and on demand, but the account that owns the repository is locked for billing, so GitHub refuses to start the job: a red run there reads "The job was not started because your account is locked due to a billing issue" and means the commands never ran, not that they failed. The workflow starts working on its own once billing is restored. `.githooks/pre-commit` runs the same three commands before a commit lands, which makes it the only enforcement that happens today; enable it once per clone with `git config core.hooksPath .githooks`. It checks the working tree rather than the staged tree, skips the plugin step when the Claude Code CLI is absent, and `git commit --no-verify` bypasses it on purpose.

## Evals

`evals/<skill>.json` follows the schema of Anthropic's `skill-creator` (prompt, expected_output, files, assertions). `evals/fixtures/` holds fictional material only, with the language of the material declared in the file name, plus `evals/fixtures/code-workspace/` for `with-code` cases. Examination workflows are evaluated by their first round; syntheses, by the artifact. Skill cases carry a workspace configuration fixture (`refinement-no-code-<language>.md` or `refinement-with-code-en-US.md`), read in place of `docs/agents/refinement.md`; without it the workflow stops asking for `/configure-refinement`. Chat-prompt cases run either `prompts/<skill>.md` (standalone chat) or `prompts/project/INSTRUCTIONS.md` with `prompts/project/refinement-core.md` and any target `prompts/project/<skill>.md` (unified web workspace), with inputs inline in `prompt` and no workspace configuration.

`scripts/aggregate-runs.mjs <case directory> [--threshold 0.8]` aggregates the per run `grading.json` files of one case into a pass rate over runs, and holds an assertion only when it passes in at least 80% of them. With `--baseline <directory>` it compares two configurations of the same case, `with_skill` against `no_skill`, and reports each assertion as bought, already followed, lost or held by neither. How many runs a case gets, three or five, is in `evals/README.md`. The fixture sets in `evals/fixtures/runs/` have known aggregates and the validator checks both, so the aggregation and the comparison each have a regression of their own.

`scripts/diff-glossary.mjs <CONTEXT.md at the start> <CONTEXT.md at the end>` reads the glossary a driven session left against the fixture it started from: a term removed, a term defined twice, or a term whose definition changed, fails; a definition kept in full with a sentence carrying `[TO CONFIRM:` added beside it is reported as flagged and passes, and a marker on some other sentence of a rewritten definition does not exempt it; and every added term is listed with the pre-existing terms its body names, which is where a contradiction between two entries would sit. It emits the same expectations shape as the grader, so `aggregate-runs.mjs <case> --grading glossary.json` gives the rate over runs. The seven fixtures in `evals/fixtures/glossary/` are its regression: three taken from measured runs of ticket 18, one from a pt-BR run of ticket 13 that appended its marker below the `_Avoid_` line, and three built from the reviews of the check, one with a term defined twice, one with a marker parked on an unrelated sentence of a rewritten definition, and one with a second `_Avoid_` line beside a marked sentence.

`evals/triggers/<skill>.json` holds the trigger eval set of each model-invoked skill, in the `[{query, should_trigger}]` shape the `skill-creator` optimization loop reads: those two skills fire on their `description` alone, so the set is the only measurement of whether the rigor layer loads when it should. The loop itself is not run by any check, because it costs a session per query. `evals/README.md` carries how to run it, and the first rule there is that it runs one query at a time: in parallel the runner counts its own failed subprocesses as runs that did not trigger, and reports a working description as one that never fires.

`scripts/grade-output.mjs <artifact> --skill <name> [--lang <en-US|pt-BR>]` runs the mechanical assertions and serves as the grader, in both languages; without `--lang` it detects the language of the artifact. `evals/fixtures/artifacts/<skill>[-actions]-<language>.md` are published artifacts that serve as the grader's own regression: the validator grades every one of them and fails if any check fails. See `evals/README.md`.

## What a synthesis grade covers

`grade-output.mjs` reads the shape of a published artifact, and shape is most of what it can read: the sections present in the graded language, markers in the right syntax and the right language, the verdict drawn from that workflow's vocabulary, `Given` as state rather than action, the six INVEST rows, the final notice, and the absence of story points and effort in hours. On top of that each workflow adds a few structural ties: in `refine-story`, a recipient on every open question and a question behind every `[TO CONFIRM:`; in `bootstrap-context`, provenance on baseline rows and cross-cutting rules plus a recipient and open question behind every `[TO CONFIRM:`; in `qa-plan`, the open question ledger read against the matrix in both directions; in `meeting-minutes`, the action table against its JSON twin, provenance on every row, and the self-audit line.

How many checks that comes to, counted over each committed fixture, which is what `validate-skills.mjs` grades and compares against this table:

| Artifact fixture | Checks |
| --- | --- |
| `refine-story-en-US` | 14 |
| `refine-story-pt-BR` | 14 |
| `qa-plan-en-US` | 16 |
| `qa-plan-pt-BR` | 16 |
| `requirements-discovery-en-US` | 13 |
| `requirements-discovery-pt-BR` | 13 |
| `meeting-minutes-en-US` | 21 |
| `meeting-minutes-pt-BR` | 21 |
| `meeting-minutes-actions-en-US` | 20 |
| `bootstrap-context-en-US` | 19 |
| `bootstrap-context-pt-BR` | 19 |

A few checks are conditional, so another artifact of the same workflow can draw one fewer: the `refine-story` fixtures carry a REFINE verdict and the `bootstrap-context` fixtures carry a PARTIAL verdict, each drawing the check that the verdict names the questions unblocking it, while a READY or BASELINE READY artifact never reaches that check and grades out of one fewer. A count is therefore a property of an artifact, not of a workflow, and the number a run reports should be read with that in mind.

## What the harness does not check

Knowing where the mechanical layer stops keeps a green run from being read as more than it is.

- Whether a `[SPECIFIED: excerpt]` citation states the outcome in words or is merely compatible with it. Comparing a citation against the source text is judgment, so no grader check covers it, and the eval suites cover it by reading, with a grading subagent or a person. What the grader does catch is the detectable half: a result an open question unblocks, read from the `unblocks #n` slot of the ledger against the matrix, in both directions.
- Anything a workflow does not publish. `grade-output.mjs` reads a published artifact, and an examination round publishes nothing, so a round is covered by the eval assertions alone.
- Whether anything in the artifact is true. A grade says the shape holds, never that a criterion traces to something the PO said, that a verdict matches what the answers support, or that a glossary written during the session agrees with itself. The glossary half is narrower than it was: `diff-glossary.mjs` catches a term whose definition the session changed on its own, which is the shape two of the nine runs of ticket 18 left, and still cannot catch a new entry whose sentences contradict another term without touching it, which is the shape the run of ticket 14 left. Nor can a mechanical check read `CONTEXT.md` against an arbitrary User Story to tell whether the frontier swept every constraint on the concepts the capability acts on: Cases 1 and 4 of `evals/refine-story.json` assert the retroactive-reading gap on US-245's first round, while general frontier completeness remains an eval reading check. The first end to end run of the package, recorded in ticket 02 of `docs/tickets/measurement-depth/`, published a User Story that graded clean while asserting a user interface element nobody specified, closing its examination over an edge case the glossary points at, and leaving the glossary contradicting itself. All three are visible by reading and invisible to every check above. A green grade is the floor of an artifact's quality, not a verdict on it.
- Prose style. The repository forbids the em-dash in committed files, enforced over every `.md` by `validate-skills.mjs`, and the grader deliberately does not carry that rule into a published artifact: it is house style here, never stated to the agent writing in a workspace, and a pt-BR synthesis failed for ordinary Portuguese prose until it was removed. The boundary itself is guarded, by a check that builds the case and requires the grader to pass it.
- Whether either primitive loads when it should. The two model-invoked skills fire on their `description`, and no check runs a query to see whether they do: the validator checks that a trigger set exists and is shaped right, never that the description scores well on it. That measurement is a session per query and lives in `evals/README.md`.
- Whether a rule change holds across the package. After changing a rule, rerun the cases that exercise it, and the whole suite only when the change touches more than one workflow; a single rule is settled by two or three targeted cases, and the suite costs around a million tokens.

## Self-containment

No skill from outside. The validator checks that every Skill tool call in the `SKILL.md` files points to a skill of this package; a call to an unknown name fails.
