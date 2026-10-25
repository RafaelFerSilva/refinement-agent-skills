# 16: The grader fails an artifact for a rule no skill states

Status: resolved
Blocked by: none
Type: task
Origin: 2026-10-25 (commit 9c3d0fe)

Found by the pt-BR end to end run of ticket 03. The published artifact failed exactly one check:

```
node scripts/grade-output.mjs refinement-skills-workspace/end-to-end-245-pt-BR/.scratch/245-silenciar-alertas/spec.md --skill refine-story --lang pt-BR
FAIL  no em-dash
14/15
```

The two offending lines are ordinary Portuguese prose. The character cannot be reproduced here, because the prose rule of this repository forbids it in every committed file, so the quotes below write it as `(em-dash)` where the artifact carries the character itself:

> 🔶 REFINAR (em-dash) desbloqueia com a resposta à Pergunta em Aberto nº 1

> Tarefas técnicas sugeridas, movidas dos critérios: AC2 original, "Ajustar a tabela de alertas para guardar o silenciamento" (em-dash) como o silenciamento é persistido é decisão do time

`grep -rn` over `skills/` and `prompts/` returns nothing for the rule: no `SKILL.md`, no `TEMPLATE.md`, and no generated prompt tells the agent that a published artifact may not use an em-dash. `AGENTS.md` states it, and `AGENTS.md` is the constitution of this repository, not a file the package installs into a workspace. So the package grades an artifact against a rule it never communicates, and `scripts/validate-skills.mjs` keeps the repository clean of dashes while leaving the generated artifact unguided.

The asymmetry between languages is what surfaced it. The en-US run produced no em-dash and passed; Portuguese prose reaches for the travessão by default, so the same discipline fails in one language and not the other. Any pt-BR eval case that grades a synthesis inherits this.

## Evidence

- The grader output above, against `scripts/grade-output.mjs`, the global check `no em-dash`.
- `refinement-skills-workspace/end-to-end-245-pt-BR/.scratch/245-silenciar-alertas/spec.md`, the Veredito section and the second bullet of Notas.
- The en-US artifact of ticket 02, which passes the same check without being told to.

## What a fix has to decide

Whether the rule belongs to the artifact at all. Two readings, and they point opposite ways. If the no-dash rule is house style for this repository's prose, the grader check is the thing that is wrong, and it should not apply to an artifact published in a user's workspace. If it is a property the package wants in what it publishes, then it belongs where the artifact is written, stated once in `requirements-rigor` and reachable from both languages, which is a rule change needing its own preflight and its own measurement.

## Comments

- 2026-10-25 Triaged: ready-for-agent, with the direction settled by the user: the no dash rule is house style for this repository, not a property the package demands of what it publishes. So the grader stops applying `no em-dash` to a published artifact, and the rule keeps holding where it belongs, over the repository's own files through `scripts/validate-skills.mjs`, which already walks them.
  - What this means for the fixtures in `evals/fixtures/artifacts/`: they are repository files, so the prose rule still reaches them through the validator's own walk, and losing the grader check there costs nothing.
  - Watch for the regression this opens: the check was the only thing failing the pt-BR artifact of ticket 03, so after the change that artifact grades 15 of 15, and the eval that reported a difference between the languages stops reporting one. Record that in the ticket when it lands, otherwise a later reader will think the gap closed by itself.
- 2026-10-25 Preflight (commit e53315f): confirmed
  - Docs: `AGENTS.md:20` states the rule as a property of repository prose, which is what the triage decision rests on; `docs/agents/harness.md:20` lists it among what `scripts/validate-skills.mjs` carries, and that stays true after this change; `docs/agents/ticket-preflight.md:33` asks every preflight to check prose for it, also unaffected; `evals/README.md` never mentions it, so no documentation claims the grader enforces it.
  - Package: `scripts/grade-output.mjs:205` is the check, `check('no em-dash', !text.includes('\u2014'))`, global rather than per workflow: confirmed. `scripts/validate-skills.mjs:96` walks every committed `.md` outside `.git`, `node_modules`, `.scratch` and `*-workspace`, which includes `evals/fixtures/artifacts/`: confirmed, so the repository half of the rule holds without the grader. `grep -rn` over `skills/` and `prompts/` returns nothing for the rule: confirmed, the package still never tells an agent about it.
  - Reproduction: `node scripts/grade-output.mjs refinement-skills-workspace/end-to-end-245-pt-BR/.scratch/245-silenciar-alertas/spec.md --skill refine-story --lang pt-BR` gives 14 of 15 with `FAIL no em-dash` as the only failure, and `evals/fixtures/artifacts/refine-story-pt-BR.md` gives 15 of 15.
  - Criteria: this ticket states no acceptance criteria; the work is removing the check, guarding the removal, and recording what the numbers do.
  - Conflicts: one, and it is the ticket's own subject. `/implement` says a grader change starts from a fixture under `evals/fixtures/artifacts/` that fails before the fix, and such a fixture would have to carry the character, which `AGENTS.md:20` forbids in every committed file and the validator enforces. So the failing case is built at validation time instead: the validator copies the clean pt-BR fixture, inserts the character, and requires the grader to pass it. The character lives in the script as an escape, never as a byte in committed prose.
- 2026-10-25 Implemented. The check is gone from `scripts/grade-output.mjs`, with a comment in its place saying why, so the next reader does not restore it as an oversight.
  - The guard came first and failed first: `error: grade-output.mjs fails an artifact over a dash, which is repository style and not a rule the package states: FAIL no em-dash`. It copies `evals/fixtures/artifacts/refine-story-pt-BR.md` into a temp directory, appends a line carrying the character, grades it, and requires a pass. The character exists in the validator as an escape and never as a byte in a committed file.
  - Both halves verified after the change. The grader: the pt-BR artifact of ticket 03 goes from 14 of 15 to **14 of 14**, and the en-US artifact of ticket 02 from 14 of 14 to **13 of 13**, the denominator falling by one because the check was global. The repository: appending a line with the character to a committed fixture still fails the validator with `evals/fixtures/artifacts/refine-story-pt-BR.md: contains an em-dash`, and the fixture was restored.
  - The regression the triage asked to record, in plain words: **the pt-BR synthesis of ticket 03 now grades clean, and that is this change, not an improvement in the package.** The only failing check in the first pt-BR end to end run was this one. Anyone reading the ticket 03 numbers later should read them against the grader of that day, which had fifteen checks.
  - Left for ticket 15, which was blocked on this one so it could describe the final state: `harness.md` still says the validator carries the prose rule, which remains true, and says nothing about the grader deliberately not carrying it. That sentence belongs to the documentation half of 15.
  - Review findings applied: the guard skipped silently when its fixture was absent, which was reproduced by moving `refine-story-pt-BR.md` away and restoring the check in the grader, after which the validator printed `ok` and exited 0; it now fails with a named reason, like the other regressions in that file. And the amendment written into ticket 02 said no check the artifact passed had been removed, which denies exactly what happened: the artifact was passing that check, and the sentence now says the removal hides no failure.

