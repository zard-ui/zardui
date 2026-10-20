/**
 * Analog's Vite config needs two edits: the Tailwind plugin, and a `build.cssTarget`.
 *
 * The template's `build.target: ['es2020']` doubles as the CSS target, and Lightning
 * CSS then lowers logical properties to `left`/`right` fallbacks chosen by `:lang()`
 * — so `dir="rtl"` with `lang="en"` lays out left to right.
 */

jest.mock('@cli/utils/logger.js', () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn(), debug: jest.fn() },
}));

import { CSS_TARGET, ensureCssTarget, setupCssTarget } from '@cli/commands/init/vite-setup.js';
import { logger } from '@cli/utils/logger.js';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
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
