/**
 * Typo tolerance for the names a model sends.
 *
 * Models guess names from shadcn, from other libraries or from memory:
 * `dropdown-menu`, `datepicker`, `toast`. Answering "not found" sends them on a
 * second round trip through list-components, which costs the whole catalog in
 * context. Answering "did you mean dropdown?" costs one line.
 */

/** Edit distance between two strings, case-insensitive. */
export function distance(a: string, b: string): number {
  a = a.toLowerCase();
  b = b.toLowerCase();
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }
  return previous[b.length];
}

function sharedPrefix(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

/** Lowercase, with separators removed: `Date Picker`, `date_picker` and `datepicker` all compare equal. */
function squash(value: string): string {
  return value.toLowerCase().replace(/[\s_-]+/g, '');
}

/**
 * Up to `limit` candidates that look like what was asked for, best first.
 *
 * A candidate qualifies when one contains the other (`dropdown-menu` →
 * `dropdown`), when they share a stem of four letters, or when the edit distance is small relative to the length, so a
 * short name does not match everything.
 */
export function suggest(input: string, candidates: readonly string[], limit = 3): string[] {
  const wanted = squash(input);
  if (!wanted) return [];
  return candidates
    .map(candidate => {
      const name = squash(candidate);
      if (name === wanted) return { candidate, score: 0 };
      if (name.includes(wanted) || wanted.includes(name)) return { candidate, score: 1 };
      // A shared stem: "theme" → "theming", "toggl" → "toggle-group".
      if (sharedPrefix(wanted, name) >= 4) return { candidate, score: 2 };
      const d = distance(wanted, name);
      return {
        candidate,
        score: d <= Math.max(1, Math.floor(Math.max(wanted.length, name.length) / 3)) ? 1 + d : Infinity,
      };
    })
    .filter(entry => entry.score !== Infinity)
    .sort((a, b) => a.score - b.score || a.candidate.localeCompare(b.candidate))
    .slice(0, limit)
    .map(entry => entry.candidate);
}

/** ` Did you mean "a" or "b"?`, or nothing when there is no good guess. */
export function didYouMean(input: string, candidates: readonly string[]): string {
  const guesses = suggest(input, candidates);
  if (guesses.length === 0) return '';
  return ` Did you mean ${guesses.map(g => `"${g}"`).join(' or ')}?`;
}
