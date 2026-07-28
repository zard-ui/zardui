import { resolveAliasToPath, type Config } from '@cli/utils/config.js';
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

/**
 * O `@import` do CSS é resolvido pelo bundler a partir do arquivo que o contém,
 * então precisa ser um caminho relativo de verdade — não dá para montá-lo
 * fatiando o alias.
 *
 * A versão anterior pegava o segundo segmento do baseUrl e colava o alias sem o
 * primeiro caractere. Só acertava no layout `src/app` + `@/...`: com baseUrl
 * `projects/admin/src/app` mirava `./admin/...`, e com um alias `@app/core`
 * gerava `./appapp/core`.
 */
function coreImportPath(cwd: string, config: Config): string {
  const cssDir = path.dirname(path.resolve(cwd, config.tailwind.css));
  const coreDir = path.resolve(cwd, resolveAliasToPath(config.aliases.core, config.baseUrl));

  const relative = path.relative(cssDir, coreDir).split(path.sep).join('/');

  return relative.startsWith('.') ? relative : `./${relative}`;
}

export async function applyThemeToStyles(cwd: string, config: Config): Promise<void> {
  const stylesPath = path.join(cwd, config.tailwind.css);
  const themeContent = getThemeContent(config.tailwind.baseColor, coreImportPath(cwd, config));

  await writeFile(stylesPath, themeContent, 'utf8');
}
