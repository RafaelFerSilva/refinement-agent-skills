# 17: A pt-BR assertion penalizes the package for following ADR 0005

Status: needs-triage
Blocked by: none
Type: task
Origin: 2026-10-25 (commit d51bde6)

Found by the baseline comparison of ticket 05. One assertion is the only one in four cases where the package scores below the model without it:

```
LOST     with 33% vs baseline 100%  Rigor markers appear in their Portuguese form, such as
                                    `[INFERÊNCIA:` or `[A CONFIRMAR:`, with no English markers mixed in
```

Two of the three runs with the skill failed it for emitting `[INVEST-FAIL: V]` in a pt-BR round. The baseline runs passed it by never producing an INVEST marker at all.

`[INVEST-FAIL: V]` is what the package prescribes. `skills/requirements-rigor/SKILL.md` lists the marker as `[INVEST-FAIL: letter]` in en-US and `[INVEST-FAIL: letra]` in pt-BR, identical but for the placeholder, and ADR 0005 puts "INVEST criterion names and the results PASS and FAIL" in the canonical set that is not localized. `scripts/grade-output.mjs` agrees by omission: `[INVEST-FAIL:` appears in neither language's token list, so its `markers consistent with pt-BR` check never flags it.

So the assertion in `evals/refine-story.json` case 4 reads as if every bracketed marker must be Portuguese, and a reader grading it strictly marks a correct artifact as wrong. The run that passed did so by producing fewer markers, which is the opposite of what the package wants.

## Evidence

- The comparison above, from `node scripts/aggregate-runs.mjs refinement-skills-workspace/baseline-refine-story-4-pt-BR/with_skill --baseline refinement-skills-workspace/baseline-refine-story-4-pt-BR/no_skill`.
- `evals/refine-story.json`, case 4, third assertion.
- `skills/requirements-rigor/SKILL.md`, the marker table, and `docs/adr/0005-what-pt-br-localizes.md`, the canonical set.

## What a fix has to decide

Whether to name the canonical exceptions inside the assertion, which is the smallest change and keeps the rule it was written to protect, or to drop the assertion in favour of the grader check that already covers marker language. The first reading looks right: the assertion exists because pt-BR runs once mixed `[INFERENCE:` into Portuguese artifacts, and that failure mode is still worth catching.
