import { bundlerFor, isLibraryKind } from '@cli/commands/init/project-kind.js';
import { type Config } from '@cli/utils/config.js';
import { getProjectInfo, type ProjectInfo } from '@cli/utils/get-project-info.js';
import { logger } from '@cli/utils/logger.js';
import { filterInstalledPackages, installPackagesWithRetry } from '@cli/utils/package-manager.js';

export async function installDependencies(cwd: string, config: Config, projectInfo?: ProjectInfo): Promise<void> {
  const info = projectInfo || (await getProjectInfo(cwd));

  const cdkVersion = getCdkVersion(info.angularVersion);
  const deps = [cdkVersion, 'class-variance-authority', 'clsx', 'tailwind-merge', '@ng-icons/core', '@ng-icons/lucide'];
  const devDeps = tailwindPackages(config.projectType);

  if (info.hasTailwind) {
    logger.info('Tailwind CSS is already installed. Only the missing pieces will be added.');
  }

  // Cada lote que sobra vazio é uma invocação inteira do gerenciador poupada —
  // o caso comum de um `init` repetido é justamente esse, nada a instalar.
  const [missingDeps, missingDevDeps] = await Promise.all([
    filterInstalledPackages(deps, cwd),
    filterInstalledPackages(devDeps, cwd),
  ]);

  if (!missingDeps.length && !missingDevDeps.length) {
    logger.info('All dependencies are already installed.');
    return;
  }

  await installPackagesWithRetry(missingDeps, cwd, config.packageManager, false);
  await installPackagesWithRetry(missingDevDeps, cwd, config.packageManager, true);
}

/**
 * O que o Tailwind precisa para rodar naquele tipo de projeto.
 *
 * A lista é sempre a completa e o filtro de instalados decide o que sobra:
 * checar só a presença do `tailwindcss` deixava passar o caso de quem já o
 * tinha instalado mas sem o adaptador do bundler, e aí o build não gerava
 * utilitário nenhum.
 *
 * Numa biblioteca não há bundler a configurar — quem compila o CSS é a
 * aplicação que a consome —, mas os pacotes ficam porque o tema que o init
 * escreve ali os declara.
 */
function tailwindPackages(kind: Config['projectType']): string[] {
  const shared = ['tailwindcss', 'tailwindcss-animate'];

  if (isLibraryKind(kind)) return shared;

  return bundlerFor(kind) === 'vite'
    ? [...shared, '@tailwindcss/vite']
    : [...shared, '@tailwindcss/postcss', 'postcss'];
}

function getCdkVersion(angularVersion?: string | null): string {
  if (!angularVersion) {
    return '@angular/cdk';
  }

  const majorVersion = Number.parseInt(angularVersion.split('.')[0]);

  return `@angular/cdk@^${majorVersion}`;
}
