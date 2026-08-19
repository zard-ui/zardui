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
 * Escreve o `.postcssrc.json` na raiz do projeto que vai usá-lo.
 *
 * O build do Angular procura o arquivo a partir do CSS que está processando e
 * sobe até a raiz do workspace, então o projeto é o lugar mais específico que
 * funciona — e num monorepo com vários apps é o único que não configura todos
 * eles de uma vez. `projectRoot` é `.` no app único.
 */
export async function createPostCssConfig(cwd: string, projectRoot = '.'): Promise<void> {
  const targetDir = path.resolve(cwd, projectRoot);

  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, '.postcssrc.json'), POSTCSS_CONFIG, 'utf8');
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

  // Numa biblioteca esse arquivo normalmente não existe — é o init que o cria,
  // para a lib expor os tokens a quem a consome.
  await mkdir(path.dirname(stylesPath), { recursive: true });
  await writeFile(stylesPath, themeContent, 'utf8');
}
