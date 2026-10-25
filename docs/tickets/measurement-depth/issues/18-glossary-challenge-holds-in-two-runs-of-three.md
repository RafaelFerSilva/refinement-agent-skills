# 18: The glossary challenge fires in two runs of three

Status: ready-for-human
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

## Comments

- 2026-10-25 Triaged: ready-for-agent, then claimed in the same pass. The ticket asks where a rule has to live for it to hold, which is a question about the doctrine of `socratic-examination` and does not need the user to arbitrate it. It goes before tickets 13 and 12 because both are rule changes in the same primitive and would inherit whatever ceiling this one finds.
- 2026-10-25 Preflight (commit d7d072b): confirmed
  - Docs: ADR 0005 "Considered alternatives" carries the precedent the ticket rests on, "a rule stated in a file the run may not open behaves as optional", and the zero of five to three of three series. `AGENTS.md` Invariants forbids the third candidate: a rule used by more than one workflow lives in the primitive, once. `evals/README.md:29` budgets a driven session at three runs and `:31` holds an assertion at 80%, which at three runs means all three. `harness.md:59` already records that no check reads whether a glossary written during the session agrees with itself, so this rule stays on the "does not check" list and the measurement stands in for a test.
  - Package: `skills/socratic-examination/SKILL.md:54` and `:58` carry the wording ticket 14 left, unchanged since `d7d072b`. The table the ticket quotes matches the recorded runs: `refinement-skills-workspace/glossary-challenge/after2/run-2/workspace/CONTEXT.md` holds the one contradicting entry of the last wave, the `Silencing` entry asserting that the reading "still appears in the operational report, marked as occurring while silenced", against an `Operational report` entry defined over readings and left untouched. Confirmed.
  - Reproduction: the three `after2` runs are the reproduction and the baseline for this ticket, measured under the protocol this change reuses, so the before side is not re-run.
  - Criteria: no acceptance criteria stated; the ticket asks for a placement decision and the measurement that judges it.
  - Conflicts: two. `qa-plan:49`, `requirements-discovery:33` and `refine-story:35` each state the end of examination in their own completion criterion, abbreviated from the primitive; a closing obligation added to the primitive is not repeated into them, both because the invariant sends a shared rule to the primitive and because changing three workflows would make the measurement unattributable. And the primitive already carries a write-time glossary rule, so a closing pass has to be a different obligation rather than the same sentence twice.
- 2026-10-25 Implemented and measured over six more driven sessions. The hypothesis the ticket carried is not supported: the rule moved to a second placement, tried there in two wordings, and the rate did not move.
  - The change, in `skills/socratic-examination/SKILL.md`, puts the check at the moment every session reaches, the end of examination, instead of in a bullet read at the start: "One pass separates the end of examination from synthesis. Re-read `CONTEXT.md`, where the workspace has one, against two things: the answers this session collected, and the entries as they read when the session opened." The second term was added after the first wave, for the reason the first wave exposed. `prompts/` regenerated.
  - Protocol: the same story, the same answers by subject, the same model, three runs per wave, judged from the files each run left rather than from what it reported. The before side is the `after2` wave of ticket 14, measured identically, so it was not re-run.

```
                                     challenge raised   contradicting entry   definition widened with no PO
after2, the wording of ticket 14          2 of 3              1 of 3                    0 of 3
after3, the closing pass                  2 of 3              0 of 3                    1 of 3
after4, the pass over both sides          2 of 3              0 of 3                    1 of 3
```

  - **Not held, and the reason is now specific.** Two placements, three wordings, nine runs, six challenges. What the closing pass bought is the second column: no run left the glossary saying two things about one term. What it did not buy is the first, and the miss simply changed shape. A session that accepts the widening now rewrites the existing entry instead of contradicting it, so the glossary agrees with itself and the definition changed without the PO. The second wave makes the limit explicit: `after4/run-1` widened `Operational report`, ran the pass, and reported "Re-checked for conflicts with pre-session entries: none found". That is one run, and it suggests rather than shows what the next attempt is up against: a session that does not see the widening as a widening may not see it on a re-read either, however the re-read is worded.
  - What the two misses have in common is the moment, not the wording: both wrote the glossary at the end of the round in which the answer arrived, before any later instruction could apply. The four runs that challenged, two per wave, all held the contested entry open; two of them wrote other entries in that same round, so what the challenge buys is the entry under dispute and not a general pause.
  - The wording kept is the sharpened one. It costs nothing, it removed the self-contradicting glossary of ticket 14, and `after4/run-2` shows the behavior at its best: `Operational report` left as it was with `[TO CONFIRM: operations director]` appended, and the back door named out loud: it held back a new `alert` entry too, because that one "would reference the operational report and I would be asserting the same widening through the back door".
  - Handed back as `ready-for-human`, because what is left is a decision and not a rewording. Three ways out, and the evidence does not pick between them. Accept the rule at two of three and say so in `harness.md`, which is honest but puts a rule in the package that one session in three ignores. Spend a mechanism rather than a sentence, by making the glossary conflict an item on the frontier, which is where the two misses would have had to pass; that costs round shape, and ticket 12 already touches round shape. Or drop the rule, on the ground that a check only two sessions in three perform is a false promise. That choice is also the moment to record an ADR, which this measurement does not do on its own.
  - Two clauses of the wording are not covered by the measurement, both added after it from the review of this change. The pass now says "where the workspace has one", because `GLOSSARY.md` creates `CONTEXT.md` only when a term is first resolved and a session that resolved none has no file to re-read. And a widening found after the PO has closed the session stays as `[TO CONFIRM: PO]` beside the unchanged entry instead of forcing a round on a PO who asked to stop, which the first wording would have demanded. No run exercised either branch.
