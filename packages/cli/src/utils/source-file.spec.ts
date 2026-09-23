/**
 * The two source edits init makes to the user's files.
 *
 * Both have broken in real projects by assuming the file's simplest shape: an
 * import fits on one line, an array contains no other. Neither assumption holds
 * in a real `app.config.ts` or `vite.config.ts`.
 */

import { arrayRange, lineEndingOf, withImport } from '@cli/utils/source-file.js';

describe('lineEndingOf', () => {
  it('should follow whichever line ending the file already uses', () => {
    expect(lineEndingOf('a\r\nb')).toBe('\r\n');
    expect(lineEndingOf('a\nb')).toBe('\n');
  });
});

describe('withImport', () => {
  const IMPORT = "import { provideZard } from '@/shared/core/provider/providezard';";

  it('should insert after the last import', () => {
    const content = ["import { a } from 'a';", "import { b } from 'b';", '', 'export const x = 1;'].join('\n');

    expect(withImport(content, IMPORT).split('\n')[2]).toBe(IMPORT);
  });

  // The symbol list often wraps across several lines; a pattern anchored to a
  // single line did not reach it, and the import ended up before all the others.
  it('should see through a multi-line import list', () => {
    const content = ["import {\n  provideHttpClient,\n  withInterceptors,\n} from '@angular/common/http';", ''].join(
      '\n',
    );

    const lines = withImport(content, IMPORT).split('\n');

    expect(lines[4]).toBe(IMPORT);
  });

  it('should keep CRLF files consistent instead of mixing endings', () => {
    const content = "import { a } from 'a';\r\n\r\nexport const x = 1;\r\n";
    const result = withImport(content, IMPORT);

    expect(result).toContain(`\r\n${IMPORT}\r\n`);
    expect(result.split('\n').every(line => line === '' || line.endsWith('\r'))).toBe(true);
  });

  it('should be a no-op when the import is already there', () => {
    const content = `${IMPORT}\nexport const x = 1;\n`;

    expect(withImport(content, IMPORT)).toBe(content);
  });

  it('should fall back to the top of a file with no imports', () => {
    expect(withImport('export const x = 1;\n', IMPORT).startsWith(IMPORT)).toBe(true);
  });
});

describe('arrayRange', () => {
  it('should span the whole array, not stop at the first bracket', () => {
    const content = 'providers: [a(), b([c])]';
    const range = arrayRange(content, 'providers');

    expect(range?.body).toBe('a(), b([c])');
  });

  /**
   * O caso que quebrava o Analog: o `]` de `withInterceptors([...])` era lido
   * como o fim da lista de providers, e `provideZard()` acabava registrado como
   * um interceptor de HTTP.
   */
  it('should not mistake a nested array for the end of the list', () => {
    const content = [
      'providers: [',
      '  provideFileRouter(),',
      '  provideHttpClient(withInterceptors([requestContextInterceptor])),',
      ']',
    ].join('\n');

    expect(arrayRange(content, 'providers')?.body).toContain('requestContextInterceptor');
    expect(content[arrayRange(content, 'providers')?.close as number]).toBe(']');
    expect(arrayRange(content, 'providers')?.close).toBe(content.length - 1);
  });

  it('should ignore brackets inside strings and comments', () => {
    const content = "plugins: [analog({ pattern: '**/*.md]' }), /* ] */ tailwindcss()]";

    expect(arrayRange(content, 'plugins')?.body).toContain('tailwindcss()');
  });

  it('should find an empty array', () => {
    expect(arrayRange('providers: []', 'providers')?.body).toBe('');
  });

  it('should return null when the key is not there', () => {
    expect(arrayRange('export const x = 1;', 'providers')).toBeNull();
  });

  // With no closing bracket there is no range — better to refuse than insert blind.
  it('should return null when the array is never closed', () => {
    expect(arrayRange('providers: [a(),', 'providers')).toBeNull();
  });
});
