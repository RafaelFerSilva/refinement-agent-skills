<!--
Why this file exists: Claude Code reads CLAUDE.md as project instructions and would ignore
AGENTS.md if this file carried content of its own. The import below keeps AGENTS.md the single
source of truth. It lives in .claude/ rather than at the repository root because this repository
is also a plugin, and a CLAUDE.md at a plugin root is never loaded as context: `claude plugin
validate` warns about it, while `<cwd>/.claude/CLAUDE.md` loads as project memory like the root
file does. HTML comments are stripped before entering agent context.
-->
@../AGENTS.md

Compatibility bridge for Claude Code. Any AI workflow change goes into `AGENTS.md`, never here.
