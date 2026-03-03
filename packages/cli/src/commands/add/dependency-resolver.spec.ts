jest.mock('../../utils/registry.js', () => ({
  fetchRegistryIndex: jest.fn(),
  invalidateRegistryCache: jest.fn(),
}));

jest.mock('../../utils/logger.js', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(false),
  readdirSync: jest.fn().mockReturnValue([]),
}));

import { getComponentMeta, resolveDependencies } from '@cli/commands/add/dependency-resolver.js';
import { Config } from '@cli/utils/config.js';
import { existsSync, readdirSync } from 'fs';

import { fetchRegistryIndex, invalidateRegistryCache } from '../../utils/registry.js';

const mockFetchRegistryIndex = fetchRegistryIndex as jest.MockedFunction<typeof fetchRegistryIndex>;
const mockInvalidateRegistryCache = invalidateRegistryCache as jest.MockedFunction<typeof invalidateRegistryCache>;
const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockReaddirSync = readdirSync as jest.MockedFunction<typeof readdirSync>;

const fakeRegistryIndex = {
  $schema: 'https://zardui.com/schema.json',
  name: 'zardui',
  homepage: 'https://zardui.com',
  version: '1.0.0',
  items: [
    {
      name: 'button',
      type: 'registry:component',
      basePath: 'button',
      dependencies: ['@angular/cdk'],
      devDependencies: [],
      registryDependencies: ['core'],
      files: ['button.component.ts'],
    },
    {
      name: 'core',
      type: 'registry:component',
      basePath: 'core',
      dependencies: ['rxjs'],
      devDependencies: [],
      registryDependencies: [],
      files: ['core.ts'],
    },
    {
      name: 'dialog',
      type: 'registry:component',
      basePath: 'dialog',
      dependencies: ['@angular/cdk'],
      devDependencies: [],
      registryDependencies: ['button'],
      files: ['dialog.component.ts'],
    },
  ],
};

const fakeResolvedConfig: Config & { resolvedPaths: any } = {
  style: 'css',
  appConfigFile: 'src/app/app.config.ts',
  packageManager: 'npm',
  tailwind: { css: 'src/styles.css', baseColor: 'slate' },
  baseUrl: 'src/app',
  aliases: {
    components: '@/shared/components',
    utils: '@/shared/utils',
    core: '@/shared/core',
    services: '@/shared/services',
  },
  resolvedPaths: {
    tailwindCss: '/project/src/styles.css',
    baseUrl: '/project/src/app',
    components: '/project/src/app/shared/components',
    utils: '/project/src/app/shared/utils',
    core: '/project/src/app/shared/core',
    services: '/project/src/app/shared/services',
  },
};

describe('getComponentMeta', () => {
  beforeEach(() => {
    mockFetchRegistryIndex.mockReset();
    mockFetchRegistryIndex.mockResolvedValue(fakeRegistryIndex as any);
  });

  it('should return correct metadata for an existing component', async () => {
    const meta = await getComponentMeta('button');

    expect(meta).toEqual({
      name: 'button',
      basePath: 'button',
      dependencies: ['@angular/cdk'],
      devDependencies: [],
      registryDependencies: ['core'],
    });
  });

  it('should return undefined for a non-existent component', async () => {
    const meta = await getComponentMeta('nonexistent');

    expect(meta).toBeUndefined();
  });
});

describe('resolveDependencies', () => {
  beforeEach(() => {
    mockFetchRegistryIndex.mockReset();
    mockFetchRegistryIndex.mockResolvedValue(fakeRegistryIndex as any);
    mockExistsSync.mockReturnValue(false);
  });

  it('should collect npm dependencies from components', async () => {
    const result = await resolveDependencies(['button'], fakeResolvedConfig, '/project', { overwrite: true });

    expect(result.dependenciesToInstall).toContain('@angular/cdk');
  });

  it('should resolve registry dependencies recursively', async () => {
    const result = await resolveDependencies(['button'], fakeResolvedConfig, '/project', { overwrite: true });

    const componentNames = result.componentsToInstall.map(c => c.name);
    expect(componentNames).toContain('button');
    expect(componentNames).toContain('core');
  });

  it('should skip already installed components when overwrite is false', async () => {
    mockExistsSync.mockImplementation((dir: any) => {
      // button directory exists and has files
      return String(dir).includes('button');
    });
    mockReaddirSync.mockImplementation((dir: any) => {
      if (String(dir).includes('button')) return ['button.component.ts'] as any;
      return [] as any;
    });

    const result = await resolveDependencies(['button'], fakeResolvedConfig, '/project', { overwrite: false });

    const componentNames = result.componentsToInstall.map(c => c.name);
    expect(componentNames).not.toContain('button');
  });

  it('should collect dependencies from nested registry dependencies', async () => {
    const result = await resolveDependencies(['dialog'], fakeResolvedConfig, '/project', { overwrite: true });

    // dialog depends on button, which depends on core
    const componentNames = result.componentsToInstall.map(c => c.name);
    expect(componentNames).toContain('dialog');
    expect(componentNames).toContain('button');
    expect(componentNames).toContain('core');

    // npm dependencies from all levels
    expect(result.dependenciesToInstall).toContain('@angular/cdk');
    expect(result.dependenciesToInstall).toContain('rxjs');
  });
});
