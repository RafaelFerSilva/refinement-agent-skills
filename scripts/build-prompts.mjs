#!/usr/bin/env node
// Generates prompts/<flow>.md: the self-contained version of each workflow for chat and instruction-based agents.
// Single source of truth are the skills; this file only composes and adapts. Do not edit prompts/ manually.
// Every rule below is live: disabling one changes the generated output. A rule whose removal keeps
// --check green is dead weight and goes, since it hides which rules the current skills depend on.
// usage: node scripts/build-prompts.mjs [--check]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'prompts');
const read = (p) => readFileSync(join(root, 'skills', p), 'utf8');

const noFrontmatter = (t) => t.replace(/^---\n[\s\S]*?\n---\n/, '');
const noTitle = (t) => t.replace(/^# [^\n]*\n/, '');
const body = (p) => noTitle(noFrontmatter(read(p)).trim()).trim();
const verbatim = (p) => noFrontmatter(read(p)).trim();
const part = (title, text) => `# ${title}\n\n${text}\n`;
const dropSection = (text, heading) => text.replace(new RegExp(`\\n## ${heading}\\n[\\s\\S]*?(?=\\n## |\\s*$)`), '\n');

const RULES = [
  // Skill tool invocation for requirements-rigor
  [/invoke the Skill tool for `requirements-rigor`/gi, 'apply the "Requirements rigor" section of this prompt'],

  // Skill tool invocation for socratic-examination
  [/Invoke the Skill tool for `socratic-examination`/g, 'Apply the "Socratic examination" section of this prompt'],
  [/Continue rounds of `socratic-examination`/g, 'Continue rounds of socratic examination'],
  [/Resolve it with `socratic-examination`/g, 'Resolve it with socratic examination'],

  // ANTI-PATTERNS companion file
  [/\(read `ANTI-PATTERNS\.md` in `requirements-rigor` separately\)/g, '(see the "Anti-patterns" section of this prompt)'],
  [/`ANTI-PATTERNS\.md` of `requirements-rigor` is a separate read and holds the type names the tags below use, so the scan starts there\./g, 'The "Anti-patterns" section of this prompt holds the type names the tags below use, so the scan starts there.'],
  [/anti-pattern from \[ANTI-PATTERNS\.md\]\(ANTI-PATTERNS\.md\)/g, 'anti-pattern from the "Anti-patterns" section of this prompt'],
  [/live in \[ANTI-PATTERNS\.md\]\(ANTI-PATTERNS\.md\), read when scanning or auditing a text\./g, 'live in the "Anti-patterns" section of this prompt.'],

  // QUESTIONNAIRE companion file
  [/following `QUESTIONNAIRE\.md` in `requirements-rigor`/g, 'following the "Questionnaire" section of this prompt'],
  [/following \[QUESTIONNAIRE\.md\]\(QUESTIONNAIRE\.md\)/g, 'following the "Questionnaire" section of this prompt'],

  // TEMPLATE companion file
  [/following the template at the end of \[TEMPLATE\.md\]\(TEMPLATE\.md\)/g, 'following the "Discovery input" format in the "Template" section of this prompt'],
  [/following \[TEMPLATE\.md\]\(TEMPLATE\.md\)/g, 'following the "Template" section of this prompt'],
  [/following `skills\/refine-story\/TEMPLATE\.md`/g, 'following the "Candidate story template" section of this prompt'],
  [/listed at the end of the workflow `TEMPLATE\.md`/g, 'listed at the end of the "Template" section of this prompt'],

  // TEST-DESIGN companion file
  [/\[TEST-DESIGN\.md\]\(TEST-DESIGN\.md\)/g, 'the "Test design" section of this prompt'],

  // RULES companion file
  [/\[RULES\.md\]\(RULES\.md\)/g, 'the "Synthesis rules" section of this prompt'],

  // GLOSSARY & ADR companion files
  [/format of \[GLOSSARY\.md\]\(GLOSSARY\.md\)/g, 'format of the "Glossary format" section of this prompt'],
  [/in \[ADR\.md\]\(ADR\.md\)/g, 'in the "ADR format" section of this prompt'],

  // Workspace / scratch / file delivery adapting
  [/Read `docs\/agents\/refinement\.md` in the workspace to identify the configured language \(`en-US` or `pt-BR`, default `en-US`\) and publishing path\. Minutes, questionnaires, and generated inputs follow this language\./g, 'Minutes, questionnaires, and generated inputs follow the refinement language.'],
  [/Read `CONTEXT\.md` for glossary terms when present\./g, 'Use any glossary terms provided by the PO.'],
  [/Operating mode is determined by `Mode:` in `docs\/agents\/refinement\.md`: `with-code` \(or legacy `com-codigo`\) for code mode, and `without-code` \(or legacy `sem-codigo`\) for no-code mode\. /g, ''],
  [/Refinement language is determined by `Language:` \(or `Idioma:`\) in `docs\/agents\/refinement\.md` \(`en-US` or `pt-BR`\), with `en-US` as default\./g, 'Refinement language is determined by the language requested by the PO, or the language of the input when none is requested (`en-US` or `pt-BR`), with `en-US` as default.'],
  [/from an input statement, `CONTEXT\.md`, or a verified fact/g, 'from an input statement, the glossary, or a verified fact'],
  [/use the domain role from `CONTEXT\.md` when available\./g, 'use the domain role from the glossary when available.'],
  [/ Mapping to external tracker labels lives in `docs\/agents\/triage-labels\.md` when present\./g, ''],
  [/the file exists at `\.scratch\/<project>-<YYYY-MM-DD>\/minutes\.md` \(or where configured in `docs\/agents\/refinement\.md`\), with final disclaimer\./g, 'the minutes were delivered in the response, with final disclaimer.'],
  [/spec and candidate stories exist at the path defined in `docs\/agents\/refinement\.md`, with final disclaimer\./g, 'spec and candidate stories were delivered in the response, with final disclaimer.'],
  [/file exists at path defined by `docs\/agents\/refinement\.md`, with `Status:` matching the verdict and final disclaimer present\./g, 'the refined US was delivered in the response, with `Status:` matching the verdict and final disclaimer present.'],
  [/file exists at path defined by `docs\/agents\/refinement\.md` with final disclaimer present\./g, 'the QA plan was delivered in the response, with final disclaimer present.'],
  [/If `\.scratch\/<slug>\/` already exists for this US, inspect its contents: a previous session may have resolved questions, which you must not repeat\. The slug follows conventions in `docs\/agents\/refinement\.md`\. If `docs\/adr\/` or `\.scratch\/` are absent, proceed without warning\./g, 'If the PO pasted a previous artifact for this US, read it: a previous session may have resolved questions, which you must not repeat.'],
  [/If `\.scratch\/<slug>\/spec\.md` exists from `\/refine-story`, start from it: decisions from that session already answer many questions\. Without this file, treat/g, 'If the PO pasted the refined US from `/refine-story`, start from it: decisions from that session already answer many questions. Without it, treat'],
  [/search workspace sources: glossary, previous stories in `\.scratch\/`, documents attached by the PO\. In code mode, dispatch a subagent to search the codebase for what the US asserts or assumes: does the rule exist\? is the limit implemented\? does the integration function\? A found fact becomes a recommended answer citing the source\./g, 'search what the PO provided: glossary, previous artifacts, attached documents. A found fact becomes a recommended answer citing the source.'],
  [/Search workspace sources \(`CONTEXT\.md`, ADRs, previous stories in `\.scratch\/`, attached documents\)/g, 'Search what the PO provided (glossary, ADRs, previous artifacts, attached documents)'],
  [/In code mode, dispatch a subagent to inspect the codebase for DEV questions \(is notification synchronous or asynchronous\? is there a lock on approval\? does a mock exist for the external system\?\) and for existing code behavior on open PO questions: code facts settle testing layers, observation points on outcomes stated in specifications, automation blockers, and regression impact, with source citation, while any outcome no specification states in words stays `\[UNDEFINED -> Question n\]` for PO with the code behavior cited as context or recommendation base in the question\. /g, ''],
  [/Check glossary, previous stories in `\.scratch\/`, workspace documents, and in code mode, the codebase: does the mentioned integration already exist\? Is the threshold already implemented\?/g, 'Check glossary, previous artifacts, and documents provided by the PO: does the mentioned integration already exist? Is the threshold already implemented?'],
  [/Before asking, search for the answer in `CONTEXT\.md`, ADRs, previous stories in `\.scratch\/`, and workspace documents; in code mode, inspect the codebase via subagent\./g, 'Before asking, search for the answer in what the PO provided (glossary, ADRs, previous artifacts, and attached documents).'],
  [/In no-code mode, search is restricted to the workspace without subagents; if nothing is found/g, 'Search is restricted to what the PO provided; if nothing is found'],
  [/In no-code mode, search is restricted to workspace files without subagents; if nothing is found/g, 'Search is restricted to what the PO provided; if nothing is found'],
  [/verify in workspace artifacts and, in code mode, against source code\./g, 'verify against artifacts and documents provided by the PO.'],
  [/Re-read `CONTEXT\.md`, where the workspace has one, against two things:/g, 'Re-read the provided glossary, when present, against two things:'],
  [/A resolved domain term enters `CONTEXT\.md` immediately, in the format of the "Glossary format" section of this prompt; do not accumulate for the end\./g, 'Acknowledge a resolved domain term in one line during the round and hold it in the format of the "Glossary format" section of this prompt for the consolidated "Memory / Knowledge Base Updates" section at synthesis.'],
  [/glossary updated immediately\./g, 'glossary terms acknowledged briefly during rounds for synthesis updates.'],
  [/Domain terms resolved are added to `CONTEXT\.md` immediately\./g, 'Domain terms resolved are acknowledged briefly during the round and emitted in the consolidated "Memory / Knowledge Base Updates" section at synthesis.'],
  [/record in `CONTEXT\.md` only what the PO resolves/g, 'include in the "Memory / Knowledge Base Updates" section at synthesis only what the PO resolves'],
  [/Read any paths or text in the input, existing files in `docs\/reference\/` and `docs\/` \(excluding `docs\/agents\/`\), `CONTEXT\.md`, domain ADRs in `docs\/adr\/`, and existing `docs\/product-overview\.md` when present,/g, 'Read what the PO provided in this conversation (pasted notes, attached legacy documents, existing glossary, ADRs, or prior product overview),'],
  [/In code mode, dispatch a subagent to map implemented domain entities, user roles and permission checks, external integrations, and configured limits or SLAs in the codebase, citing source files\. In no-code mode, inspection is restricted to workspace files without subagents; if neither reference documents nor prior context files exist/g, 'Inspection is restricted to what the PO provided; if neither reference documents nor prior context were provided'],
  [/every technical gap in no-code mode is assigned to `DEV`\./g, 'every unresolved technical gap is assigned to `DEV`.'],
  [/\(and in no-code mode with `TACIT ONLY`, state in one line that no workspace reference documents were found\)/g, '(and with `TACIT ONLY`, state in one line that no reference documents were provided)'],
  [/"no recommendation: no written source in workspace"/g, '"no recommendation: no written source provided"'],
  [/Write `docs\/product-overview\.md` following the "Template" section of this prompt, citing `\[INFERENCE: source\]` on document-derived or code-derived claims/g, 'Deliver `product-overview.md` (or updated sections when prior `product-overview.md` came partially from platform memory) following the "Template" section of this prompt, citing `[INFERENCE: source]` on document-derived claims'],
  [/Write an ADR in `docs\/adr\/` only when/g, 'Deliver an ADR block (`NNNN-<slug>.md`) only when'],
  [/`docs\/product-overview\.md` exists with `Status:` matching the verdict and final disclaimer present, and `CONTEXT\.md` holds every resolved domain term without silent rewrites or operational prose\./g, 'the product overview was delivered in the response with `Status:` matching the verdict and final disclaimer present, and the glossary holds every resolved domain term without silent rewrites or operational prose.'],
  [/alongside `docs\/product-overview\.md`, and link the file from the open questions section\./g, 'delivered in the response, and reference it from the open questions section.'],
  [/path to `docs\/product-overview\.md` \(and any ADRs or questionnaires created\),/g, 'which artifacts and memory update blocks were delivered in the response,'],
  [/Source: <paths in docs\/reference\/, codebase in with-code mode, or "tacit onboarding examination">, \/bootstrap-context session on <YYYY-MM-DD>/g, 'Source: <pasted or attached reference documents, or "tacit onboarding examination">, bootstrap-context session on <YYYY-MM-DD>'],
  [/If the item lives in the workspace, add `Status: not a US` \(or `Status: não é US`\) and the rationale below the title to leave a trail\./g, 'Tell the PO to mark the item with `Status: not a US` (or `Status: não é US`) and the rationale to leave a trail.'],
  [/\$ARGUMENTS/g, 'what the PO provides in this conversation'],
];

function adapt(text) {
  let t = text;
  for (const [re, to] of RULES) t = t.replace(re, to);
  const leftovers = t.match(/Skill tool|\]\([A-Z-]+\.md\)|\$ARGUMENTS|docs\/agents\/[a-z-]+\.md/g);
  if (leftovers) throw new Error(`unadapted skill reference: ${[...new Set(leftovers)].join(', ')}`);
  return t;
}

const COUNT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

const CHAT = (name, { title, examination = true }) => {
  const otherFlows = Object.keys(FLOWS).filter((f) => f !== name).map((f) => `\`/${f}\``).join(', ');
  const variant = examination
    ? {
        combines: 'socratic examination, requirements rigor, and templates',
        inputRest: 'Where the workflow says "read `CONTEXT.md`", use the glossary pasted, attached, or configured in platform memory / knowledge base by the PO; without a glossary, ask for product domain roles in round 1. Where it says "previous stories in `.scratch/`", "ADRs", `docs/product-overview.md`, or "documents in `docs/`", use only what the PO provided or configured in platform memory; if nothing was found, state this in one line at the top of round 1.',
        glossaryAdr: [
          '- During examination rounds, acknowledge newly resolved glossary terms, ADRs, or product-overview updates in one brief line without emitting file blocks mid-round.',
          '- At final synthesis, whenever the session added or flagged `CONTEXT.md` terms, updated `product-overview.md` baseline facts, or recorded an ADR, append a dedicated "Memory / Knowledge Base Updates" section (in `pt-BR`: "Atualizações para a Memória / Base de Conhecimento") with copy-ready blocks, and remind the PO in the report step to update those files in their agent platform memory or knowledge base before the next session (omit both the section and reminder when nothing changed). Emit the complete file only when creating it from scratch or when the entire prior file was pasted inline in this conversation; when prior context came from platform memory or knowledge retrieval where unseen entries may exist, emit an append/delta block (`Append to CONTEXT.md` / `Adicionar ao CONTEXT.md`, or updated sections for `product-overview.md`) so pre-existing entries are never overwritten. In `bootstrap-context`, `product-overview.md` is already delivered as the primary synthesis artifact (delivering updated sections only on incremental platform-memory runs), so do not duplicate `product-overview.md` inside "Memory / Knowledge Base Updates". Emit each new ADR as its own complete `NNNN-<slug>.md` block.',
        ],
        carryOver: ' A previous artifact pasted by the PO, such as a spec with `Status: open map` or a refined US, is the starting point.',
        closing: [
          '- The session date is the date provided by the PO; if omitted, leave `<date>` in the artifact.',
          '- Socratic examination happens within this conversation: run each round and wait for PO response. Do not invent answers or synthesize before the frontier empties or the PO requests closure.',
        ],
      }
    : {
        combines: 'requirements rigor, synthesis rules, and templates',
        inputRest: 'Use only the transcript, meeting metadata, and optional glossary that the PO provided.',
        glossaryAdr: [],
        carryOver: '',
        closing: [],
      };
  return [
    '# Chat mode',
    '',
    `This prompt is the chat and instruction-based agent version of the **${title}** workflow from the Refinement Skills package. It combines the workflow, ${variant.combines} into a single document. The rules below take precedence over any file, tool, or mode instructions appearing in the rest of this prompt.`,
    '',
    '- The operating mode is always **without code**: there is no repository, subagent, or file tool. Ignore instructions regarding with-code mode or dispatching subagents.',
    `- Input is whatever the PO provides in this conversation: pasted text or attached files. ${variant.inputRest}`,
    '- Where the workflow says to publish, write, or save a file, deliver the content directly in the response, each artifact in its own block titled with the filename it would have, ready for the PO to copy into the work item. Questionnaires also go in the response, one block per recipient. "Completed when: file exists" means "the artifact was delivered in the response".',
    ...variant.glossaryAdr,
    '- The `Azure:` line receives the ID provided by the PO, or `none`. Slugs follow workflow conventions and serve only to label blocks.',
    `- The other referenced workflows (${otherFlows}) are separate prompts in this collection. When the workflow directs to one of them, inform the PO which one and what artifacts to carry over.${variant.carryOver}`,
    ...variant.closing,
    '',
  ].join('\n');
};

const common = () => [ 
  part('Socratic examination', body('socratic-examination/SKILL.md')),
  part('Glossary format', body('socratic-examination/GLOSSARY.md')),
  part('ADR format', body('socratic-examination/ADR.md')),
  part('Requirements rigor', body('requirements-rigor/SKILL.md')),
  part('Anti-patterns', body('requirements-rigor/ANTI-PATTERNS.md')),
  part('Questionnaire', body('requirements-rigor/QUESTIONNAIRE.md')),
];
const rigorOnly = () => [
  part('Requirements rigor', body('requirements-rigor/SKILL.md')),
  part('Anti-patterns', body('requirements-rigor/ANTI-PATTERNS.md')),
  part('Questionnaire', body('requirements-rigor/QUESTIONNAIRE.md')),
];

const FLOWS = {
  'bootstrap-context': {
    title: 'Bootstrap Context',
    parts: () => [
      part('Workflow: Bootstrap Context', dropSection(body('bootstrap-context/SKILL.md'), 'Before starting')),
      ...common(),
      part('Template', verbatim('bootstrap-context/TEMPLATE.md')),
    ],
  },
  'refine-story': {
    title: 'Refine Story',
    parts: () => [
      part('Workflow: Refine Story', dropSection(body('refine-story/SKILL.md'), 'Before starting')),
      ...common(),
      part('Template', verbatim('refine-story/TEMPLATE.md')),
    ],
  },
  'qa-plan': {
    title: 'QA Plan',
    parts: () => [
      part('Workflow: QA Plan', dropSection(body('qa-plan/SKILL.md'), 'Before starting')),
      ...common(),
      part('Test design', body('qa-plan/TEST-DESIGN.md')),
      part('Template', verbatim('qa-plan/TEMPLATE.md')),
    ],
  },
  'requirements-discovery': {
    title: 'Requirements Discovery',
    parts: () => [
      part('Workflow: Requirements Discovery', dropSection(body('requirements-discovery/SKILL.md'), 'Before starting')),
      ...common(),
      part('Template', verbatim('requirements-discovery/TEMPLATE.md')),
      part('Candidate story template', verbatim('refine-story/TEMPLATE.md')),
    ],
  },
  'meeting-minutes': {
    title: 'Meeting Minutes',
    examination: false,
    parts: () => [
      part('Workflow: Meeting Minutes', body('meeting-minutes/SKILL.md')),
      ...rigorOnly(),
      part('Synthesis rules', body('meeting-minutes/RULES.md')),
      part('Template', verbatim('meeting-minutes/TEMPLATE.md')),
    ],
  },
};

function router() {
  let t = dropSection(body('which-flow/SKILL.md'), 'Prerequisite');
  t = t.replace(/from `docs\/reference\/` \(or run with no files for a short onboarding examination; in code mode it also inspects the codebase\) to build `CONTEXT\.md` and `docs\/product-overview\.md`/,
    'pasted or attached in the conversation (or run with no files for a short onboarding examination) to generate `CONTEXT.md` and `product-overview.md` for your agent knowledge base');
  t = t.replace(/Between workflows, run `\/clear`: the subsequent step reads the published artifact, not the conversation history\. Within a workflow session, do not compact context before final synthesis: the examination and the resulting artifact require the same continuous reasoning\./,
    'Between workflows, start a new conversation and paste the previous artifact: the next stage reads the artifact, not the conversation.');
  t = t.replace(/The workspace declares in `docs\/agents\/refinement\.md` whether it runs \*\*with code\*\* \(`with-code`\) or \*\*without code\*\* \(`without-code`\)\. With code, workflows inspect the codebase before asking questions and resolve architectural questions directly\. Without code, the PO is the source of facts, the glossary and previous stories serve as memory, and architectural questions become questionnaires for the engineering team\. The workflows remain identical; only who answers what changes\./,
    'In chat mode, the operating mode is always **without code**.');
  t = t.replace(/Workflows conclude by writing a questionnaire per recipient alongside the artifact, containing questions that examination could not resolve\. Send the file, paste responses into a new conversation, and run the workflow again against the artifact: it resumes from where it left off\./,
    'Workflows conclude by delivering one questionnaire per recipient in the response for questions that examination could not resolve. Send the questionnaire, paste responses into a new conversation along with the artifact, and rerun the workflow: it resumes from where it left off.');
  const flowNames = Object.keys(FLOWS);
  const flowFiles = flowNames.map((f) => `\`${f}.md\``).join(', ');
  const flowCount = COUNT_WORDS[flowNames.length] ?? String(flowNames.length);
  const head = `# Which workflow? (chat mode)

Chat and instruction-based agent version of the Refinement Skills package router. Each workflow is a standalone prompt in this collection: ${flowFiles}. In a project or agent supporting knowledge files, use this text as instructions and the ${flowCount} prompts as knowledge files; when the PO requests a workflow, read the corresponding file and follow it as instructions. In a standard chat, paste the workflow prompt directly.

`;
  return head + t + '\n';
}

const check = process.argv.includes('--check');
const outputs = {};
for (const [name, flow] of Object.entries(FLOWS)) {
  const header = `<!-- Generated by scripts/build-prompts.mjs from skills/. Do not edit manually: run node scripts/build-prompts.mjs -->\n\n`;
  outputs[`${name}.md`] = header + CHAT(name, flow) + '\n' + adapt(flow.parts().join('\n'));
}
outputs['which-flow.md'] = `<!-- Generated by scripts/build-prompts.mjs from skills/. Do not edit manually: run node scripts/build-prompts.mjs -->\n\n` + adapt(router());

let stale = [];
for (const [file, text] of Object.entries(outputs)) {
  const p = join(outDir, file);
  if (check) {
    if (!existsSync(p) || readFileSync(p, 'utf8') !== text) stale.push(file);
  } else {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(p, text);
    console.log(`generated: prompts/${file} (${text.split('\n').length} lines)`);
  }
}
if (check) {
  if (stale.length) { console.error(`outdated prompts: ${stale.join(', ')}. Run: node scripts/build-prompts.mjs`); process.exit(1); }
  console.log('ok: prompts/ in sync with skills/');
}
