import { getAllComponentNames } from '@cli/commands/add/dependency-resolver.js';

/**
 * Works out which components the command should install, from its arguments.
 *
 * Returns an empty list when nothing was given: the wizard picks in that case
 * (or, with no interactive terminal, the command fails asking for the names).
 */
export async function selectComponents(components: string[], allFlag: boolean): Promise<string[]> {
  if (allFlag) return getAllComponentNames();
  return components ?? [];
}
