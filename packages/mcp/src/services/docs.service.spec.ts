import { docsService, sectionOf } from './docs.service.js';

/**
 * O nome do componente vira caminho da página, então corre o mesmo risco do
 * registry: sem validação, `../../algo` sai de /docs/components e traz outra
 * coisa de volta para o modelo.
 */
describe('docsService path safety', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  it.each([['../../../etc/passwd'], ['/absolute'], ['button?raw=1'], ['//evil.example.com/x']])(
    'refuses "%s" without any request',
    async name => {
      await expect(docsService.getComponentMarkdown(name)).rejects.toThrow(/Invalid component name/);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it('keeps a clean name inside the components directory', () => {
    expect(docsService.urlFor('data-table')).toBe('https://zardui.com/docs/components/data-table');
  });
});

/**
 * A página de um componente é um documento só, com instalação, uso, exemplos e
 * API. Quem pede exemplos deve receber exemplos, e não o documento inteiro.
 */
describe('sectionOf', () => {
  const page = [
    '# Button',
    '',
    '## Installation',
    '',
    'npx zard-cli add button',
    '',
    '## Examples',
    '',
    '### Size',
    '',
    '```angular-ts',
    'code here',
    '```',
    '',
    '### Outline',
    '',
    'more code',
    '',
    '## API Reference',
    '',
    'the table',
  ].join('\n');

  it('takes the section and its subsections, and stops at the next one', () => {
    const examples = sectionOf(page, 'Examples');

    expect(examples).toContain('### Size');
    expect(examples).toContain('### Outline');
    expect(examples).not.toContain('## API Reference');
    expect(examples).not.toContain('npx zard-cli add button');
  });

  it('keeps its own heading, so the result reads as a document', () => {
    expect(sectionOf(page, 'Examples')?.startsWith('## Examples')).toBe(true);
  });

  it('reads the last section up to the end of the page', () => {
    expect(sectionOf(page, 'API Reference')).toContain('the table');
  });

  it('does not care about the case of the heading', () => {
    expect(sectionOf(page, 'examples')).toContain('### Size');
  });

  it('returns null for a section the page does not have', () => {
    expect(sectionOf(page, 'Accessibility')).toBeNull();
  });
});
