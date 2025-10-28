import * as prompts from 'prompts';

import { getAllComponentNames } from '@cli/core/registry/index.js';
import { logger } from '@cli/utils/logger.js';

export async function selectComponents(components: string[], allFlag: boolean): Promise<string[]> {
  if (allFlag) {
    return getAllComponentNames();
  }

  if (!components?.length) {
    return await promptForComponents();
  }

  return components;
}

async function promptForComponents(): Promise<string[]> {
  const { components: selected } = await prompts({
    type: 'multiselect',
    name: 'components',
    message: 'Which components would you like to add?',
    hint: 'Space to select. A to toggle all. Enter to submit.',
    choices: getAllComponentNames().map(name => ({
      title: name,
      value: name,
    })),
  });

  if (!selected?.length) {
    logger.warn('No components selected. Exiting.');
    process.exit(0);
  }

  return selected;
}
