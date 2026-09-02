import { presetOf, resolveAliasToPath, type Config } from '@cli/utils/config.js';
import { presetCatalog } from '@cli/utils/preset-catalog.js';
import { normalizePreset, renderThemeCss, resolvePreset } from '@zardui/preset';
import { mkdir, writeFile } from 'node:fs/promises';
import * as path from 'path';

const POSTCSS_CONFIG = `{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
`;

/**
 * Writes `.postcssrc.json` at the root of the project that will use it.
 *
 * The Angular build looks for the file starting from the CSS it is processing
 * and walks up to the workspace root, so the project is the most specific place
 * that works — and in a monorepo with several apps it is the only one that does
 * not configure all of them at once. `projectRoot` is `.` for a single app.
 */
export async function createPostCssConfig(cwd: string, projectRoot = '.'): Promise<void> {
  const targetDir = path.resolve(cwd, projectRoot);

  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, '.postcssrc.json'), POSTCSS_CONFIG, 'utf8');
}

/**
 * The CSS `@import` is resolved by the bundler relative to the file containing
 * it, so it has to be a real relative path — it cannot be assembled by slicing
 * the alias.
 *
 * The previous version took the second segment of baseUrl and pasted the alias
 * without its first character. It only worked for the `src/app` + `@/...`
 * layout: with baseUrl `projects/admin/src/app` it aimed at `./admin/...`, and
 * with an `@app/core` alias it produced `./appapp/core`.
 */
export function coreImportPath(cwd: string, config: Config): string {
  const cssDir = path.dirname(path.resolve(cwd, config.tailwind.css));
  const coreDir = path.resolve(cwd, resolveAliasToPath(config.aliases.core, config.baseUrl));

  const relative = path.relative(cssDir, coreDir).split(path.sep).join('/');

  return relative.startsWith('.') ? relative : `./${relative}`;
}

/**
 * O CSS de tema que este `components.json` descreve.
 *
 * Sai do preset, e não mais do tom neutro sozinho — mas para um arquivo escrito
 * antes do campo `preset` o resultado é byte a byte o mesmo, porque `presetOf`
 * deriva dele exatamente o que ele já dizia.
 */
export function themeCssFor(cwd: string, config: Config): string {
  const preset = normalizePreset(presetOf(config));

  return renderThemeCss(resolvePreset(preset, presetCatalog()), { corePath: coreImportPath(cwd, config) });
}

export async function applyThemeToStyles(cwd: string, config: Config): Promise<void> {
  const stylesPath = path.join(cwd, config.tailwind.css);
  const themeContent = themeCssFor(cwd, config);

  // In a library that file usually does not exist — init creates it, so the
  // library can expose the tokens to whoever consumes it.
  await mkdir(path.dirname(stylesPath), { recursive: true });
  await writeFile(stylesPath, themeContent, 'utf8');
}
