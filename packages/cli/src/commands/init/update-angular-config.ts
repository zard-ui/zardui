import type { Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import { existsSync } from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

const ZARD_PROVIDER_IMPORT = (corePath: string) => `import { provideZard } from '${corePath}/provider/providezard';`;
const ZARD_PROVIDER_ENTRY = 'provideZard()';

/**
 * A quebra de linha que o arquivo já usa.
 *
 * Editar um arquivo CRLF com `\n` cru gera terminações misturadas e, pior, faz
 * o git marcar o arquivo inteiro como alterado — o diff do init deixa de ser
 * legível.
 */
function lineEndingOf(content: string): string {
  return content.includes('\r\n') ? '\r\n' : '\n';
}

/** Insere o import do provider logo depois do último import do arquivo. */
function withProviderImport(content: string, corePath: string): string {
  const importLine = ZARD_PROVIDER_IMPORT(corePath);

  if (content.includes(importLine)) {
    logger.warn('Import statement already exists. Skipping.');
    return content;
  }

  const eol = lineEndingOf(content);
  // O `\r?` é o que faltava: sem ele, num arquivo CRLF a quebra não é
  // consumida e o import novo acaba emendado no anterior, na mesma linha.
  const importRegex = /^import .* from '.*';\r?\n?/gm;

  let lastImport: RegExpExecArray | null = null;
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content)) !== null) lastImport = match;

  if (!lastImport) return importLine + eol + content;

  const end = lastImport.index + lastImport[0].length;
  const alreadyBroken = /\r?\n$/.test(lastImport[0]);

  return content.slice(0, end) + (alreadyBroken ? '' : eol) + importLine + eol + content.slice(end);
}

/**
 * Asynchronously reads, modifies, and writes the Angular application configuration file.
 * @returns {Promise<void>} A promise that resolves when the file operation is complete.
 */
export async function updateAngularConfig(cwd: string, config: Config): Promise<void> {
  const appConfigPath = path.join(cwd, config.appConfigFile);

  if (!existsSync(appConfigPath)) {
    logger.warn(`${appConfigPath} not found, skipping path configuration`);
    return;
  }

  try {
    await fsPromises.access(appConfigPath);
    const original: string = await fsPromises.readFile(appConfigPath, 'utf8');
    const eol = lineEndingOf(original);

    let content = withProviderImport(original, config.aliases.core);

    // Add the provider to the providers array
    const providersRegex = /providers:\s*\[([^\]]*?)\]/s;

    if (providersRegex.test(content)) {
      content = content.replace(providersRegex, (match: string, providersContent: string): string => {
        if (providersContent.includes(ZARD_PROVIDER_ENTRY)) {
          logger.warn('Provider already exists in the list. Skipping.');
          return match;
        }

        // O `]` fica na própria linha: a lista é código que o usuário vai ler e
        // editar depois, e emendar o fechamento no último provider deixa o
        // arquivo torto assim que o Prettier do projeto não roda em seguida.
        const body = providersContent.replace(/\s+$/, '');

        if (body.trim() === '') {
          return `providers: [${eol}    ${ZARD_PROVIDER_ENTRY},${eol}  ]`;
        }

        const withTrailingComma = body.endsWith(',') ? body : `${body},`;
        return `providers: [${withTrailingComma}${eol}    ${ZARD_PROVIDER_ENTRY},${eol}  ]`;
      });
    } else {
      logger.error(
        'Could not find the "providers: [...]" array in app.config.ts. The file structure may be unsupported.',
      );
      return;
    }

    await fsPromises.writeFile(appConfigPath, content, 'utf8');
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'ENOENT') {
      logger.error(`Error: Configuration file not found at ${appConfigPath}`);
    } else if (e instanceof Error) {
      logger.error('An error occurred during file operation:', e.message);
    } else {
      logger.error('An unknown error occurred:', e);
    }
    throw e;
  }
}
