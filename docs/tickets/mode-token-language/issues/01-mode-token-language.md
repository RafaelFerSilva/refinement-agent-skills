# 01: Decide whether the mode tokens stay canonical

Status: ready-for-human
Blocked by: none
Type: grilling
Origin: 2026-10-25 (commit 81547f6)

The configuration of an en-US workspace reads `Mode: sem-codigo`, and a run answers "Mode is `sem-codigo`" in the middle of an English response. ADR 0001 named the two modes in Portuguese and ADR 0005 lists them among the tokens that stay canonical in both languages, on the grounds that they are configuration keys in installed workspaces.

The question is whether that reasoning still holds now that every other localized token has a pt-BR form. It is a decision, not a defect, and it is not the agent's to arbitrate.

Localizing them to `with-code` and `without-code` reads better in an English workspace and costs a migration: every installed workspace has the Portuguese token written in `docs/agents/refinement.md`, so `/configure-refinement` would need to accept both forms for a while, and the four workflows plus the grader fixtures mention the tokens. Keeping them canonical costs nothing and leaves the oddity in place.

## Acceptance criteria

- The decision is recorded, either as an amendment to ADR 0005 or as a new ADR if it reverses one.
- If localized: both forms accepted on read, one form written, and the migration note stated in the configuration skill.

## Comments
