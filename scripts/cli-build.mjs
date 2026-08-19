/**
 * Build da zard-cli — roda igual em Linux, macOS, Git Bash, PowerShell e cmd.
 *
 * Substitui a sequência de comandos shell que o target do Nx executava
 * (`rm -rf`, `sed -i`, `chmod`, `cp`), que só funcionava em ambientes POSIX.
 *
 * Duas armadilhas do Windows moldam o desenho aqui:
 *   - `npx`/`npm` são `.cmd`, e desde a correção do CVE-2024-27980 o Node se
 *     recusa a executá-los sem shell. Por isso os binários são resolvidos dentro
 *     de node_modules e executados com o próprio Node.
 *   - `npm link` não tem equivalente em JS, então é a única chamada que passa
 *     pelo shell — sem argumentos dinâmicos, portanto sem risco de injeção.
 *
 * Uso:
 *   node scripts/cli-build.mjs --registry <url> --package <arquivo> [--link]
 */

import { execFileSync, execSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = join(ROOT, 'packages', 'cli');
const DIST = join(CLI, 'dist');
const TSCONFIG = 'packages/cli/tsconfig.build.json';

/**
 * Onde o entrypoint da CLI cai dentro do `dist`.
 *
 * A CLI compila junto com `packages/preset`, que é a fonte única dos tokens de
 * tema. Como os dois fontes vivem em pastas irmãs, o diretório-raiz comum passou
 * a ser `packages/`, e o tsc espelha isso na saída: `dist/cli/src` e
 * `dist/preset/src`. Publicar assim é mais barato do que achatar — mover as
 * pastas depois invalidaria os caminhos relativos entre elas, e `main`/`bin` do
 * package.json apontam para cá justamente para que ninguém precise.
 */
const ENTRY_DIR = join(DIST, 'cli', 'src');

const require = createRequire(import.meta.url);

function parseArgs(argv) {
  const args = { link: false };
  for (let index = 0; index < argv.length; index++) {
    const flag = argv[index];
    if (flag === '--link') args.link = true;
    else if (flag === '--registry') args.registry = argv[++index];
    else if (flag === '--package') args.package = argv[++index];
  }

  if (!args.registry) throw new Error('Missing --registry <url>');
  if (!args.package) throw new Error('Missing --package <file>');

  args.registry = validateRegistry(args.registry);
  return args;
}

/**
 * A URL do registry entra no artefato publicado, então é validada antes.
 *
 * Duas coisas que um erro de digitação no comando de build produziria em
 * silêncio: um valor que não é URL nenhuma, que só falharia na máquina de quem
 * instalasse; e uma aspa no meio, que quebraria o arquivo `.js` gerado, já que
 * o placeholder vive dentro de um literal de string.
 */
function validateRegistry(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`--registry must be a URL, got: ${value}`);
  }

  if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
    throw new Error(`--registry must use https (or localhost for development), got: ${value}`);
  }

  // Sem a barra final: o código monta `${base}/registry.json`.
  return url.href.replace(/\/+$/, '');
}

/** Caminho do entrypoint declarado em `bin` — evita depender dos shims .cmd. */
function resolveBin(packageName, binName = packageName) {
  const manifestPath = require.resolve(`${packageName}/package.json`);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const bin = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.[binName];

  if (!bin) throw new Error(`Package "${packageName}" does not declare a "${binName}" bin.`);
  return join(dirname(manifestPath), bin);
}

/**
 * Roda uma ferramenta de build com o próprio Node.
 *
 * Se o pacote ainda não estiver em node_modules, cai para `npx` via shell — é o
 * caso de quem clonou o repo e ainda não rodou `npm install`.
 */
function runTool(packageName, binName, toolArgs) {
  let scriptPath;
  try {
    scriptPath = resolveBin(packageName, binName);
  } catch {
    execSync([binName, ...toolArgs].join(' '), { cwd: ROOT, stdio: 'inherit' });
    return;
  }

  execFileSync(process.execPath, [scriptPath, ...toolArgs], { cwd: ROOT, stdio: 'inherit' });
}

function copyIfExists(from, to) {
  if (existsSync(from)) copyFileSync(from, to);
}

const args = parseArgs(process.argv.slice(2));

// 1. dist limpo — evita arrastar arquivos de um build anterior.
rmSync(DIST, { recursive: true, force: true });

// 2. compila e reescreve os aliases `@cli/*` para caminhos relativos.
runTool('typescript', 'tsc', ['-p', TSCONFIG]);
runTool('tsc-alias', 'tsc-alias', ['-p', TSCONFIG]);

// 3. injeta a URL do registry no lugar do placeholder.
const registryConfig = join(ENTRY_DIR, 'config', 'registry-config.js');
writeFileSync(registryConfig, readFileSync(registryConfig, 'utf8').replaceAll('__REGISTRY_URL__', args.registry));

// 4. shebang + bit de execução: sem isso o binário não roda direto.
const entry = join(ENTRY_DIR, 'index.js');
writeFileSync(entry, `#!/usr/bin/env node\n${readFileSync(entry, 'utf8')}`);
chmodSync(entry, 0o755);

// 5. metadados que o pacote publicado precisa carregar.
copyFileSync(join(CLI, args.package), join(DIST, 'package.json'));
copyIfExists(join(CLI, 'README.md'), join(DIST, 'README.md'));
copyIfExists(join(CLI, '.npmignore'), join(DIST, '.npmignore'));

// 6. no modo dev, registra o binário globalmente (`zardev`).
if (args.link) execSync('npm link', { cwd: DIST, stdio: 'inherit' });

console.log(`\n✔ zard-cli built — registry: ${args.registry}`);
