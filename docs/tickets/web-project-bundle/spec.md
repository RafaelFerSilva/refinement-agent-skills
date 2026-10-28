# Spec: modular web-platform bundle (`prompts/project/`) and unified web workspace guides

Status: resolved
Origin: 2026-10-28 (commit 8675cac)

## Problem Statement

Teams running the package on web agent platforms without a local repository (Claude Projects, ChatGPT Projects, Custom GPTs, Gemini Gems, Copilot Studio) want a single shared environment where all five refinement workflows, the router, the Q&A helper, and the product's living context (`CONTEXT.md`, `product-overview.md`, ADRs, and reference manuals) coexist across conversations, mirroring how installed skills coexist in a local workspace.

Today, the prompt generator only emits self-contained single-file prompts in `prompts/*.md`, where every workflow file embeds its own full copy of `socratic-examination` and `requirements-rigor` (totaling more than 3,000 lines across seven files). While self-contained files are essential when pasting one prompt into a plain, stateless chat, uploading all of them into a single web agent's Knowledge Base duplicates the shared primitives six times: consuming over twice the context budget, creating six competing copies of the marker and INVEST tables during semantic RAG retrieval, and exhausting strict file-upload caps (such as Gemini Gems' 10-file limit) before the team adds product context and reference documents. In addition, the Getting Started guides do not yet walk users step by step through setting up a unified web workspace versus using one-off standalone prompts, nor explain how starting a fresh conversation inside the same web workspace corresponds to `/clear`.

## Solution

Provide two generated prompt distributions from the single source of truth in `skills/`, alongside clear step-by-step documentation for both modes:

1. **Keep `prompts/*.md` as self-contained prompts for ad-hoc chats:** users on plain web chats without persistent instructions or knowledge files continue pasting one self-contained prompt per conversation.
2. **Generate a zero-duplication modular bundle in `prompts/project/` for unified web workspaces:**
   - `INSTRUCTIONS.md`: pasted into the platform's System Prompt / Custom Instructions field (consuming zero file upload slots). Combines the global chat-mode rules (always `without-code`, inline or knowledge-base input, artifact delivery in chat blocks, and the consolidated `Memory / Knowledge Base Updates` protocol), the workflow router (`which-flow`), and the single-turn read-only Q&A and diagnostic helper (`ask-refinement`).
   - `refinement-core.md`: uploaded once to the Knowledge Base. Holds `socratic-examination` (including glossary and ADR formats) and `requirements-rigor` (including anti-patterns and questionnaire formats), adapted for chat mode.
   - Five lean workflow knowledge files (`bootstrap-context.md`, `meeting-minutes.md`, `requirements-discovery.md`, `refine-story.md`, `qa-plan.md`): uploaded to the Knowledge Base alongside `refinement-core.md`. Each carries only its own workflow steps, workflow-specific rules/test-design companion, and output template, referencing `refinement-core.md` instead of repeating shared primitives.
3. **Document unified web workspaces vs. ad-hoc chats step by step:** update the Getting Started guides (`en-US` and `pt-BR`), `README.md`, `which-flow`, and `ask-refinement` so teams know how to configure one shared web workspace per product, why opening a new chat thread inside that same web workspace mirrors `/clear` while keeping knowledge shared, and when to reach for `prompts/project/` versus `prompts/*.md`.

## User Stories

1. As a Product Owner configuring a Claude Project, ChatGPT Project, Custom GPT, Gemini Gem, or Copilot Studio agent for my product, I want a modular prompt bundle where shared primitives live in a single file and routing/Q&A live in the system instructions, so that all five workflows coexist in one shared web workspace without duplicating rules.
2. As a Gemini Gems or Custom GPT user subject to strict Knowledge Base file limits (10 or 20 files), I want the package's Knowledge Base footprint to stay at six compact files (`refinement-core.md` plus the five workflows) with `INSTRUCTIONS.md` in the instructions field, so that I retain plenty of file slots for `CONTEXT.md`, `product-overview.md`, ADRs, and product reference documents.
3. As a user on a RAG-indexed web agent platform, I want marker tables, INVEST rules, Gherkin standards, and examination round rules to appear once in `refinement-core.md` rather than six times across workflow files, so that retrieval pulls the canonical rule cleanly together with the requested workflow.
4. As a Product Owner starting a conversation inside a unified web workspace, I want `INSTRUCTIONS.md` to route my request automatically: answering usage, marker, or memory questions in a single turn without opening `❓ Q<n>` rounds, or loading `refinement-core.md` plus the matching workflow file (`bootstrap-context.md`, `meeting-minutes.md`, `requirements-discovery.md`, `refine-story.md`, or `qa-plan.md`) when I supply an artifact or request a workflow.
5. As a user on a plain web chat without persistent knowledge files, I want `prompts/*.md` at the root of `prompts/` to remain completely self-contained, so that pasting a single file still works with zero external dependencies.
6. As a team lead onboarding Product Owners and QA engineers in `pt-BR` or `en-US`, I want the Getting Started guides and `README.md` to explain Option A (Unified Web Workspace via `prompts/project/`) versus Option B (Ad-hoc Chat via `prompts/*.md`), including why starting a new chat thread inside the same web workspace acts like `/clear` while preserving shared knowledge, so that the team adopts a consistent workflow.
7. As a user asking `/ask-refinement` or `prompts/ask-refinement.md` whether prompts can coexist in a single shared web workspace, I want an accurate explanation of `prompts/project/` versus `prompts/*.md`, so that in-chat help matches the package guides.
8. As a package maintainer, I want `build-prompts` and `validate-skills` to verify freshness, zero primitive duplication across `prompts/project/<flow>.md`, zero unadapted workspace/tool leaks, zero dead adaptation rules, and valid evaluation cases for the modular bundle, so that changes in `skills/` propagate cleanly to both prompt distributions.

## Implementation Decisions

- **Single builder, two distributions (`prompts/*.md` and `prompts/project/*.md`):** `build-prompts` remains the sole generator for everything under `prompts/`, checked via `--check` in `validate-skills` and `.githooks/pre-commit`. Parameterizing adaptation targets (referencing `"this prompt"` in standalone files versus `"\`refinement-core.md\`"` or `"this workflow file"` in modular files) avoids duplicating the adaptation rule table and preserves the zero-dead-rules invariant.
- **Zero-slot `INSTRUCTIONS.md` + six Knowledge Base files:** placing global chat-mode rules, `Memory / Knowledge Base Updates` rules, `which-flow` routing, and `ask-refinement` Q&A behavior into `prompts/project/INSTRUCTIONS.md` keeps system-level routing always loaded in the agent's instruction box without spending a Knowledge Base file slot. Uploading `refinement-core.md` plus the five workflow files uses six slots total and cuts total bundle size by more than half compared to standalone prompts.
- **Explicit read contract inside `INSTRUCTIONS.md` and each modular workflow file:** `INSTRUCTIONS.md` instructs the agent to (a) answer usage/diagnostic/marker questions directly in one turn (consulting `refinement-core.md` when markers, verdicts, INVEST, Gherkin, anti-patterns, questionnaires, rounds, glossary format, or ADR format are involved) without opening `❓ Q<n>` rounds, and (b) when running a workflow, read both `refinement-core.md` and the specific `<workflow>.md` knowledge file (plus any product `CONTEXT.md`, `product-overview.md`, ADRs, or reference files in the Knowledge Base) before executing Step 1. Each modular `<workflow>.md` also opens with a one-line header reminding the agent to apply `INSTRUCTIONS.md` and `refinement-core.md`.
- **Validator enforcement of modular bundle invariants and eval shapes:** `validate-skills` checks that `prompts/project/` contains the exact expected file set in sync with `build-prompts --check`, that `prompts/project/<workflow>.md` files do not inline `Socratic examination` or `Requirements rigor` sections, and that evaluation suites can declare modular bundle cases (`prompts/project/INSTRUCTIONS.md`, `prompts/project/refinement-core.md`, and any target `prompts/project/<workflow>.md`) with inline multi-line prompts and no local workspace fixtures.

## Testing Decisions

Good tests verify observable external behavior at existing package seams:

- **Builder and validator seam (`build-prompts --check`, `validate-skills`, `claude plugin validate --strict`):** verifies byte-for-byte freshness of both `prompts/*.md` and `prompts/project/*.md`, zero unadapted `Skill tool` / companion link / `$ARGUMENTS` / `docs/agents/` leaks across both distributions, zero dead rules in `RULES`, absence of duplicated primitive sections inside `prompts/project/<workflow>.md`, zero em-dashes or en-dashes across all generated and authored markdown files, and valid `prompts/project/` evaluation case declarations.
- **Evaluation suite seam (`evals/`):** adds modular web-workspace evaluation cases executed via isolated subagents reading only `prompts/project/` files, verifying: (1) routing + Round 1 examination on a User Story in a unified web workspace (`INSTRUCTIONS.md` + `refinement-core.md` + `refine-story.md`) with inline product glossary from Knowledge Base, and (2) single-turn Q&A inside the same unified web workspace (`INSTRUCTIONS.md` + `refinement-core.md`) answering a usage/marker/workspace question in `pt-BR` without opening examination rounds.

## Out of Scope

- Vendor-specific API scripts or browser automation to upload files into Claude, OpenAI, Google, or Microsoft web consoles.
- Changing how CLI skills operate in local git repositories (`skills/` behavior stays unchanged beyond updating `ask-refinement` and `which-flow` reference notes on `prompts/project/`).
- Removing `prompts/*.md` standalone files, which remain supported for ad-hoc chats without persistent knowledge bases.

## Further Notes

- Keeping `prompts/project/` under `prompts/` preserves the repository layout and governance in `AGENTS.md` without introducing a new top-level generated folder.
