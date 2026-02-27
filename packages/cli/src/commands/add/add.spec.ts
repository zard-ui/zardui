const mockInstallPackages = jest.fn().mockResolvedValue(undefined);
const mockGetConfig = jest.fn();
const mockGetProjectInfo = jest.fn();
const mockResolveConfigPaths = jest.fn();
const mockSelectComponents = jest.fn();
const mockResolveDependencies = jest.fn();
const mockInstallComponent = jest.fn().mockResolvedValue(undefined);
const mockValidateTargetPath = jest.fn();
const mockPrompts = jest.fn();
const mockGetTargetDir = jest.fn();
const mockExistsSync = jest.fn().mockReturnValue(true);
const mockSpinnerInstance = { text: '', start: jest.fn(), succeed: jest.fn(), stop: jest.fn(), fail: jest.fn() };

jest.mock('@cli/utils/package-manager.js', () => ({
  installPackages: (...args: any[]) => mockInstallPackages(...args),
}));

jest.mock('@cli/utils/config.js', () => ({
  getConfig: (...args: any[]) => mockGetConfig(...args),
  resolveConfigPaths: (...args: any[]) => mockResolveConfigPaths(...args),
}));

jest.mock('@cli/utils/get-project-info.js', () => ({
  getProjectInfo: (...args: any[]) => mockGetProjectInfo(...args),
}));

jest.mock('@cli/commands/add/component-selector.js', () => ({
  selectComponents: (...args: any[]) => mockSelectComponents(...args),
}));

jest.mock('@cli/commands/add/dependency-resolver.js', () => ({
  resolveDependencies: (...args: any[]) => mockResolveDependencies(...args),
  getTargetDir: (...args: any[]) => mockGetTargetDir(...args),
}));

jest.mock('@cli/commands/add/component-installer.js', () => ({
  installComponent: (...args: any[]) => mockInstallComponent(...args),
  validateTargetPath: (...args: any[]) => mockValidateTargetPath(...args),
}));

jest.mock('@cli/commands/add/dark-mode-setup.js', () => ({
  updateProvideZardWithDarkMode: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@cli/commands/init/theme-loader.js', () => ({
  injectThemeScript: jest.fn().mockResolvedValue(undefined),
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
  spinner: () => {
    mockSpinnerInstance.start.mockReturnValue(mockSpinnerInstance);
    return mockSpinnerInstance;
  },
}));

jest.mock('@cli/utils/errors.js', () => ({
  CliError: class CliError extends Error {
    code: string;
    constructor(message: string, code: string) {
      super(message);
      this.code = code;
    }
  },
}));

jest.mock('node:fs', () => ({
  existsSync: (...args: any[]) => mockExistsSync(...args),
}));

jest.mock(
  'prompts',
  () =>
    (...args: any[]) =>
      mockPrompts(...args),
);

jest.mock('chalk', () => ({
  default: {
    bold: (s: string) => s,
    dim: (s: string) => s,
    cyan: (s: string) => s,
  },
  __esModule: true,
}));

import type { Config } from '@cli/utils/config.js';

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

function makeResolvedConfig(pm: 'npm' | 'yarn' | 'pnpm' | 'bun') {
  const config = makeConfig(pm);
  return {
    ...config,
    resolvedPaths: {
      tailwindCss: '/project/src/styles.css',
      baseUrl: '/project/src/app',
      components: '/project/src/app/shared/components',
      utils: '/project/src/app/shared/utils',
      core: '/project/src/app/shared/core',
      services: '/project/src/app/shared/services',
    },
  };
}

const baseProjectInfo = {
  framework: 'angular' as const,
  hasTypeScript: true,
  hasTailwind: true,
  hasNx: false,
  angularVersion: '21.0.0',
  angularVersionRaw: '^21.0.0',
};

describe('add command integration', () => {
  let add: any;

  beforeEach(() => {
    jest.resetModules();
    mockInstallPackages.mockReset();
    mockGetConfig.mockReset();
    mockGetProjectInfo.mockReset();
    mockResolveConfigPaths.mockReset();
    mockSelectComponents.mockReset();
    mockResolveDependencies.mockReset();
    mockInstallComponent.mockReset();
    mockGetTargetDir.mockReset();
    mockExistsSync.mockReset();
    mockPrompts.mockReset();

    mockInstallPackages.mockResolvedValue(undefined);
    mockInstallComponent.mockResolvedValue(undefined);
    mockExistsSync.mockReturnValue(true);

    add = require('@cli/commands/add/index.js').add;
  });

  describe.each(['npm', 'yarn', 'pnpm', 'bun'] as const)('with %s runner', pm => {
    it('should read PM from config and install deps with correct runner', async () => {
      const config = makeConfig(pm);
      const resolvedConfig = makeResolvedConfig(pm);

      mockGetConfig.mockResolvedValue(config);
      mockGetProjectInfo.mockResolvedValue(baseProjectInfo);
      mockResolveConfigPaths.mockResolvedValue(resolvedConfig);
      mockSelectComponents.mockResolvedValue(['button']);
      mockResolveDependencies.mockResolvedValue({
        componentsToInstall: [
          {
            name: 'button',
            basePath: 'button',
            dependencies: ['@angular/cdk'],
            devDependencies: [],
            registryDependencies: [],
          },
        ],
        dependenciesToInstall: new Set(['@angular/cdk']),
      });
      mockGetTargetDir.mockReturnValue('/project/src/app/shared/components/button');

      await add.parseAsync(['button', '--yes', '--cwd', '/project'], { from: 'user' });

      // Verify installPackages was called with the stored runner
      expect(mockInstallPackages).toHaveBeenCalledWith(expect.arrayContaining(['@angular/cdk']), '/project', pm, false);
    });
  });

  it('should throw CliError when config not found', async () => {
    mockGetConfig.mockResolvedValue(null);

    // Commander catches the error, so we test the loadConfiguration function behavior
    await expect(add.parseAsync(['node', 'zard-cli', 'add', 'button', '--yes', '--cwd', '/project'])).rejects.toThrow(
      'Configuration not found',
    );
  });

  it('should retry with --legacy-peer-deps on install failure', async () => {
    const config = makeConfig('npm');
    const resolvedConfig = makeResolvedConfig('npm');

    mockGetConfig.mockResolvedValue(config);
    mockGetProjectInfo.mockResolvedValue(baseProjectInfo);
    mockResolveConfigPaths.mockResolvedValue(resolvedConfig);
    mockSelectComponents.mockResolvedValue(['button']);
    mockResolveDependencies.mockResolvedValue({
      componentsToInstall: [
        {
          name: 'button',
          basePath: 'button',
          dependencies: ['@angular/cdk'],
          devDependencies: [],
          registryDependencies: [],
        },
      ],
      dependenciesToInstall: new Set(['@angular/cdk']),
    });
    mockGetTargetDir.mockReturnValue('/project/src/app/shared/components/button');

    // First install fails, retry succeeds
    mockInstallPackages.mockRejectedValueOnce(new Error('peer dep conflict')).mockResolvedValueOnce(undefined);

    await add.parseAsync(['button', '--yes', '--cwd', '/project'], { from: 'user' });

    // Second call should have legacyPeerDeps=true
    expect(mockInstallPackages).toHaveBeenCalledTimes(2);
    expect(mockInstallPackages.mock.calls[1]).toEqual([
      expect.arrayContaining(['@angular/cdk']),
      '/project',
      'npm',
      false,
      true,
    ]);
  });

  it('should skip install when no dependencies to install', async () => {
    const config = makeConfig('npm');
    const resolvedConfig = makeResolvedConfig('npm');

    mockGetConfig.mockResolvedValue(config);
    mockGetProjectInfo.mockResolvedValue(baseProjectInfo);
    mockResolveConfigPaths.mockResolvedValue(resolvedConfig);
    mockSelectComponents.mockResolvedValue(['button']);
    mockResolveDependencies.mockResolvedValue({
      componentsToInstall: [
        { name: 'button', basePath: 'button', dependencies: [], devDependencies: [], registryDependencies: [] },
      ],
      dependenciesToInstall: new Set(),
    });
    mockGetTargetDir.mockReturnValue('/project/src/app/shared/components/button');

    await add.parseAsync(['button', '--yes', '--cwd', '/project'], { from: 'user' });

    expect(mockInstallPackages).not.toHaveBeenCalled();
  });

  it('should log info and return when all components already installed', async () => {
    const config = makeConfig('npm');
    const resolvedConfig = makeResolvedConfig('npm');

    mockGetConfig.mockResolvedValue(config);
    mockGetProjectInfo.mockResolvedValue(baseProjectInfo);
    mockResolveConfigPaths.mockResolvedValue(resolvedConfig);
    mockSelectComponents.mockResolvedValue(['button']);
    mockResolveDependencies.mockResolvedValue({
      componentsToInstall: [],
      dependenciesToInstall: new Set(),
    });

    await add.parseAsync(['button', '--yes', '--cwd', '/project'], { from: 'user' });

    const { logger } = require('@cli/utils/logger.js');
    expect(logger.info).toHaveBeenCalledWith('All components already installed.');
    expect(mockInstallPackages).not.toHaveBeenCalled();
  });
});
