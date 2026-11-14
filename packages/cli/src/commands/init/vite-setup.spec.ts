jest.mock('@cli/utils/logger.js', () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn(), debug: jest.fn() },
}));

import { setupViteTsconfigPaths, withTsconfigPaths } from '@cli/commands/init/vite-setup.js';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

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
