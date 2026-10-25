# 02: Run the examination to synthesis and grade the published User Story

Status: ready-for-agent
Blocked by: 01
Type: task
Origin: 2026-10-25 (commit 81547f6)

The first end to end measurement of the package. Drive `refine-story` over US-245 with the scripted answers until the frontier empties, let it publish, and grade the artifact.

This is where the claim gets tested: that the rounds converge, that the verdict matches what the answers support, that every criterion is Gherkin a QA engineer could automate, that what the PO refused appears as `[TO CONFIRM: whom]` with a questionnaire, and that nothing the answers did not say turns into an assertion.

Defects found here are filed as their own tickets rather than fixed in place: this ticket measures, and a rule change needs its own preflight.

## Acceptance criteria

- A full session is recorded under `refinement-skills-workspace/`, with the published User Story and any questionnaire.
- `node scripts/grade-output.mjs <published US> --skill refine-story --lang en-US` runs and its output is recorded, pass or fail.
- The INVEST scorecard, the verdict and the open questions are read against the scripted answers, and every divergence is written down.
- Each defect found becomes a ticket in this effort, with the evidence quoted.

## Comments
