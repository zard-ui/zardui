import { type Config } from '@cli/utils/config.js';
import { getThemeContent } from '@cli/utils/theme-selector.js';
import { writeFile } from 'node:fs/promises';
import * as path from 'path';

const POSTCSS_CONFIG = `{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
`;

export async function setupTailwind(cwd: string, config: Config): Promise<void> {
  await createPostCssConfig(cwd);
  await applyThemeToStyles(cwd, config);
}

export async function createPostCssConfig(cwd: string): Promise<void> {
  const postcssConfigPath = path.join(cwd, '.postcssrc.json');
  await writeFile(postcssConfigPath, POSTCSS_CONFIG, 'utf8');
}

export async function applyThemeToStyles(cwd: string, config: Config): Promise<void> {
  const stylesPath = path.join(cwd, config.tailwind.css);
  const selectedTheme = config.tailwind.baseColor;
  const parts = config.baseUrl.split('/');
  const base = parts.length > 1 ? parts[1] : parts[0];
  const corePath = './' + base + config.aliases.core.substring(1);
  const themeContent = getThemeContent(selectedTheme, corePath);

  await writeFile(stylesPath, themeContent, 'utf8');
}
