import { type Config } from '@cli/utils/config.js';
import { getProjectInfo } from '@cli/utils/get-project-info.js';
import { logger } from '@cli/utils/logger.js';
import { filterInstalledPackages, installPackagesWithRetry } from '@cli/utils/package-manager.js';

type ProjectInfo = {
  framework: string;
  hasTypeScript: boolean;
  hasTailwind: boolean;
  hasNx: boolean;
  angularVersion: string | null;
};

export async function installDependencies(cwd: string, config: Config, projectInfo?: ProjectInfo): Promise<void> {
  const info = projectInfo || (await getProjectInfo(cwd));

  const cdkVersion = getCdkVersion(info.angularVersion);
  const deps = [cdkVersion, 'class-variance-authority', 'clsx', 'tailwind-merge', '@ng-icons/core', '@ng-icons/lucide'];

  const devDeps = info.hasTailwind
    ? ['tailwindcss-animate']
    : ['tailwindcss', '@tailwindcss/postcss', 'postcss', 'tailwindcss-animate'];

  if (info.hasTailwind) {
    logger.info('Tailwind CSS is already installed. Skipping Tailwind dependencies installation.');
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

function getCdkVersion(angularVersion?: string): string {
  if (!angularVersion) {
    return '@angular/cdk';
  }

  const majorVersion = Number.parseInt(angularVersion.split('.')[0]);

  return `@angular/cdk@^${majorVersion}`;
}
