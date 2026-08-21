/**
 * Source edits that more than one init step needs to make.
 *
 * Inserting an import looks trivial until the file is in CRLF: a raw `\n`
 * produces mixed endings, makes git mark the whole file as changed, and — when
 * the expression that finds the imports forgets the `\r` — welds the new line
 * onto the end of the previous one.
 */

/** The line ending the file already uses. */
export function lineEndingOf(content: string): string {
  return content.includes('\r\n') ? '\r\n' : '\n';
}

/** The file's last `import ... from '...'`, or null when there is none. */
function lastImport(content: string): RegExpExecArray | null {
  // `[\s\S]*?` rather than `.*`: the list of imported symbols often wraps across
  // several lines, and a pattern anchored to a single line did not reach it — in
  // such a file the new import was thrown in before all the others.
  const importRegex = /^import\s[\s\S]*?from\s+'[^']*';\r?\n?/gm;

  let last: RegExpExecArray | null = null;
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content)) !== null) last = match;

  return last;
}

/**
 * Inserts an import line just after the file's last import.
 *
 * Returns the content untouched when the import is already there, so calling it
 * twice is the same as calling it once.
 */
export function withImport(content: string, importLine: string): string {
  if (content.includes(importLine)) return content;

  const eol = lineEndingOf(content);
  const last = lastImport(content);

  if (!last) return importLine + eol + content;

  const end = last.index + last[0].length;
  const alreadyBroken = /\r?\n$/.test(last[0]);

  return content.slice(0, end) + (alreadyBroken ? '' : eol) + importLine + eol + content.slice(end);
}

/** Where an array literal starts and ends, as indices into the content. */
export interface ArrayRange {
  /** Index of the opening `[`. */
  readonly open: number;
  /** Index of the closing `]`. */
  readonly close: number;
  /** What sits between the two, without the brackets. */
  readonly body: string;
}

/**
 * The range of the array assigned to `key`, found by counting brackets.
 *
 * A regular expression stops at the first `]` it sees, and in real code that `]`
 * is usually a nested array's — `withInterceptors([...])` inside `providers`, a
 * plugin with options inside `plugins`. Anything inserted there landed in the
 * wrong array, and the build broke with a type error that mentions ZardUI
 * nowhere.
 *
 * Strings and comments are skipped, so a `]` written inside one does not count
 * as a closing bracket.
 */
export function arrayRange(content: string, key: string): ArrayRange | null {
  const opening = new RegExp(`\\b${key}\\s*:\\s*\\[`).exec(content);

  if (!opening) return null;

  const open = opening.index + opening[0].length - 1;
  let depth = 0;

  for (let index = open; index < content.length; index++) {
    const skipped = skipStringOrComment(content, index);

    if (skipped !== index) {
      index = skipped - 1;
      continue;
    }

    const char = content[index];

    if (char === '[') depth++;
    else if (char === ']' && --depth === 0) {
      return { open, close: index, body: content.slice(open + 1, index) };
    }
  }

  return null;
}

/**
 * The index just past the string or comment starting at `index`.
 *
 * Returns `index` itself when there is neither — the caller uses that to know
 * the character is code and should be taken into account.
 */
function skipStringOrComment(content: string, index: number): number {
  const char = content[index];
  const next = content[index + 1];

  if (char === '/' && next === '/') {
    const end = content.indexOf('\n', index);
    return end === -1 ? content.length : end;
  }

  if (char === '/' && next === '*') {
    const end = content.indexOf('*/', index + 2);
    return end === -1 ? content.length : end + 2;
  }

  if (char !== '"' && char !== "'" && char !== '`') return index;

  for (let cursor = index + 1; cursor < content.length; cursor++) {
    if (content[cursor] === '\\') {
      cursor++;
      continue;
    }
    if (content[cursor] === char) return cursor + 1;
  }

  return content.length;
}
