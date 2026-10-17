# Tracker: local markdown

Refinement artifacts in this workspace live in `.scratch/`, versioned alongside repository code.

- One directory per topic: `.scratch/<slug>/`, following naming conventions in `refinement.md`.
- Every artifact carries `Status:` directly beneath its title and, when work items are configured, the work item ID line. Questionnaires are the exception: they follow their own format without `Status:`.
- Candidate stories and open decisions for a discovery live in `.scratch/<slug>/issues/NN-<slug>.md`, numbered starting at 01.
- Comments and discussion history appear at the end of the file under `## Comments`.

When a workflow says "publish": write the file to `.scratch/<slug>/`, creating the directory if missing. When it says "read the US": the user provides the file path or ID; an ID resolves to `.scratch/*/` by matching the title or identifier.
