/**
 * Analog's Vite config needs four edits: the Tailwind plugin, a `build.cssTarget`,
 * a `resolve.alias` for the components alias and `resolve.tsconfigPaths` (Vite 8).
 *
 * The template's `build.target: ['es2020']` doubles as the CSS target, and Lightning
 * CSS then lowers logical properties to `left`/`right` fallbacks chosen by `:lang()`
 * — so `dir="rtl"` with `lang="en"` lays out left to right.
 */

jest.mock('@cli/utils/logger.js', () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn(), debug: jest.fn() },
}));

import {
  CSS_TARGET,
  ensureAlias,
  ensureCssTarget,
  setupCssTarget,
  setupViteAlias,
  setupViteTsconfigPaths,
  withTsconfigPaths,
} from '@cli/commands/init/vite-setup.js';
import { logger } from '@cli/utils/logger.js';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

const LITERAL = "['chrome111', 'edge111', 'firefox128', 'safari16.4']";

const TEMPLATE = `import { defineConfig } from 'vite';
import analog from '@analogjs/platform';

export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [analog()],
}));
`;

describe('ensureCssTarget', () => {
  it('should add the Tailwind baseline after the template build.target', () => {
    const result = ensureCssTarget(TEMPLATE);

    expect(result).toContain(`    target: ['es2020'],\n    cssTarget: ${LITERAL},\n  },`);
    expect(CSS_TARGET).toEqual(['chrome111', 'edge111', 'firefox128', 'safari16.4']);
  });

  it('should be idempotent', () => {
    const once = ensureCssTarget(TEMPLATE) as string;

    expect(ensureCssTarget(once)).toBe(once);
    expect(once.match(/cssTarget/g)).toHaveLength(1);
  });

  it('should never overwrite an existing cssTarget', () => {
    const own = TEMPLATE.replace("target: ['es2020'],", "target: ['es2020'],\n    cssTarget: 'chrome90',");

    expect(ensureCssTarget(own)).toBe(own);
  });

  it('should add it to a target that has no trailing comma', () => {
    const result = ensureCssTarget(TEMPLATE.replace("['es2020'],", "['es2020']"));

    expect(result).toContain(`target: ['es2020'],\n    cssTarget: ${LITERAL}\n  },`);
  });

  it('should handle an inline build object', () => {
    const result = ensureCssTarget(TEMPLATE.replace(/build: \{[^}]*\},/, "build: { target: ['es2020'] },"));

    expect(result).toContain(`build: { target: ['es2020'], cssTarget: ${LITERAL} },`);
  });

  it('should handle a string target', () => {
    const result = ensureCssTarget(TEMPLATE.replace("['es2020']", "'es2020'"));

    expect(result).toContain(`target: 'es2020',\n    cssTarget: ${LITERAL},`);
  });

  it('should leave a modern target alone', () => {
    const modern = TEMPLATE.replace("['es2020']", "'esnext'");
    const browsers = TEMPLATE.replace("['es2020']", "['chrome120', 'safari17']");

    expect(ensureCssTarget(modern)).toBe(modern);
    expect(ensureCssTarget(browsers)).toBe(browsers);
  });

  it('should treat a target older than the baseline as old', () => {
    expect(ensureCssTarget(TEMPLATE.replace("['es2020']", "['chrome100']"))).toContain('cssTarget');
  });

  it('should add the key when build has no target', () => {
    const result = ensureCssTarget(TEMPLATE.replace("target: ['es2020'],", "outDir: 'dist',"));

    expect(result).toContain(`  build: {\n    cssTarget: ${LITERAL},\n    outDir: 'dist',\n  },`);
  });

  it('should fill an empty build object', () => {
    expect(ensureCssTarget(TEMPLATE.replace(/build: \{[^}]*\},/, 'build: {},'))).toContain(
      `build: { cssTarget: ${LITERAL} },`,
    );
  });

  it('should create a build object in front of plugins when there is none', () => {
    const noBuild = TEMPLATE.replace(/ {2}build: \{[^}]*\},\n/, '');
    const result = ensureCssTarget(noBuild);

    expect(result).toContain(`  build: {\n    cssTarget: ${LITERAL},\n  },\n  plugins: [analog()],`);
    expect(ensureCssTarget(result as string)).toBe(result);
  });

  it('should keep CRLF files in CRLF', () => {
    const result = ensureCssTarget(TEMPLATE.replace(/\n/g, '\r\n')) as string;

    expect(result).toContain(`target: ['es2020'],\r\n    cssTarget: ${LITERAL},\r\n  },`);
    expect(result.replace(/\r\n/g, '')).not.toContain('\n');
  });

  it('should keep CRLF when it has to create the build object', () => {
    const result = ensureCssTarget(TEMPLATE.replace(/ {2}build: \{[^}]*\},\n/, '').replace(/\n/g, '\r\n')) as string;

    expect(result).toContain(`  build: {\r\n    cssTarget: ${LITERAL},\r\n  },\r\n`);
    expect(result.replace(/\r\n/g, '')).not.toContain('\n');
  });

  it('should give up on a build that is not an object literal', () => {
    expect(ensureCssTarget(TEMPLATE.replace(/build: \{[^}]*\},/, 'build: buildOptions,'))).toBeNull();
  });

  it('should give up on a target it cannot read', () => {
    expect(ensureCssTarget(TEMPLATE.replace("['es2020']", 'browserTargets'))).toBeNull();
  });

  it('should give up when there is neither build nor plugins', () => {
    expect(ensureCssTarget('export default {};\n')).toBeNull();
  });

  it('should ignore brackets inside strings and comments', () => {
    const tricky = TEMPLATE.replace("target: ['es2020'],", "// } ]\n    target: ['es2020'], // }");

    expect(ensureCssTarget(tricky)).toContain(`target: ['es2020'],\n    cssTarget: ${LITERAL}`);
  });
});

describe('setupCssTarget', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'zard-vite-'));
    jest.clearAllMocks();
  });

  afterEach(() => rm(dir, { recursive: true, force: true }));

  it('should write the key into vite.config.ts', async () => {
    await writeFile(path.join(dir, 'vite.config.ts'), TEMPLATE);
    await setupCssTarget(dir);

    expect(await readFile(path.join(dir, 'vite.config.ts'), 'utf8')).toContain(`cssTarget: ${LITERAL}`);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should warn with the exact line when the config cannot be edited', async () => {
    const odd = 'export default {};\n';
    await writeFile(path.join(dir, 'vite.config.ts'), odd);
    await setupCssTarget(dir);

    expect(await readFile(path.join(dir, 'vite.config.ts'), 'utf8')).toBe(odd);
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining(`cssTarget: ${LITERAL}`));
  });

  it('should warn when there is no vite config', async () => {
    await setupCssTarget(dir);

    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining(`cssTarget: ${LITERAL}`));
  });
});

const ALIAS_VALUE = "fileURLToPath(new URL('./src/app', import.meta.url))";
const IMPORT = "import { fileURLToPath } from 'node:url';";
const SRC = './src/app';

describe('ensureAlias', () => {
  it('should add the alias into the template resolve and the import after the others', () => {
    const result = ensureAlias(TEMPLATE, '@', SRC) as string;

    expect(result).toContain(`  resolve: {\n    alias: { '@': ${ALIAS_VALUE} },\n    mainFields: ['module'],\n  },`);
    expect(result).toContain(`import analog from '@analogjs/platform';\n${IMPORT}\n`);
  });

  it('should be idempotent', () => {
    const once = ensureAlias(TEMPLATE, '@', SRC) as string;

    expect(ensureAlias(once, '@', SRC)).toBe(once);
    expect(once.match(/fileURLToPath\(/g)).toHaveLength(1);
  });

  it('should keep an existing @ alias untouched', () => {
    const own = TEMPLATE.replace('mainFields', "alias: { '@': '/abs/src' },\n    mainFields");

    expect(ensureAlias(own, '@', SRC)).toBe(own);
  });

  it('should add the key next to other aliases', () => {
    const other = TEMPLATE.replace('mainFields', "alias: {\n      '~': '/x',\n    },\n    mainFields");
    const result = ensureAlias(other, '@', SRC) as string;

    expect(result).toContain(`alias: {\n      '@': ${ALIAS_VALUE},\n      '~': '/x',\n    },`);
  });

  it('should create resolve in front of plugins when there is none', () => {
    const none = TEMPLATE.replace(/ {2}resolve: \{[^}]*\},\n/, '');
    const result = ensureAlias(none, '@', SRC) as string;

    expect(result).toContain(
      `  resolve: {\n    alias: {\n      '@': ${ALIAS_VALUE},\n    },\n  },\n  plugins: [analog()],`,
    );
    expect(ensureAlias(result, '@', SRC)).toBe(result);
  });

  it('should fill an empty resolve and handle an inline one', () => {
    expect(ensureAlias(TEMPLATE.replace(/resolve: \{[^}]*\}/, 'resolve: {}'), '@', SRC)).toContain(
      `resolve: { alias: { '@': ${ALIAS_VALUE} } },`,
    );
    expect(
      ensureAlias(TEMPLATE.replace(/resolve: \{[^}]*\}/, "resolve: { mainFields: ['module'] }"), '@', SRC),
    ).toContain(`resolve: { alias: { '@': ${ALIAS_VALUE} }, mainFields: ['module'] },`);
  });

  it('should use the configured alias and target', () => {
    const result = ensureAlias(TEMPLATE, '@app', './projects/shop/src/app') as string;

    expect(result).toContain("'@app': fileURLToPath(new URL('./projects/shop/src/app', import.meta.url))");
  });

  it('should not duplicate an import that is already there', () => {
    const imported = TEMPLATE.replace('import analog', "import { fileURLToPath } from 'url';\nimport analog");
    const result = ensureAlias(imported, '@', SRC) as string;

    expect(result.match(/import \{ fileURLToPath \}/g)).toHaveLength(1);
  });

  it('should keep CRLF files in CRLF', () => {
    const crlf = ensureAlias(TEMPLATE.replace(/\n/g, '\r\n'), '@', SRC) as string;
    const created = ensureAlias(
      TEMPLATE.replace(/ {2}resolve: \{[^}]*\},\n/, '').replace(/\n/g, '\r\n'),
      '@',
      SRC,
    ) as string;

    expect(crlf).toContain(`${IMPORT}\r\n`);
    expect(crlf.replace(/\r\n/g, '')).not.toContain('\n');
    expect(created.replace(/\r\n/g, '')).not.toContain('\n');
  });

  it('should give up on shapes it cannot merge into', () => {
    const variable = TEMPLATE.replace(/resolve: \{[^}]*\}/, 'resolve: resolveOptions');
    const list = TEMPLATE.replace('mainFields', "alias: [{ find: '~', replacement: '/x' }],\n    mainFields");

    expect(ensureAlias(variable, '@', SRC)).toBeNull();
    expect(ensureAlias(list, '@', SRC)).toBeNull();
    expect(ensureAlias('export default {};\n', '@', SRC)).toBeNull();
  });
});

describe('setupViteAlias', () => {
  let dir: string;
  const config = { baseUrl: 'src/app', aliases: { components: '@/shared/components' } } as Parameters<
    typeof setupViteAlias
  >[1];

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'zard-vite-'));
    jest.clearAllMocks();
  });

  afterEach(() => rm(dir, { recursive: true, force: true }));

  it('should derive the alias from components.json', async () => {
    await writeFile(path.join(dir, 'vite.config.ts'), TEMPLATE);
    await setupViteAlias(dir, config);

    expect(await readFile(path.join(dir, 'vite.config.ts'), 'utf8')).toContain(`'@': ${ALIAS_VALUE}`);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should honour a custom prefix and base', async () => {
    await writeFile(path.join(dir, 'vite.config.ts'), TEMPLATE);
    await setupViteAlias(dir, {
      baseUrl: 'projects/shop/src/app/',
      aliases: { components: '@app/ui' },
    } as typeof config);

    expect(await readFile(path.join(dir, 'vite.config.ts'), 'utf8')).toContain(
      "'@app': fileURLToPath(new URL('./projects/shop/src/app', import.meta.url))",
    );
  });

  it('should warn with the exact snippet when the config cannot be edited', async () => {
    await writeFile(path.join(dir, 'vite.config.ts'), 'export default {};\n');
    await setupViteAlias(dir, config);

    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining(`alias: { '@': ${ALIAS_VALUE} }`));
  });

  it('should warn when there is no vite config', async () => {
    await setupViteAlias(dir, config);

    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('fileURLToPath'));
  });
});

/** What `create-analog --template latest` writes. */
const ANALOG_CONFIG = [
  "import { defineConfig } from 'vite';",
  "import analog from '@analogjs/platform';",
  '',
  'export default defineConfig(({ mode }) => ({',
  '  build: {',
  "    target: ['es2020'],",
  '  },',
  '  resolve: {',
  "    mainFields: ['module'],",
  '  },',
  '  plugins: [',
  '    analog(),',
  '  ],',
  '}));',
  '',
].join('\n');

describe('withTsconfigPaths', () => {
  it('should add the option to the existing resolve object, in its indentation', () => {
    expect(withTsconfigPaths(ANALOG_CONFIG)).toContain(
      ['  resolve: {', "    mainFields: ['module'],", '    tsconfigPaths: true,', '  },'].join('\n'),
    );
  });

  it('should add a comma after an entry that has none', () => {
    const content = ANALOG_CONFIG.replace("mainFields: ['module'],", "mainFields: ['module']");

    expect(withTsconfigPaths(content)).toContain("mainFields: ['module'],\n    tsconfigPaths: true,");
  });

  it('should keep a one-line resolve on one line', () => {
    expect(withTsconfigPaths("export default { resolve: { mainFields: ['module'] }, plugins: [] };")).toBe(
      "export default { resolve: { mainFields: ['module'], tsconfigPaths: true }, plugins: [] };",
    );
    expect(withTsconfigPaths('export default { resolve: {}, plugins: [] };')).toBe(
      'export default { resolve: { tsconfigPaths: true }, plugins: [] };',
    );
  });

  it('should write a resolve block before plugins when there is none', () => {
    const content = ANALOG_CONFIG.replace("  resolve: {\n    mainFields: ['module'],\n  },\n", '');

    expect(withTsconfigPaths(content)).toContain('  resolve: {\n    tsconfigPaths: true,\n  },\n  plugins: [');
  });

  it('should keep CRLF line endings', () => {
    const result = withTsconfigPaths(ANALOG_CONFIG.replace(/\n/g, '\r\n')) as string;

    expect(result).toContain('    tsconfigPaths: true,\r\n');
    expect(result.replace(/\r\n/g, '')).not.toContain('\n');
  });

  it('should leave a config that already sets the option untouched', () => {
    const content = ANALOG_CONFIG.replace(
      "mainFields: ['module'],",
      "mainFields: ['module'],\n    tsconfigPaths: false,",
    );

    expect(withTsconfigPaths(content)).toBe(content);
  });

  it('should return null when there is neither resolve nor plugins', () => {
    expect(withTsconfigPaths('export default {};')).toBeNull();
  });
});

describe('setupViteTsconfigPaths', () => {
  async function project(viteVersion: string | null): Promise<string> {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-vite-'));
    await writeFile(path.join(cwd, 'package.json'), '{}');
    await writeFile(path.join(cwd, 'vite.config.ts'), ANALOG_CONFIG);
    if (viteVersion) {
      await mkdir(path.join(cwd, 'node_modules', 'vite'), { recursive: true });
      await writeFile(
        path.join(cwd, 'node_modules', 'vite', 'package.json'),
        JSON.stringify({ name: 'vite', version: viteVersion }),
      );
    }
    return cwd;
  }

  it('should switch the option on with Vite 8', async () => {
    const cwd = await project('8.3.6');

    await setupViteTsconfigPaths(cwd);

    expect(await readFile(path.join(cwd, 'vite.config.ts'), 'utf8')).toContain('tsconfigPaths: true');
  });

  it('should be idempotent', async () => {
    const cwd = await project('8.3.6');

    await setupViteTsconfigPaths(cwd);
    const once = await readFile(path.join(cwd, 'vite.config.ts'), 'utf8');
    await setupViteTsconfigPaths(cwd);

    expect(await readFile(path.join(cwd, 'vite.config.ts'), 'utf8')).toBe(once);
  });

  it('should leave the config alone and warn with an older Vite', async () => {
    const cwd = await project('7.1.0');
    const { logger } = jest.requireMock('@cli/utils/logger.js');

    await setupViteTsconfigPaths(cwd);

    expect(await readFile(path.join(cwd, 'vite.config.ts'), 'utf8')).toBe(ANALOG_CONFIG);
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('vite-tsconfig-paths'));
  });
});
