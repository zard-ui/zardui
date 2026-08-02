import { APRIL_2025 } from './2025/april-2025';
import { AUGUST_2025 } from './2025/august-2025';
import { DECEMBER_2025 } from './2025/december-2025';
import { JULY_2025 } from './2025/july-2025';
import { JUNE_2025 } from './2025/june-2025';
import { MARCH_2025 } from './2025/march-2025';
import { MAY_2025 } from './2025/may-2025';
import { NOVEMBER_2025 } from './2025/november-2025';
import { OCTOBER_2025 } from './2025/october-2025';
import { SEPTEMBER_2025 } from './2025/september-2025';
import { MARCH_2026 } from './2026/march-2026';
import { type ChangelogEntry } from './changelog-entry.interface';

/**
 * Every published changelog entry, newest first.
 *
 * Each entry is plain metadata (`entries/<year>/<month>-<year>.ts`); the demo
 * components and their highlighted code live in a sibling `.examples.ts` module
 * that the entry loads on demand, so adding a month costs nothing on first paint.
 * Add new months here — order does not matter, the list is sorted by date.
 */
export const CHANGELOG_ENTRIES: readonly ChangelogEntry[] = [
  MARCH_2026,
  DECEMBER_2025,
  NOVEMBER_2025,
  OCTOBER_2025,
  SEPTEMBER_2025,
  AUGUST_2025,
  JULY_2025,
  JUNE_2025,
  MAY_2025,
  APRIL_2025,
  MARCH_2025,
].sort((a, b) => b.meta.date.getTime() - a.meta.date.getTime());
