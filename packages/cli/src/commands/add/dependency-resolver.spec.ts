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
}));

import {
  getComponentMeta,
  getTargetDir,
  isItemInstalled,
  resolveDependencies,
} from '@cli/commands/add/dependency-resolver.js';
import { Config } from '@cli/utils/config.js';
import { existsSync } from 'fs';
import * as path from 'path';

import { fetchRegistryIndex, invalidateRegistryCache } from '../../utils/registry.js';

const mockFetchRegistryIndex = fetchRegistryIndex as jest.MockedFunction<typeof fetchRegistryIndex>;
const mockInvalidateRegistryCache = invalidateRegistryCache as jest.MockedFunction<typeof invalidateRegistryCache>;
const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;

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
      files: ['button.component.ts'],
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
    // O diretório e todos os arquivos declarados pelo item já existem.
    mockExistsSync.mockImplementation((target: any) => String(target).includes('button'));

    const result = await resolveDependencies(['button'], fakeResolvedConfig, '/project', { overwrite: false });

    const componentNames = result.componentsToInstall.map(c => c.name);
    expect(componentNames).not.toContain('button');
  });

  it('should reinstall a component whose declared files are missing', async () => {
    // O diretório existe, mas o arquivo que o item declara não: instalação
    // interrompida pela metade, que agora é completada em vez de pulada.
    mockExistsSync.mockImplementation((target: any) => String(target) === '/project/src/app/shared/components/button');

    const result = await resolveDependencies(['button'], fakeResolvedConfig, '/project', { overwrite: false });

    const componentNames = result.componentsToInstall.map(c => c.name);
    expect(componentNames).toContain('button');
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

describe('isItemInstalled', () => {
  beforeEach(() => {
    mockExistsSync.mockReset();
  });

  it('should report not installed when no declared file exists', () => {
    mockExistsSync.mockImplementation((target: any) => String(target) === '/project/components/button');

    expect(isItemInstalled('/project/components/button', ['button.component.ts', 'index.ts'])).toBe(false);
  });

  it('should report not installed when only some declared files exist', () => {
    mockExistsSync.mockImplementation((target: any) => !String(target).endsWith('index.ts'));

    expect(isItemInstalled('/project/components/button', ['button.component.ts', 'index.ts'])).toBe(false);
  });

  it('should report installed when every declared file exists', () => {
    mockExistsSync.mockReturnValue(true);

    expect(isItemInstalled('/project/components/button', ['button.component.ts', 'index.ts'])).toBe(true);
  });

  it('should report not installed when the directory is missing', () => {
    mockExistsSync.mockReturnValue(false);

    expect(isItemInstalled('/project/components/button', ['button.component.ts'])).toBe(false);
  });

  it('should report not installed when the item declares no file', () => {
    mockExistsSync.mockReturnValue(true);

    expect(isItemInstalled('/project/components/button', [])).toBe(false);
  });
});

describe('getTargetDir', () => {
  it('should write a styles item next to the global stylesheet', () => {
    const target = getTargetDir({ name: 'typeset', basePath: 'styles' }, fakeResolvedConfig, '/project');

    expect(target).toBe(path.dirname('/project/src/styles.css'));
  });

  it('should write a component into the components directory', () => {
    const target = getTargetDir({ name: 'button', basePath: 'button' }, fakeResolvedConfig, '/project');

    expect(target).toBe(path.resolve('/project/src/app/shared/components', 'button'));
  });
});
