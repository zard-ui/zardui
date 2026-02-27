const mockDetectPackageManager = jest.fn();
const mockInstallPackages = jest.fn().mockResolvedValue(undefined);
const mockGetInstallCommand = jest.fn();
const mockWriteFile = jest.fn().mockResolvedValue(undefined);
const mockMkdir = jest.fn().mockResolvedValue(undefined);
const mockExistsSync = jest.fn().mockReturnValue(false);
const mockPrompts = jest.fn();
const mockGetProjectInfo = jest.fn();
const mockInstallDependencies = jest.fn().mockResolvedValue(undefined);
const mockPromptForConfig = jest.fn();
const mockUpdateAngularConfig = jest.fn().mockResolvedValue(undefined);
const mockApplyThemeToStyles = jest.fn().mockResolvedValue(undefined);
const mockCreatePostCssConfig = jest.fn().mockResolvedValue(undefined);
const mockUpdateTsConfig = jest.fn().mockResolvedValue(undefined);
const mockInstallComponent = jest.fn().mockResolvedValue(undefined);
const mockResolveConfigPaths = jest.fn();
const mockSpinnerInstance = { text: '', start: jest.fn(), succeed: jest.fn(), stop: jest.fn(), fail: jest.fn() };

jest.mock('@cli/utils/package-manager.js', () => ({
  detectPackageManager: (...args: any[]) => mockDetectPackageManager(...args),
  installPackages: (...args: any[]) => mockInstallPackages(...args),
  getInstallCommand: (...args: any[]) => mockGetInstallCommand(...args),
}));

jest.mock('@cli/commands/init/dependencies.js', () => ({
  installDependencies: (...args: any[]) => mockInstallDependencies(...args),
}));

jest.mock('@cli/commands/init/config-prompter.js', () => ({
  promptForConfig: (...args: any[]) => mockPromptForConfig(...args),
}));

jest.mock('@cli/commands/init/tailwind-setup.js', () => ({
  applyThemeToStyles: (...args: any[]) => mockApplyThemeToStyles(...args),
  createPostCssConfig: (...args: any[]) => mockCreatePostCssConfig(...args),
}));

jest.mock('@cli/commands/init/tsconfig-updater.js', () => ({
  updateTsConfig: (...args: any[]) => mockUpdateTsConfig(...args),
}));

jest.mock('@cli/commands/init/update-angular-config.js', () => ({
  updateAngularConfig: (...args: any[]) => mockUpdateAngularConfig(...args),
}));

jest.mock('@cli/commands/add/component-installer.js', () => ({
  installComponent: (...args: any[]) => mockInstallComponent(...args),
}));

jest.mock('@cli/utils/config.js', () => ({
  resolveConfigPaths: (...args: any[]) => mockResolveConfigPaths(...args),
  Config: {},
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

jest.mock('node:fs/promises', () => ({
  writeFile: (...args: any[]) => mockWriteFile(...args),
  mkdir: (...args: any[]) => mockMkdir(...args),
}));

jest.mock(
  'prompts',
  () =>
    (...args: any[]) =>
      mockPrompts(...args),
);

jest.mock('chalk', () => ({
  default: { bold: (s: string) => s, dim: (s: string) => s, cyan: (s: string) => s },
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

const baseProjectInfo = {
  framework: 'angular' as const,
  hasTypeScript: true,
  hasTailwind: false,
  hasNx: false,
  angularVersion: '21.0.0',
  angularVersionRaw: '^21.0.0',
};

describe('init command integration', () => {
  let init: any;

  beforeEach(() => {
    jest.resetModules();
    mockDetectPackageManager.mockReset();
    mockInstallPackages.mockReset();
    mockInstallDependencies.mockReset();
    mockPromptForConfig.mockReset();
    mockGetProjectInfo.mockReset();
    mockWriteFile.mockReset();
    mockExistsSync.mockReset();
    mockPrompts.mockReset();
    mockUpdateAngularConfig.mockReset();
    mockApplyThemeToStyles.mockReset();
    mockCreatePostCssConfig.mockReset();
    mockUpdateTsConfig.mockReset();
    mockInstallComponent.mockReset();
    mockResolveConfigPaths.mockReset();
    mockMkdir.mockReset();

    mockInstallPackages.mockResolvedValue(undefined);
    mockInstallDependencies.mockResolvedValue(undefined);
    mockWriteFile.mockResolvedValue(undefined);
    mockMkdir.mockResolvedValue(undefined);
    mockUpdateAngularConfig.mockResolvedValue(undefined);
    mockApplyThemeToStyles.mockResolvedValue(undefined);
    mockCreatePostCssConfig.mockResolvedValue(undefined);
    mockUpdateTsConfig.mockResolvedValue(undefined);
    mockInstallComponent.mockResolvedValue(undefined);

    // Default: cwd exists, no components.json, Angular project
    mockExistsSync.mockImplementation((p: string) => {
      if (String(p).endsWith('components.json')) return false;
      return true;
    });

    init = require('@cli/commands/init/index.js').init;
  });

  describe.each(['npm', 'yarn', 'pnpm', 'bun'] as const)('with %s runner', pm => {
    it('should detect PM, save in config, and install deps with correct runner', async () => {
      const config = makeConfig(pm);
      mockGetProjectInfo.mockResolvedValue(baseProjectInfo);
      mockDetectPackageManager.mockResolvedValue(pm);
      mockPromptForConfig.mockResolvedValue(config);
      mockResolveConfigPaths.mockResolvedValue({
        ...config,
        resolvedPaths: {
          tailwindCss: '/project/src/styles.css',
          baseUrl: '/project/src/app',
          components: '/project/src/app/shared/components',
          utils: '/project/src/app/shared/utils',
          core: '/project/src/app/shared/core',
          services: '/project/src/app/shared/services',
        },
      });

      // Invoke init command action with --yes
      await init.parseAsync(['--yes', '--cwd', '/project'], { from: 'user' });

      // Verify PM was detected
      expect(mockDetectPackageManager).toHaveBeenCalled();

      // Verify config was prompted with detected PM
      expect(mockPromptForConfig).toHaveBeenCalledWith('/project', baseProjectInfo, pm);

      // Verify components.json was written with the correct PM
      expect(mockWriteFile).toHaveBeenCalledWith(
        expect.stringContaining('components.json'),
        expect.stringContaining(`"packageManager": "${pm}"`),
        'utf8',
      );

      // Verify dependencies were installed
      expect(mockInstallDependencies).toHaveBeenCalledWith('/project', config, baseProjectInfo);
    });
  });

  it('should write config containing the detected packageManager', async () => {
    const config = makeConfig('pnpm');
    mockGetProjectInfo.mockResolvedValue(baseProjectInfo);
    mockDetectPackageManager.mockResolvedValue('pnpm');
    mockPromptForConfig.mockResolvedValue(config);
    mockResolveConfigPaths.mockResolvedValue({
      ...config,
      resolvedPaths: {
        tailwindCss: '/project/src/styles.css',
        baseUrl: '/project/src/app',
        components: '/project/src/app/shared/components',
        utils: '/project/src/app/shared/utils',
        core: '/project/src/app/shared/core',
        services: '/project/src/app/shared/services',
      },
    });

    await init.parseAsync(['--yes', '--cwd', '/project'], { from: 'user' });

    const writtenJson = JSON.parse(mockWriteFile.mock.calls[0][1]);
    expect(writtenJson.packageManager).toBe('pnpm');
  });

  it('should ask for re-initialization when components.json exists', async () => {
    mockExistsSync.mockReturnValue(true); // cwd exists + components.json exists
    mockGetProjectInfo.mockResolvedValue(baseProjectInfo);
    mockDetectPackageManager.mockResolvedValue('npm');
    mockPrompts.mockResolvedValueOnce({ reinitialize: true });
    mockPromptForConfig.mockResolvedValue(makeConfig('npm'));
    mockResolveConfigPaths.mockResolvedValue({
      ...makeConfig('npm'),
      resolvedPaths: {
        tailwindCss: '/p/src/styles.css',
        baseUrl: '/p/src/app',
        components: '/p/src/app/shared/components',
        utils: '/p/src/app/shared/utils',
        core: '/p/src/app/shared/core',
        services: '/p/src/app/shared/services',
      },
    });

    await init.parseAsync(['--yes', '--cwd', '/project'], { from: 'user' });

    // prompts was called for reinitialize confirmation
    expect(mockPrompts).toHaveBeenCalledWith(expect.objectContaining({ name: 'reinitialize' }));
  });
});

describe('init success message', () => {
  let logger: any;

  beforeEach(() => {
    jest.resetModules();
    mockDetectPackageManager.mockReset();
    mockInstallDependencies.mockReset();
    mockPromptForConfig.mockReset();
    mockGetProjectInfo.mockReset();
    mockWriteFile.mockReset();
    mockExistsSync.mockReset();
    mockUpdateAngularConfig.mockReset();
    mockApplyThemeToStyles.mockReset();
    mockCreatePostCssConfig.mockReset();
    mockUpdateTsConfig.mockReset();
    mockInstallComponent.mockReset();
    mockResolveConfigPaths.mockReset();
    mockMkdir.mockReset();

    mockInstallDependencies.mockResolvedValue(undefined);
    mockWriteFile.mockResolvedValue(undefined);
    mockMkdir.mockResolvedValue(undefined);
    mockUpdateAngularConfig.mockResolvedValue(undefined);
    mockApplyThemeToStyles.mockResolvedValue(undefined);
    mockCreatePostCssConfig.mockResolvedValue(undefined);
    mockUpdateTsConfig.mockResolvedValue(undefined);
    mockInstallComponent.mockResolvedValue(undefined);

    mockExistsSync.mockImplementation((p: string) => {
      if (String(p).endsWith('components.json')) return false;
      return true;
    });

    mockGetProjectInfo.mockResolvedValue(baseProjectInfo);

    logger = require('@cli/utils/logger.js').logger;
  });

  it.each([
    ['npm', 'npx'],
    ['yarn', 'yarn dlx'],
    ['pnpm', 'pnpmx'],
    ['bun', 'bunx'],
  ])('should show correct run command for %s (%s)', async (pm, expectedCommand) => {
    const config = makeConfig(pm as any);
    mockDetectPackageManager.mockResolvedValue(pm);
    mockPromptForConfig.mockResolvedValue(config);
    mockResolveConfigPaths.mockResolvedValue({
      ...config,
      resolvedPaths: {
        tailwindCss: '/p/src/styles.css',
        baseUrl: '/p/src/app',
        components: '/p/src/app/shared/components',
        utils: '/p/src/app/shared/utils',
        core: '/p/src/app/shared/core',
        services: '/p/src/app/shared/services',
      },
    });

    const init = require('@cli/commands/init/index.js').init;
    await init.parseAsync(['--yes', '--cwd', '/project'], { from: 'user' });

    const infoCalls = logger.info.mock.calls.map((c: any[]) => c[0]);
    expect(infoCalls.some((msg: string) => msg.includes(expectedCommand))).toBe(true);
  });
});
