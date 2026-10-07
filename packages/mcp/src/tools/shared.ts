import { z } from 'zod';

import { registryService } from '../services/registry.service.js';
import { componentsAliasedAs } from '../utils/aliases.js';
import { didYouMean } from '../utils/fuzzy.js';
import { InvalidIdentifierError } from '../utils/identifiers.js';
import { errorMessage, fail } from '../utils/result.js';

export const componentName = z
  .string()
  .describe('Component name as the registry spells it (e.g. "button", "date-picker")');

/**
 * The answer for a component that does not exist, with the closest names when
 * there are any — so the model corrects itself in the next call instead of
 * listing the whole catalog first.
 */
export async function unknownComponent(name: string) {
  let hint = ' Use search-components to find it.';
  try {
    const names = (await registryService.getItems()).map(item => item.name);
    const aliased = componentsAliasedAs(name).filter(candidate => names.includes(candidate));
    hint = aliased.length
      ? ` Did you mean ${aliased.map(n => `"${n}"`).join(' or ')}?`
      : didYouMean(name, names) || hint;
  } catch {
    // The registry is unreachable: the generic hint stands.
  }
  return fail(`No component named "${name}".${hint}`);
}

export async function unknownBlock(id: string) {
  let hint = ' Use list-blocks to see the available blocks.';
  try {
    const ids = (await registryService.getBlocksRegistry()).blocks.map(block => block.id);
    hint = didYouMean(id, ids) || hint;
  } catch {
    // Unreachable: the generic hint stands.
  }
  return fail(`No block named "${id}".${hint}`);
}

/** An invalid name is the caller's mistake and says so; anything else is the network's. */
export function failure(error: unknown, what: string) {
  if (error instanceof InvalidIdentifierError) return fail(error.message);
  return fail(`Could not fetch ${what}: ${errorMessage(error)}`);
}
