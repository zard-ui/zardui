import { writeFile } from 'node:fs/promises';
import * as path from 'path';

import { getThemeContent, getThemeDisplayName } from '@cli/utils/theme-selector.js';
import { POSTCSS_CONFIG } from '@cli/utils/templates.js';
import { type Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';

export async function setupTailwind(cwd: string, config: Config): Promise<void> {
  await createPostCssConfig(cwd);
  await applyThemeToStyles(cwd, config);
}

async function createPostCssConfig(cwd: string): Promise<void> {
  const postcssConfigPath = path.join(cwd, '.postcssrc.json');
  await writeFile(postcssConfigPath, POSTCSS_CONFIG, 'utf8');
}

async function applyThemeToStyles(cwd: string, config: Config): Promise<void> {
  const stylesPath = path.join(cwd, config.tailwind.css);
  const selectedTheme = config.tailwind.baseColor;
  const themeContent = getThemeContent(selectedTheme);

  await writeFile(stylesPath, themeContent, 'utf8');

  logger.info(`Applied ${getThemeDisplayName(selectedTheme)} theme configuration to your CSS file`);
}
