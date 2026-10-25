---
name: implement
description: "Implement a piece of work on this package based on a spec or set of tickets."
disable-model-invocation: true
---

Before writing anything, run the ticket preflight in [`docs/agents/ticket-preflight.md`](../../../docs/agents/ticket-preflight.md): re-verify the ticket against the package as it stands and against the documents that govern the area, then record the outcome in the ticket. Start only when the recorded outcome allows it.

Implement the work described by the user in the spec or tickets.

## What stands in for tests here

This package has no unit test suite, so the test-first habit lands on the checks that do exist, and in this order:

- A change to a rule a skill states: first make the rule checkable, by adding or sharpening a check in `scripts/validate-skills.mjs` or `scripts/grade-output.mjs`, or an assertion in `evals/*.json`, then change the rule, then measure. A rule shipped without a check that can fail is a rule nobody will notice breaking.
- A change to the harness itself: write the failing case first, which for the grader means a fixture under `evals/fixtures/artifacts/` and for the validator means the condition it must reject, and confirm it fails before the fix.
- `harness.md` records what the mechanical layer cannot check. When a rule falls there, say so in the ticket rather than pretending a check covers it.

## While working

Run `node scripts/validate-skills.mjs` often: it carries frontmatter, manifest, router, prose, eval references, grader regression and prompt freshness in one command. Run `node scripts/build-prompts.mjs` after any edit under `skills/`, because `prompts/` is generated and the validator rejects it when stale.

## Before reporting done

Run the Definition of Done from `AGENTS.md`: `node scripts/validate-skills.mjs`, `node scripts/build-prompts.mjs --check`, and `claude plugin validate . --strict`.

For a behavioral change, measure it. Rerun the eval cases that exercise the rule, two or three of them, in both languages when the rule is localized; the full suite only when the change touches more than one workflow. Report the before and after, and say plainly when a fix is not demonstrated: a single passing run does not separate a fix from variance, which is why the series in ADR 0005 was measured rather than asserted.

Then call the Skill tool with `code-review` on the work.

## Committing

Do not commit automatically. Propose a Conventional Commit message and ask for explicit authorization, or leave the work uncommitted for the user to review. The pre-commit hook runs the Definition of Done; when it fails, fix the cause rather than passing `--no-verify`.

Stage explicit paths rather than `git add -A`: this repository is also a working directory for other projects' files from time to time, and `-A` has already come close to committing one.
