#!/usr/bin/env node
// Validates the package: frontmatter, plugin manifest, router, README, prose, and grader regression.
// usage: node scripts/validate-skills.mjs
import { readFileSync, readdirSync, existsSync, statSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = join(root, 'skills');
const errors = [];
const fail = (m) => errors.push(m);

function frontmatter(text, skillName) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    if (!line.trim()) continue;
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) {
      fail(`${skillName}: invalid frontmatter line: "${line}"`);
      continue;
    }
    const val = kv[2].trim();
    if (val.includes(': ') && !(val.startsWith('"') && val.endsWith('"')) && !(val.startsWith("'") && val.endsWith("'"))) {
      fail(`${skillName}: value of "${kv[1]}" contains ": " and is not quoted (breaks YAML parsers)`);
    }
    fm[kv[1]] = val.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
  }
  return fm;
}

const skills = readdirSync(skillsDir)
  .filter((d) => statSync(join(skillsDir, d)).isDirectory())
  .sort();
const userInvoked = new Set();

for (const name of skills) {
  const dir = join(skillsDir, name);
  const skillFile = join(dir, 'SKILL.md');
  if (!existsSync(skillFile)) { fail(`${name}: no SKILL.md`); continue; }
  const text = readFileSync(skillFile, 'utf8');
  const fm = frontmatter(text, name);
  if (!fm) { fail(`${name}: missing frontmatter`); continue; }
  if (fm.name !== name) fail(`${name}: name "${fm.name}" differs from the folder`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) fail(`${name}: name outside the Agent Skills pattern`);
  if (!fm.description) fail(`${name}: missing description`);
  else if (fm.description.length > 1024) fail(`${name}: description above 1024 characters`);
  const lines = text.split('\n').length;
  if (lines > 500) fail(`${name}: SKILL.md with ${lines} lines (maximum 500)`);
  const yamlFile = join(dir, 'agents', 'openai.yaml');
  if (!existsSync(yamlFile)) {
    fail(`${name}: missing agents/openai.yaml`);
  } else {
    const yaml = readFileSync(yamlFile, 'utf8');
    const disabled = fm['disable-model-invocation'] === 'true';
    const implicitOff = /allow_implicit_invocation:\s*false/.test(yaml);
    if (disabled !== implicitOff) fail(`${name}: disable-model-invocation=${disabled} but allow_implicit_invocation:false=${implicitOff} in openai.yaml`);
    if (disabled) userInvoked.add(name);
  }
}

const plugin = JSON.parse(readFileSync(join(root, '.claude-plugin', 'plugin.json'), 'utf8'));
const listed = (plugin.skills || []).map((p) => p.replace(/^\.\/skills\//, '')).sort();
for (const s of skills) if (!listed.includes(s)) fail(`plugin.json does not list ${s}`);
for (const s of listed) if (!skills.includes(s)) fail(`plugin.json lists ${s}, which does not exist`);

const readme = readFileSync(join(root, 'README.md'), 'utf8');
for (const s of skills) if (!readme.includes(`skills/${s}/SKILL.md`)) fail(`README.md does not link ${s}`);
const router = readFileSync(join(skillsDir, 'which-flow', 'SKILL.md'), 'utf8');
for (const s of skills) if (s !== 'which-flow' && !router.includes(s)) fail(`which-flow does not mention ${s}`);

// Self-containment: every Skill tool call points to a skill of this package.
for (const name of skills) {
  const text = readFileSync(join(skillsDir, name, 'SKILL.md'), 'utf8');
  for (const m of text.matchAll(/Skill tool (?:para|for) `([a-z0-9-]+)`/g)) {
    if (!skills.includes(m[1])) fail(`${name}: calls the Skill tool for ${m[1]}, which does not exist in skills/`);
  }
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    // Eval run outputs are generated artifacts, not repository prose: .gitignore keeps them out of the
    // repository and the prose rules below do not apply to them.
    if (['.git', 'node_modules', '.scratch'].includes(e) || e.endsWith('-workspace')) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.md')) out.push(p);
  }
  return out;
}
for (const file of walk(root)) {
  const rel = file.slice(root.length + 1);
  const text = readFileSync(file, 'utf8');
  if (text.includes('\u2014')) fail(`${rel}: contains an em-dash`);
  if (text.charCodeAt(0) === 0xfeff || text.includes('\r')) fail(`${rel}: BOM or CRLF`);
}

for (const f of readdirSync(join(root, 'evals')).filter((f) => f.endsWith('.json'))) {
  let suite = null;
  try { suite = JSON.parse(readFileSync(join(root, 'evals', f), 'utf8')); } catch (e) { fail(`evals/${f}: invalid JSON (${e.message})`); }
  if (!suite) continue;
  if (!skills.includes(suite.skill_name)) fail(`evals/${f}: skill_name "${suite.skill_name}" does not exist in skills/`);
  for (const c of suite.evals ?? []) {
    for (const ref of c.files ?? []) {
      if (!existsSync(join(root, ref))) fail(`evals/${f}: case ${c.id} references ${ref}, which does not exist`);
    }
    if (!(c.files ?? []).some((ref) => /refinement-[a-z-]+-(en-US|pt-BR)\.md$/.test(ref))) {
      fail(`evals/${f}: case ${c.id} provides no workspace configuration fixture; the workflow would stop asking for /configure-refinement`);
    }
  }
}

// An assertion that demands markers in their pt-BR form has to name the ones ADR 0005 keeps canonical
// in both languages, or it fails an artifact for following the package. The grader cannot catch this,
// since reading an assertion is judgment, so the check is on the wording. It is lexical, and that is
// its limit: it recognizes an assertion that asks for markers in Portuguese or in their pt-BR form,
// or that rejects markers in English wholesale, and an assertion that demands the same thing in words
// nobody has used yet escapes it. Add the phrasing here when one does.
const CANONICAL_MARKERS = ['INVEST-FAIL', 'MANUAL-ONLY'];
const DEMANDS_PT_MARKERS = [
  /no English markers? mixed in/i,
  /markers?[^.]{0,80}\b(?:Portuguese|pt-BR) forms?\b/i,
  /\b(?:Portuguese|pt-BR) forms?\b[^.]{0,80}markers?/i,
  /markers?\s+(?:are|is|appear|appears|must be|stay|stays)\b[^.]{0,60}\bin Portuguese\b/i,
  /\bno\b[^.]{0,40}markers?\b[^.]{0,40}\bin English\b/i,
  /\bno English\b[^.]{0,40}markers?/i,
];
// Two things stay outside the guard. An assertion that names the English markers it rejects is bounded
// by that list and cannot catch a canonical one by accident. And an assertion where it is the artifact
// rather than the markers that is said to be in Portuguese is not a demand about markers at all.
const ENUMERATES_ENGLISH_MARKERS = /\[(?:STATED|ASSUMED|INFERENCE|TO CONFIRM|AMBIGUITY|ANTI-PATTERN|DECOMPOSE|DIVERGENCE|ORPHAN|CONFLICT|SPECIFIED|DERIVED|UNDEFINED|TRACKING)/;
for (const f of readdirSync(join(root, 'evals')).filter((f) => f.endsWith('.json'))) {
  let suite = null;
  try { suite = JSON.parse(readFileSync(join(root, 'evals', f), 'utf8')); } catch { continue; }
  for (const c of suite.evals ?? []) {
    for (const a of c.assertions ?? []) {
      if (!DEMANDS_PT_MARKERS.some((re) => re.test(a)) || ENUMERATES_ENGLISH_MARKERS.test(a)) continue;
      const missing = CANONICAL_MARKERS.filter((m) => !a.includes(m));
      if (missing.length) fail(`evals/${f}: case ${c.id} asks for markers in their pt-BR form without naming the canonical ${missing.join(' and ')}, which ADR 0005 keeps in both languages`);
    }
  }
}

// Claude Code bridge: lives in .claude/, imports AGENTS.md, and never sits at the plugin root,
// where `claude plugin validate` warns that it is not loaded as context.
const bridge = join(root, '.claude', 'CLAUDE.md');
if (existsSync(join(root, 'CLAUDE.md'))) fail('CLAUDE.md at the repository root: a plugin root CLAUDE.md is not loaded as context, move it to .claude/CLAUDE.md');
if (!existsSync(bridge)) fail('.claude/CLAUDE.md missing: Claude Code loses the AGENTS.md instructions in this repository');
else if (!readFileSync(bridge, 'utf8').includes('@../AGENTS.md')) fail('.claude/CLAUDE.md does not import @../AGENTS.md');

// Grader regression: every artifact fixture passes its own grader, in the language its name declares.
const artifactsDir = join(root, 'evals', 'fixtures', 'artifacts');
const checkCounts = new Map();
let graded = 0;
if (!existsSync(artifactsDir)) {
  fail('evals/fixtures/artifacts missing: the grader has no regression');
} else {
  const fixtures = readdirSync(artifactsDir).filter((f) => f.endsWith('.md')).sort();
  if (!fixtures.length) fail('evals/fixtures/artifacts has no fixture');
  for (const f of fixtures) {
    const m = f.match(/^(.+?)(?:-actions)?-(en-US|pt-BR)\.md$/);
    if (!m) { fail(`evals/fixtures/artifacts/${f}: name outside the <skill>[-actions]-<en-US|pt-BR>.md pattern`); continue; }
    const [, graderSkill, lang] = m;
    if (!skills.includes(graderSkill)) { fail(`evals/fixtures/artifacts/${f}: ${graderSkill} does not exist in skills/`); continue; }
    const run = spawnSync(process.execPath, [join(root, 'scripts', 'grade-output.mjs'), join(artifactsDir, f), '--skill', graderSkill, '--lang', lang, '--json'], { encoding: 'utf8' });
    let report = null;
    try { report = JSON.parse(run.stdout); } catch { report = null; }
    if (run.status === 0) graded++;
    else fail(`evals/fixtures/artifacts/${f}: grader failed\n       ${(report?.expectations ?? []).filter((e) => !e.passed).map((e) => `FAIL  ${e.text}`).join('\n       ') || (run.stderr || '').trim()}`);
    if (report) checkCounts.set(f.replace(/\.md$/, ''), report.expectations.length);
  }
}

// How many checks each fixture draws is documented in harness.md, so that a reader of a green run
// knows the size of what passed. A count in prose goes stale the moment a check is added or removed,
// which is the defect this section exists to describe, one level up, so the numbers are compared here.
const harnessFile = join(root, 'docs', 'agents', 'harness.md');
if (!existsSync(harnessFile)) {
  fail('docs/agents/harness.md missing: the record of what the mechanical layer covers is the one thing a green run is read against');
} else {
  const harness = readFileSync(harnessFile, 'utf8');
  const documented = new Map([...harness.matchAll(/^\|\s*`([a-z0-9-]+-(?:en-US|pt-BR))`\s*\|\s*(\d+)\s*\|/gim)].map((m) => [m[1], Number(m[2])]));
  for (const [fixture, count] of checkCounts) {
    if (!documented.has(fixture)) fail(`docs/agents/harness.md does not say how many checks ${fixture} draws, and it draws ${count}`);
    else if (documented.get(fixture) !== count) fail(`docs/agents/harness.md says ${fixture} draws ${documented.get(fixture)} checks, and it draws ${count}`);
  }
  // Only a documented fixture that is not on disk is stale documentation. One whose grading never
  // reported is a broken grader, already failed above, and blaming the documentation for it sends the
  // reader to the wrong file.
  const onDisk = new Set(existsSync(artifactsDir) ? readdirSync(artifactsDir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')) : []);
  for (const fixture of documented.keys()) {
    if (!onDisk.has(fixture)) fail(`docs/agents/harness.md documents a check count for ${fixture}, which is not an artifact fixture`);
  }
}

// Repeat run aggregation: the fixture set in evals/fixtures/runs/ has a known aggregate, so the
// aggregation has a regression of its own. One assertion holds in every run, one in a third of them,
// one in two thirds, which at a threshold of 0.66 separates what holds from what does not.
const aggExample = join(root, 'evals', 'fixtures', 'runs', 'aggregate-example');
if (!existsSync(aggExample)) {
  fail('evals/fixtures/runs/aggregate-example missing: the repeat run aggregation has no regression');
} else {
  const run = spawnSync(process.execPath, [join(root, 'scripts', 'aggregate-runs.mjs'), aggExample, '--threshold', '0.66', '--json'], { encoding: 'utf8' });
  let agg = null;
  try { agg = JSON.parse(run.stdout); } catch { agg = null; }
  if (!agg) {
    fail(`aggregate-runs.mjs did not emit JSON over evals/fixtures/runs/aggregate-example: ${(run.stderr || run.stdout || '').trim().split('\n')[0]}`);
  } else {
    const round = (n) => Math.round(n * 1000) / 1000;
    const got = {
      runs: agg.runs,
      verdict: agg.verdict,
      meeting: agg.assertions_meeting_threshold,
      rates: (agg.assertions ?? []).map((a) => round(a.rate)),
      meets: (agg.assertions ?? []).map((a) => a.meets_threshold),
      overall: round(agg.pass_rate_over_runs),
    };
    const want = { runs: 3, verdict: 'not held', meeting: 2, rates: [1, 0.333, 0.667], meets: [true, false, true], overall: 0.667 };
    if (JSON.stringify(got) !== JSON.stringify(want)) fail(`aggregate-runs.mjs over the fixture set reports ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);
  }
}

// Baseline comparison: the fixture pair in evals/fixtures/runs/compare-example/ has one assertion the
// package buys, one the model already follows without it, and one neither configuration holds.
const cmpExample = join(root, 'evals', 'fixtures', 'runs', 'compare-example');
if (!existsSync(cmpExample)) {
  fail('evals/fixtures/runs/compare-example missing: the baseline comparison has no regression');
} else {
  const run = spawnSync(process.execPath, [join(root, 'scripts', 'aggregate-runs.mjs'), join(cmpExample, 'with_skill'), '--baseline', join(cmpExample, 'no_skill'), '--threshold', '0.8', '--json'], { encoding: 'utf8' });
  let cmp = null;
  try { cmp = JSON.parse(run.stdout); } catch { cmp = null; }
  if (!cmp) {
    fail(`aggregate-runs.mjs --baseline did not emit JSON over evals/fixtures/runs/compare-example: ${(run.stderr || run.stdout || '').trim().split('\n')[0]}`);
  } else {
    const got = (cmp.comparison ?? []).map((c) => [c.with_rate, c.baseline_rate, c.verdict]);
    const want = [[1, 0, 'bought'], [1, 1, 'already followed'], [0, 0, 'neither']];
    if (JSON.stringify(got) !== JSON.stringify(want)) fail(`aggregate-runs.mjs --baseline over the fixture pair reports ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);
  }
}

// The no dash rule is house style for this repository and not a property the package demands of what
// a workspace publishes (ticket 16). The walk above holds the repository half. This holds the other:
// the grader does not fail an artifact for the character. The case cannot live in
// evals/fixtures/artifacts/, because a committed fixture carrying the character would break the very
// rule this check draws the boundary of, so it is built here from the clean fixture and thrown away.
const dashFixture = join(artifactsDir, 'refine-story-pt-BR.md');
if (!existsSync(dashFixture)) {
  fail(`${dashFixture.slice(root.length + 1)} missing: the grader has nothing to build the dash case from, and the boundary between repository style and what the package grades goes unchecked`);
} else {
  const tmp = mkdtempSync(join(tmpdir(), 'refinement-skills-dash-'));
  try {
    const withDash = join(tmp, 'refine-story-pt-BR.md');
    writeFileSync(withDash, `${readFileSync(dashFixture, 'utf8')}\nNota do validador: um travess\u00e3o \u2014 no corpo do artefato.\n`);
    const run = spawnSync(process.execPath, [join(root, 'scripts', 'grade-output.mjs'), withDash, '--skill', 'refine-story', '--lang', 'pt-BR'], { encoding: 'utf8' });
    if (run.status !== 0) fail(`grade-output.mjs fails an artifact over a dash, which is repository style and not a rule the package states: ${(run.stdout || '').split('\n').filter((l) => l.startsWith('FAIL')).join(', ')}`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

const built = spawnSync(process.execPath, [join(root, 'scripts', 'build-prompts.mjs'), '--check'], { encoding: 'utf8' });
if (built.status !== 0) fail((built.stderr || built.stdout).trim());

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
console.log(`ok: ${skills.length} valid skills (${userInvoked.size} user-invoked, ${skills.length - userInvoked.size} model-invoked), ${graded} artifact fixtures graded`);
