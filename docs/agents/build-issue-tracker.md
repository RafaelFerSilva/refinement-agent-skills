# Build issue tracker: local markdown, versioned

Specs and tickets for building this package live as markdown under `docs/tickets/`, committed with the code.

This is construction configuration: it says where the work on the package is tracked. It is not `docs/agents/issue-tracker.md`, the file `/configure-refinement` writes into a target workspace to say where refinement artifacts are published. The two never meet, because this repository is not a refinement workspace.

## Conventions

- One effort per directory: `docs/tickets/<feature-slug>/`
- The spec is `docs/tickets/<feature-slug>/spec.md`
- Tickets are one file per ticket at `docs/tickets/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`, never a single combined file
- Triage state is a `Status:` line near the top of each ticket, from the vocabulary in [`build-triage-labels.md`](build-triage-labels.md)
- A `Blocked by: NN, NN` line near the top carries the blocking edges; a ticket is unblocked when every ticket it lists is resolved
- An `Origin: YYYY-MM-DD (commit <hash>)` line records the package state the ticket was written against, which is what [`ticket-preflight.md`](ticket-preflight.md) re-verifies
- Comments and conversation history append at the bottom under a `## Comments` heading

`docs/tickets/` is versioned on purpose. A ticket here is the plan of record for a package whose history is already kept deliberately, in `docs/adr/` and in commit messages, and a plan that vanishes with the working directory cannot be read back six months later. `.scratch/` is left alone: in this repository that path names where a refinement artifact is published in a target workspace, and overloading it in the one repository that defines the term would cost more than it saves.

## When a skill says "publish to the issue tracker"

Create the file under `docs/tickets/<feature-slug>/`, creating the directory if needed.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user normally passes the path or the number.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `docs/tickets/<effort>/map.md`, carrying the Notes, Decisions-so-far and Fog body
- **Child ticket**: `docs/tickets/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`, `prototype`, `grilling`, `task`); a `Status:` line records `claimed` or `resolved`
- **Frontier**: scan `docs/tickets/<effort>/issues/` for tickets that are open, unblocked and unclaimed; first by number wins
- **Claim**: set `Status: claimed` and save before any work
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer, gist plus link, to the Decisions-so-far of `map.md`
