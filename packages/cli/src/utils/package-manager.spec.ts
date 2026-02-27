const mockExeca = jest.fn().mockResolvedValue({});
const mockDetect = jest.fn();

jest.mock('@antfu/ni', () => ({
  detect: mockDetect,
}));

jest.mock('execa', () => ({
  execa: mockExeca,
}));

const mockGetConfig = jest.fn().mockResolvedValue(null);
jest.mock('@cli/utils/config.js', () => ({
  getConfig: (...args: any[]) => mockGetConfig(...args),
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

  it('should map yarn@berry to yarn via @antfu/ni', async () => {
    mockDetect.mockResolvedValueOnce('yarn@berry');
    const mod = getModuleFresh();

    const result = await mod.detectPackageManager();

    expect(result).toBe('yarn');
  });

  it('should default to npm when no detection succeeds', async () => {
    mockDetect.mockResolvedValueOnce(null);
    const mod = getModuleFresh();

    const result = await mod.detectPackageManager();

    expect(result).toBe('npm');
  });

  it('should default to npm when @antfu/ni returns unknown agent', async () => {
    mockDetect.mockResolvedValueOnce('deno');
    const mod = getModuleFresh();

    const result = await mod.detectPackageManager();

    expect(result).toBe('npm');
  });

  it('should prioritize bun over pnpm/yarn/npm in user agent', async () => {
    // User agent containing multiple PM names — bun should win
    process.env.npm_config_user_agent = 'bun/1.0.0 npm/? pnpm/8.0.0 yarn/1.22.0';
    const mod = getModuleFresh();

    const result = await mod.detectPackageManager();

    expect(result).toBe('bun');
  });

  it('should prioritize pnpm over yarn/npm in user agent', async () => {
    process.env.npm_config_user_agent = 'pnpm/8.0.0 npm/? yarn/1.22.0';
    const mod = getModuleFresh();

    const result = await mod.detectPackageManager();

    expect(result).toBe('pnpm');
  });

  it('should prioritize yarn over npm in user agent', async () => {
    process.env.npm_config_user_agent = 'yarn/1.22.0 npm/?';
    const mod = getModuleFresh();

    const result = await mod.detectPackageManager();

    expect(result).toBe('yarn');
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

  it('should detect each runner via @antfu/ni fallback', async () => {
    for (const pm of ['npm', 'yarn', 'pnpm', 'bun'] as const) {
      jest.resetModules();
      mockDetect.mockResolvedValueOnce(pm);
      const mod = getModuleFresh();

      const result = await mod.detectPackageManager();

      expect(result).toBe(pm);
    }
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

  it('should return correct command for bun with isDev (lowercase -d)', async () => {
    expect(await getInstallCommand('bun', true)).toEqual(['add', '-d']);
  });

  it('should fallback to npm for unknown runner', async () => {
    expect(await getInstallCommand('unknown')).toEqual(['install']);
  });

  it('should fallback to npm dev for unknown runner with isDev', async () => {
    expect(await getInstallCommand('unknown', true)).toEqual(['install', '-D']);
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

  it('should call execa with correct arguments for npm', async () => {
    await installPackages(['@angular/cdk', 'rxjs'], '/project', 'npm');

    expect(mockExeca).toHaveBeenCalledWith('npm', ['install', '@angular/cdk', 'rxjs'], {
      cwd: '/project',
      stdio: 'inherit',
    });
  });

  it('should call execa with correct arguments for yarn', async () => {
    await installPackages(['lodash'], '/project', 'yarn');

    expect(mockExeca).toHaveBeenCalledWith('yarn', ['add', 'lodash'], { cwd: '/project', stdio: 'inherit' });
  });

  it('should call execa with correct arguments for pnpm', async () => {
    await installPackages(['lodash'], '/project', 'pnpm');

    expect(mockExeca).toHaveBeenCalledWith('pnpm', ['add', 'lodash'], { cwd: '/project', stdio: 'inherit' });
  });

  it('should call execa with correct arguments for bun', async () => {
    await installPackages(['lodash'], '/project', 'bun');

    expect(mockExeca).toHaveBeenCalledWith('bun', ['add', 'lodash'], { cwd: '/project', stdio: 'inherit' });
  });

  it('should use dev flag correctly', async () => {
    await installPackages(['jest'], '/project', 'npm', true);

    expect(mockExeca).toHaveBeenCalledWith('npm', ['install', '-D', 'jest'], { cwd: '/project', stdio: 'inherit' });
  });

  it('should use lowercase -d for bun dev', async () => {
    await installPackages(['jest'], '/project', 'bun', true);

    expect(mockExeca).toHaveBeenCalledWith('bun', ['add', '-d', 'jest'], { cwd: '/project', stdio: 'inherit' });
  });

  it('should include --legacy-peer-deps when flag is set for npm', async () => {
    await installPackages(['@angular/cdk'], '/project', 'npm', false, true);

    expect(mockExeca).toHaveBeenCalledWith('npm', ['install', '@angular/cdk', '--legacy-peer-deps'], {
      cwd: '/project',
      stdio: 'inherit',
    });
  });

  it('should NOT include --legacy-peer-deps for pnpm', async () => {
    await installPackages(['@angular/cdk'], '/project', 'pnpm', false, true);

    expect(mockExeca).toHaveBeenCalledWith('pnpm', ['add', '@angular/cdk'], { cwd: '/project', stdio: 'inherit' });
  });

  it('should NOT include --legacy-peer-deps for yarn', async () => {
    await installPackages(['@angular/cdk'], '/project', 'yarn', false, true);

    expect(mockExeca).toHaveBeenCalledWith('yarn', ['add', '@angular/cdk'], { cwd: '/project', stdio: 'inherit' });
  });

  it('should NOT include --legacy-peer-deps for bun', async () => {
    await installPackages(['@angular/cdk'], '/project', 'bun', false, true);

    expect(mockExeca).toHaveBeenCalledWith('bun', ['add', '@angular/cdk'], { cwd: '/project', stdio: 'inherit' });
  });

  it('should pass cwd correctly to execa', async () => {
    await installPackages(['pkg'], '/my/custom/path', 'npm');

    expect(mockExeca).toHaveBeenCalledWith('npm', ['install', 'pkg'], {
      cwd: '/my/custom/path',
      stdio: 'inherit',
    });
  });

  it('should pass stdio: inherit to execa', async () => {
    await installPackages(['pkg'], '/project', 'npm');

    expect(mockExeca).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Array),
      expect.objectContaining({ stdio: 'inherit' }),
    );
  });

  it('should propagate execa errors', async () => {
    const error = new Error('Command failed');
    mockExeca.mockRejectedValueOnce(error);

    await expect(installPackages(['pkg'], '/project', 'npm')).rejects.toThrow('Command failed');
  });

  it('should install multiple packages in a single call', async () => {
    await installPackages(['pkg-a', 'pkg-b', 'pkg-c'], '/project', 'pnpm');

    expect(mockExeca).toHaveBeenCalledWith('pnpm', ['add', 'pkg-a', 'pkg-b', 'pkg-c'], {
      cwd: '/project',
      stdio: 'inherit',
    });
  });
});

describe('getPackageManager', () => {
  beforeEach(() => {
    jest.resetModules();
    mockGetConfig.mockReset();
  });

  it('should read runner from components.json', async () => {
    mockGetConfig.mockResolvedValueOnce({ packageManager: 'pnpm' });
    const mod = getModuleFresh();

    const result = await mod.getPackageManager('/project');

    expect(mockGetConfig).toHaveBeenCalledWith('/project');
    expect(result).toBe('pnpm');
  });

  it('should return npm when config does not exist', async () => {
    mockGetConfig.mockResolvedValueOnce(null);
    const mod = getModuleFresh();

    const result = await mod.getPackageManager('/project');

    expect(result).toBe('npm');
  });

  it('should return npm when packageManager is not in config', async () => {
    mockGetConfig.mockResolvedValueOnce({ style: 'css' });
    const mod = getModuleFresh();

    const result = await mod.getPackageManager('/project');

    expect(result).toBe('npm');
  });

  it('should read each runner from config correctly', async () => {
    for (const pm of ['npm', 'yarn', 'pnpm', 'bun'] as const) {
      mockGetConfig.mockResolvedValueOnce({ packageManager: pm });
      jest.resetModules();
      const mod = getModuleFresh();

      const result = await mod.getPackageManager('/project');

      expect(result).toBe(pm);
    }
  });
});
