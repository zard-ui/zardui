const mockInstallPackages = jest.fn().mockResolvedValue(undefined);
const mockGetProjectInfo = jest.fn();

jest.mock('@cli/utils/package-manager.js', () => ({
  installPackages: (...args: any[]) => mockInstallPackages(...args),
}));

jest.mock('@cli/utils/get-project-info.js', () => ({
  getProjectInfo: (...args: any[]) => mockGetProjectInfo(...args),
}));

jest.mock('@cli/utils/logger.js', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    success: jest.fn(),
    break: jest.fn(),
  },
}));

import { installDependencies } from '@cli/commands/init/dependencies.js';
import type { Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';

const baseProjectInfo = {
  framework: 'angular' as const,
  hasTypeScript: true,
  hasTailwind: false,
  hasNx: false,
  angularVersion: '21.0.0',
  angularVersionRaw: '^21.0.0',
};

function makeConfig(pm: 'npm' | 'yarn' | 'pnpm' | 'bun'): Config {
  return {
    style: 'css',
    appConfigFile: 'src/app/app.config.ts',
    packageManager: pm,
    tailwind: { css: 'src/styles.css', baseColor: 'slate' },
    baseUrl: 'src/app',
    aliases: {
      components: '@/shared/components',
      utils: '@/shared/utils',
      core: '@/shared/core',
      services: '@/shared/services',
    },
  };
}

describe('installDependencies', () => {
  beforeEach(() => {
    mockInstallPackages.mockReset();
    mockInstallPackages.mockResolvedValue(undefined);
    mockGetProjectInfo.mockReset();
  });

  describe.each(['npm', 'yarn', 'pnpm', 'bun'] as const)('with %s runner', pm => {
    it('should install deps using the correct runner', async () => {
      await installDependencies('/project', makeConfig(pm), { ...baseProjectInfo, hasTailwind: true });

      expect(mockInstallPackages).toHaveBeenCalledWith(
        expect.arrayContaining(['class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-angular']),
        '/project',
        pm,
        false,
      );
    });

    it('should install devDeps when Tailwind is not installed', async () => {
      await installDependencies('/project', makeConfig(pm), { ...baseProjectInfo, hasTailwind: false });

      // Called twice: deps + devDeps
      expect(mockInstallPackages).toHaveBeenCalledTimes(2);
      expect(mockInstallPackages).toHaveBeenCalledWith(
        expect.arrayContaining(['tailwindcss', '@tailwindcss/postcss', 'postcss', 'tailwindcss-animate']),
        '/project',
        pm,
        true,
      );
    });
  });

  it('should skip Tailwind devDeps when Tailwind is already installed', async () => {
    await installDependencies('/project', makeConfig('npm'), { ...baseProjectInfo, hasTailwind: true });

    // Only called once for regular deps
    expect(mockInstallPackages).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('already installed'));
  });

  it('should include @angular/cdk@^21 for Angular 21', async () => {
    await installDependencies('/project', makeConfig('npm'), {
      ...baseProjectInfo,
      angularVersion: '21.0.0',
      hasTailwind: true,
    });

    expect(mockInstallPackages).toHaveBeenCalledWith(
      expect.arrayContaining(['@angular/cdk@^21']),
      '/project',
      'npm',
      false,
    );
  });

  it('should include @angular/cdk@^19 for Angular 19', async () => {
    await installDependencies('/project', makeConfig('npm'), {
      ...baseProjectInfo,
      angularVersion: '19.2.0',
      hasTailwind: true,
    });

    expect(mockInstallPackages).toHaveBeenCalledWith(
      expect.arrayContaining(['@angular/cdk@^19']),
      '/project',
      'npm',
      false,
    );
  });

  it('should include @angular/cdk without version when Angular version not detected', async () => {
    await installDependencies('/project', makeConfig('npm'), {
      ...baseProjectInfo,
      angularVersion: null,
      hasTailwind: true,
    });

    expect(mockInstallPackages).toHaveBeenCalledWith(
      expect.arrayContaining(['@angular/cdk']),
      '/project',
      'npm',
      false,
    );

    // Should NOT contain versioned CDK
    const depsArg = mockInstallPackages.mock.calls[0][0] as string[];
    expect(depsArg.some((d: string) => d.startsWith('@angular/cdk@'))).toBe(false);
  });

  it('should fetch project info when not provided', async () => {
    mockGetProjectInfo.mockResolvedValueOnce({ ...baseProjectInfo, hasTailwind: true });

    await installDependencies('/project', makeConfig('npm'));

    expect(mockGetProjectInfo).toHaveBeenCalledWith('/project');
  });
});

describe('installWithRetry (via installDependencies)', () => {
  beforeEach(() => {
    mockInstallPackages.mockReset();
  });

  it('should retry with legacyPeerDeps when first attempt fails', async () => {
    // First call fails, second (retry) succeeds
    mockInstallPackages.mockRejectedValueOnce(new Error('peer dep conflict'));
    mockInstallPackages.mockResolvedValueOnce(undefined);

    await installDependencies('/project', makeConfig('npm'), { ...baseProjectInfo, hasTailwind: true });

    expect(mockInstallPackages).toHaveBeenCalledTimes(2);
    // First call without legacy-peer-deps
    expect(mockInstallPackages.mock.calls[0]).toEqual([expect.any(Array), '/project', 'npm', false]);
    // Second call with legacy-peer-deps flag
    expect(mockInstallPackages.mock.calls[1]).toEqual([expect.any(Array), '/project', 'npm', false, true]);
  });

  it('should retry devDeps independently if devDeps install fails', async () => {
    // Regular deps succeed, devDeps first attempt fails, retry succeeds
    mockInstallPackages
      .mockResolvedValueOnce(undefined) // deps OK
      .mockRejectedValueOnce(new Error('conflict')) // devDeps fail
      .mockResolvedValueOnce(undefined); // devDeps retry OK

    await installDependencies('/project', makeConfig('npm'), { ...baseProjectInfo, hasTailwind: false });

    expect(mockInstallPackages).toHaveBeenCalledTimes(3);
    // Third call is devDeps retry with legacy flag
    expect(mockInstallPackages.mock.calls[2]).toEqual([
      expect.arrayContaining(['tailwindcss']),
      '/project',
      'npm',
      true,
      true,
    ]);
  });

  it('should pass legacyPeerDeps=true to installPackages for any runner on retry', async () => {
    for (const pm of ['npm', 'yarn', 'pnpm', 'bun'] as const) {
      mockInstallPackages.mockReset();
      mockInstallPackages.mockRejectedValueOnce(new Error('fail'));
      mockInstallPackages.mockResolvedValueOnce(undefined);

      await installDependencies('/project', makeConfig(pm), { ...baseProjectInfo, hasTailwind: true });

      // installPackages is responsible for ignoring legacyPeerDeps for non-npm runners
      expect(mockInstallPackages.mock.calls[1][4]).toBe(true);
    }
  });

  it('should propagate error if retry also fails', async () => {
    mockInstallPackages.mockRejectedValue(new Error('still failing'));

    await expect(
      installDependencies('/project', makeConfig('npm'), { ...baseProjectInfo, hasTailwind: true }),
    ).rejects.toThrow('still failing');
  });
});
