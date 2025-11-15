import { type Config } from '@cli/utils/config.js';
import { getProjectInfo } from '@cli/utils/get-project-info.js';
import { logger } from '@cli/utils/logger.js';
import { installPackages } from '@cli/utils/package-manager.js';

export async function installDependencies(cwd: string, config: Config): Promise<void> {
  const projectInfo = await getProjectInfo(cwd);

  const cdkVersion = getCdkVersion(projectInfo.angularVersion);
  const deps = [cdkVersion, 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-angular'];
  const devDeps = ['tailwindcss', '@tailwindcss/postcss', 'postcss', 'tailwindcss-animate'];

  await installWithRetry(deps, cwd, config.packageManager, false);
  await installWithRetry(devDeps, cwd, config.packageManager, true);
}

function getCdkVersion(angularVersion?: string): string {
  if (!angularVersion) {
    return '@angular/cdk';
  }

  const majorVersion = Number.parseInt(angularVersion.split('.')[0]);

  if (majorVersion === 19) {
    return '@angular/cdk@^19.0.0';
  } else if (majorVersion === 18) {
    return '@angular/cdk@^18.0.0';
  } else if (majorVersion === 17) {
    return '@angular/cdk@^17.0.0';
  }

  return '@angular/cdk';
}

async function installWithRetry(
  packages: string[],
  cwd: string,
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun',
  isDev: boolean,
): Promise<void> {
  try {
    await installPackages(packages, cwd, packageManager, isDev);
  } catch (error) {
    logger.warn('Installation failed, retrying with --legacy-peer-deps...');
    await installPackages(packages, cwd, packageManager, isDev, true);
  }
}
