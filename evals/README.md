# Evals

Test cases in the format of Anthropic's `skill-creator`: one file per skill, with realistic prompts, expected output, and assertions. Every fixture in `fixtures/` is fictional (RouteWise, Fleet Project); client material never enters here.

## How to run

With `skill-creator` installed: run `/skill-creator` and ask it to run the evals in `evals/<skill>.json`. It triggers one run with the skill and one without, writes the outputs to `<skill>-workspace/iteration-N/` (git-ignored), and opens the viewer.

Without it, one subagent per case: give it the prompt, the files listed in `files`, and the path to the skill, then save the output. For synthesis artifacts, run the mechanical grader:

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

Per run files live in the layout the workspace already uses, one directory per configuration and one per run:

```
<case>/with_skill/run-<n>/outputs/response.md
<case>/with_skill/run-<n>/grading.json
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

Every case carries a workspace configuration fixture in `files`, `refinement-no-code-en-US.md` or `refinement-no-code-pt-BR.md`, read in place of `docs/agents/refinement.md`. Without it the workflow stops asking for `/configure-refinement`, and the case grades the stop instead of the examination. The validator rejects a case that provides none.

### Scripted Product Owner answers

`po-answers-245-<language>.md` holds the answers a PO gives to the round `refine-story` opens over the US-245 fixture of that language: `po-answers-245-en-US.md` answers `us-245-silence-alerts.md`, and `po-answers-245-pt-BR.md` answers `us-245-silenciar-alertas.md`, subject for subject. They are what lets a run reach synthesis; without them the session stops at the round, which is why the assertions of the examination cases end at "waits for the PO".

The protocol:

- The fixture belongs to whoever drives the run, a person or a subagent playing the PO. The session under test receives the answer lines of the subjects it asked about, never the file: a session that reads the file reads ahead to subjects it has not asked about, and the round stops being a measurement of what it decided to ask.
- Answers are matched **by subject**, never by question number. Numbering varies between runs, so a fixture keyed to `Q3` would only fit the run it was written against.
- A question no subject covers gets the fixture's **Anything else** reply. An improvised answer makes the run unattributable: a divergence in the artifact can no longer be told apart from a divergence in the input.
- Two subjects per question, or one subject answering two questions, is normal. Reply with the lines of each, and keep the lines unchanged when a later round reopens a subject.
- Copy the fixtures the case names into the run workspace, and point the session at the copies. A session driven to synthesis records resolved terms in `CONTEXT.md`, which here is a copy of `CONTEXT-fleet.md` or `CONTEXT-frota.md`: run it against the fixture in place and the next run starts from a glossary the previous one wrote, which is the comparability the repeat runs depend on.
- Record whether the session opened the answers file. It sits in the directory the prompt points the session at, and a session that reads ahead to subjects it has not asked about makes "waits for the PO" and "no number invented" pass for the wrong reason, with nothing in the recorded session to show it.

What the answers are built to exercise, and what to read the published artifact against: the retroactive reading is refused and routed to the engineering team, which has to surface as `[TO CONFIRM: engineering team]` plus a questionnaire rather than as a resolved rule; the window, what it suppresses, and the shared silencing have no basis in the story text, so they have to be carried as decisions the PO made and not as `[INFERENCE: base]`; and no number the answers do not state, starting with a duration, may appear as an assertion.

`fixtures/artifacts/` holds published artifacts, one per workflow and language, named `<skill>[-actions]-<en-US|pt-BR>.md`. They are the grader's own regression: `scripts/validate-skills.mjs` grades every one of them in the language its name declares and fails if any check fails. A new rule in the grader starts here, with the fixture that exercises it.

## What is evaluated

- **Examination workflows** (`refine-story`, `qa-plan`, `requirements-discovery`): the **first round**, in the format `socratic-examination` defines. With no PO answering, the session does not advance, and it is in the first round that triage, fact seeking, and the shape of the questions appear. The assertions check that triage was stated, that questions carry a recommended answer with a cited base, that nothing was invented, and that the agent waited for the PO instead of synthesizing.
- **Synthesis** (`meeting-minutes`, and the final artifacts of the workflows when a case simulates the PO answers): the published artifact, graded by the mechanical grader plus the assertions of the case.
- **Language**: each suite carries en-US cases, the package default, and one pt-BR case that exercises the same discipline with Portuguese dialogue, markers, and verdicts. A mixed-language artifact fails.

## Optimizing triggering

Only `requirements-rigor` and `socratic-examination` are model-invoked; the others are user-invoked and do not depend on `description` to fire. The `skill-creator` description optimization loop applies to those two: generate 20 queries, half that should trigger and half that nearly trigger but should not (code review requests, minutes with no requirement content, a unit test for one function), then run `scripts/run_loop.py` from `skill-creator`.
