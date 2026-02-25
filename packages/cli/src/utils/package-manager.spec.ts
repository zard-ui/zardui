const mockExeca = jest.fn().mockResolvedValue({});
const mockDetect = jest.fn();

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

  beforeEach(() => {
    jest.resetModules();
    delete process.env.npm_config_user_agent;
    mockDetect.mockReset();
  });

  afterEach(() => {
    if (originalUserAgent !== undefined) {
      process.env.npm_config_user_agent = originalUserAgent;
    } else {
      delete process.env.npm_config_user_agent;
    }
  });

  it('should detect npm from npm_config_user_agent', async () => {
    process.env.npm_config_user_agent = 'npm/10.0.0 node/v20.0.0 linux x64';
    const mod = getModuleFresh();

    const result = await mod.detectPackageManager();

    expect(result).toBe('npm');
  });

  it('should detect yarn from npm_config_user_agent', async () => {
    process.env.npm_config_user_agent = 'yarn/1.22.19 npm/? node/v20.0.0 linux x64';
    const mod = getModuleFresh();

    const result = await mod.detectPackageManager();

    expect(result).toBe('yarn');
  });

  it('should detect pnpm from npm_config_user_agent', async () => {
    process.env.npm_config_user_agent = 'pnpm/8.0.0 npm/? node/v20.0.0 linux x64';
    const mod = getModuleFresh();

    const result = await mod.detectPackageManager();

    expect(result).toBe('pnpm');
  });

  it('should detect bun from npm_config_user_agent', async () => {
    process.env.npm_config_user_agent = 'bun/1.0.0 node/v20.0.0 linux x64';
    const mod = getModuleFresh();

    const result = await mod.detectPackageManager();

    expect(result).toBe('bun');
  });

  it('should fall back to @antfu/ni detect when no user agent', async () => {
    mockDetect.mockResolvedValueOnce('pnpm');
    const mod = getModuleFresh();

    const result = await mod.detectPackageManager();

    expect(mockDetect).toHaveBeenCalledWith({ programmatic: true });
    expect(result).toBe('pnpm');
  });

  it('should default to npm when no detection succeeds', async () => {
    mockDetect.mockResolvedValueOnce(null);
    const mod = getModuleFresh();

    const result = await mod.detectPackageManager();

    expect(result).toBe('npm');
  });

  it('should cache the result and only detect once', async () => {
    process.env.npm_config_user_agent = 'pnpm/8.0.0 node/v20.0.0 linux x64';
    const mod = getModuleFresh();

    const first = await mod.detectPackageManager();
    // Change env to verify caching
    process.env.npm_config_user_agent = 'npm/10.0.0 node/v20.0.0 linux x64';
    const second = await mod.detectPackageManager();

    expect(first).toBe('pnpm');
    expect(second).toBe('pnpm');
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

    expect(mockExeca).toHaveBeenCalledWith('npm', ['install', '@angular/cdk', 'rxjs'], {
      cwd: '/project',
      stdio: 'inherit',
    });
  });

  it('should use dev flag correctly', async () => {
    await installPackages(['jest'], '/project', 'npm', true);

    expect(mockExeca).toHaveBeenCalledWith('npm', ['install', '-D', 'jest'], { cwd: '/project', stdio: 'inherit' });
  });

  it('should include --legacy-peer-deps when flag is set for npm', async () => {
    await installPackages(['@angular/cdk'], '/project', 'npm', false, true);

    expect(mockExeca).toHaveBeenCalledWith('npm', ['install', '@angular/cdk', '--legacy-peer-deps'], {
      cwd: '/project',
      stdio: 'inherit',
    });
  });

  it('should not include --legacy-peer-deps for non-npm managers', async () => {
    await installPackages(['@angular/cdk'], '/project', 'pnpm', false, true);

    expect(mockExeca).toHaveBeenCalledWith('pnpm', ['add', '@angular/cdk'], { cwd: '/project', stdio: 'inherit' });
  });

  it('should use correct command for yarn', async () => {
    await installPackages(['lodash'], '/project', 'yarn');

    expect(mockExeca).toHaveBeenCalledWith('yarn', ['add', 'lodash'], { cwd: '/project', stdio: 'inherit' });
  });
});
