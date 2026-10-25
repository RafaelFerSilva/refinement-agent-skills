# 17: A pt-BR assertion penalizes the package for following ADR 0005

Status: resolved
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

The same wording appears in two sibling cases, found in the preflight: `evals/requirements-discovery.json` case 3 carries it with no examples at all, and `evals/qa-plan.json` case 3 carries it over origin markers, where `[MANUAL-ONLY]` is the canonical token that would trip it. One defect, three assertions.

## Evidence

- The comparison above, from `node scripts/aggregate-runs.mjs refinement-skills-workspace/baseline-refine-story-4-pt-BR/with_skill --baseline refinement-skills-workspace/baseline-refine-story-4-pt-BR/no_skill`.
- `evals/refine-story.json`, case 4, third assertion.
- `skills/requirements-rigor/SKILL.md`, the marker table, and `docs/adr/0005-what-pt-br-localizes.md`, the canonical set.

## What a fix has to decide

Whether to name the canonical exceptions inside the assertion, which is the smallest change and keeps the rule it was written to protect, or to drop the assertion in favour of the grader check that already covers marker language. The first reading looks right: the assertion exists because pt-BR runs once mixed `[INFERENCE:` into Portuguese artifacts, and that failure mode is still worth catching.

## Comments

- 2026-10-25 Triaged: ready-for-agent, and first in the queue. Smallest change of the six, no rule moves, and it unblocks honest measurement in pt-BR: while the assertion stands, every pt-BR run that does the right thing is scored as doing the wrong one, which contaminates ticket 13's measurement and any repeat run of case 4. The direction is already settled by ADR 0005, so the work is naming the canonical exceptions inside the assertion rather than deciding anything.
- 2026-10-25 Preflight (commit 6c0f005): adjusted, scope widened from one assertion to three.
  - Docs: ADR 0005 "Canonical in both languages" settles the direction, so nothing here is a judgment call; `skills/requirements-rigor/SKILL.md:39` is the marker table, where `[INVEST-FAIL: letter]` and `[INVEST-FAIL: letra]` differ only in the placeholder and `[MANUAL-ONLY]` is identical in both columns; `harness.md` "What the harness does not check" explains why this slipped, since reading an assertion is judgment and nothing mechanical compares an assertion against the ADR.
  - Package: the assertion text at `evals/refine-story.json` case 4 is as the ticket quotes: confirmed. The canonical set in ADR 0005 and the marker table: confirmed. `[INVEST-FAIL:` absent from both token lists of `scripts/grade-output.mjs`: confirmed, so the grader never flagged it and only the read assertion did. **Changed**: the ticket treats this as one assertion in one case. `grep` over `evals/*.json` finds the same "no English markers mixed in" wording in three places: `refine-story` case 4, `requirements-discovery` case 3, and `qa-plan` case 3. The ticket text is updated in this edit to say so. `meeting-minutes` case 3 names the exact English markers it rejects and is correct as written.
  - Reproduction: the measured run of ticket 05, re-read rather than re-run. `node scripts/aggregate-runs.mjs refinement-skills-workspace/baseline-refine-story-4-pt-BR/with_skill --baseline refinement-skills-workspace/baseline-refine-story-4-pt-BR/no_skill` reports `LOST with 33% vs baseline 100%` on that assertion, and the two failing gradings quote `[INVEST-FAIL: V]` as their reason.
  - Criteria: this ticket states no acceptance criteria; the work is the three assertions plus a check that makes the rule hold for the next one written.
  - Conflicts: localized vocabulary, so both languages and the point of decision matter. Nothing moves in `skills/`, so `prompts/` is unaffected. The stored runs of ticket 05 keep their gradings, which is what makes a before and after possible without spending sessions.
- 2026-10-25 Implemented and measured. Three assertions corrected and one check added, in that order: the check first, confirmed failing on all three.
  - The check: `scripts/validate-skills.mjs` now reads every assertion in `evals/*.json` and, when one rejects markers of the other language, requires it to name the canonical `INVEST-FAIL` and `MANUAL-ONLY`. Before the fix it failed three times, once per case; after, the suite is clean. This is the regression guard the defect lacked: the grader cannot catch a bad assertion, because reading an assertion is judgment, so the check is on the wording rather than on an artifact.
  - The three assertions now end with "except `[INVEST-FAIL:` and `[MANUAL-ONLY]`, which ADR 0005 keeps canonical in both languages": `refine-story` case 4, `requirements-discovery` case 3, `qa-plan` case 3. `meeting-minutes` case 3 was left alone, since it names the exact English markers it rejects and is correct as written.
  - Measured by regrading, not by rerunning: the six stored pt-BR responses of ticket 05 were judged again against the corrected assertion by a pass that read the responses only, with the earlier verdicts withheld from it. Two of the three runs with the skill flip from failed to held, for carrying `[INVEST-FAIL: V]` and nothing else of the other language; the three baseline runs are unchanged, since they produced no marker of either kind.

```
before   LOST     with  33% vs baseline 100%   4 bought, 1 already followed, 1 lost
after    ALREADY  with 100% vs baseline 100%   4 bought, 2 already followed, 0 lost
```

  - Each `with_skill` run of that case goes from 5 of 6 to 6 of 6. The package no longer scores below the model without it anywhere in the four cases of ticket 05.
  - What the regrade does not establish: it rejudges three stored runs, so it says the assertion no longer punishes a correct artifact, not that the package would hold the assertion across fresh runs. That is a repeat measurement and belongs with whichever ticket next needs case 4 measured.
  - Review finding applied, in two passes. The guard first keyed on the single phrase "no English markers mixed in", the wording the three assertions happened to share, so the same demand written another way passed. It now recognizes a demand rather than a sentence: markers in their Portuguese or pt-BR form, markers said to be in Portuguese with the markers as the subject, and a wholesale rejection of markers in English. Checked against the phrasings the review named ("every marker is in Portuguese", "markers follow the pt-BR forms", "no marker in English appears"), all three now rejected, against the reworded "Rigor markers appear in their Portuguese form throughout the spec", also rejected, and against three assertions that must stay exempt.
  - Two exemptions, each for a reason rather than for convenience. An assertion that names the English markers it rejects, like `meeting-minutes` case 3, is bounded by that list and cannot catch a canonical marker by accident. And an assertion where the artifact rather than the markers is said to be in Portuguese is not a demand about markers: the first widening caught that one and failed the suite on a correct assertion, which is how the distinction was found.

