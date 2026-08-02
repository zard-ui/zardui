/**
 * O registro do `provideZard()` no app.config do usuário.
 *
 * É a única etapa do init que edita código que o usuário escreveu, e a forma
 * desse código varia mais do que parece: providers com arrays aninhados,
 * imports em várias linhas, arquivos em CRLF.
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
   * O caso que quebrava o Analog: o `]` de `withInterceptors([...])` era lido
   * como o fim da lista, e `provideZard()` entrava como um interceptor de HTTP
   * — um erro de tipo no build que não menciona ZardUI em lugar nenhum.
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
    // O provider entra depois do último item da lista, já fora do aninhado.
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
