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
  assertAngularSupported,
  collectBuildRequirements,
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

describe('items that ask something of the build', () => {
  const mapIndex = {
    ...fakeRegistryIndex,
    items: [
      ...fakeRegistryIndex.items,
      {
        name: 'map',
        type: 'registry:component',
        dependencies: ['ng-mapcn@22.0.0-beta.7', 'maplibre-gl@^6.11.2'],
        devDependencies: ['@types/geojson'],
        minAngularMajor: 22,
        build: {
          styles: [{ import: 'maplibre-gl/dist/maplibre-gl.css' }, { file: 'map.css' }],
          assets: [{ glob: 'maplibre-gl-worker.mjs', input: 'node_modules/maplibre-gl/dist', output: '/' }],
        },
        files: ['map.imports.ts', 'map.css'],
      },
      {
        name: 'map-draw',
        type: 'registry:component',
        dependencies: ['terra-draw@^1.37.0'],
        registryDependencies: ['map'],
        minAngularMajor: 22,
        files: ['map-draw.imports.ts'],
      },
    ],
  };

  beforeEach(() => {
    mockFetchRegistryIndex.mockReset();
    mockFetchRegistryIndex.mockResolvedValue(mapIndex as any);
    mockExistsSync.mockReturnValue(false);
  });

  it('keeps dev dependencies apart from the runtime ones', async () => {
    const result = await resolveDependencies(['map'], fakeResolvedConfig, '/project', { overwrite: true });

    expect([...result.dependenciesToInstall]).toEqual(['ng-mapcn@22.0.0-beta.7', 'maplibre-gl@^6.11.2']);
    expect([...result.devDependenciesToInstall]).toEqual(['@types/geojson']);
  });

  it('pulls the map in, with its dependencies, when only map-draw is asked for', async () => {
    const result = await resolveDependencies(['map-draw'], fakeResolvedConfig, '/project', { overwrite: true });

    expect(result.componentsToInstall.map(component => component.name)).toEqual(['map-draw', 'map']);
    expect(result.dependenciesToInstall).toEqual(
      new Set(['terra-draw@^1.37.0', 'ng-mapcn@22.0.0-beta.7', 'maplibre-gl@^6.11.2']),
    );
  });

  it('collects the build requirements of what was asked for and of what it depends on', async () => {
    const found = await collectBuildRequirements(['map-draw'], fakeResolvedConfig, '/project', {});

    expect(found.map(item => item.name)).toEqual(['map']);
    expect(found[0].dir).toBe(path.resolve('/project/src/app/shared/components/map'));
    expect(found[0].build.assets).toHaveLength(1);
  });

  it('still reports them when the item is already installed, so a re-run can repair the wiring', async () => {
    mockExistsSync.mockReturnValue(true);

    const resolved = await resolveDependencies(['map'], fakeResolvedConfig, '/project', { overwrite: false });
    const found = await collectBuildRequirements(['map'], fakeResolvedConfig, '/project', {});

    expect(resolved.componentsToInstall).toEqual([]);
    expect(found.map(item => item.name)).toEqual(['map']);
  });

  it('leaves out an item that failed to install', async () => {
    const found = await collectBuildRequirements(['map'], fakeResolvedConfig, '/project', { skip: ['map'] });

    expect(found).toEqual([]);
  });

  it('does not report items without a build requirement', async () => {
    const found = await collectBuildRequirements(['dialog'], fakeResolvedConfig, '/project', {});

    expect(found).toEqual([]);
  });

  describe('assertAngularSupported', () => {
    const map = { name: 'map', minAngularMajor: 22 };

    it('stops before installing on an Angular older than the item supports', () => {
      expect(() => assertAngularSupported([map], '21.2.0')).toThrow(/map requires Angular 22 or newer.*Angular 21/);
    });

    it('lets the supported majors through, and what declares no minimum', () => {
      expect(() => assertAngularSupported([map], '22.0.0')).not.toThrow();
      expect(() => assertAngularSupported([map], '23.1.0')).not.toThrow();
      expect(() => assertAngularSupported([{ name: 'button' }], '19.0.0')).not.toThrow();
    });

    it('does not guess when the Angular version could not be read', () => {
      expect(() => assertAngularSupported([map], null)).not.toThrow();
    });
  });
});
