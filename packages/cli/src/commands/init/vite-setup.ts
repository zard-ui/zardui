import { logger } from '@cli/utils/logger.js';
import { arrayRange, lineEndingOf, withImport } from '@cli/utils/source-file.js';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';

const TAILWIND_IMPORT = "import tailwindcss from '@tailwindcss/vite';";
const TAILWIND_PLUGIN = 'tailwindcss()';

/** Os nomes que o Vite aceita, na ordem em que ele próprio procura. */
const CONFIG_FILES = ['vite.config.ts', 'vite.config.mts', 'vite.config.js', 'vite.config.mjs'];

export function findViteConfig(cwd: string): string | null {
  return CONFIG_FILES.map(name => path.join(cwd, name)).find(existsSync) ?? null;
}

/**
 * Registra o Tailwind como plugin do Vite.
 *
 * No Analog quem compila é o Vite, não o build do Angular — um `.postcssrc.json`
 * ali não é lido por ninguém, e sem o plugin o `@import 'tailwindcss'` que o
 * tema escreve no CSS global não gera utilitário nenhum.
 */
export async function setupVitePlugin(cwd: string): Promise<void> {
  const configPath = findViteConfig(cwd);

  if (!configPath) {
    logger.warn('vite.config.ts not found; add the @tailwindcss/vite plugin manually.');
    return;
  }

  const original = await readFile(configPath, 'utf8');

  if (original.includes('@tailwindcss/vite')) {
    logger.info('Tailwind is already registered as a Vite plugin. Skipping.');
    return;
  }

  const withPlugin = registerPlugin(withImport(original, TAILWIND_IMPORT), lineEndingOf(original));

  if (withPlugin === null) {
    logger.warn(
      `Could not find the "plugins: [...]" array in ${path.basename(configPath)}; add tailwindcss() manually.`,
    );
    return;
  }

  await writeFile(configPath, withPlugin, 'utf8');
}

/**
 * Acrescenta `tailwindcss()` à lista de plugins.
 *
 * O plugin entra no fim: a ordem importa para o Vite, e o do Analog precisa
 * processar os arquivos Angular antes que o Tailwind varra as classes.
 */
function registerPlugin(content: string, eol: string): string | null {
  const plugins = arrayRange(content, 'plugins');

  if (!plugins) return null;
  if (plugins.body.includes(TAILWIND_PLUGIN)) return content;

  // A indentação dos itens existentes é a que o arquivo já usa; repeti-la evita
  // que a linha nova destoe do resto quando não há Prettier depois.
  const indent = /\n([ \t]+)\S/.exec(plugins.body)?.[1] ?? '    ';
  const closingIndent = indent.slice(0, Math.max(0, indent.length - 2));
  const trimmed = plugins.body.replace(/\s+$/, '');

  const entries = trimmed.trim() ? `${trimmed.endsWith(',') ? trimmed : `${trimmed},`}` : '';

  return (
    content.slice(0, plugins.open) +
    `[${entries}${eol}${indent}${TAILWIND_PLUGIN},${eol}${closingIndent}]` +
    content.slice(plugins.close + 1)
  );
}
