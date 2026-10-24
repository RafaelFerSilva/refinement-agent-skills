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

## Fixtures

Flat directory, where the file name declares the language of the material: English names hold en-US material (`us-245-silence-alerts.md`, `CONTEXT-fleet.md`), Portuguese names hold pt-BR material (`us-245-silenciar-alertas.md`, `CONTEXT-frota.md`).

Every case carries a workspace configuration fixture in `files`, `refinement-no-code-en-US.md` or `refinement-no-code-pt-BR.md`, read in place of `docs/agents/refinement.md`. Without it the workflow stops asking for `/configure-refinement`, and the case grades the stop instead of the examination. The validator rejects a case that provides none.

`fixtures/artifacts/` holds published artifacts, one per workflow and language, named `<skill>[-actions]-<en-US|pt-BR>.md`. They are the grader's own regression: `scripts/validate-skills.mjs` grades every one of them in the language its name declares and fails if any check fails. A new rule in the grader starts here, with the fixture that exercises it.

## What is evaluated

- **Examination workflows** (`refine-story`, `qa-plan`, `requirements-discovery`): the **first round**, in the format `socratic-examination` defines. With no PO answering, the session does not advance, and it is in the first round that triage, fact seeking, and the shape of the questions appear. The assertions check that triage was stated, that questions carry a recommended answer with a cited base, that nothing was invented, and that the agent waited for the PO instead of synthesizing.
- **Synthesis** (`meeting-minutes`, and the final artifacts of the workflows when a case simulates the PO answers): the published artifact, graded by the mechanical grader plus the assertions of the case.
- **Language**: each suite carries en-US cases, the package default, and one pt-BR case that exercises the same discipline with Portuguese dialogue, markers, and verdicts. A mixed-language artifact fails.

## Optimizing triggering

Only `requirements-rigor` and `socratic-examination` are model-invoked; the others are user-invoked and do not depend on `description` to fire. The `skill-creator` description optimization loop applies to those two: generate 20 queries, half that should trigger and half that nearly trigger but should not (code review requests, minutes with no requirement content, a unit test for one function), then run `scripts/run_loop.py` from `skill-creator`.
