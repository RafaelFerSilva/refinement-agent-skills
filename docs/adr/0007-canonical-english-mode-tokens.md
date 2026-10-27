# Canonical English mode tokens, with legacy Portuguese tokens accepted on read

ADR 0001 named the two operating modes in Portuguese, ADR 0004 made English canonical across the repository and inside `docs/agents/refinement.md` itself (including `pt-BR` workspaces), and ADR 0005 kept `com-codigo` and `sem-codigo` canonical in both languages as configuration keys in installed workspaces. That left `com-codigo` and `sem-codigo` as the sole canonical tokens in the package spelled in Portuguese rather than English, causing `en-US` workspaces to write `Mode: sem-codigo` and English examination responses to echo `sem-codigo` or `com-codigo` mid-sentence.

We decided to supersede the mode-token clause of ADR 0005: `with-code` and `without-code` are the canonical operating mode tokens across both `en-US` and `pt-BR` workspaces, matching `Mode:`, `Language:`, `Status:`, `Azure:`, `PASS`, `FAIL`, `PO`, and `DEV`. One form is written (`Mode: with-code` or `Mode: without-code`), and both forms (`with-code` or `com-codigo`, `without-code` or `sem-codigo`) are accepted on read.

## Considered alternatives

Keeping `com-codigo` and `sem-codigo` canonical in both languages as ADR 0005 specified, rejected because `docs/agents/refinement.md` is already canonical English in both workspace languages and the skill-side migration is small: none of the four workflows or nine grader fixtures hardcode the Portuguese tokens. Localizing the mode token by workspace `Language:` (`with-code` and `without-code` in `en-US`, `com-codigo` and `sem-codigo` in `pt-BR`), rejected for the reason ADR 0005 stated: a configuration key should not change or break when switching `Language:`.

## Consequences

`/configure-refinement` writes `Mode: with-code` or `Mode: without-code` and migrates legacy `com-codigo` or `sem-codigo` in place when re-run, while noting that installed workspaces carrying the legacy tokens continue working without immediate reconfiguration. `configure-refinement` and `requirements-rigor` accept both canonical and legacy tokens on read, and `scripts/validate-skills.mjs` enforces that the configuration template and workspace fixtures write `with-code` and `without-code` while both skills retain legacy read compatibility.
