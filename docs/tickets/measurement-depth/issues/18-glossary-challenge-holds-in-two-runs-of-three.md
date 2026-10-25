# 18: The glossary challenge fires in two runs of three

Status: needs-triage
Blocked by: none
Type: task
Origin: 2026-10-25 (commit fbd2386)

Ticket 14 made `socratic-examination` challenge an answer that widens a term the glossary already defines, and measured it over nine driven sessions. The rule works and does not hold:

```
                              challenge raised    contradicting entry written
before, rule as it was             0 of 3                   2 of 3
after, first wording               2 of 3                   1 of 3
after, sharpened wording           2 of 3                   1 of 3
```

Two wordings, the same 2 of 3. The convention in `evals/README.md` holds an assertion at 80% of runs, which at three runs means all three, so the behavior is improved and unreliable, and one session in three still publishes a glossary that contradicts itself.

## What a fix has to decide

Where the rule lives, rather than how it is worded. ADR 0005 recorded the precedent: "The anti-pattern tag went from zero of five runs to three of three only when the type names moved into the always loaded file." The rule here sits in a bullet list inside the primitive, read once at the start of a session and applied many rounds later, which is the same shape as the failure that ADR describes.

The candidates, and the tension between them:

- State it where the answer arrives, in the round discipline of `socratic-examination`, so it is read at the moment an answer lands rather than at the moment the session opens.
- State it where the glossary is written, which is the same file but a different section, and is where the detectable moment already is.
- Repeat it in the workflows, which the invariant in `AGENTS.md` forbids: a rule used by more than one workflow lives in the primitive, once. Any fix that tempts this way is a reason to question the invariant deliberately, not to break it quietly.

Whatever is tried, the measurement already exists and is cheap to repeat: nine sessions, the fixture answers of ticket 01, and the two numbers in the table above. Read that table with the caveat ticket 14 records: the configurations were separated by instruction, by pinning the before runs to a snapshot and banning the Skill tool, not by a boundary anything enforced.
