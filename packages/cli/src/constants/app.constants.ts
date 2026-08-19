import { existsSync, readFileSync } from 'fs';
import { dirname, join, parse } from 'path';
import { fileURLToPath } from 'url';

/**
 * A versão da CLI, lida do `package.json` que a acompanha.
 *
 * Sobe diretório a diretório até encontrá-lo, em vez de contar níveis a partir
 * daqui. A contagem fixa já apontava para o lugar errado assim que a estrutura
 * do `dist` mudou — e o sintoma era um aviso no meio da saída de todo comando,
 * com a versão virando `0.0.0`. A busca vale igual no fonte (`packages/cli`) e
 * no pacote publicado, sem ninguém precisar manter os dois em sincronia.
 */
function getAppVersion(): string {
  try {
    let directory = dirname(fileURLToPath(import.meta.url));
    const { root } = parse(directory);

    while (true) {
      const candidate = join(directory, 'package.json');

      if (existsSync(candidate)) {
        const version = JSON.parse(readFileSync(candidate, 'utf8')).version;
        if (typeof version === 'string') return version;
      }

      if (directory === root) break;
      directory = dirname(directory);
    }

    console.warn('Failed to read version from package.json');
    return '0.0.0';
  } catch {
    console.warn('Failed to read version from package.json');
    return '0.0.0';
  }
}

export const APP_VERSION = getAppVersion();
