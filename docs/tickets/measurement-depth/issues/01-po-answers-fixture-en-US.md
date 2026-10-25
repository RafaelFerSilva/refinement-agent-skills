# 01: Scripted Product Owner answers for US-245, en-US

Status: ready-for-agent
Blocked by: none
Type: task
Origin: 2026-10-25 (commit 81547f6)

A session cannot reach synthesis because nobody answers the round. Write the answers once, as a fixture, so any run can be driven to the end.

The fixture answers the questions `refine-story` asks of `evals/fixtures/us-245-silence-alerts.md`: who silences, the silencing window, what the window suppresses, whether the silence is per operator or shared, early reactivation, and the retroactive reading. It cannot answer by question number, because numbering varies between runs; it answers by subject, so a run matches its own questions against it.

Answers must be the kind a Product Owner gives, including the ones that refuse: at least one "I do not know, ask the engineering team" so that `[TO CONFIRM: whom]` and a questionnaire are exercised, and at least one decision with no basis in the source text, so the artifact has to carry it as a decision rather than as an inference.

## Acceptance criteria

- `evals/fixtures/po-answers-245-en-US.md` exists, answers by subject rather than by number, and covers every subject the round opens.
- It contains at least one refusal that routes to the engineering team, and at least one scope decision the source text does not support.
- `evals/README.md` documents the protocol: how a run uses the fixture, and that answers are matched by subject.
- Nothing in `skills/` changes.

## Comments
