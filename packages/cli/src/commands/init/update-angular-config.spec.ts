/**
 * Registering `provideZard()` in the user's app.config.
 *
 * It is the only step of init that edits code the user wrote, and the shape of
 * that code varies more than it looks: providers with nested arrays, imports
 * spread over several lines, files in CRLF.
 */

import { updateAngularConfig } from '@cli/commands/init/update-angular-config.js';
import { DEFAULT_CONFIG, type Config } from '@cli/utils/config.js';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

jest.mock('@cli/utils/logger.js', () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn(), debug: jest.fn() },
}));

const config: Config = { ...DEFAULT_CONFIG, appConfigFile: 'src/app/app.config.ts' };

async function runOn(source: string): Promise<string> {
  const cwd = await mkdtemp(path.join(tmpdir(), 'zard-app-config-'));
  const file = path.join(cwd, config.appConfigFile);

  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, source, 'utf8');

  await updateAngularConfig(cwd, config);

  return readFile(file, 'utf8');
}

describe('updateAngularConfig', () => {
  it('should append the provider to the list', async () => {
    const result = await runOn(
      ['export const appConfig = {', '  providers: [provideRouter(routes)],', '};', ''].join('\n'),
    );

    expect(result).toContain('provideZard(),');
    expect(result).toContain("import { provideZard } from '@/shared/core/provider/providezard';");
  });

  /**
   * The case that broke Analog: the `]` of `withInterceptors([...])` was read as
   * the end of the list, and `provideZard()` went in as an HTTP interceptor — a
   * type error at build time that mentions ZardUI nowhere.
   */
  it('should not land inside a nested array', async () => {
    const result = await runOn(
      [
        'export const appConfig = {',
        '  providers: [',
        '    provideFileRouter(),',
        '    provideHttpClient(withInterceptors([requestContextInterceptor])),',
        '  ],',
        '};',
        '',
      ].join('\n'),
    );

    expect(result).toContain('withInterceptors([requestContextInterceptor])');
    expect(result).not.toContain('requestContextInterceptor,\n    provideZard()');
    // The provider goes in after the list's last item, outside the nested one.
    expect(result.indexOf('provideZard()')).toBeGreaterThan(result.indexOf('provideHttpClient'));
  });

  it('should fill an empty providers array', async () => {
    const result = await runOn(['export const appConfig = {', '  providers: [],', '};', ''].join('\n'));

    expect(result).toMatch(/providers: \[\s*provideZard\(\),\s*\]/);
  });

  it('should leave a file that already registers the provider untouched', async () => {
    const source = [
      "import { provideZard } from '@/shared/core/provider/providezard';",
      'export const appConfig = {',
      '  providers: [provideZard()],',
      '};',
      '',
    ].join('\n');

    expect(await runOn(source)).toBe(source);
  });

  it('should keep CRLF files from getting mixed endings', async () => {
    const result = await runOn(
      ['export const appConfig = {', '  providers: [provideRouter(routes)],', '};', ''].join('\r\n'),
    );

    expect(result.split('\n').every(line => line === '' || line.endsWith('\r'))).toBe(true);
  });
});
