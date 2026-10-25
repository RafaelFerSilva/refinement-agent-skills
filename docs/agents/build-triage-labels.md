# Build triage labels

The five canonical triage roles, used by `/triage` and read by the other engineering skills. Here they are `Status:` strings inside a ticket file, not labels on a remote tracker, because the tracker is local markdown.

| Role | String |
| --- | --- |
| needs triage | `needs-triage` |
| needs information | `needs-info` |
| ready for an agent | `ready-for-agent` |
| ready for a human | `ready-for-human` |
| will not fix | `wontfix` |

A ticket also passes through `claimed` and `resolved` while it is worked, as [`build-issue-tracker.md`](build-issue-tracker.md) describes. `/implement` starts only from a ticket whose status allows work and whose blockers are resolved, which the preflight checks first.

This file is construction configuration. It is not `docs/agents/triage-labels.md`, which `requirements-rigor` reads in a target workspace to map a refinement verdict (READY, REFINE, BLOCKED and their pt-BR forms) onto that workspace's tracker labels. Different vocabulary, different purpose, different repository.
