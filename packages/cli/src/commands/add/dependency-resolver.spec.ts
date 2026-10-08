jest.mock('../../utils/registry.js', () => ({
  fetchRegistryIndex: jest.fn(),
  fetchBlocksIndex: jest.fn().mockResolvedValue({ blocks: [] }),
  getAvailableBlocks: jest.fn().mockResolvedValue([]),
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
import { existsSync, type PathLike } from 'fs';
import * as path from 'path';

import { fetchBlocksIndex, fetchRegistryIndex, invalidateRegistryCache } from '../../utils/registry.js';

const mockFetchRegistryIndex = fetchRegistryIndex as jest.MockedFunction<typeof fetchRegistryIndex>;
const mockInvalidateRegistryCache = invalidateRegistryCache as jest.MockedFunction<typeof invalidateRegistryCache>;
const mockFetchBlocksIndex = fetchBlocksIndex as jest.MockedFunction<typeof fetchBlocksIndex>;
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
    blocks: '@/shared/blocks',
  },
  resolvedPaths: {
    tailwindCss: '/project/src/styles.css',
    baseUrl: '/project/src/app',
    components: '/project/src/app/shared/components',
    utils: '/project/src/app/shared/utils',
    core: '/project/src/app/shared/core',
    services: '/project/src/app/shared/services',
    blocks: '/project/src/app/shared/blocks',
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
    // The directory and every file the item declares are already there.
    mockExistsSync.mockImplementation((target: PathLike) => String(target).includes('button'));

    const result = await resolveDependencies(['button'], fakeResolvedConfig, '/project', { overwrite: false });

    const componentNames = result.componentsToInstall.map(c => c.name);
    expect(componentNames).not.toContain('button');
  });

  it('should reinstall a component whose declared files are missing', async () => {
    // The directory exists but the file the item declares does not: an install
    // cut in half, which is now completed rather than skipped.
    mockExistsSync.mockImplementation(
      (target: PathLike) => String(target) === '/project/src/app/shared/components/button',
    );

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
    mockExistsSync.mockImplementation((target: PathLike) => String(target) === '/project/components/button');

    expect(isItemInstalled('/project/components/button', ['button.component.ts', 'index.ts'])).toBe(false);
  });

  it('should report not installed when only some declared files exist', () => {
    mockExistsSync.mockImplementation((target: PathLike) => !String(target).endsWith('index.ts'));

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

  it('should keep a styles item next to the global stylesheet even under --path', () => {
    // --path moves components. A stylesheet that moved with them would still be
    // imported as `./typeset.css` from beside the global CSS, and resolve to
    // nothing — the install would report success and style nothing.
    const target = getTargetDir({ name: 'typeset', basePath: 'styles' }, fakeResolvedConfig, '/project', 'src/ui');

    expect(target).toBe(path.dirname('/project/src/styles.css'));
  });

  it('should honour --path for a component', () => {
    const target = getTargetDir({ name: 'button', basePath: 'button' }, fakeResolvedConfig, '/project', 'src/ui');

    expect(target).toBe(path.resolve('/project', 'src/ui', 'button'));
  });
});

/*
 * Blocks come from their own index, and a block is written as a folder: every
 * file of `login-01` belongs together, and two blocks under the same `--path`
 * must not land in one directory.
 */
describe('blocks', () => {
  const loginBlock = {
    id: 'login-01',
    title: 'Login 01',
    description: 'A login form.',
    category: 'Login',
    registryDependencies: ['button', 'card'],
    dependencies: ['@ng-icons/core'],
  };

  beforeEach(() => {
    mockFetchBlocksIndex.mockResolvedValue({ blocks: [loginBlock] });
  });

  it('resolves a block id the component registry does not know', async () => {
    const meta = await getComponentMeta('login-01');

    expect(meta).toMatchObject({ name: 'login-01', basePath: 'blocks', isBlock: true });
  });

  it('carries the components the block needs, so `add` pulls them in', async () => {
    const meta = await getComponentMeta('login-01');

    expect(meta?.registryDependencies).toEqual(['button', 'card']);
  });

  it('still returns undefined for a name that is neither', async () => {
    expect(await getComponentMeta('not-a-thing')).toBeUndefined();
  });

  it('writes a block into its own directory under the blocks alias', () => {
    const target = getTargetDir({ name: 'login-01', basePath: 'blocks' }, fakeResolvedConfig, '/project');

    expect(target).toBe(path.join('/project/src/app/shared/blocks', 'login-01'));
  });

  it('keeps one directory per block under --path', () => {
    const first = getTargetDir({ name: 'login-01', basePath: 'blocks' }, fakeResolvedConfig, '/project', 'src/ui');
    const second = getTargetDir({ name: 'signup-01', basePath: 'blocks' }, fakeResolvedConfig, '/project', 'src/ui');

    expect(first).toBe(path.join(path.resolve('/project', 'src/ui'), 'login-01'));
    expect(second).not.toBe(first);
  });
});
