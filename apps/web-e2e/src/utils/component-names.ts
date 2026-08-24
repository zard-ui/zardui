import { workspaceRoot } from '@nx/devkit';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every component that has a documentation page, read from the library itself.
 *
 * Taken from disk rather than from a list kept here: a suite that sweeps every
 * page is only worth anything if a new component joins it without anyone
 * remembering to add it.
 */
export const COMPONENT_NAMES: string[] = readdirSync(join(workspaceRoot, 'libs/zard/src/lib/shared/components'), {
  withFileTypes: true,
})
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort();
