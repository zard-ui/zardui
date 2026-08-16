import { docsService, sectionOf } from './docs.service.js';

/**
 * The component name becomes the page's path, so it carries the same risk as
 * the registry: without validation, `../../something` leaves /docs/components
 * and brings back a different page to the model.
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
 * The site is a single-page app: a path that does not exist answers 200 with
 * the site's own HTML, not 404. Treating that as success handed fifty kB of
 * markup to the model instead of an answer — found by running the server
 * against production before publishing it.
 */
describe('docsService when the page does not exist', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  const respond = (body: string, contentType: string, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    statusText: '',
    headers: { get: (h: string) => (h.toLowerCase() === 'content-type' ? contentType : null) },
    text: async () => body,
  });

  it('treats the SPA fallback as a missing page, not as documentation', async () => {
    fetchMock.mockResolvedValue(respond('<!DOCTYPE html><html lang="en"><head>…', 'text/html; charset=utf-8'));

    await expect(docsService.getComponentMarkdown('nao-existe')).resolves.toBeNull();
  });

  it('still returns a real markdown page', async () => {
    fetchMock.mockResolvedValue(respond('# Button\n\n## Installation\n', 'text/markdown; charset=utf-8'));

    await expect(docsService.getComponentMarkdown('button-real')).resolves.toContain('## Installation');
  });

  it('falls back to sniffing the body when there is no content-type', async () => {
    fetchMock.mockResolvedValue(respond('<html><body>nope</body></html>', ''));
    await expect(docsService.getComponentMarkdown('sem-tipo-html')).resolves.toBeNull();

    fetchMock.mockResolvedValue(respond('# Card\n', ''));
    await expect(docsService.getComponentMarkdown('sem-tipo-md')).resolves.toContain('# Card');
  });

  it('reports a real 404 as missing too', async () => {
    fetchMock.mockResolvedValue(respond('', 'text/html', 404));

    await expect(docsService.getComponentMarkdown('quatro-zero-quatro')).resolves.toBeNull();
  });
});

/**
 * A component's page is a single document, with installation, usage, examples
 * and API. Whoever asks for examples should get examples, not the whole thing.
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
