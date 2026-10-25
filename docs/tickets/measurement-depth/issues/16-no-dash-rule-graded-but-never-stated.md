# 16: The grader fails an artifact for a rule no skill states

Status: ready-for-agent
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
