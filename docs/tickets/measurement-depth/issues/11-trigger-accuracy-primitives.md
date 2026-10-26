# 11: Measure the triggering of the two model-invoked primitives

Status: claimed
Blocked by: none
Type: task
Origin: 2026-10-25 (commit 81547f6)

`requirements-rigor` and `socratic-examination` are the only skills whose `description` decides whether they load. Every workflow depends on them, and if `requirements-rigor` under-triggers, the rigor layer silently does not arrive while the workflow still reports a result. That triggering has never been measured.

Build the trigger eval set the `skill-creator` loop expects, twenty queries per skill, half that should fire and half near misses that share vocabulary but need something else, and run the loop. Near misses are the valuable half: a code review request, minutes with no requirement content, a unit test for one function.

## Acceptance criteria

- A trigger eval set exists for each of the two primitives, with the should-fire and should-not-fire split recorded.
- The optimization loop runs and its per-iteration scores are recorded.
- Either the description is updated with the result, or the current one is recorded as the best measured, with the score.

## Comments

- 2026-10-26 Preflight (commit 169befd, re-verified from 125864f): confirmed
  - Docs: `evals/README.md` "Optimizing triggering" already names the loop, the two skills, the twenty query split and the three near miss shapes the ticket repeats, so the convention exists and only the measurement is missing; `docs/agents/harness.md` Validation lists what the validator enforces and has no line about trigger sets, which is where the new check gets recorded; `AGENTS.md` Invariants say the primitives are model-invoked and that "the `description` is the trigger that decides when they fire", which is the premise of the ticket; `CONTEXT.md` and the ADRs do not touch descriptions, and ADR 0005 does not apply because the description stays canonical en-US in both languages. The `/implement` rule that a rule change starts from a check that can fail decides the order: the validator check on the trigger sets comes before the sets.
  - Package: `skills/requirements-rigor/SKILL.md:3` and `skills/socratic-examination/SKILL.md:3` carry the descriptions, unchanged since 81547f6 (`git log` over both files since the origin commit shows body edits only: 3f27e68, 893083c, d7d072b, and 169befd touched only `.claude/skills`, `.agents/skills`, `AGENTS.md` and `scripts/link-skills.sh`); neither frontmatter has `disable-model-invocation`, and both `openai.yaml` files lack `allow_implicit_invocation: false`, so model-invoked is confirmed on both sides. No committed trigger set exists under `evals/`: confirmed. The `skill-creator` loop is installed as `anthropic-skills:skill-creator` with `scripts/run_loop.py`, which runs each query through `claude -p` three times and reads whether the Skill tool names a command file it plants in `.claude/commands/` of the nearest project root.
  - Reproduction: not applicable, the ticket claims an absence of measurement, not a defect. Four confounds found while reproducing the harness mechanics, recorded here because they shape the measurement: (1) `run_eval.py` plants `<skill>-skill-<uuid>.md` in one shared `.claude/commands/` directory across workers, so `--num-workers > 1` puts multiple identical copies in `skill_listing` at once and counts any trigger that picks a sibling worker's UUID as a miss (an interrupted `--num-workers 6` run earlier today capped recall near 1/6 across all iterations while a standalone single-worker probe triggered 2/2); (2) a run rooted in this repository loads `AGENTS.md`, which describes both primitives, into every query; (3) user-scoped skills and plugins compete unless `--setting-sources project` restricts the list and the two primitives are unlinked for the duration; and (4) `run_eval.py` swallows exit code 1 when the CLI hits its session limit, scoring quota errors as non-triggers. The loop therefore runs from a neutral project root with `--num-workers 1`, `--setting-sources project`, MCP servers stripped (`--strict-mcp-config --mcp-config '{"mcpServers":{}}'`), and the two links restored after.
  - Criteria: 3 still hold, 0 already satisfied, 0 need changing
  - Conflicts: none in the invariants. The sets live in `evals/triggers/<skill>.json`, a subdirectory, because the validator reads every `evals/*.json` as a case suite with `skill_name` and `evals` and would reject the loop's `[{query, should_trigger}]` shape at the top level. The shim and the unlinking are environment, not package, and leave nothing behind.
- 2026-10-26 Implemented and measured. The near misses were the valuable half, as the ticket predicted, and the first two waves of the loop measured the harness rather than the descriptions.
  - Trigger sets: `evals/triggers/requirements-rigor.json`, twenty two queries, and `evals/triggers/socratic-examination.json`, twenty, each balanced between should fire and near miss, in both languages. The near miss halves carry the three shapes the ticket named, a code review, minutes of a one to one and of a retrospective, a unit test for one function, plus the ones that compete hardest: cucumber glue code for `requirements-rigor`, and for `socratic-examination` a socratic Kubernetes quiz, a candidate interview questionnaire, and a request to answer the PO's questions rather than ask them. `scripts/validate-skills.mjs` requires a set for every model-invoked skill, at least ten queries a side, no duplicate and no dash, and rejects a set for a skill that is user-invoked or absent. Confirmed failing before the sets existed: `error: requirements-rigor: model-invoked without a trigger set at evals/triggers/requirements-rigor.json`. Both size rules were confirmed to fail on a mutated set after the review tightened them.
  - **The loop ran twice and both waves are void.** Per iteration scores, recorded because the numbers sit in the workspace and would otherwise be read as results. Wave 1, the two skills at once and no isolation, aborted at the improvement call, which failed with `claude -p exited 1`; its log reports correct runs out of total runs, not queries:

```
wave 1  requirements-rigor   train 18/36, 21/36, 21/36, 18/36   test 15/24, 14/24, 15/24, 12/24   aborted in iteration 5
wave 1  socratic-examination train 20/36, 21/36, 20/36          test 16/24, 14/24, 16/24          aborted in iteration 4
```

  - Wave 2 added the isolation this environment needs, ran the skills one after another, completed five iterations each, and reports queries passed:

```
wave 2  requirements-rigor   train 6/12 in all five iterations   test 4/8 in all five
wave 2  socratic-examination train 6, 6, 7, 6, 6 of 12           test 4, 4, 4, 5, 4 of 8
```

  - What voided them: `--num-workers 6`, the runner's default. A probe fired the skill on the very query the loop scored 0 of 3, so the runner and not the description was failing. Measured directly, one description and four queries: 1 of 6 should fire runs at six workers, 3 of 6 at two, 6 of 6 at one. `run_eval.py` sends subprocess stderr to `/dev/null` and counts a run that produced no stream event as a run that did not trigger, so load arrives as a uniform zero and cannot be told apart from a description nobody consults. The same load is what broke the improvement call, whose logged prompt replays successfully alone. The head to head that compared the iteration 4 candidate of `socratic-examination` against the current description ran at six workers too, so it is void on the same grounds: it put both at 10 of 20 with the candidate firing on nothing at all, and it establishes nothing about either. The run rule now sits in `evals/README.md`, and `harness.md` records in two places that no check runs the loop.
  - **Valid measurement, serial.** One query at a time, three runs per query, the whole set per skill. Before, with the descriptions as they stood at 125864f:

```
requirements-rigor    18/20 queries   should fire 10/10 (30/30 runs)   near miss 8/10 (6/30 runs)
socratic-examination  20/20 queries   should fire 10/10 (30/30 runs)   near miss 10/10 (0/30 runs)
```

  - `socratic-examination` is recorded as the best measured description, at 20 of 20, unchanged. No candidate has ever been scored against it serially, so the claim is that the current description measures clean, not that nothing could beat it.
  - `requirements-rigor` failed one shape, unanimously: minutes of a one to one and minutes of a retrospective each fired 3 of 3. The description said "or meeting minutes" with nothing saying which meeting, so any minutes pulled the rigor layer in. The clause now reads "or the minutes of a meeting where requirements were discussed", and the description closes by naming the exclusion, minutes that settle no requirement. After, same protocol:

```
requirements-rigor    20/20 queries   should fire 10/10 (30/30 runs)   near miss 10/10 (0/30 runs)
```

  - The two over triggers went from 3 of 3 to 0 of 3 and the refinement minutes query that must fire stayed at 3 of 3, so the exclusion cost no recall. Because the new wording names the two shapes that failed, the review asked whether 20 of 20 was overfitted to the set. A held out pair answers it, added after the fix and never seen by it: minutes of a backlog grooming session that settled two rules fire 3 of 3, and minutes of an all hands that settles nothing fire 0 of 3. Neither meeting is named in the description, so what generalizes is the rule and not the two examples.
  - What this does not establish. One wave of three runs per query, on a clean flip rather than a marginal move, but still one wave. The measurement runs one planted copy of one description against the built in skills alone, so it says nothing about how either primitive competes inside a workspace where the six workflows and other plugins are installed, which is the configuration a user actually has; wave 1 ran in that noisier configuration and is void for the concurrency reason, so the question is open. And it says nothing about what either skill does once loaded: triggering is the gate, and every assertion about the behavior behind it lives in the eval suites.
  - **Outstanding, and why the ticket is not resolved.** Criterion 2 asks for the loop's per iteration scores, and the only scores the loop has produced are void. A valid wave means running it serially: five iterations over twenty two queries at three runs is around three hundred sessions per skill, against the sixty that one scoring pass costs. That is a spend decision rather than an implementation step, so it is left to the user: accept the serial scoring pass above as the measurement and resolve the ticket, or authorize a serial loop wave per skill.
  - Per run files live in the git ignored workspace tree, under `refinement-skills-workspace/trigger-serial/`, `trigger-after/`, `trigger-head2head/` and the two void waves, so the numbers above are quoted here rather than linked.
