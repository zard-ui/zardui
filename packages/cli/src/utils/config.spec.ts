jest.mock('node:fs/promises', () => ({
  access: jest.fn(),
  readFile: jest.fn(),
}));

jest.mock('@cli/utils/registry.js', () => ({
  validateRegistryUrl: jest.fn(),
}));

jest.mock('@cli/utils/logger.js', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import { getConfig, resolveAliasToPath, resolveConfigPaths } from '@cli/utils/config.js';
import { ConfigError } from '@cli/utils/errors.js';
import { validateRegistryUrl } from '@cli/utils/registry.js';
import { access, readFile } from 'node:fs/promises';

const mockAccess = access as jest.MockedFunction<typeof access>;
const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;
const mockValidateRegistryUrl = validateRegistryUrl as jest.MockedFunction<typeof validateRegistryUrl>;

describe('getConfig', () => {
  beforeEach(() => {
    mockAccess.mockReset();
    mockReadFile.mockReset();
    mockValidateRegistryUrl.mockReset();
  });

  it('should return null when components.json does not exist', async () => {
    mockAccess.mockRejectedValueOnce(new Error('ENOENT'));

    const result = await getConfig('/project');

    expect(result).toBeNull();
  });

  it('should parse valid config with defaults', async () => {
    mockAccess.mockResolvedValueOnce(undefined);
    mockReadFile.mockResolvedValueOnce(
      JSON.stringify({
        style: 'css',
      }) as any,
    );

    const result = await getConfig('/project');

    expect(result).not.toBeNull();
    expect(result!.style).toBe('css');
    expect(result!.packageManager).toBe('npm');
    expect(result!.baseUrl).toBe('src/app');
    expect(result!.aliases.components).toBe('@/shared/components');
    expect(result!.aliases.utils).toBe('@/shared/utils');
    expect(result!.tailwind.css).toBe('src/styles.css');
    expect(result!.tailwind.baseColor).toBe('slate');
  });

  it('should throw ConfigError on invalid JSON', async () => {
    mockAccess.mockResolvedValueOnce(undefined);
    mockReadFile.mockResolvedValueOnce('not valid json {{{' as any);

    await expect(getConfig('/project')).rejects.toThrow(ConfigError);
  });

  it('should validate registryUrl when present', async () => {
    mockAccess.mockResolvedValueOnce(undefined);
    mockReadFile.mockResolvedValueOnce(
      JSON.stringify({
        registryUrl: 'https://custom-registry.com/r',
      }) as any,
    );
    mockValidateRegistryUrl.mockImplementation(() => {
      /* noop */
    });

    await getConfig('/project');

    expect(mockValidateRegistryUrl).toHaveBeenCalledWith('https://custom-registry.com/r');
  });

  it('should not validate registryUrl when not present', async () => {
    mockAccess.mockResolvedValueOnce(undefined);
    mockReadFile.mockResolvedValueOnce(JSON.stringify({ style: 'css' }) as any);

    await getConfig('/project');

    expect(mockValidateRegistryUrl).not.toHaveBeenCalled();
  });

  it('should re-throw ConfigError from validateRegistryUrl', async () => {
    mockAccess.mockResolvedValue(undefined);
    mockReadFile.mockResolvedValue(
      JSON.stringify({
        registryUrl: 'http://not-localhost.com/r',
      }) as any,
    );
    mockValidateRegistryUrl.mockImplementation(() => {
      throw new ConfigError('Registry URL must use HTTPS');
    });

    try {
      await getConfig('/project');
      fail('Expected getConfig to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect((error as ConfigError).message).toMatch(/HTTPS/);
    }
  });
});

describe('resolveConfigPaths', () => {
  it('should resolve all paths correctly', async () => {
    const config = {
      style: 'css' as const,
      appConfigFile: 'src/app/app.config.ts',
      packageManager: 'npm' as const,
      tailwind: { css: 'src/styles.css', baseColor: 'slate' },
      baseUrl: 'src/app',
      aliases: {
        components: '@/shared/components',
        utils: '@/shared/utils',
        core: '@/shared/core',
        services: '@/shared/services',
      },
    };

    const result = await resolveConfigPaths('/project', config);

    expect(result.resolvedPaths.tailwindCss).toBe('/project/src/styles.css');
    expect(result.resolvedPaths.baseUrl).toBe('/project/src/app');
    expect(result.resolvedPaths.components).toBe('/project/src/app/shared/components');
    expect(result.resolvedPaths.utils).toBe('/project/src/app/shared/utils');
    expect(result.resolvedPaths.core).toBe('/project/src/app/shared/core');
    expect(result.resolvedPaths.services).toBe('/project/src/app/shared/services');
  });

  it('should preserve the original config properties', async () => {
    const config = {
      style: 'css' as const,
      appConfigFile: 'src/app/app.config.ts',
      packageManager: 'pnpm' as const,
      tailwind: { css: 'src/styles.css', baseColor: 'zinc' },
      baseUrl: 'src/app',
      aliases: {
        components: '@/shared/components',
        utils: '@/shared/utils',
        core: '@/shared/core',
        services: '@/shared/services',
      },
    };

    const result = await resolveConfigPaths('/project', config);

    expect(result.packageManager).toBe('pnpm');
    expect(result.tailwind.baseColor).toBe('zinc');
    expect(result.style).toBe('css');
  });
});

describe('resolveAliasToPath', () => {
  it('should replace @/ prefix with baseUrl', () => {
    const result = resolveAliasToPath('@/shared/components', 'src/app');

    expect(result).toBe('src/app/shared/components');
  });

  it('should handle different baseUrl values', () => {
    const result = resolveAliasToPath('@/lib/utils', 'app');

    expect(result).toBe('app/lib/utils');
  });

  it('should not modify paths without @/ prefix', () => {
    const result = resolveAliasToPath('some/path', 'src/app');

    expect(result).toBe('some/path');
  });
});
