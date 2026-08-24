/**
 * Custom paths — the surface where baseUrl, aliases and `--path` cross.
 *
 * The four places that consume this configuration live in different files
 * (config, registry, dependency-resolver, tsconfig-updater) and have to agree
 * with each other: where the file is written, which import it comes out with,
 * and what the tsconfig maps. When they diverge, the component is installed
 * somewhere the import cannot reach — and the project only breaks at build time.
 *
 * Hence the cross-cutting suite: each scenario checks destination, import and
 * mapping together, rather than testing each function in isolation.
 */

const mockExistsSync = jest.fn();
const mockReadFile = jest.fn();
const mockWriteFile = jest.fn();

// The factories are hoisted above the `const`s above, so they cannot read the
// variables at registration time — only when the mock is actually called.
jest.mock('fs', () => ({ existsSync: (...args: unknown[]) => mockExistsSync(...args) }));
jest.mock('node:fs/promises', () => ({
  readFile: (...args: unknown[]) => mockReadFile(...args),
  writeFile: (...args: unknown[]) => mockWriteFile(...args),
  mkdir: jest.fn().mockResolvedValue(undefined),
  access: jest.fn(),
}));

import { validateTargetPath } from '@cli/commands/add/component-installer.js';
import { getTargetDir } from '@cli/commands/add/dependency-resolver.js';
import { buildConfig } from '@cli/commands/init/config-prompter.js';
import { applyThemeToStyles } from '@cli/commands/init/tailwind-setup.js';
import { updateTsConfig } from '@cli/commands/init/tsconfig-updater.js';
import { aliasPattern, resolveAliasToPath, resolveConfigPaths, type Config } from '@cli/utils/config.js';
import { CliError } from '@cli/utils/errors.js';
import { transformContent } from '@cli/utils/registry.js';

const CWD = '/proj';

/** Compares paths without depending on the platform separator. */
const norm = (p: string): string => p.replace(/\\/g, '/').replace(/^[A-Za-z]:/, '');

function makeConfig(baseUrl: string, aliases: Partial<Config['aliases']> & { components: string }): Config {
  const prefix = aliases.components.split('/')[0];
  return {
    style: 'css',
    appConfigFile: 'src/app/app.config.ts',
    packageManager: 'npm',
    tailwind: { css: 'src/styles.css', baseColor: 'neutral' },
    baseUrl,
    aliases: {
      components: aliases.components,
      utils: aliases.utils ?? `${prefix}/shared/utils`,
      core: aliases.core ?? `${prefix}/shared/core`,
      services: aliases.services ?? `${prefix}/shared/services`,
    },
  };
}

describe('resolveAliasToPath', () => {
  it('should map the default alias onto baseUrl', () => {
    expect(resolveAliasToPath('@/shared/components', 'src/app')).toBe('src/app/shared/components');
  });

  it('should map a custom subfolder onto baseUrl', () => {
    expect(resolveAliasToPath('@/ui/components', 'src/app')).toBe('src/app/ui/components');
  });

  it('should follow a nested baseUrl', () => {
    expect(resolveAliasToPath('@/shared/components', 'projects/admin/src/app')).toBe(
      'projects/admin/src/app/shared/components',
    );
  });

  // An alias is not required to be called `@`. Any prefix is just a nickname for
  // baseUrl, and what follows it is the path inside the project.
  it('should treat a non-@ prefix as an alias for baseUrl', () => {
    expect(resolveAliasToPath('@app/components', 'src/app')).toBe('src/app/components');
  });

  it('should treat a tilde prefix as an alias for baseUrl', () => {
    expect(resolveAliasToPath('~/components', 'src/app')).toBe('src/app/components');
  });

  it('should ignore a trailing slash', () => {
    expect(resolveAliasToPath('@/shared/components/', 'src/app')).toBe('src/app/shared/components');
  });

  it('should ignore a trailing slash on baseUrl too', () => {
    expect(resolveAliasToPath('@/shared/components', 'src/app/')).toBe('src/app/shared/components');
  });

  it('should handle a deeply nested alias', () => {
    expect(resolveAliasToPath('@/features/design-system/ui/components', 'src/app')).toBe(
      'src/app/features/design-system/ui/components',
    );
  });

  it('should handle a prefix with dashes', () => {
    expect(resolveAliasToPath('@my-design-system/components', 'src/app')).toBe('src/app/components');
  });

  it('should map a bare prefix with no path onto baseUrl itself', () => {
    expect(resolveAliasToPath('@', 'src/app')).toBe('src/app');
    expect(resolveAliasToPath('@/', 'src/app')).toBe('src/app');
  });

  it('should accept a single-segment baseUrl', () => {
    expect(resolveAliasToPath('@/components', 'src')).toBe('src/components');
  });
});

describe('aliasPattern', () => {
  it('should derive the tsconfig key from the alias prefix', () => {
    expect(aliasPattern('@/shared/components')).toBe('@/*');
    expect(aliasPattern('@app/components')).toBe('@app/*');
    expect(aliasPattern('~/components')).toBe('~/*');
    expect(aliasPattern('@my-design-system/ui')).toBe('@my-design-system/*');
  });

  it('should ignore a trailing slash', () => {
    expect(aliasPattern('@/shared/components/')).toBe('@/*');
  });
});

describe('resolveConfigPaths', () => {
  it('should resolve every alias against the project root', async () => {
    const resolved = await resolveConfigPaths(CWD, makeConfig('src/app', { components: '@/shared/components' }));

    expect(norm(resolved.resolvedPaths.components)).toBe('/proj/src/app/shared/components');
    expect(norm(resolved.resolvedPaths.utils)).toBe('/proj/src/app/shared/utils');
    expect(norm(resolved.resolvedPaths.core)).toBe('/proj/src/app/shared/core');
    expect(norm(resolved.resolvedPaths.services)).toBe('/proj/src/app/shared/services');
  });

  it('should honour a custom folder layout', async () => {
    const config = makeConfig('src/app', {
      components: '@/ui/components',
      utils: '@/ui/utils',
      core: '@/ui/core',
      services: '@/ui/services',
    });
    const resolved = await resolveConfigPaths(CWD, config);

    expect(norm(resolved.resolvedPaths.components)).toBe('/proj/src/app/ui/components');
    expect(norm(resolved.resolvedPaths.utils)).toBe('/proj/src/app/ui/utils');
  });

  it('should honour a nested project baseUrl', async () => {
    const config = makeConfig('projects/admin/src/app', { components: '@/shared/components' });
    const resolved = await resolveConfigPaths(CWD, config);

    expect(norm(resolved.resolvedPaths.components)).toBe('/proj/projects/admin/src/app/shared/components');
  });

  // Without resolving the prefix, `@app/components` became a literal folder named
  // `@app` at the project root — outside anything the tsconfig maps.
  it('should not create a literal folder out of a non-@ alias prefix', async () => {
    const resolved = await resolveConfigPaths(CWD, makeConfig('src/app', { components: '@app/components' }));

    expect(norm(resolved.resolvedPaths.components)).toBe('/proj/src/app/components');
    expect(norm(resolved.resolvedPaths.components)).not.toContain('@app');
  });
});

describe('getTargetDir', () => {
  const resolvedFor = async (baseUrl: string, components: string) =>
    resolveConfigPaths(CWD, makeConfig(baseUrl, { components }));

  it('should place a component under the components alias', async () => {
    const resolved = await resolvedFor('src/app', '@/shared/components');

    expect(norm(getTargetDir({ name: 'button' }, resolved, CWD))).toBe('/proj/src/app/shared/components/button');
  });

  it('should place core and utils at their own aliases, not under components', async () => {
    const resolved = await resolvedFor('src/app', '@/shared/components');

    expect(norm(getTargetDir({ name: 'core', basePath: 'core' }, resolved, CWD))).toBe('/proj/src/app/shared/core');
    expect(norm(getTargetDir({ name: 'utils', basePath: 'utils' }, resolved, CWD))).toBe('/proj/src/app/shared/utils');
  });

  it('should follow basePath when it differs from the component name', async () => {
    const resolved = await resolvedFor('src/app', '@/shared/components');
    const target = getTargetDir({ name: 'dropdown-item', basePath: 'dropdown' }, resolved, CWD);

    expect(norm(target)).toBe('/proj/src/app/shared/components/dropdown');
  });

  it('should let --path override the configured alias', async () => {
    const resolved = await resolvedFor('src/app', '@/shared/components');

    expect(norm(getTargetDir({ name: 'button' }, resolved, CWD, 'libs/ui'))).toBe('/proj/libs/ui/button');
  });

  it('should keep --path relative to the project root, never to baseUrl', async () => {
    const resolved = await resolvedFor('projects/admin/src/app', '@/shared/components');

    expect(norm(getTargetDir({ name: 'button' }, resolved, CWD, 'libs/ui'))).toBe('/proj/libs/ui/button');
  });

  it('should normalize a --path written with ./ or a trailing slash', async () => {
    const resolved = await resolvedFor('src/app', '@/shared/components');

    expect(norm(getTargetDir({ name: 'button' }, resolved, CWD, './libs/ui'))).toBe('/proj/libs/ui/button');
    expect(norm(getTargetDir({ name: 'button' }, resolved, CWD, 'libs/ui/'))).toBe('/proj/libs/ui/button');
  });

  it('should send core and utils to --path as well, not to their aliases', async () => {
    const resolved = await resolvedFor('src/app', '@/shared/components');

    expect(norm(getTargetDir({ name: 'core', basePath: 'core' }, resolved, CWD, 'libs/ui'))).toBe('/proj/libs/ui/core');
  });

  it('should place a component under a deeply nested alias', async () => {
    const resolved = await resolvedFor('src/app', '@/features/design-system/ui');

    expect(norm(getTargetDir({ name: 'button' }, resolved, CWD))).toBe(
      '/proj/src/app/features/design-system/ui/button',
    );
  });

  it('should follow the alias even when components and utils live in different trees', async () => {
    const config = makeConfig('src/app', {
      components: '@/ui/components',
      utils: '@/lib/utils',
      core: '@/lib/core',
      services: '@/lib/services',
    });
    const resolved = await resolveConfigPaths(CWD, config);

    expect(norm(getTargetDir({ name: 'button' }, resolved, CWD))).toBe('/proj/src/app/ui/components/button');
    expect(norm(getTargetDir({ name: 'utils', basePath: 'utils' }, resolved, CWD))).toBe('/proj/src/app/lib/utils');
    expect(norm(getTargetDir({ name: 'core', basePath: 'core' }, resolved, CWD))).toBe('/proj/src/app/lib/core');
  });
});

describe('validateTargetPath', () => {
  const ROOT = norm(require('node:path').resolve('/proj'));

  const resolveIn = (relative: string): string => require('node:path').resolve('/proj', relative);

  it('should accept a path inside the project', () => {
    expect(() => validateTargetPath(resolveIn('src/app/shared/components'), resolveIn('.'))).not.toThrow();
  });

  it('should accept the project root itself', () => {
    expect(() => validateTargetPath(resolveIn('.'), resolveIn('.'))).not.toThrow();
  });

  it('should reject a path that climbs out of the project', () => {
    expect(() => validateTargetPath(resolveIn('../outside'), resolveIn('.'))).toThrow(CliError);
  });

  it('should reject an unrelated absolute path', () => {
    expect(() => validateTargetPath(require('node:path').resolve('/other/place'), resolveIn('.'))).toThrow(CliError);
  });

  // `/proj-evil` starts with `/proj` but is not inside it. Comparing string
  // prefixes without requiring the separator lets the sibling directory through.
  it('should reject a sibling directory that merely shares the prefix', () => {
    const sibling = require('node:path').resolve(`${ROOT}-evil/components`);

    expect(() => validateTargetPath(sibling, resolveIn('.'))).toThrow(CliError);
  });
});

describe('transformContent', () => {
  const config = makeConfig('src/app', {
    components: '@/ui/components',
    utils: '@/ui/utils',
    core: '@/ui/core',
    services: '@/ui/services',
  });

  it('should rewrite an import that points at a file inside an alias', () => {
    const out = transformContent("import { mergeClasses } from '@/shared/utils/merge-classes';", config);

    expect(out).toBe("import { mergeClasses } from '@/ui/utils/merge-classes';");
  });

  // `card.component.ts` imports the barrel: `from '@/shared/core'`, with no
  // subpath. Without rewriting it, the installed component points at a folder
  // that does not exist when the user chose a different alias.
  it('should rewrite a barrel import that has no subpath', () => {
    const out = transformContent("import { ZardStringTemplateOutletDirective } from '@/shared/core';", config);

    expect(out).toBe("import { ZardStringTemplateOutletDirective } from '@/ui/core';");
  });

  it('should rewrite sibling component imports written as relative paths', () => {
    const out = transformContent("import { ZardMenuDirective } from '../menu/menu.directive';", config);

    expect(out).toBe("import { ZardMenuDirective } from '@/ui/components/menu/menu.directive';");
  });

  it('should rewrite every alias key', () => {
    const source = [
      "import a from '@/shared/components/button';",
      "import b from '@/shared/utils/merge-classes';",
      "import c from '@/shared/core';",
      "import d from '@/shared/services/toast';",
    ].join('\n');

    expect(transformContent(source, config)).toBe(
      [
        "import a from '@/ui/components/button';",
        "import b from '@/ui/utils/merge-classes';",
        "import c from '@/ui/core';",
        "import d from '@/ui/services/toast';",
      ].join('\n'),
    );
  });

  it('should leave imports untouched when the aliases are the default ones', () => {
    const defaults = makeConfig('src/app', { components: '@/shared/components' });
    const source = "import { mergeClasses } from '@/shared/utils/merge-classes';";

    expect(transformContent(source, defaults)).toBe(source);
  });

  it('should never emit a doubled slash from a trailing-slash alias', () => {
    const sloppy = makeConfig('src/app', {
      components: '@/ui/components/',
      utils: '@/ui/utils/',
      core: '@/ui/core/',
      services: '@/ui/services/',
    });
    const out = transformContent("import { mergeClasses } from '@/shared/utils/merge-classes';", sloppy);

    expect(out).not.toContain('//');
    expect(out).toBe("import { mergeClasses } from '@/ui/utils/merge-classes';");
  });

  it('should not touch third-party imports', () => {
    const source = "import { cva } from 'class-variance-authority';\nimport type { X } from 'embla-carousel';";

    expect(transformContent(source, config)).toBe(source);
  });

  it('should rewrite the components barrel without a subpath', () => {
    const out = transformContent("import { ZardButtonComponent } from '@/shared/components';", config);

    expect(out).toBe("import { ZardButtonComponent } from '@/ui/components';");
  });

  it('should rewrite re-exports, not only imports', () => {
    const out = transformContent("export * from '@/shared/core';\nexport { x } from '@/shared/utils/number';", config);

    expect(out).toBe("export * from '@/ui/core';\nexport { x } from '@/ui/utils/number';");
  });

  it('should rewrite double-quoted specifiers', () => {
    const out = transformContent('import { mergeClasses } from "@/shared/utils/merge-classes";', config);

    expect(out).toBe('import { mergeClasses } from "@/ui/utils/merge-classes";');
  });

  it('should rewrite a type-only import', () => {
    const out = transformContent("import type { ZardCardVariants } from '@/shared/components/card';", config);

    expect(out).toBe("import type { ZardCardVariants } from '@/ui/components/card';");
  });

  it('should rewrite a specifier split across lines', () => {
    const source = "import {\n  mergeClasses,\n} from '@/shared/utils/merge-classes';";

    expect(transformContent(source, config)).toBe("import {\n  mergeClasses,\n} from '@/ui/utils/merge-classes';");
  });

  it('should rewrite a deep subpath', () => {
    const out = transformContent("import { x } from '@/shared/core/directives/id.directive';", config);

    expect(out).toBe("import { x } from '@/ui/core/directives/id.directive';");
  });

  it('should route sibling imports to components even for a nested file', () => {
    const out = transformContent("import { x } from '../dropdown/dropdown-item.component';", config);

    expect(out).toBe("import { x } from '@/ui/components/dropdown/dropdown-item.component';");
  });

  it('should keep the alias prefix when it is not @', () => {
    const prefixed = makeConfig('src/app', {
      components: '@app/components',
      utils: '@app/utils',
      core: '@app/core',
      services: '@app/services',
    });
    const source = "import { mergeClasses } from '@/shared/utils/merge-classes';\nimport { y } from '@/shared/core';";

    expect(transformContent(source, prefixed)).toBe(
      "import { mergeClasses } from '@app/utils/merge-classes';\nimport { y } from '@app/core';",
    );
  });

  // Com `--path libs/ui`, os componentes do lote ficam vizinhos ali. Manter o
  // alias would make `carousel` import `@/shared/components/button` — a path
  // que aponta para a pasta de onde eles justamente foram tirados.
  it('should make component imports relative when installing to a custom path', () => {
    const out = transformContent("import { ZardButtonComponent } from '@/shared/components/button';", config, {
      siblingComponents: true,
    });

    expect(out).toBe("import { ZardButtonComponent } from '../button';");
  });

  it('should keep utils and core on their aliases even under a custom path', () => {
    const source = "import { mergeClasses } from '@/shared/utils/merge-classes';\nimport { y } from '@/shared/core';";

    expect(transformContent(source, config, { siblingComponents: true })).toBe(
      "import { mergeClasses } from '@/ui/utils/merge-classes';\nimport { y } from '@/ui/core';",
    );
  });

  it('should keep sibling relative imports relative under a custom path', () => {
    const out = transformContent("import { x } from '../menu/menu.directive';", config, { siblingComponents: true });

    expect(out).toBe("import { x } from '../menu/menu.directive';");
  });

  it('should not confuse an alias key with a longer folder name', () => {
    // `@/shared/core-legacy` is not the `core` alias; it must not become `@/ui/core-legacy`.
    const out = transformContent("import { x } from '@/shared/core-legacy/thing';", config);

    expect(out).toBe("import { x } from '@/shared/core-legacy/thing';");
  });
});

describe('updateTsConfig', () => {
  const tsconfigOf = (): any => JSON.parse(mockWriteFile.mock.calls[0][1]);

  beforeEach(() => {
    mockExistsSync.mockReset().mockReturnValue(true);
    mockReadFile.mockReset();
    mockWriteFile.mockReset().mockResolvedValue(undefined);
  });

  it('should map the alias prefix onto baseUrl', async () => {
    mockReadFile.mockResolvedValue('{ "compilerOptions": {} }');

    await updateTsConfig(CWD, makeConfig('src/app', { components: '@/shared/components' }));

    expect(tsconfigOf().compilerOptions.paths).toEqual({ '@/*': ['./src/app/*'] });
  });

  // baseUrl virou erro no TypeScript 6 e some no 7.
  it('should never introduce baseUrl', async () => {
    mockReadFile.mockResolvedValue('{ "compilerOptions": {} }');

    await updateTsConfig(CWD, makeConfig('src/app', { components: '@/shared/components' }));

    expect(tsconfigOf().compilerOptions.baseUrl).toBeUndefined();
  });

  it('should write the mapping relative to an existing baseUrl', async () => {
    mockReadFile.mockResolvedValue('{ "compilerOptions": { "baseUrl": "./src" } }');

    await updateTsConfig(CWD, makeConfig('src/app', { components: '@/shared/components' }));

    expect(tsconfigOf().compilerOptions.paths).toEqual({ '@/*': ['app/*'] });
  });

  // Sem isto, escolher `@app/components` gera imports que o tsconfig nunca mapeia.
  it('should map a custom alias prefix', async () => {
    mockReadFile.mockResolvedValue('{ "compilerOptions": {} }');

    await updateTsConfig(CWD, makeConfig('src/app', { components: '@app/components' }));

    expect(tsconfigOf().compilerOptions.paths).toEqual({ '@app/*': ['./src/app/*'] });
  });

  it('should keep mappings the project already had', async () => {
    mockReadFile.mockResolvedValue('{ "compilerOptions": { "paths": { "@env/*": ["./src/environments/*"] } } }');

    await updateTsConfig(CWD, makeConfig('src/app', { components: '@/shared/components' }));

    expect(tsconfigOf().compilerOptions.paths).toEqual({
      '@env/*': ['./src/environments/*'],
      '@/*': ['./src/app/*'],
    });
  });

  it('should follow a nested project baseUrl', async () => {
    mockReadFile.mockResolvedValue('{ "compilerOptions": {} }');

    await updateTsConfig(CWD, makeConfig('projects/admin/src/app', { components: '@/shared/components' }));

    expect(tsconfigOf().compilerOptions.paths).toEqual({ '@/*': ['./projects/admin/src/app/*'] });
  });

  it('should overwrite its own mapping instead of duplicating it on re-init', async () => {
    mockReadFile.mockResolvedValue('{ "compilerOptions": { "paths": { "@/*": ["./src/old/*"] } } }');

    await updateTsConfig(CWD, makeConfig('src/app', { components: '@/shared/components' }));

    expect(tsconfigOf().compilerOptions.paths).toEqual({ '@/*': ['./src/app/*'] });
  });

  it('should preserve a tsconfig written with comments', async () => {
    mockReadFile.mockResolvedValue('{\n  // project paths\n  "compilerOptions": { "strict": true }\n}');

    await updateTsConfig(CWD, makeConfig('src/app', { components: '@/shared/components' }));

    const written = mockWriteFile.mock.calls[0][1] as string;
    expect(written).toContain('project paths');
    expect(written).toContain('"strict": true');
  });

  it('should map a tilde prefix', async () => {
    mockReadFile.mockResolvedValue('{ "compilerOptions": {} }');

    await updateTsConfig(CWD, makeConfig('src/app', { components: '~/components' }));

    expect(tsconfigOf().compilerOptions.paths).toEqual({ '~/*': ['./src/app/*'] });
  });

  it('should leave the file alone when there is no tsconfig', async () => {
    mockExistsSync.mockReturnValue(false);

    await updateTsConfig(CWD, makeConfig('src/app', { components: '@/shared/components' }));

    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('should not throw when the tsconfig is unparseable', async () => {
    mockReadFile.mockResolvedValue('{ this is not json }');

    await expect(
      updateTsConfig(CWD, makeConfig('src/app', { components: '@/shared/components' })),
    ).resolves.toBeUndefined();
  });
});

describe('applyThemeToStyles', () => {
  /** The `@import '<path>/css/tailwind'` the theme writes into the global CSS. */
  const importedCorePath = (): string => {
    const css = mockWriteFile.mock.calls[0][1] as string;
    return /@import '([^']+)\/css\/tailwind'/.exec(css)?.[1] ?? '';
  };

  beforeEach(() => {
    mockWriteFile.mockReset().mockResolvedValue(undefined);
  });

  it('should point at core relative to the CSS file', async () => {
    await applyThemeToStyles(CWD, makeConfig('src/app', { components: '@/shared/components' }));

    expect(importedCorePath()).toBe('./app/shared/core');
  });

  it('should follow a custom folder layout', async () => {
    const config = makeConfig('src/app', { components: '@/ui/components', core: '@/ui/core' });

    await applyThemeToStyles(CWD, config);

    expect(importedCorePath()).toBe('./app/ui/core');
  });

  // Fatiar o alias produzia `./appapp/core`, e o bundler morria no @import.
  it('should survive an alias prefix other than @', async () => {
    const config = makeConfig('src/app', { components: '@app/components', core: '@app/core' });

    await applyThemeToStyles(CWD, config);

    expect(importedCorePath()).toBe('./app/core');
  });

  it('should walk out of the CSS folder when core lives elsewhere', async () => {
    const config: Config = {
      ...makeConfig('projects/admin/src/app', { components: '@/shared/components' }),
      tailwind: { css: 'projects/admin/src/styles.css', baseColor: 'neutral' },
    };

    await applyThemeToStyles(CWD, config);

    expect(importedCorePath()).toBe('./app/shared/core');
  });

  it('should emit a relative path even when the CSS sits above the project root layout', async () => {
    const config: Config = {
      ...makeConfig('projects/admin/src/app', { components: '@/shared/components' }),
      tailwind: { css: 'src/styles.css', baseColor: 'neutral' },
    };

    await applyThemeToStyles(CWD, config);

    expect(importedCorePath()).toBe('../projects/admin/src/app/shared/core');
  });

  it('should climb out of a nested styles folder', async () => {
    const config: Config = {
      ...makeConfig('src/app', { components: '@/shared/components' }),
      tailwind: { css: 'src/assets/styles/main.css', baseColor: 'neutral' },
    };

    await applyThemeToStyles(CWD, config);

    expect(importedCorePath()).toBe('../../app/shared/core');
  });

  it('should handle CSS sitting next to core', async () => {
    const config: Config = {
      ...makeConfig('src', { components: '@/components', core: '@/core' }),
      tailwind: { css: 'src/styles.css', baseColor: 'neutral' },
    };

    await applyThemeToStyles(CWD, config);

    expect(importedCorePath()).toBe('./core');
  });

  it('should handle CSS at the project root', async () => {
    const config: Config = {
      ...makeConfig('src/app', { components: '@/shared/components' }),
      tailwind: { css: 'styles.css', baseColor: 'neutral' },
    };

    await applyThemeToStyles(CWD, config);

    expect(importedCorePath()).toBe('./src/app/shared/core');
  });

  it('should never emit a Windows separator into the CSS import', async () => {
    const config: Config = {
      ...makeConfig('projects/admin/src/app', { components: '@/shared/components' }),
      tailwind: { css: 'projects/admin/src/assets/styles.css', baseColor: 'neutral' },
    };

    await applyThemeToStyles(CWD, config);

    expect(importedCorePath()).not.toContain('\\');
    expect(importedCorePath()).toBe('../app/shared/core');
  });
});

describe('buildConfig', () => {
  const answers = (over: Partial<Parameters<typeof buildConfig>[0]> = {}) => ({
    kind: 'angular' as const,
    libraryRoot: '',
    appConfig: 'src/app/app.config.ts',
    theme: 'neutral',
    globalCss: 'src/styles.css',
    componentsAlias: '@/shared/components',
    utilsAlias: '@/shared/utils',
    ...over,
  });

  it('should derive core and services from the components alias', () => {
    const config = buildConfig(answers(), 'npm');

    expect(config.aliases.core).toBe('@/shared/core');
    expect(config.aliases.services).toBe('@/shared/services');
  });

  it('should derive them from a custom components alias too', () => {
    const config = buildConfig(answers({ componentsAlias: '@/ui/components' }), 'npm');

    expect(config.aliases.core).toBe('@/ui/core');
    expect(config.aliases.services).toBe('@/ui/services');
  });

  // The wizard's default offers `apps/[app]/src/app/app.config.ts` for
  // workspaces. Hardcoding baseUrl to `src/app` sent the components to a folder
  // at the root that belongs to no project.
  it('should derive baseUrl from the app.config.ts location', () => {
    const config = buildConfig(answers({ appConfig: 'apps/admin/src/app/app.config.ts' }), 'npm');

    expect(config.baseUrl).toBe('apps/admin/src/app');
  });

  it('should derive baseUrl for a classic single-app layout', () => {
    expect(buildConfig(answers(), 'npm').baseUrl).toBe('src/app');
  });

  it('should derive baseUrl for an Angular workspace project', () => {
    const config = buildConfig(answers({ appConfig: 'projects/admin/src/app/app.config.ts' }), 'npm');

    expect(config.baseUrl).toBe('projects/admin/src/app');
  });

  it('should derive baseUrl from a path typed with backslashes', () => {
    const config = buildConfig(answers({ appConfig: 'apps\\admin\\src\\app\\app.config.ts' }), 'npm');

    expect(config.baseUrl).toBe('apps/admin/src/app');
  });

  it('should fall back to src/app when app.config.ts sits at the root', () => {
    expect(buildConfig(answers({ appConfig: 'app.config.ts' }), 'npm').baseUrl).toBe('src/app');
  });

  it('should keep a non-@ prefix across the derived aliases', () => {
    const config = buildConfig(answers({ componentsAlias: '@app/ui', utilsAlias: '@app/utils' }), 'npm');

    expect(config.aliases).toEqual({
      components: '@app/ui',
      utils: '@app/utils',
      core: '@app/core',
      services: '@app/services',
    });
  });

  it('should derive core and services from a deeply nested components alias', () => {
    const config = buildConfig(answers({ componentsAlias: '@/features/design-system/components' }), 'npm');

    expect(config.aliases.core).toBe('@/features/design-system/core');
    expect(config.aliases.services).toBe('@/features/design-system/services');
  });
});

/**
 * The contract that ties it all together: for every layout, the component has to
 * land in a directory the tsconfig mapping reaches from the generated import.
 * This is the check that was missing when each piece was fixed in isolation.
 */
describe('coherence between destination, import and tsconfig', () => {
  const LAYOUTS = [
    { name: 'default', baseUrl: 'src/app', alias: '@/shared/components' },
    { name: 'subpasta ui', baseUrl: 'src/app', alias: '@/ui/components' },
    { name: 'prefixo @app', baseUrl: 'src/app', alias: '@app/components' },
    { name: 'prefixo til', baseUrl: 'src/app', alias: '~/components' },
    { name: 'workspace', baseUrl: 'projects/admin/src/app', alias: '@/shared/components' },
    { name: 'nx', baseUrl: 'apps/admin/src/app', alias: '@/ui/components' },
    { name: 'baseUrl src', baseUrl: 'src', alias: '@/components' },
    { name: 'alias profundo', baseUrl: 'src/app', alias: '@/features/design-system/ui' },
  ];

  beforeEach(() => {
    mockExistsSync.mockReset().mockReturnValue(true);
    mockReadFile.mockReset().mockResolvedValue('{ "compilerOptions": {} }');
    mockWriteFile.mockReset().mockResolvedValue(undefined);
  });

  it.each(LAYOUTS)('$name: o import gerado resolve para o arquivo escrito', async layout => {
    const config = makeConfig(layout.baseUrl, {
      components: layout.alias,
      utils: `${layout.alias.replace(/\/[^/]+$/, '')}/utils`,
      core: `${layout.alias.replace(/\/[^/]+$/, '')}/core`,
      services: `${layout.alias.replace(/\/[^/]+$/, '')}/services`,
    });
    const resolved = await resolveConfigPaths(CWD, config);

    // 1. where the file is written
    const target = norm(getTargetDir({ name: 'button' }, resolved, CWD));

    // 2. which import references it
    const importSpecifier = transformContent("from '@/shared/components/button'", config).slice(6, -1);

    // 3. o que o tsconfig mapeia
    await updateTsConfig(CWD, config);
    const paths = JSON.parse(mockWriteFile.mock.calls[0][1] as string).compilerOptions.paths;
    const [pattern, [mapping]] = Object.entries(paths)[0] as [string, string[]];

    // the import has to match the pattern, and the substitution has to land on the destination
    const prefix = pattern.replace(/\*$/, '');
    expect(importSpecifier.startsWith(prefix)).toBe(true);

    const resolvedByTsconfig = `${CWD}/${mapping.replace(/\*$/, '')}${importSpecifier.slice(prefix.length)}`
      .replace(/\/\.\//g, '/')
      .replace(/\/{2,}/g, '/');

    expect(resolvedByTsconfig).toBe(target);
  });
});
