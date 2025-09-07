import { detect } from '@antfu/ni';
import { existsSync } from 'fs';
import path from 'path';

export async function getPackageManager(cwd: string = process.cwd()): Promise<'npm' | 'yarn' | 'pnpm' | 'bun'> {
  // Try @antfu/ni detection first
  const agent = await detect({ cwd });

  // Handle yarn@berry case
  if (agent === 'yarn@berry') return 'yarn';
  if (agent && ['npm', 'yarn', 'pnpm', 'bun'].includes(agent)) {
    return agent as 'npm' | 'yarn' | 'pnpm' | 'bun';
  }

  // Fallback: check lock files if @antfu/ni fails
  const lockFiles = [
    { file: 'bun.lock', manager: 'bun' as const },
    { file: 'pnpm-lock.yaml', manager: 'pnpm' as const },
    { file: 'yarn.lock', manager: 'yarn' as const },
    { file: 'package-lock.json', manager: 'npm' as const },
  ];

  for (const { file, manager } of lockFiles) {
    if (existsSync(path.join(cwd, file))) {
      return manager;
    }
  }

  return 'npm';
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

export async function installPackages(packages: string[], cwd: string, isDev = false, legacyPeerDeps = false): Promise<void> {
  const { execa } = await import('execa');
  const packageManager = await getPackageManager(cwd);
  const installCmd = await getInstallCommand(packageManager, isDev);

  const args = [...installCmd, ...packages];

  // Add legacy-peer-deps flag only for npm
  if (legacyPeerDeps && packageManager === 'npm') {
    args.push('--legacy-peer-deps');
  }

  await execa(packageManager, args, { cwd, stdio: 'inherit' });
}
