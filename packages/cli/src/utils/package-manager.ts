import { detect } from '@antfu/ni';

import { getConfig } from '@cli/utils/config.js';

export async function detectPackageManager(): Promise<'npm' | 'yarn' | 'pnpm' | 'bun'> {
  const userAgent = process.env.npm_config_user_agent || '';

  if (userAgent.includes('bun')) return 'bun';
  if (userAgent.includes('pnpm')) return 'pnpm';
  if (userAgent.includes('yarn')) return 'yarn';
  if (userAgent.includes('npm')) return 'npm';

  const agent = await detect({ programmatic: true });

  if (agent === 'yarn@berry') return 'yarn';
  if (agent && ['npm', 'yarn', 'pnpm', 'bun'].includes(agent)) {
    return agent as 'npm' | 'yarn' | 'pnpm' | 'bun';
  }

  return 'npm';
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

export async function installPackages(packages: string[], cwd: string, packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun', isDev = false, legacyPeerDeps = false): Promise<void> {
  const { execa } = await import('execa');
  const installCmd = await getInstallCommand(packageManager, isDev);

  const args = [...installCmd, ...packages];

  if (legacyPeerDeps && packageManager === 'npm') {
    args.push('--legacy-peer-deps');
  }

  await execa(packageManager, args, { cwd, stdio: 'inherit' });
}
