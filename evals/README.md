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

### Scripted Product Owner answers

`po-answers-245-<language>.md` holds the answers a PO gives to the round `refine-story` opens over the US-245 fixture of that language: `po-answers-245-en-US.md` answers `us-245-silence-alerts.md`. They are what lets a run reach synthesis; without them the session stops at the round, which is why the assertions of the examination cases end at "waits for the PO".

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
