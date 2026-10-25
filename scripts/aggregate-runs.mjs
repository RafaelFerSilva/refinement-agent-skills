#!/usr/bin/env node
// Aggregates the per run grading files of one eval case into a pass rate over runs.
// One run cannot separate a fix from variance, so a case is measured over several runs and each
// assertion is held or not held against a threshold. Reads both grading shapes already in use:
// the viewer's {expectations, summary} and the --json output of scripts/grade-output.mjs.
// With --baseline, the same case measured in another configuration is read too and each assertion is
// reported as bought by the package, already followed without it, lost, or held by neither.
// With --grading <name>, the per run file read is <name> instead of grading.json, which is how a
// second grader over the same runs, scripts/diff-glossary.mjs for instance, aggregates on its own.
// usage: node scripts/aggregate-runs.mjs <case directory | grading file ...> [--baseline <directory>] [--grading <name>] [--threshold <0..1>] [--json]
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';

const DEFAULT_THRESHOLD = 0.8;
const argv = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1] ?? fallback;
};
const asJson = argv.includes('--json');
// --threshold without a value is an error rather than the default: a report computed at a threshold
// nobody chose reads as one that was chosen.
const thresholdIndex = argv.indexOf('--threshold');
const thresholdGiven = thresholdIndex !== -1;
const thresholdArg = thresholdGiven ? argv[thresholdIndex + 1] : String(DEFAULT_THRESHOLD);
const threshold = Number(thresholdArg);
const baselineIndex = argv.indexOf('--baseline');
const baselineGiven = baselineIndex !== -1;
const baselineArg = baselineGiven ? argv[baselineIndex + 1] : null;
const gradingIndex = argv.indexOf('--grading');
const gradingGiven = gradingIndex !== -1;
const gradingName = gradingGiven ? argv[gradingIndex + 1] : 'grading.json';
// The flags that take a value, in one list, so that a flag added later cannot leak its value into
// the targets by being left out of a per flag condition. A valued flag given twice is an error
// rather than a silent pick of one of the two values.
const VALUED = ['--threshold', '--baseline', '--grading'];
const repeated = VALUED.filter((f) => argv.indexOf(f) !== -1 && argv.indexOf(f) !== argv.lastIndexOf(f));
const valueOf = (i) => i > 0 && VALUED.includes(argv[i - 1]);
const targets = argv.filter((a, i) => !a.startsWith('--') && !valueOf(i));

const usage = 'usage: node scripts/aggregate-runs.mjs <case directory | grading file ...> [--baseline <directory>] [--grading <name>] [--threshold <0..1>] [--json]';
if (repeated.length || !targets.length || thresholdArg === undefined || thresholdArg.startsWith('--') || !Number.isFinite(threshold) || threshold <= 0 || threshold > 1) {
  console.error(usage);
  process.exit(2);
}
if (baselineGiven && (baselineArg === undefined || baselineArg.startsWith('--'))) {
  console.error(usage);
  process.exit(2);
}
if (gradingGiven && (gradingName === undefined || gradingName.startsWith('--') || gradingName.includes('/'))) {
  console.error(usage);
  process.exit(2);
}

// A case directory holds one directory per run, each with a grading file; run-N and with_skill/run-N
// are the layouts the workspace already uses. Only directories named run-<n> count as runs, and they
// are ordered by that number, so a grading file left beside them from an earlier single run
// measurement is not counted as one more run and run-10 does not sort before run-2.
// Explicit grading files are taken in the order given.
function gradingFiles(target) {
  if (!existsSync(target)) {
    console.error(`error: ${target} does not exist`);
    process.exit(2);
  }
  if (!statSync(target).isDirectory()) return [target];
  const runs = [];
  const walk = (dir, depth) => {
    for (const entry of readdirSync(dir).sort()) {
      const p = join(dir, entry);
      if (!statSync(p).isDirectory()) continue;
      const n = entry.match(/^run-(\d+)$/);
      if (n && existsSync(join(p, gradingName))) runs.push({ order: Number(n[1]), file: join(p, gradingName) });
      else if (depth > 0) walk(p, depth - 1);
    }
  };
  walk(target, 2);
  if (!runs.length) {
    const single = join(target, gradingName);
    if (existsSync(single)) return [single];
  }
  return runs.sort((a, b) => a.order - b.order).map((r) => r.file);
}

function aggregate(where) {
const files = where.flatMap(gradingFiles);
if (!files.length) {
  console.error(`error: no ${gradingName} found under ${where.join(', ')}`);
  process.exit(2);
}

// Run label: the directory holding the grading file, which is run-N in the repeat layout.
const runs = files.map((file) => {
  let parsed = null;
  try { parsed = JSON.parse(readFileSync(file, 'utf8')); } catch (e) {
    console.error(`error: ${file} is not valid JSON (${e.message})`);
    process.exit(2);
  }
  const expectations = parsed.expectations;
  if (!Array.isArray(expectations) || !expectations.length) {
    console.error(`error: ${file} carries no expectations array`);
    process.exit(2);
  }
  return { run: basename(dirname(file)), file, expectations };
});

// An assertion is identified by its text, which is what the case file declares and what every
// grading shape carries. A text missing from a run counts as not held in that run and is named.
const texts = [];
for (const run of runs) for (const e of run.expectations) if (!texts.includes(e.text)) texts.push(e.text);

const assertions = texts.map((text) => {
  const perRun = runs.map((run) => {
    const found = run.expectations.filter((e) => e.text === text);
    return {
      run: run.run,
      passed: found.length > 0 && found.every((e) => e.passed),
      missing: found.length === 0,
      duplicated: found.length > 1,
    };
  });
  const held = perRun.filter((r) => r.passed).length;
  const rate = held / runs.length;
  return {
    text,
    held,
    runs: runs.length,
    rate,
    meets_threshold: rate >= threshold,
    missing_in: perRun.filter((r) => r.missing).map((r) => r.run),
    failed_in: perRun.filter((r) => !r.passed && !r.missing).map((r) => r.run),
    duplicated_in: perRun.filter((r) => r.duplicated).map((r) => r.run),
  };
});

// A run is scored against every assertion the case declares, not only the ones its own grading file
// lists, so a grading file that skips an assertion lowers the run that skipped it.
for (const run of runs) {
  run.total = texts.length;
  run.passed = assertions.filter((a) => a.failed_in.includes(run.run) === false && a.missing_in.includes(run.run) === false).length;
  run.pass_rate = texts.length ? run.passed / texts.length : 0;
}

const meeting = assertions.filter((a) => a.meets_threshold).length;
const passRateOverRuns = runs.reduce((sum, r) => sum + r.pass_rate, 0) / runs.length;
const verdict = meeting === assertions.length ? 'held' : 'not held';
return {
  case: basename(where[0].replace(/\/+$/, '')),
  runs: runs.length,
  threshold,
  verdict,
  pass_rate_over_runs: passRateOverRuns,
  assertions_meeting_threshold: meeting,
  assertions_total: assertions.length,
  run_pass_rates: runs.map((r) => ({ run: r.run, passed: r.passed, total: r.total, pass_rate: r.pass_rate, file: r.file })),
  assertions,
};
}

const result = aggregate(targets);
const assertions = result.assertions;
const { verdict, assertions_meeting_threshold: meeting, pass_rate_over_runs: passRateOverRuns } = result;

// An assertion held in one configuration and not the other is the whole point of a baseline: what the
// package buys, and what the model already does without it. An assertion absent from the baseline
// grading is reported as not measured there rather than as a difference.
if (baselineGiven) {
  const baseline = aggregate([baselineArg]);
  result.baseline = baseline;
  // Every assertion either side graded gets a line. One graded on one side only is reported as such
  // rather than dropped: an assertion the baseline holds and the package was never graded on is
  // exactly what this comparison exists to surface.
  const texts = [...assertions.map((a) => a.text)];
  for (const b of baseline.assertions) if (!texts.includes(b.text)) texts.push(b.text);
  result.comparison = texts.map((text) => {
    const a = assertions.find((x) => x.text === text);
    const b = baseline.assertions.find((x) => x.text === text);
    const verdictOf = () => {
      if (!a) return 'not measured with the skill';
      if (!b) return 'not measured in the baseline';
      if (a.meets_threshold && !b.meets_threshold) return 'bought';
      if (a.meets_threshold && b.meets_threshold) return 'already followed';
      if (!a.meets_threshold && b.meets_threshold) return 'lost';
      return 'neither';
    };
    return {
      text,
      with_rate: a ? a.rate : null,
      baseline_rate: b ? b.rate : null,
      delta: a && b ? a.rate - b.rate : null,
      verdict: verdictOf(),
    };
  });
}

const pct = (n) => `${Math.round(n * 100)}%`;
if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`case: ${result.case}, ${result.runs} runs, threshold ${pct(threshold)}\n`);
  for (const r of result.run_pass_rates) console.log(`  ${r.run}: ${r.passed}/${r.total}  ${pct(r.pass_rate)}`);
  console.log('');
  for (const a of assertions) {
    const where = [
      a.failed_in.length ? `failed in ${a.failed_in.join(', ')}` : '',
      a.missing_in.length ? `absent from ${a.missing_in.join(', ')}` : '',
      a.duplicated_in.length ? `listed more than once in ${a.duplicated_in.join(', ')}` : '',
    ].filter(Boolean).join('; ');
    console.log(`${a.meets_threshold ? 'HELD    ' : 'NOT HELD'} ${a.held}/${a.runs}  ${a.text}${where ? `  (${where})` : ''}`);
  }
  console.log(`\n${verdict}: ${meeting}/${assertions.length} assertions at or above ${pct(threshold)}, pass rate over runs ${pct(passRateOverRuns)}`);
  if (result.comparison) {
    const b = result.baseline;
    console.log(`\nbaseline: ${b.case}, ${b.runs} runs, ${b.assertions_meeting_threshold}/${b.assertions_total} assertions at or above ${pct(threshold)}, pass rate over runs ${pct(b.pass_rate_over_runs)}\n`);
    const label = { bought: 'BOUGHT  ', 'already followed': 'ALREADY ', lost: 'LOST    ', neither: 'NEITHER ', 'not measured in the baseline': 'UNKNOWN ', 'not measured with the skill': 'UNKNOWN ' };
    for (const c of result.comparison) {
      const mine = c.with_rate === null ? 'not measured' : pct(c.with_rate);
      const base = c.baseline_rate === null ? 'not measured' : pct(c.baseline_rate);
      console.log(`${label[c.verdict]} with ${mine} vs baseline ${base}  ${c.text}`);
    }
    const bought = result.comparison.filter((c) => c.verdict === 'bought').length;
    const already = result.comparison.filter((c) => c.verdict === 'already followed').length;
    console.log(`\n${bought} bought by the package, ${already} already followed without it, ${result.comparison.length - bought - already} held by neither or lost`);
  }
}
process.exit(verdict === 'held' ? 0 : 1);
