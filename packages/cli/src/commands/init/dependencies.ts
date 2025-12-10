import { type Config } from '@cli/utils/config.js';
import { getProjectInfo } from '@cli/utils/get-project-info.js';
import { logger } from '@cli/utils/logger.js';
import { installPackages } from '@cli/utils/package-manager.js';

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
  const deps = [cdkVersion, 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-angular'];

  const devDeps = info.hasTailwind ? [] : ['tailwindcss', '@tailwindcss/postcss', 'postcss', 'tailwindcss-animate'];

  if (info.hasTailwind) {
    logger.info('Tailwind CSS is already installed. Skipping Tailwind dependencies installation.');
  }

  await installWithRetry(deps, cwd, config.packageManager, false);

  if (devDeps.length > 0) {
    await installWithRetry(devDeps, cwd, config.packageManager, true);
  }
}

function getCdkVersion(angularVersion?: string): string {
  if (!angularVersion) {
    return '@angular/cdk';
  }

  const majorVersion = Number.parseInt(angularVersion.split('.')[0]);

  return `@angular/cdk@^${majorVersion}`;
}

async function installWithRetry(
  packages: string[],
  cwd: string,
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun',
  isDev: boolean,
): Promise<void> {
  try {
    await installPackages(packages, cwd, packageManager, isDev);
  } catch {
    logger.warn('Installation failed, retrying with --legacy-peer-deps...');
    await installPackages(packages, cwd, packageManager, isDev, true);
  }
}
