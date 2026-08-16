const mockExeca = jest.fn().mockResolvedValue({});
const mockDetect = jest.fn();
const mockExistsSync = jest.fn();
const mockReadFile = jest.fn();

jest.mock('node:fs', () => ({ existsSync: mockExistsSync }));
jest.mock('node:fs/promises', () => ({ readFile: mockReadFile }));

jest.mock('@antfu/ni', () => ({
  detect: mockDetect,
}));

jest.mock('execa', () => ({
  execa: mockExeca,
}));

jest.mock('@cli/utils/config.js', () => ({
  getConfig: jest.fn().mockResolvedValue(null),
}));

function getModuleFresh() {
  return require('@cli/utils/package-manager.js') as typeof import('@cli/utils/package-manager.js');
}

describe('detectPackageManager', () => {
  const originalUserAgent = process.env.npm_config_user_agent;

  const manifestWith = (packageManager?: string) =>
    mockReadFile.mockResolvedValue(JSON.stringify(packageManager ? { packageManager } : {}));

  beforeEach(() => {
    jest.resetModules();
    delete process.env.npm_config_user_agent;
    mockDetect.mockReset();
    mockDetect.mockResolvedValue(null);
    mockReadFile.mockReset();
    mockReadFile.mockRejectedValue(new Error('ENOENT'));
  });

  afterEach(() => {
    if (originalUserAgent !== undefined) {
      process.env.npm_config_user_agent = originalUserAgent;
    } else {
      delete process.env.npm_config_user_agent;
    }
  });

  it('should prefer the packageManager field over the user agent', async () => {
    manifestWith('bun@1.3.14');
    process.env.npm_config_user_agent = 'npm/10.0.0 node/v20.0.0 linux x64';
    const mod = getModuleFresh();

    await expect(mod.detectPackageManager('/project')).resolves.toBe('bun');
  });

  it('should ignore a packageManager field naming an unsupported manager', async () => {
    manifestWith('deno@2.0.0');
    mockDetect.mockResolvedValue('pnpm');
    const mod = getModuleFresh();

    await expect(mod.detectPackageManager('/project')).resolves.toBe('pnpm');
  });

  it('should prefer the lockfile over the user agent', async () => {
    mockDetect.mockResolvedValue('bun');
    process.env.npm_config_user_agent = 'npm/10.0.0 node/v20.0.0 linux x64';
    const mod = getModuleFresh();

    await expect(mod.detectPackageManager('/project')).resolves.toBe('bun');
  });

  it('should pass the working directory to the lockfile detection', async () => {
    mockDetect.mockResolvedValue('pnpm');
    const mod = getModuleFresh();

    await mod.detectPackageManager('/project');

    expect(mockDetect).toHaveBeenCalledWith({ programmatic: true, cwd: '/project' });
  });

  it('should normalize yarn@berry to yarn', async () => {
    mockDetect.mockResolvedValue('yarn@berry');
    const mod = getModuleFresh();

    await expect(mod.detectPackageManager('/project')).resolves.toBe('yarn');
  });

  it('should fall back to the user agent when the project says nothing', async () => {
    process.env.npm_config_user_agent = 'pnpm/8.0.0 npm/? node/v20.0.0 linux x64';
    const mod = getModuleFresh();

    await expect(mod.detectPackageManager('/project')).resolves.toBe('pnpm');
  });

  it('should default to npm when no detection succeeds', async () => {
    const mod = getModuleFresh();

    await expect(mod.detectPackageManager('/project')).resolves.toBe('npm');
  });

  it('should cache the result and only detect once', async () => {
    manifestWith('pnpm@8.0.0');
    const mod = getModuleFresh();

    const first = await mod.detectPackageManager('/project');
    manifestWith('npm@10.0.0');
    const second = await mod.detectPackageManager('/project');

    expect(first).toBe('pnpm');
    expect(second).toBe('pnpm');
  });
});

describe('suggestedRunner', () => {
  const originalUserAgent = process.env.npm_config_user_agent;
  let suggestedRunner: (typeof import('@cli/utils/package-manager.js'))['suggestedRunner'];

  beforeEach(() => {
    jest.resetModules();
    delete process.env.npm_config_user_agent;
    suggestedRunner = getModuleFresh().suggestedRunner;
  });

  afterEach(() => {
    if (originalUserAgent !== undefined) {
      process.env.npm_config_user_agent = originalUserAgent;
    } else {
      delete process.env.npm_config_user_agent;
    }
  });

  it('should suggest the runner the user actually invoked, not the project manager', () => {
    process.env.npm_config_user_agent = 'npm/10.9.0 node/v22.0.0 win32 x64';

    expect(suggestedRunner('bun')).toBe('npx');
  });

  it('should suggest bunx when invoked through bun', () => {
    process.env.npm_config_user_agent = 'bun/1.3.14 npm/? node/v22.0.0 win32 x64';

    expect(suggestedRunner('npm')).toBe('bunx');
  });

  it('should not read yarn out of the npm fragment of its user agent', () => {
    process.env.npm_config_user_agent = 'yarn/1.22.19 npm/? node/v22.0.0 linux x64';

    expect(suggestedRunner('npm')).toBe('yarn dlx');
  });

  it('should fall back to the project package manager without a user agent', () => {
    expect(suggestedRunner('pnpm')).toBe('pnpm dlx');
    expect(suggestedRunner('bun')).toBe('bunx');
    expect(suggestedRunner('npm')).toBe('npx');
  });
});

describe('getInstallCommand', () => {
  let getInstallCommand: (typeof import('@cli/utils/package-manager.js'))['getInstallCommand'];

  beforeEach(() => {
    jest.resetModules();
    const mod = getModuleFresh();
    getInstallCommand = mod.getInstallCommand;
  });

  it('should return correct command for npm', async () => {
    expect(await getInstallCommand('npm')).toEqual(['install']);
  });

  it('should return correct command for npm with isDev', async () => {
    expect(await getInstallCommand('npm', true)).toEqual(['install', '-D']);
  });

  it('should return correct command for yarn', async () => {
    expect(await getInstallCommand('yarn')).toEqual(['add']);
  });

  it('should return correct command for yarn with isDev', async () => {
    expect(await getInstallCommand('yarn', true)).toEqual(['add', '-D']);
  });

  it('should return correct command for pnpm', async () => {
    expect(await getInstallCommand('pnpm')).toEqual(['add']);
  });

  it('should return correct command for pnpm with isDev', async () => {
    expect(await getInstallCommand('pnpm', true)).toEqual(['add', '-D']);
  });

  it('should return correct command for bun', async () => {
    expect(await getInstallCommand('bun')).toEqual(['add']);
  });

  it('should return correct command for bun with isDev', async () => {
    expect(await getInstallCommand('bun', true)).toEqual(['add', '-d']);
  });
});

describe('installPackages', () => {
  let installPackages: (typeof import('@cli/utils/package-manager.js'))['installPackages'];

  beforeEach(() => {
    jest.resetModules();
    mockExeca.mockReset();
    mockExeca.mockResolvedValue({});
    const mod = getModuleFresh();
    installPackages = mod.installPackages;
  });

  it('should call execa with correct arguments', async () => {
    await installPackages(['@angular/cdk', 'rxjs'], '/project', 'npm');

    expect(mockExeca).toHaveBeenCalledWith('npm', ['install', '@angular/cdk', 'rxjs', '--no-audit', '--no-fund'], {
      cwd: '/project',
      stdin: 'ignore',

      stdout: 'inherit',

      stderr: 'inherit',
    });
  });

  it('should use dev flag correctly', async () => {
    await installPackages(['jest'], '/project', 'npm', true);

    expect(mockExeca).toHaveBeenCalledWith('npm', ['install', '-D', 'jest', '--no-audit', '--no-fund'], {
      cwd: '/project',
      stdin: 'ignore',

      stdout: 'inherit',

      stderr: 'inherit',
    });
  });

  it('should include --legacy-peer-deps when flag is set for npm', async () => {
    await installPackages(['@angular/cdk'], '/project', 'npm', false, true);

    expect(mockExeca).toHaveBeenCalledWith(
      'npm',
      ['install', '@angular/cdk', '--no-audit', '--no-fund', '--legacy-peer-deps'],
      {
        cwd: '/project',
        stdin: 'ignore',

        stdout: 'inherit',

        stderr: 'inherit',
      },
    );
  });

  it('should relax peer resolution for pnpm instead of --legacy-peer-deps', async () => {
    await installPackages(['@angular/cdk'], '/project', 'pnpm', false, true);

    expect(mockExeca).toHaveBeenCalledWith('pnpm', ['add', '@angular/cdk', '--no-strict-peer-dependencies'], {
      cwd: '/project',
      stdin: 'ignore',

      stdout: 'inherit',

      stderr: 'inherit',
    });
  });

  it('should not add npm-only speed flags to other managers', async () => {
    await installPackages(['@angular/cdk'], '/project', 'bun');

    expect(mockExeca).toHaveBeenCalledWith('bun', ['add', '@angular/cdk'], {
      cwd: '/project',
      stdin: 'ignore',
      stdout: 'inherit',
      stderr: 'inherit',
    });
  });

  it('should use correct command for yarn', async () => {
    await installPackages(['lodash'], '/project', 'yarn');

    expect(mockExeca).toHaveBeenCalledWith('yarn', ['add', 'lodash'], {
      cwd: '/project',
      stdin: 'ignore',
      stdout: 'inherit',
      stderr: 'inherit',
    });
  });
});

describe('installPackagesWithRetry', () => {
  let installPackagesWithRetry: (typeof import('@cli/utils/package-manager.js'))['installPackagesWithRetry'];

  beforeEach(() => {
    jest.resetModules();
    mockExeca.mockReset();
    mockExeca.mockResolvedValue({});
    installPackagesWithRetry = getModuleFresh().installPackagesWithRetry;
  });

  it('should not invoke the package manager for an empty batch', async () => {
    await installPackagesWithRetry([], '/project', 'npm');

    expect(mockExeca).not.toHaveBeenCalled();
  });

  it('should retry with relaxed peers after a failure', async () => {
    mockExeca.mockRejectedValueOnce(new Error('ERESOLVE')).mockResolvedValue({});

    await installPackagesWithRetry(['@angular/cdk'], '/project', 'npm');

    expect(mockExeca).toHaveBeenCalledTimes(2);
    expect(mockExeca.mock.calls[1][1]).toContain('--legacy-peer-deps');
  });

  it('should go straight to relaxed peers on later batches once the fallback kicked in', async () => {
    mockExeca.mockRejectedValueOnce(new Error('ERESOLVE')).mockResolvedValue({});

    await installPackagesWithRetry(['@angular/cdk'], '/project', 'npm');
    mockExeca.mockClear();

    await installPackagesWithRetry(['clsx'], '/project', 'npm', true);

    expect(mockExeca).toHaveBeenCalledTimes(1);
    expect(mockExeca.mock.calls[0][1]).toContain('--legacy-peer-deps');
  });

  it('should not retry managers that have no peer relaxation flag', async () => {
    mockExeca.mockRejectedValue(new Error('boom'));

    await expect(installPackagesWithRetry(['clsx'], '/project', 'bun')).rejects.toThrow('boom');
    expect(mockExeca).toHaveBeenCalledTimes(1);
  });
});

describe('filterInstalledPackages', () => {
  let filterInstalledPackages: (typeof import('@cli/utils/package-manager.js'))['filterInstalledPackages'];

  const manifest = (dependencies: Record<string, string>, devDependencies: Record<string, string> = {}) =>
    JSON.stringify({ dependencies, devDependencies });

  beforeEach(() => {
    jest.resetModules();
    mockExistsSync.mockReset();
    mockReadFile.mockReset();
    filterInstalledPackages = getModuleFresh().filterInstalledPackages;
  });

  it('should drop packages already declared and resolvable', async () => {
    mockReadFile.mockResolvedValue(manifest({ clsx: '^2.1.1' }, { 'tailwindcss-animate': '^1.0.7' }));
    mockExistsSync.mockReturnValue(true);

    const result = await filterInstalledPackages(['clsx', 'tailwindcss-animate', 'tailwind-merge'], '/project');

    expect(result).toEqual(['tailwind-merge']);
  });

  it('should keep declared packages that are not in node_modules', async () => {
    mockReadFile.mockResolvedValue(manifest({ clsx: '^2.1.1' }));
    mockExistsSync.mockReturnValue(false);

    await expect(filterInstalledPackages(['clsx'], '/project')).resolves.toEqual(['clsx']);
  });

  it('should drop a scoped package when the requested major matches', async () => {
    mockReadFile.mockResolvedValue(manifest({ '@angular/cdk': '^21.0.1' }));
    mockExistsSync.mockReturnValue(true);

    await expect(filterInstalledPackages(['@angular/cdk@^21'], '/project')).resolves.toEqual([]);
  });

  it('should keep a package whose requested major differs from the declared one', async () => {
    mockReadFile.mockResolvedValue(manifest({ '@angular/cdk': '^20.0.0' }));
    mockExistsSync.mockReturnValue(true);

    await expect(filterInstalledPackages(['@angular/cdk@^21'], '/project')).resolves.toEqual(['@angular/cdk@^21']);
  });

  it('should keep everything when the manifest cannot be read', async () => {
    mockReadFile.mockRejectedValue(new Error('ENOENT'));

    await expect(filterInstalledPackages(['clsx'], '/project')).resolves.toEqual(['clsx']);
  });
});
