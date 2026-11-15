import { getAllComponentNames } from '@cli/commands/add/dependency-resolver.js';
import { resolveInstallAliases } from '@cli/commands/add/install-aliases.js';
import { logger } from '@cli/utils/logger.js';

/**
 * Works out which components the command should install, from its arguments.
 *
 * Returns an empty list when nothing was given: the wizard picks in that case
 * (or, with no interactive terminal, the command fails asking for the names).
 *
 * A name that is really another item's page — `toast`, which is `sonner` — is
 * replaced by the item and the replacement is said out loud, so a script that
 * relies on the old name sees what was installed.
 */
export async function selectComponents(components: string[], allFlag: boolean): Promise<string[]> {
  if (allFlag) return getAllComponentNames();

  const requested = components ?? [];
  if (!requested.length) return requested;

  const { names, replaced } = resolveInstallAliases(requested, new Set(await getAllComponentNames()));
  for (const [given, installed] of replaced) logger.info(`${given} → ${installed}`);

  return names;
}
