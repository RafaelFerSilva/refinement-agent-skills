# 05: Record a baseline without the skills

Status: ready-for-agent
Blocked by: 04
Type: task
Origin: 2026-10-25 (commit 81547f6)

No case has ever run without the skills, so the package has no evidence that it beats a competent model reading the same fixture. That is the first question an adopter asks, and the one the suite cannot answer.

Run the four most informative cases with the fixture and the prompt but no skill, grade them with the same assertions, and record the comparison. The point is not to win: a baseline that scores well on some assertions tells us which rules the model already follows and which ones the package is actually buying.

## Acceptance criteria

- Four cases run without any skill loaded, on the same fixtures and prompts, recorded under a baseline configuration directory.
- The same assertions are graded, and a per-assertion comparison with the skill is recorded.
- The assertions where the baseline matches the package are named, since those are candidates for pruning from the skills.

## Comments
