import { detect } from '@antfu/ni';
import { isCapturing } from '@cli/ui/log-sink.js';
import { getConfig } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import * as path from 'node:path';

type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

let cachedPackageManager: PackageManager | null = null;

const SUPPORTED: readonly PackageManager[] = ['npm', 'yarn', 'pnpm', 'bun'];

function asPackageManager(value: string | null | undefined): PackageManager | null {
  // `yarn@berry`, `pnpm@6`, `bun@1.3.14` — só a família interessa.
  const name = value?.split('@')[0];
  return SUPPORTED.includes(name as PackageManager) ? (name as PackageManager) : null;
}

/**
 * Qual gerenciador o *projeto* usa.
 *
 * A ordem importa. `npm_config_user_agent` descreve como a CLI foi chamada
 * (`npx` sempre diz npm), não o que o projeto usa — confiar nele primeiro fazia
 * um projeto bun receber `packageManager: "npm"` no components.json e ganhar um
 * package-lock.json ao lado do bun.lock. O projeto responde por si: primeiro o
 * campo `packageManager` do package.json, depois os lockfiles.
 */
export async function detectPackageManager(cwd: string = process.cwd()): Promise<PackageManager> {
  if (cachedPackageManager) return cachedPackageManager;

  const declared = asPackageManager(await readPackageManagerField(cwd));
  if (declared) return (cachedPackageManager = declared);

  const fromLockfile = asPackageManager(await detect({ programmatic: true, cwd }));
  if (fromLockfile) return (cachedPackageManager = fromLockfile);

  const userAgent = process.env.npm_config_user_agent || '';

  if (userAgent.includes('bun')) return (cachedPackageManager = 'bun');
  if (userAgent.includes('pnpm')) return (cachedPackageManager = 'pnpm');
  if (userAgent.includes('yarn')) return (cachedPackageManager = 'yarn');

  return (cachedPackageManager = 'npm');
}

const RUNNER: Record<PackageManager, string> = {
  npm: 'npx',
  yarn: 'yarn dlx',
  pnpm: 'pnpm dlx',
  bun: 'bunx',
};

/**
 * Como sugerir que o usuário rode a CLI de novo.
 *
 * Aqui a pergunta é outra: não é qual gerenciador o projeto usa para instalar
 * dependências, e sim por onde a CLI acabou de ser executada. Quem chamou
 * `npx zard-cli init` num projeto bun não espera terminar lendo `bunx` — e o
 * `npx` que ele já usou funciona. Só quando não dá para saber é que o
 * gerenciador do projeto responde.
 */
export function suggestedRunner(packageManager: PackageManager): string {
  const userAgent = process.env.npm_config_user_agent || '';

  if (userAgent.startsWith('bun')) return RUNNER.bun;
  if (userAgent.startsWith('pnpm')) return RUNNER.pnpm;
  if (userAgent.startsWith('yarn')) return RUNNER.yarn;
  if (userAgent.startsWith('npm')) return RUNNER.npm;

  return RUNNER[packageManager];
}

/** O campo `packageManager` do package.json — padrão do Corepack, é declaração explícita. */
async function readPackageManagerField(cwd: string): Promise<string | null> {
  try {
    const manifest = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8'));
    return typeof manifest.packageManager === 'string' ? manifest.packageManager : null;
  } catch {
    return null;
  }
}

export async function getPackageManager(cwd: string = process.cwd()): Promise<'npm' | 'yarn' | 'pnpm' | 'bun'> {
  const config = await getConfig(cwd);
  return config?.packageManager ?? 'npm';
}

export async function getInstallCommand(packageManager: string, isDev = false): Promise<string[]> {
  switch (packageManager) {
    case 'yarn':
      return isDev ? ['add', '-D'] : ['add'];
    case 'pnpm':
      return isDev ? ['add', '-D'] : ['add'];
    case 'bun':
      return isDev ? ['add', '-d'] : ['add'];
    case 'npm':
    default:
      return isDev ? ['install', '-D'] : ['install'];
  }
}

/**
 * Trabalho que o gerenciador faz por hábito e que não serve à instalação em si.
 *
 * A auditoria de vulnerabilidades manda a árvore inteira para o registro e
 * espera a resposta; em projeto Angular, com mais de mil pacotes, ela sozinha
 * responde por vários segundos de uma chamada que instala meia dúzia deles.
 */
function speedFlags(packageManager: PackageManager): string[] {
  return packageManager === 'npm' ? ['--no-audit', '--no-fund'] : [];
}

export async function installPackages(
  packages: string[],
  cwd: string,
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun',
  isDev = false,
  legacyPeerDeps = false,
): Promise<void> {
  const { execa } = await import('execa');
  const installCmd = await getInstallCommand(packageManager, isDev);

  const args = [...installCmd, ...packages, ...speedFlags(packageManager)];

  if (legacyPeerDeps && packageManager === 'npm') {
    args.push('--legacy-peer-deps');
  }

  if (legacyPeerDeps && packageManager === 'pnpm') {
    args.push('--no-strict-peer-dependencies');
  }

  // Com a tela interativa montada, herdar o stdio deixaria o gerenciador de
  // pacotes escrever por cima do frame. Nesse caso a saída é capturada e só
  // aparece em modo debug; fora dela, o comportamento continua sendo o de
  // repassar a saída ao vivo.
  if (isCapturing()) {
    const command = `${packageManager} ${args.join(' ')}`;
    try {
      // stdin ignorado, não em pipe: um pipe de entrada aberto nunca recebe EOF
      // e o gerenciador de pacotes fica esperando nele para sempre. Fechar o
      // stdin também garante que ele nunca tente abrir um prompt, o que seria
      // invisível atrás da tela cheia.
      const result = await execa(packageManager, args, {
        cwd,
        stdin: 'ignore',
        stdout: 'pipe',
        stderr: 'pipe',
      });
      logger.debug(`${command}\n${result.stdout}`);
    } catch (error) {
      // Sem isso a falha chega ao usuário como uma linha genérica: a saída real
      // do gerenciador de pacotes fica no sink e é impressa junto do resumo.
      logger.error(`${command} failed:\n${outputOf(error)}`);
      throw error;
    }
    return;
  }

  // stdin ignorado aqui também. A instalação recebe os pacotes por argumento e
  // nunca tem o que perguntar; herdar um stdin que não fecha (pipe, CI, job em
  // background) prende o gerenciador esperando um EOF que não vem — a saída
  // continua ao vivo porque stdout e stderr seguem herdados.
  await execa(packageManager, args, { cwd, stdin: 'ignore', stdout: 'inherit', stderr: 'inherit' });
}

function outputOf(error: unknown): string {
  const { stderr, stdout, message } = (error ?? {}) as { stderr?: string; stdout?: string; message?: string };
  return (stderr?.trim() || stdout?.trim() || message || String(error)).trim();
}

/** Só npm e pnpm têm como relaxar a checagem de peers; nos outros, repetir é repetir a mesma falha. */
function canRelaxPeers(packageManager: PackageManager): boolean {
  return packageManager === 'npm' || packageManager === 'pnpm';
}

let peerRelaxationEngaged = false;

/**
 * Instala o lote e, se o gerenciador recusar a árvore por conflito de peers,
 * repete com a checagem relaxada.
 *
 * A queda fica registrada para o resto da execução: quando o primeiro lote
 * precisou do fallback, os seguintes vão precisar pelo mesmo motivo, e a
 * tentativa que já se sabe condenada custa uma resolução inteira da árvore.
 */
export async function installPackagesWithRetry(
  packages: string[],
  cwd: string,
  packageManager: PackageManager,
  isDev = false,
): Promise<void> {
  if (packages.length === 0) return;

  if (peerRelaxationEngaged) {
    await installPackages(packages, cwd, packageManager, isDev, true);
    return;
  }

  try {
    await installPackages(packages, cwd, packageManager, isDev);
  } catch (error) {
    if (!canRelaxPeers(packageManager)) throw error;

    logger.warn('Installation failed, retrying with relaxed peer dependency resolution...');
    await installPackages(packages, cwd, packageManager, isDev, true);
    peerRelaxationEngaged = true;
  }
}

/**
 * Descarta do lote os pacotes que o projeto já declara e já resolve.
 *
 * O gerenciador cobra caro por invocação — revalida a árvore inteira mesmo
 * quando não há nada a fazer —, então o ganho não está em acelerar a instalação
 * e sim em não chamá-la. Um `add` em projeto já inicializado pede justamente as
 * dependências que o `init` colocou lá.
 *
 * O filtro é deliberadamente conservador: na dúvida o pacote continua no lote e
 * quem decide é o gerenciador. Comparar apenas a major basta porque as versões
 * que a CLI pede são sempre da forma `^N`.
 */
export async function filterInstalledPackages(packages: string[], cwd: string): Promise<string[]> {
  const declared = await readDeclaredDependencies(cwd);
  if (!declared) return packages;

  return packages.filter(spec => {
    const { name, range } = parseSpec(spec);
    const declaredRange = declared[name];

    if (!declaredRange) return true;
    if (!isResolvable(name, cwd)) return true;
    if (range && majorOf(range) !== majorOf(declaredRange)) return true;

    return false;
  });
}

function parseSpec(spec: string): { name: string; range: string | null } {
  // O `@` de `@ng-icons/core` abre o escopo, não a versão — por isso o último.
  const separator = spec.lastIndexOf('@');
  if (separator <= 0) return { name: spec, range: null };

  return { name: spec.slice(0, separator), range: spec.slice(separator + 1) };
}

function majorOf(range: string): string | null {
  return /(\d+)/.exec(range)?.[1] ?? null;
}

async function readDeclaredDependencies(cwd: string): Promise<Record<string, string> | null> {
  try {
    const manifest = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8'));
    return { ...manifest.dependencies, ...manifest.devDependencies };
  } catch {
    return null;
  }
}

/** node_modules pode estar acima do projeto — workspaces içam tudo para a raiz. */
function isResolvable(name: string, cwd: string): boolean {
  let dir = path.resolve(cwd);

  for (;;) {
    if (existsSync(path.join(dir, 'node_modules', name))) return true;

    const parent = path.dirname(dir);
    if (parent === dir) return false;
    dir = parent;
  }
}
