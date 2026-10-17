#!/usr/bin/env node
// Valida o pacote: frontmatter, manifesto do plugin, roteador, README e prosa.
// uso: node scripts/validate-skills.mjs
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
      fail(`${skillName}: linha inválida no frontmatter: "${line}"`);
      continue;
    }
    const val = kv[2].trim();
    if (val.includes(': ') && !(val.startsWith('"') && val.endsWith('"')) && !(val.startsWith("'") && val.endsWith("'"))) {
      fail(`${skillName}: valor de "${kv[1]}" contém ": " mas não está entre aspas (incompatível com parsers YAML)`);
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
  if (!existsSync(skillFile)) { fail(`${name}: sem SKILL.md`); continue; }
  const text = readFileSync(skillFile, 'utf8');
  const fm = frontmatter(text, name);
  if (!fm) { fail(`${name}: frontmatter ausente`); continue; }
  if (fm.name !== name) fail(`${name}: name "${fm.name}" difere da pasta`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) fail(`${name}: nome fora do padrão do Agent Skills`);
  if (!fm.description) fail(`${name}: description ausente`);
  else if (fm.description.length > 1024) fail(`${name}: description acima de 1024 caracteres`);
  const lines = text.split('\n').length;
  if (lines > 500) fail(`${name}: SKILL.md com ${lines} linhas (máximo 500)`);
  const yamlFile = join(dir, 'agents', 'openai.yaml');
  if (!existsSync(yamlFile)) {
    fail(`${name}: agents/openai.yaml ausente`);
  } else {
    const yaml = readFileSync(yamlFile, 'utf8');
    const disabled = fm['disable-model-invocation'] === 'true';
    const implicitOff = /allow_implicit_invocation:\s*false/.test(yaml);
    if (disabled !== implicitOff) fail(`${name}: disable-model-invocation=${disabled} mas allow_implicit_invocation:false=${implicitOff} no openai.yaml`);
    if (disabled) userInvoked.add(name);
  }
}

const plugin = JSON.parse(readFileSync(join(root, '.claude-plugin', 'plugin.json'), 'utf8'));
const listed = (plugin.skills || []).map((p) => p.replace(/^\.\/skills\//, '')).sort();
for (const s of skills) if (!listed.includes(s)) fail(`plugin.json não lista ${s}`);
for (const s of listed) if (!skills.includes(s)) fail(`plugin.json lista ${s}, que não existe`);

const readme = readFileSync(join(root, 'README.md'), 'utf8');
for (const s of skills) if (!readme.includes(`skills/${s}/SKILL.md`)) fail(`README.md não linka ${s}`);
const router = readFileSync(join(skillsDir, 'which-flow', 'SKILL.md'), 'utf8');
for (const s of skills) if (s !== 'which-flow' && !router.includes(s)) fail(`which-flow não menciona ${s}`);

// Autocontenção: toda chamada à Skill tool aponta para uma skill deste pacote.
for (const name of skills) {
  const text = readFileSync(join(skillsDir, name, 'SKILL.md'), 'utf8');
  for (const m of text.matchAll(/Skill tool para `([a-z0-9-]+)`/g)) {
    if (!skills.includes(m[1])) fail(`${name}: chama a Skill tool para ${m[1]}, que não existe em skills/`);
  }
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (['.git', 'node_modules', '.scratch'].includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.md')) out.push(p);
  }
  return out;
}
for (const file of walk(root)) {
  const rel = file.slice(root.length + 1);
  const text = readFileSync(file, 'utf8');
  if (text.includes('\u2014')) fail(`${rel}: contém travessão`);
  if (text.charCodeAt(0) === 0xfeff || text.includes('\r')) fail(`${rel}: BOM ou CRLF`);
}

for (const f of readdirSync(join(root, 'evals')).filter((f) => f.endsWith('.json'))) {
  try { JSON.parse(readFileSync(join(root, 'evals', f), 'utf8')); } catch (e) { fail(`evals/${f}: JSON inválido (${e.message})`); }
}

const built = spawnSync(process.execPath, [join(root, 'scripts', 'build-prompts.mjs'), '--check'], { encoding: 'utf8' });
if (built.status !== 0) fail((built.stderr || built.stdout).trim());

if (errors.length) {
  for (const e of errors) console.error(`erro: ${e}`);
  process.exit(1);
}
console.log(`ok: ${skills.length} skills válidas (${userInvoked.size} invocadas pelo usuário, ${skills.length - userInvoked.size} pelo modelo)`);
