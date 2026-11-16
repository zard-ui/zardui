/**
 * Reads and writes one marker's rules in the eight style sheets, safely when several people (or agents) edit at once.
 *
 *   npx tsx scripts/create-parity/sheet-rule.mts get cn-badge
 *   npx tsx scripts/create-parity/sheet-rule.mts set lyra 1 cn-badge rounded-none px-2 text-xs
 *   npx tsx scripts/create-parity/sheet-rule.mts set nova 2 cn-badge hover:bg-primary/80   # pass 2: variant classes
 *   npx tsx scripts/create-parity/sheet-rule.mts set vega 1 cn-badge                       # empty rule
 *   npx tsx scripts/create-parity/sheet-rule.mts remove maia 2 cn-badge
 *
 * Every sheet has two passes (README: plain classes, then variant-prefixed ones). A rule that does not exist yet in a
 * pass is added at the end of its component's `/* MARK: x *\/` section there (the section is created when missing);
 * the component is the marker's MARK in pass 1, or `--mark <name>`. Writes take a lock directory, so two writers never
 * interleave a read-modify-write of the same sheet.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const STYLES = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'] as const;
type Style = (typeof STYLES)[number];

const DIR = resolve('libs/zard/src/lib/shared/core/css/styles');
const LOCK = resolve('.sheet-rule.lock');
const NOVA_NOT =
  ':not(:where(.style-vega, .style-maia, .style-lyra, .style-mira, .style-luma, .style-sera, .style-rhea) *)';
const PASS2 = '/* ---- PASS 2';

const file = (style: Style) => join(DIR, `style-${style}.css`);

/** [start, end) of each pass in the sheet text. */
function passes(text: string): [[number, number], [number, number]] {
  const split = text.indexOf(PASS2);
  if (split < 0) throw new Error('No PASS 2 header');
  return [
    [0, split],
    [split, text.length],
  ];
}

function selectorOf(style: Style, marker: string): string {
  return style === 'nova' ? `.${marker}${NOVA_NOT}` : `  .${marker}`;
}

/** The rule of `marker` within [from, to): its full text range and its classes. */
function findRule(text: string, style: Style, marker: string, [from, to]: [number, number]) {
  const head = style === 'nova' ? `\n${selectorOf(style, marker)} {\n` : `\n${selectorOf(style, marker)} {\n`;
  const start = text.indexOf(head, from);
  if (start < 0 || start >= to) return null;
  const close = style === 'nova' ? '\n}\n' : '\n  }\n';
  const end = text.indexOf(close, start + head.length - 1);
  const body = text.slice(start + head.length, end + 1);
  const apply = /@apply ([^;]*);/.exec(body);
  return { start: start + 1, end: end + close.length, classes: apply ? apply[1].trim() : '' };
}

function render(style: Style, marker: string, classes: string): string {
  const indent = style === 'nova' ? '' : '  ';
  const inner = classes.trim() ? `${indent}  @apply ${classes.trim()};\n` : '';
  return `${selectorOf(style, marker)} {\n${inner}${indent}}\n`;
}

/** The MARK section a marker sits in, read from pass 1. */
function markOf(text: string, style: Style, marker: string): string | null {
  const rule = findRule(text, style, marker, passes(text)[0]);
  if (!rule) return null;
  const marks = [...text.slice(0, rule.start).matchAll(/\/\* MARK: ([^*]+?) \*\//g)];
  return marks.at(-1)?.[1] ?? null;
}

function insert(text: string, style: Style, pass: 0 | 1, marker: string, mark: string, rule: string): string {
  const [from, to] = passes(text)[pass];
  const indent = style === 'nova' ? '' : '  ';
  const header = `${indent}/* MARK: ${mark} */\n`;
  const at = text.indexOf(`\n${header}`, from);

  if (at >= 0 && at < to) {
    // The end of the section: the next MARK in this pass, or the end of the pass block.
    const next = text.indexOf(`\n${indent}/* MARK: `, at + header.length);
    const blockEnd = style === 'nova' ? to : text.lastIndexOf('\n}\n', to - 1) + 1;
    const end = next >= 0 && next < blockEnd ? next + 1 : blockEnd;
    const before = text.slice(0, end).replace(/\n*$/, '\n');
    return `${before}\n${rule}\n${text.slice(end).replace(/^\n*/, '')}`;
  }

  // No section for this component in this pass: a new one at the end of the pass.
  const end = style === 'nova' ? to : text.lastIndexOf('\n}\n', to - 1) + 1;
  const before = text.slice(0, end).replace(/\n*$/, '\n');
  return `${before}\n${header}\n${rule}\n${text.slice(end).replace(/^\n*/, '')}`;
}

function withLock<T>(run: () => T): T {
  const deadline = Date.now() + 30_000;
  for (;;) {
    try {
      mkdirSync(LOCK);
      break;
    } catch {
      if (Date.now() > deadline) throw new Error(`Lock ${LOCK} held for 30 s; remove it if no writer is running.`);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50);
    }
  }
  try {
    return run();
  } finally {
    rmSync(LOCK, { recursive: true, force: true });
  }
}

function main(): void {
  const args = process.argv.slice(2);
  const markFlag = args.indexOf('--mark');
  const markOverride = markFlag >= 0 ? args.splice(markFlag, 2)[1] : undefined;
  const [command, ...rest] = args;

  if (command === 'get') {
    const marker = rest[0];
    for (const style of STYLES) {
      const text = readFileSync(file(style), 'utf8');
      const [p1, p2] = passes(text).map(range => findRule(text, style, marker, range));
      console.log(`${style.padEnd(5)} 1: ${p1 ? p1.classes || '(empty)' : '(none)'}`);
      console.log(`${' '.repeat(5)} 2: ${p2 ? p2.classes || '(empty)' : '(none)'}`);
    }
    return;
  }

  if (command === 'set' || command === 'remove') {
    const [style, passArg, marker, ...classes] = rest as [Style, string, string, ...string[]];
    if (!STYLES.includes(style)) throw new Error(`Unknown style "${style}"`);
    const pass = (Number(passArg) - 1) as 0 | 1;
    if (pass !== 0 && pass !== 1) throw new Error('Pass is 1 or 2');
    if (!/^cn-[a-z0-9-]+$/.test(marker)) throw new Error(`"${marker}" is not a marker`);
    // `get` prints these for a missing or empty rule; copied into `set` they would become invalid classes.
    if (classes.some(name => name === '(none)' || name === '(empty)')) {
      throw new Error('"(none)" and "(empty)" are what get prints, not classes: pass no classes for an empty rule');
    }

    withLock(() => {
      let text = readFileSync(file(style), 'utf8');
      const range = passes(text)[pass];
      const existing = findRule(text, style, marker, range);

      if (command === 'remove') {
        if (!existing) return;
        text = text.slice(0, existing.start) + text.slice(existing.end).replace(/^\n/, '');
      } else if (existing) {
        text = text.slice(0, existing.start) + render(style, marker, classes.join(' ')) + text.slice(existing.end);
      } else {
        const mark = markOverride ?? markOf(text, style, marker);
        if (!mark) throw new Error(`No MARK for ${marker} in ${style}; pass --mark <component>`);
        text = insert(text, style, pass, marker, mark, render(style, marker, classes.join(' ')));
      }
      writeFileSync(file(style), text);
    });
    console.log(`${command} ${style} pass ${pass + 1} ${marker}: done`);
    return;
  }

  console.log(
    'Usage: get <marker> | set <style> <1|2> <marker> [classes…] | remove <style> <1|2> <marker> [--mark <component>]',
  );
  process.exit(1);
}

main();
