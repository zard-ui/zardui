/**
 * Abrir uma URL no navegador de quem está usando.
 *
 * Cada sistema tem o seu comando, e nenhum deles existe em todo lugar — um
 * container Linux sem `xdg-open`, um WSL sem navegador, uma sessão SSH. Por isso
 * a função devolve se conseguiu em vez de levantar erro: quem chama imprime a
 * URL, que é o que a pessoa precisava de qualquer forma.
 */

import { logger } from '@cli/utils/logger.js';
import { execa } from 'execa';

interface Opener {
  readonly file: string;
  readonly args: (url: string) => string[];
}

const OPENERS: Record<string, Opener> = {
  // `start` é interno do cmd, não um executável — daí o `cmd /c`. O argumento
  // vazio é o título da janela: sem ele, uma URL entre aspas seria lida como
  // título e nada abriria.
  win32: { file: 'cmd', args: url => ['/c', 'start', '', url] },
  darwin: { file: 'open', args: url => [url] },
  linux: { file: 'xdg-open', args: url => [url] },
};

export async function openUrl(url: string): Promise<boolean> {
  const opener = OPENERS[process.platform] ?? OPENERS['linux'];
  if (!opener) return false;

  try {
    await execa(opener.file, opener.args(url), { stdio: 'ignore' });
    return true;
  } catch (error) {
    logger.debug(`Could not open the browser: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}
