/**
 * Surgical edits to a JSON file that may carry comments.
 *
 * `angular.json` and `project.json` are read by people and live in version control. Parsing and re-serializing
 * them rewrites every inline array and every comment, and the diff of a one-line change becomes the whole file.
 * These helpers find the value by its key path in the text and splice only what is new.
 */

export interface ValueRange {
  /** Index of the first character of the value. */
  readonly start: number;
  /** Index just past the last character of the value. */
  readonly end: number;
}

/** Skips whitespace and `//` and `/* *\/` comments, returning the index of the next significant character. */
function skipTrivia(text: string, from: number): number {
  let index = from;

  while (index < text.length) {
    const char = text[index];

    if (/\s/.test(char)) {
      index++;
    } else if (char === '/' && text[index + 1] === '/') {
      while (index < text.length && text[index] !== '\n') index++;
    } else if (char === '/' && text[index + 1] === '*') {
      const close = text.indexOf('*/', index + 2);
      index = close === -1 ? text.length : close + 2;
    } else {
      break;
    }
  }

  return index;
}

/** The index just past the string that starts at `from` (which holds the opening quote). */
function endOfString(text: string, from: number): number {
  let index = from + 1;

  while (index < text.length) {
    if (text[index] === '\\') index += 2;
    else if (text[index] === '"') return index + 1;
    else index++;
  }

  throw new SyntaxError('Unterminated string');
}

/** The index just past the value that starts at `from`. */
function endOfValue(text: string, from: number): number {
  const char = text[from];

  if (char === '"') return endOfString(text, from);

  if (char === '{' || char === '[') {
    const closing = char === '{' ? '}' : ']';
    let index = skipTrivia(text, from + 1);

    while (text[index] !== closing) {
      if (index >= text.length) throw new SyntaxError('Unterminated container');

      if (char === '{') {
        index = endOfString(text, index);
        index = skipTrivia(text, index);
        if (text[index] !== ':') throw new SyntaxError('Expected ":"');
        index = skipTrivia(text, index + 1);
      }

      index = skipTrivia(text, endOfValue(text, index));
      if (text[index] === ',') index = skipTrivia(text, index + 1);
    }

    return index + 1;
  }

  let index = from;
  while (index < text.length && !/[\s,\]}]/.test(text[index])) index++;
  if (index === from) throw new SyntaxError('Expected a value');

  return index;
}

/** The key at `from`, and where the value after its colon starts. */
function readMember(text: string, from: number): { key: string; valueStart: number } {
  if (text[from] !== '"') throw new SyntaxError('Expected a key');

  const key = JSON.parse(text.slice(from, endOfString(text, from))) as string;
  const colon = skipTrivia(text, endOfString(text, from));
  if (text[colon] !== ':') throw new SyntaxError('Expected ":"');

  return { key, valueStart: skipTrivia(text, colon + 1) };
}

/**
 * Where the value at `keys` sits in the text, or null when the path does not exist.
 *
 * Throws a `SyntaxError` when the text is not JSON this scanner understands — the caller treats that as
 * "cannot edit, print the snippet".
 */
export function locateValue(text: string, keys: readonly string[]): ValueRange | null {
  let index = skipTrivia(text, 0);
  let range: ValueRange = { start: index, end: endOfValue(text, index) };

  for (const wanted of keys) {
    if (text[range.start] !== '{') return null;

    let cursor = skipTrivia(text, range.start + 1);
    let found: ValueRange | null = null;

    while (text[cursor] !== '}') {
      if (cursor >= text.length) throw new SyntaxError('Unterminated object');

      const { key, valueStart } = readMember(text, cursor);
      const valueEnd = endOfValue(text, valueStart);

      if (key === wanted) {
        found = { start: valueStart, end: valueEnd };
        break;
      }

      cursor = skipTrivia(text, valueEnd);
      if (text[cursor] === ',') cursor = skipTrivia(text, cursor + 1);
    }

    if (!found) return null;
    range = found;
    index = range.start;
  }

  return range;
}

/** The indentation unit the file uses: a tab, or the width of its first indented line. */
function indentUnit(text: string): string {
  const indented = /\n([ \t]+)\S/.exec(text)?.[1];

  if (!indented) return '  ';
  return indented.startsWith('\t') ? '\t' : ' '.repeat(Math.min(indented.length, 8));
}

/** The indentation of the line holding `index`. */
function indentAt(text: string, index: number): string {
  const lineStart = text.lastIndexOf('\n', index - 1) + 1;
  return /^[ \t]*/.exec(text.slice(lineStart))?.[0] ?? '';
}

/** A JSON value written the way the file is: one member per line, nested by the file's own indentation unit. */
function formatValue(value: unknown, indent: string, unit: string): string {
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    const inner = indent + unit;
    return `[\n${value.map(item => inner + formatValue(item, inner, unit)).join(',\n')}\n${indent}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (!entries.length) return '{}';
    const inner = indent + unit;
    return `{\n${entries.map(([key, item]) => `${inner}${JSON.stringify(key)}: ${formatValue(item, inner, unit)}`).join(',\n')}\n${indent}}`;
  }

  return JSON.stringify(value);
}

/**
 * Appends items to the array at `keys`, creating the array (and nothing above it) when it is missing.
 *
 * Returns null when the parent object does not exist: creating a whole target is not a one-line change and the
 * caller prints the snippet instead.
 */
export function appendToArray(text: string, keys: readonly string[], items: readonly unknown[]): string | null {
  const unit = indentUnit(text);
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const array = locateValue(text, keys);

  if (array) {
    if (text[array.start] !== '[') return null;

    const itemsIndent = indentAt(text, array.start) + unit;
    const body = text.slice(array.start + 1, array.end - 1).replace(/\s+$/, '');
    const written = items.map(item => itemsIndent + formatValue(item, itemsIndent, unit)).join(',\n');
    const closingIndent = indentAt(text, array.end - 1);
    const separator = body.trim().endsWith(',') ? '\n' : body.trim() ? ',\n' : '\n';
    const replacement = `[${body}${separator}${written}\n${closingIndent}]`;

    return text.slice(0, array.start) + replacement.replace(/\r?\n/g, eol) + text.slice(array.end);
  }

  const parent = locateValue(text, keys.slice(0, -1));
  if (!parent || text[parent.start] !== '{') return null;

  const memberIndent = indentAt(text, parent.start) + unit;
  const member = `${memberIndent}${JSON.stringify(keys[keys.length - 1])}: ${formatValue(items, memberIndent, unit)}`;
  const inner = text.slice(parent.start + 1, parent.end - 1).replace(/\s+$/, '');
  const closingIndent = indentAt(text, parent.end - 1);
  const separator = inner.trim() ? (inner.trimEnd().endsWith(',') ? '\n' : ',\n') : '\n';
  const replacement = `{${inner}${separator}${member}\n${closingIndent}}`;

  return text.slice(0, parent.start) + replacement.replace(/\r?\n/g, eol) + text.slice(parent.end);
}
