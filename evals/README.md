# Evals

Test cases in the format of Anthropic's `skill-creator`: one file per skill, with realistic prompts, expected output, and assertions. Every fixture in `fixtures/` is fictional (RouteWise, Fleet Project); client material never enters here.

## How to run

With `skill-creator` installed: run `/skill-creator` and ask it to run the evals in `evals/<skill>.json`. It triggers one run with the skill and one without, writes the outputs to `<skill>-workspace/iteration-N/` (git-ignored), and opens the viewer.

Without it, one subagent per case: give it the prompt, the files listed in `files`, and the path to the skill (or `prompts/<skill>.md` as the standalone instruction in chat-prompt cases, where `files` names that prompt and inputs sit inline in `prompt`), then save the output. For synthesis artifacts, run the mechanical grader:

```bash
node scripts/grade-output.mjs <artifact.md> --skill <refine-story|qa-plan|requirements-discovery|meeting-minutes> [--lang <en-US|pt-BR>] --json
```

The grader evaluates artifacts in en-US and pt-BR: section names, verdicts, markers, and Gherkin keywords come from its language table. The language is detected from the artifact; `--lang` fixes which one to expect, and then an artifact mixing both fails on `markers consistent with <language>` and on `sections present in <language>`. A section that exists in neither language fails instead of passing empty.

`--json` emits the `grading.json` format the `skill-creator` viewer expects (`text`, `passed`, `evidence`), with the graded language in `language`.

## Repeat runs and the threshold

One run of a case says what happened once. The sessions recorded in ADR 0005 moved the same behavior from zero of five runs to three of three, so a single sample cannot separate a fix from variance, and a suite of single samples reports a lucky run as a fixed defect.

A case is measured over several runs, each run graded exactly as it is today, and the case reports a pass rate over runs. How many runs depends on what grades the case:

| What grades the case | Runs | Why |
| --- | --- | --- |
| The mechanical grader alone, over a published artifact | 3 | The checks are deterministic given the artifact, so the variance measured is the session's, not the grader's |
| Assertions read by a grading subagent or a person | 5 | Reading adds its own variance on top of the session's, and one miss in five has to be distinguishable from a rule that does not hold |
| A driven session, where a PO fixture answers rounds | 3 | Each run costs a full session plus the driving, so the number is a budget decision, recorded as such |

**An assertion holds when it passes in at least 80% of the runs.** At three runs that means all three; at five, four of five. The threshold is a property of the measurement, not of a case: a case that needs a looser one is a case whose assertion is not yet sharp enough to measure.

Some assertions have a trigger that a run may never meet: a rule about an answer the PO leaves open is not exercised by a run in which the PO answered. Such a run counts toward the rate, since the assertion did not fail in it, and is reported beside it as a run without the trigger, so that a wave in which no run met the trigger reads as what it is, a wave that demonstrated nothing about that rule.

Per run files live in the layout the workspace already uses, one directory per configuration and one per run:

```
<case>/with_skill/run-<n>/outputs/response.md
<case>/with_skill/run-<n>/grading.json
<case>/with_prompt/run-<n>/...
<case>/no_skill/run-<n>/...
```

`no_skill` is the baseline: the same prompt and the same fixtures, with no skill loaded and the Skill tool unused. It answers what the package adds rather than whether it works. A baseline comparison is measured at **three runs per configuration**, including the `with_skill` side and including cases that would otherwise get five, because a comparison costs two configurations at once; the cost of that choice is that a rate of two thirds on either side is a direction, not a number to quote. Two things keep it honest. The prompts must be identical between configurations, including any localization of fixture paths. And the baseline still reads the workspace configuration, which names markers, verdicts and Gherkin keywords, so what it measures is the model plus the configuration, not a bare model: the gap it shows is the floor of what the package adds, not the ceiling.

`grading.json` keeps the shape the viewer reads, `{expectations: [{text, passed, evidence}], summary: {...}}`, and the `--json` output of `grade-output.mjs` is accepted as it stands. Then:

```bash
node scripts/aggregate-runs.mjs <case directory> [--threshold 0.8] [--json]
node scripts/aggregate-runs.mjs <case>/with_skill --baseline <case>/no_skill
```

It reports the pass rate of each run, the rate of each assertion across runs with the runs it failed in named, and one verdict: `held` only when every assertion meets the threshold, exit code 0, otherwise `not held` and exit 1.

Three details decide what the numbers mean:

- A run is a `run-<n>` directory holding a grading file, ordered by that number. A grading file sitting beside them, which is what a single run measurement of the same case leaves behind, is not counted as one more run.
- Each run is scored against every assertion the case declares, not only the ones its own grading file lists. A grading file that skips an assertion lowers the run that skipped it, instead of reporting it as a perfect run over a shorter list.
- An assertion absent from a run counts as not held there and is named as absent, and an assertion listed more than once in one run is named too, because a grading file that skips or contradicts itself is not evidence that the assertion passed.

With `--baseline`, each assertion is also reported as bought by the package, already followed without it, lost, or held by neither, which is what names the rules worth questioning: an assertion the baseline already holds is a candidate for pruning, and an assertion the package loses is a defect in the package or in the assertion.

`evals/fixtures/runs/aggregate-example/` holds three grading files whose aggregate is known, one assertion holding in every run, one in a third, one in two thirds. `scripts/validate-skills.mjs` aggregates them and fails if the numbers move, which is the aggregation's own regression. `evals/fixtures/runs/compare-example/` does the same for the comparison, with one assertion the package buys, one the model already follows, and one neither holds.

## Fixtures

Flat directory, where the file name declares the language of the material: English names hold en-US material (`us-245-silence-alerts.md`, `CONTEXT-fleet.md`), Portuguese names hold pt-BR material (`us-245-silenciar-alertas.md`, `CONTEXT-frota.md`).

Every skill case carries one workspace configuration fixture in `files`, `refinement-no-code-en-US.md`, `refinement-no-code-pt-BR.md`, or `refinement-with-code-en-US.md`, read in place of `docs/agents/refinement.md`. Without it the workflow stops asking for `/configure-refinement`, and the case grades the stop instead of the examination. In `com-codigo` cases, `refinement-with-code-en-US.md` points at `evals/fixtures/code-workspace/`, a small RouteWise codebase whose source files the case also declares in `files`; when copying fixtures into an isolated run workspace, keep those files under `evals/fixtures/code-workspace/` inside the copy so the configuration path resolves unchanged. Chat-prompt cases declare only `prompts/<skill>.md` in `files` and paste their inputs inline in `prompt`, with no workspace configuration or fixture files; what the validator checks on both shapes is listed in `docs/agents/harness.md`.

### Scripted Product Owner answers

`po-answers-245-<language>.md` holds the answers a PO gives to the round `refine-story` opens over the US-245 fixture of that language: `po-answers-245-en-US.md` answers `us-245-silence-alerts.md`, and `po-answers-245-pt-BR.md` answers `us-245-silenciar-alertas.md`, subject for subject. They are what lets a run reach synthesis; without them the session stops at the round, which is why the assertions of the examination cases end at "waits for the PO".

The protocol:

- The fixture belongs to whoever drives the run, a person or a subagent playing the PO. The session under test receives the answer lines of the subjects it asked about, never the file: a session that reads the file reads ahead to subjects it has not asked about, and the round stops being a measurement of what it decided to ask.
- Answers are matched **by subject**, never by question number. Numbering varies between runs, so a fixture keyed to `Q3` would only fit the run it was written against.
- A question no subject covers gets the fixture's **Anything else** reply. An improvised answer makes the run unattributable: a divergence in the artifact can no longer be told apart from a divergence in the input.
- Two subjects per question, or one subject answering two questions, is normal. Reply with the lines of each, and keep the lines unchanged when a later round reopens a subject.
- Copy the fixtures the case names into the run workspace, and point the session at the copies. A session driven to synthesis records resolved terms in `CONTEXT.md`, which here is a copy of `CONTEXT-fleet.md` or `CONTEXT-frota.md`: run it against the fixture in place and the next run starts from a glossary the previous one wrote, which is the comparability the repeat runs depend on.
- Keep the glossary the session started from, and when the run ends read the one it left against it: `node scripts/diff-glossary.mjs <fixture copy at the start> <workspace>/CONTEXT.md --json > run-<n>/glossary.json`. A term the session rewrote, removed, or defined twice fails, which is the detectable half of the challenge rule of `socratic-examination`; a definition kept whole with a `[TO CONFIRM:` sentence added beside it passes as flagged; `aggregate-runs.mjs <case> --grading glossary.json` then gives its rate over runs beside the artifact grade. The contradiction that enters through a sentence inside a new entry is not detected, and the `names` list the check prints for each added term is where to read for it.
- Record whether the session opened the answers file. It sits in the directory the prompt points the session at, and a session that reads ahead to subjects it has not asked about makes "waits for the PO" and "no number invented" pass for the wrong reason, with nothing in the recorded session to show it.

What the answers are built to exercise, and what to read the published artifact against: the retroactive reading is refused and routed to the engineering team, which has to surface as `[TO CONFIRM: engineering team]` plus a questionnaire rather than as a resolved rule; the window, what it suppresses, and the shared silencing have no basis in the story text, so they have to be carried as decisions the PO made and not as `[INFERENCE: base]`; and no number the answers do not state, starting with a duration, may appear as an assertion. The same holds for behavior: an element none of the answers describe, a row showing remaining time for instance, appears in a `Then` only with an `[INFERENCE: base]` on that line whose base is a sentence someone can point at; a base that argues the product would need it is an invention, and a marker anywhere but that line, Notes included, licenses nothing the scenario asserts, which is the rule of `requirements-rigor`.

`fixtures/artifacts/` holds published artifacts, one per workflow and language, named `<skill>[-actions]-<en-US|pt-BR>.md`. They are the grader's own regression: `scripts/validate-skills.mjs` grades every one of them in the language its name declares and fails if any check fails. A new rule in the grader starts here, with the fixture that exercises it.

## What is evaluated

- **Examination workflows** (`refine-story`, `qa-plan`, `requirements-discovery`): the **first round**, in the format `socratic-examination` defines. With no PO answering, the session does not advance, and it is in the first round that triage, fact seeking, and the shape of the questions appear. The assertions check that triage was stated, that questions carry a recommended answer with a cited base, that nothing was invented, and that the agent waited for the PO instead of synthesizing.
- **Synthesis** (`meeting-minutes`, and the final artifacts of the workflows when a case simulates the PO answers): the published artifact, graded by the mechanical grader plus the assertions of the case.
- **Language**: each suite carries en-US cases, the package default, and one pt-BR case that exercises the same discipline with Portuguese dialogue, markers, and verdicts. A mixed-language artifact fails.

## Optimizing triggering

Only `requirements-rigor` and `socratic-examination` are model-invoked; the others are user-invoked and do not depend on `description` to fire. Each of the two carries a trigger eval set in `evals/triggers/<skill>.json`, in the shape the `skill-creator` loop reads, `[{query, should_trigger}]`: at least ten queries that should fire and at least ten near misses that share vocabulary but need something else (a code review, minutes with no requirement content, a unit test for one function, a socratic quiz on another subject), in both languages. The validator requires the set, and the Validation list of `docs/agents/harness.md` is where what it checks is written down.

The loop is `scripts/run_loop.py` from `skill-creator`, and `scripts/run_eval.py` beside it scores one description without proposing another. It plants a command file carrying the description in `.claude/commands/` of the nearest project root, runs each query through `claude -p`, and counts a query as triggered when the Skill tool names that file.

**Run it with `--num-workers 1`.** This is the measurement, not a detail of it. At `--num-workers 6`, the default, a query whose skill fires in 3 of 3 serial runs fires in 1 of 6 parallel ones, and the failures are silent: `run_eval.py` sends the subprocess stderr to `/dev/null` and counts any run that produced no stream event as a run that did not trigger. A parallel wave therefore reports a description that never fires, on the should-fire half and on the near misses alike, which reads as a precise description with no recall rather than as a broken measurement. Two workers already degrade it, so a wave over both skills runs them one after another, and a full pass of twenty queries at three runs costs sixty serial sessions, around half an hour per skill. The same load breaks the improvement call between iterations, which fails with `claude -p exited 1` and aborts the loop; the prompt it logs replays successfully on its own.

Three more things about this environment shape the result, and a rerun has to repeat them:

- Run from a neutral project root, a directory holding an empty `.claude/`, never from this repository: `AGENTS.md` describes both primitives and would be loaded into every query.
- Remove the two primitives from `~/.claude/skills` and `~/.agents/skills` for the duration (`scripts/link-skills.sh` restores them). Linked, the model sees the real skill beside the planted copy under the same description, and a call to the real one counts as a miss.
- Restrict the skills list to the project source, through a `claude` shim on `PATH` that adds `--setting-sources project`, and have the same shim strip MCP servers (`--strict-mcp-config --mcp-config '{"mcpServers":{}}'`). Without the first, the measurement runs against whatever else the machine has installed, and a plugin that competes head on, a grilling skill or a code review skill, takes the trigger and reads as a miss on this package's description. The second cut the cost per call from 0.90 to 0.17 USD in a probe without touching the skills list the decision is made from.

Results land in `refinement-skills-workspace/trigger-*/`, git ignored; the measured scores are recorded in ticket 11 of `docs/tickets/measurement-depth/`.
