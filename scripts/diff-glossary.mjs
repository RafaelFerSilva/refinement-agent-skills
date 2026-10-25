#!/usr/bin/env node
// Mechanical check over the glossary a session leaves behind, read against the glossary it started
// from. socratic-examination lets a session add terms the PO resolved and forbids it from changing
// the meaning of a term already there without the PO deciding so; a definition that changes is a
// decision, and a decision the PO did not make shows up here as an entry rewritten with no confirm
// marker on it. The measurement in ticket 18 of docs/tickets/measurement-depth/ counted that by
// reading nine workspaces by hand; this is that column as a check. What it cannot read is a new
// entry whose sentences contradict another term without touching it, which stays a reading task.
// Emits the expectations shape of scripts/grade-output.mjs, so a run's result aggregates with
// scripts/aggregate-runs.mjs like any other grading file.
// usage: node scripts/diff-glossary.mjs <CONTEXT.md at the start> <CONTEXT.md at the end> [--json]
import { readFileSync, existsSync } from 'node:fs';

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const files = argv.filter((a) => !a.startsWith('--'));
const usage = 'usage: node scripts/diff-glossary.mjs <CONTEXT.md at the start> <CONTEXT.md at the end> [--json]';
if (files.length !== 2) {
  console.error(usage);
  process.exit(2);
}
const [beforeFile, afterFile] = files;
for (const f of files) {
  if (!existsSync(f)) {
    console.error(`error: ${f} does not exist`);
    process.exit(2);
  }
}

// An entry is a `**Term**:` line that opens a paragraph, at the start of the file or after a blank
// line or a heading, followed by its body up to the next blank line or heading. The same shape in
// the middle of a paragraph is a bold label inside a body, not a term. Anything between the closing
// ** and the final colon is a qualifier a session added to the name, as in `**Silencing** (of an
// alert):`, and belongs to the display name rather than to the key. A term that opens two
// paragraphs is kept once and remembered as duplicated: two blocks for one term is two readings.
const TERM_LINE = /^\*\*(.+?)\*\*(.*):\s*$/;
function parse(text) {
  const entries = new Map();
  const duplicated = [];
  const lines = text.split('\n');
  const opensParagraph = (i) => i === 0 || lines[i - 1].trim() === '' || lines[i - 1].startsWith('#');
  for (let i = 0; i < lines.length; i++) {
    const m = opensParagraph(i) ? lines[i].match(TERM_LINE) : null;
    if (!m) continue;
    const body = [];
    for (let j = i + 1; j < lines.length; j++) {
      const l = lines[j];
      if (l.trim() === '' || l.startsWith('#')) break;
      body.push(l.trim().replace(/\s+/g, ' '));
    }
    const term = m[1].trim();
    const key = term.toLowerCase();
    if (entries.has(key)) { duplicated.push(term); continue; }
    // GLOSSARY.md splits an entry into the definition and the `_Avoid_` line, and names where a
    // confirm marker goes. The two parts are compared apart: a sentence added to the definition is
    // read as added text, and every `_Avoid_:` line, a second one included, is read as the synonyms.
    const isAvoid = (l) => l.startsWith('_Avoid_:');
    const avoid = body.filter(isAvoid).join(' ');
    const definition = body.filter((l) => !isAvoid(l)).join(' ').trim();
    entries.set(key, { term, display: `${term}${m[2].trim() ? ` ${m[2].trim()}` : ''}`, body: body.join(' ').trim(), definition, avoid });
  }
  return { entries, duplicated };
}

const beforeText = readFileSync(beforeFile, 'utf8');
const afterText = readFileSync(afterFile, 'utf8');
const { entries: before, duplicated: beforeDuplicated } = parse(beforeText);
const { entries: after, duplicated } = parse(afterText);
// A glossary with prose and no entry, or one that already defines a term twice, is a starting point
// the check cannot read, and reporting it against the session would blame the session for the input.
if (beforeText.trim() !== '' && before.size === 0) {
  console.error(`error: no \`**Term**:\` entry found in ${beforeFile}; the check reads the format of skills/socratic-examination/GLOSSARY.md`);
  process.exit(2);
}
if (beforeDuplicated.length) {
  console.error(`error: ${beforeFile} defines ${beforeDuplicated.join(', ')} more than once before the session started`);
  process.exit(2);
}

// A changed entry counts as flagged rather than rewritten only in the shape the rule allows: the
// original definition still there in full, the `_Avoid_` line as it was, and the text that was added
// carrying the marker. A marker on some other sentence of a rewritten definition does not exempt it.
const CONFIRM = /\[(?:TO CONFIRM|A CONFIRMAR):/;
const flaggedNotRewritten = (b, a) => {
  if (b.avoid !== a.avoid || !a.definition.includes(b.definition)) return false;
  return CONFIRM.test(a.definition.replace(b.definition, ''));
};
const removed = [];
const rewritten = [];
const flagged = [];
for (const [key, b] of before) {
  const a = after.get(key);
  if (!a) { removed.push(b.term); continue; }
  if (a.body === b.body) continue;
  (flaggedNotRewritten(b, a) ? flagged : rewritten).push({ term: b.term, before: b.body, after: a.body });
}
// Every new entry is listed with the pre-existing terms its body names, so that whoever reads the
// result starts at the sentences where a contradiction between two entries would enter. The
// boundary is spelled out with Unicode classes, because \b alone stops at an accented letter and
// would miss a pt-BR term that starts or ends with one.
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const names = (term) => new RegExp(`(?<![\\p{L}\\p{N}_])${escape(term)}(?![\\p{L}\\p{N}_])`, 'iu');
const added = [...after.entries()]
  .filter(([key]) => !before.has(key))
  .map(([, a]) => ({
    term: a.display,
    names: [...before.values()].filter((b) => names(b.term).test(a.body)).map((b) => b.term),
  }));

const clip = (s) => (s.length > 120 ? `${s.slice(0, 117)}...` : s);
const results = [];
const check = (text, passed, evidence = '') => results.push({ text, passed: Boolean(passed), evidence });
check('every term defined at the start is still defined', removed.length === 0, removed.join(', '));
check('no term defined at the start was rewritten without a confirm marker', rewritten.length === 0, rewritten.map((r) => `${r.term}: "${clip(r.before)}" -> "${clip(r.after)}"`).join(' | '));
check('no term is defined more than once', duplicated.length === 0, duplicated.join(', '));

const passed = results.filter((r) => r.passed).length;
if (asJson) {
  console.log(JSON.stringify({ before: beforeFile, after: afterFile, pass_rate: passed / results.length, expectations: results, added, flagged: flagged.map((f) => f.term), rewritten: rewritten.map((r) => r.term), removed, duplicated }, null, 2));
} else {
  for (const r of results) console.log(`${r.passed ? 'PASS' : 'FAIL'}  ${r.text}${r.evidence ? `  (${r.evidence})` : ''}`);
  for (const f of flagged) console.log(`note  ${f.term} changed with a confirm marker on it`);
  for (const a of added) console.log(`note  added ${a.term}${a.names.length ? `, names ${a.names.join(', ')}` : ''}`);
  console.log(`\n${passed}/${results.length}`);
}
process.exit(passed === results.length ? 0 : 1);
