#!/usr/bin/env node
// Validates the package: frontmatter, plugin manifest, router, README, prose, and grader regression.
// usage: node scripts/validate-skills.mjs
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
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

// Claude Code bridge: lives in .claude/, imports AGENTS.md, and never sits at the plugin root,
// where `claude plugin validate` warns that it is not loaded as context.
const bridge = join(root, '.claude', 'CLAUDE.md');
if (existsSync(join(root, 'CLAUDE.md'))) fail('CLAUDE.md at the repository root: a plugin root CLAUDE.md is not loaded as context, move it to .claude/CLAUDE.md');
if (!existsSync(bridge)) fail('.claude/CLAUDE.md missing: Claude Code loses the AGENTS.md instructions in this repository');
else if (!readFileSync(bridge, 'utf8').includes('@../AGENTS.md')) fail('.claude/CLAUDE.md does not import @../AGENTS.md');

// Grader regression: every artifact fixture passes its own grader, in the language its name declares.
const artifactsDir = join(root, 'evals', 'fixtures', 'artifacts');
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
    const run = spawnSync(process.execPath, [join(root, 'scripts', 'grade-output.mjs'), join(artifactsDir, f), '--skill', graderSkill, '--lang', lang], { encoding: 'utf8' });
    if (run.status === 0) graded++;
    else fail(`evals/fixtures/artifacts/${f}: grader failed\n       ${(run.stdout || run.stderr || '').split('\n').filter((l) => l.startsWith('FAIL')).join('\n       ')}`);
  }
}

const built = spawnSync(process.execPath, [join(root, 'scripts', 'build-prompts.mjs'), '--check'], { encoding: 'utf8' });
if (built.status !== 0) fail((built.stderr || built.stdout).trim());

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
console.log(`ok: ${skills.length} valid skills (${userInvoked.size} user-invoked, ${skills.length - userInvoked.size} model-invoked), ${graded} artifact fixtures graded`);
