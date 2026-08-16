/**
 * Como invocar a zard-cli sem passar por um shell.
 *
 * `execFile('npx', …)` parece resolver, e resolve no POSIX. No Windows não:
 * `npx` ali é `npx.cmd`, e desde a correção do CVE-2024-27980 o Node se recusa
 * a executar um `.cmd` sem `shell: true` — a chamada morre em ENOENT. A saída
 * tentadora é ligar o shell, que é exatamente o que reabriria a injeção que
 * este comando já sofreu uma vez.
 *
 * A saída certa é não precisar de shell em lugar nenhum: tudo aqui roda com o
 * próprio Node (`process.execPath`) sobre um arquivo `.js`, que é a mesma
 * abordagem que o build da CLI usa pelo mesmo motivo.
 *
 * A ordem também é uma decisão de segurança: a cópia instalada no projeto vem
 * antes do `npx`, que baixaria e executaria um pacote da rede.
 */

import { existsSync } from 'node:fs';
import * as path from 'node:path';

export interface CliInvocation {
  /** O programa. Nunca um `.cmd`, nunca uma string de shell. */
  readonly file: string;
  /** Os argumentos que precedem os do comando. */
  readonly prefix: string[];
  /** De onde ele saiu, para a mensagem de erro dizer o que foi tentado. */
  readonly source: 'local' | 'npx-cli' | 'npx';
}

/** O entrypoint do npm que acompanha este Node, se der para localizá-lo. */
function bundledNpx(): string | null {
  const nodeDir = path.dirname(process.execPath);

  const candidates = [
    // Windows: o npm fica ao lado do executável.
    path.join(nodeDir, 'node_modules', 'npm', 'bin', 'npx-cli.js'),
    // POSIX: <prefix>/bin/node e <prefix>/lib/node_modules.
    path.join(nodeDir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npx-cli.js'),
  ];

  return candidates.find(candidate => existsSync(candidate)) ?? null;
}

/**
 * O que executar para rodar a zard-cli a partir de `cwd`.
 *
 * A cópia do projeto é preferida: além de dispensar a rede, é a versão que
 * aquele projeto escolheu. O `npx` só entra quando ela não existe.
 */
export function resolveCliInvocation(cwd: string): CliInvocation {
  const local = path.join(cwd, 'node_modules', 'zard-cli', 'index.js');
  if (existsSync(local)) {
    return { file: process.execPath, prefix: [local], source: 'local' };
  }

  const npxCli = bundledNpx();
  if (npxCli) {
    return { file: process.execPath, prefix: [npxCli, '--yes', 'zard-cli'], source: 'npx-cli' };
  }

  // Último recurso: o `npx` do PATH. Funciona no POSIX; no Windows falha em
  // ENOENT, e a mensagem de erro do comando diz o que instalar.
  return { file: 'npx', prefix: ['zard-cli'], source: 'npx' };
}
