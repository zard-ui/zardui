/**
 * Shiki is replaced by a small fake here: the `highlightCode()` logic (language resolution, lazy loading, ANSI per
 * line, blank lines, plain-text fallback) is what is under test. The real grammars are exercised by the docs page
 * (E2E: highlighting and terminal demos) because Jest cannot load Shiki's ES modules without transforming its whole
 * dependency tree.
 */
const mockLoadLanguage = jest.fn((): Promise<void> => Promise.resolve());
const mockCodeToTokens = jest.fn((code: string, options: { lang: string }) => ({
  tokens: code.split('\n').map(line =>
    line === ''
      ? []
      : [
          {
            content: line,
            htmlStyle: { '--shiki-light': `light-${options.lang}`, '--shiki-dark': `dark-${options.lang}` },
          },
        ],
  ),
}));
const mockCreateHighlighterCore = jest.fn(() =>
  Promise.resolve({
    loadLanguage: mockLoadLanguage,
    getLoadedLanguages: () => [],
    codeToTokens: mockCodeToTokens,
  }),
);
const mockCreateJavaScriptRegexEngine = jest.fn(() => ({ engine: 'javascript' }));

jest.mock('shiki/core', () => ({ createHighlighterCore: mockCreateHighlighterCore }));
jest.mock('shiki/engine/javascript', () => ({ createJavaScriptRegexEngine: mockCreateJavaScriptRegexEngine }));

import { highlightCode } from './code-block.highlight';

const text = (line: readonly { content: string }[]) => line.map(token => token.content).join('');

describe('highlightCode', () => {
  beforeEach(() => {
    mockCodeToTokens.mockClear();
  });

  it('returns one list of tokens per line', async () => {
    const lines = await highlightCode('const a = 1;\nconst b = 2;', 'typescript');

    expect(lines).toHaveLength(2);
    expect(text(lines[0])).toBe('const a = 1;');
    expect(text(lines[1])).toBe('const b = 2;');
  });

  it('keeps the light and dark colors of every token as CSS custom properties', async () => {
    const [line] = await highlightCode('const a = 1;', 'ts');

    expect(line[0].style).toEqual({ '--shiki-light': 'light-typescript', '--shiki-dark': 'dark-typescript' });
  });

  it('asks Shiki for both themes and no default color, so the page theme decides', async () => {
    await highlightCode('a', 'json');

    expect(mockCodeToTokens).toHaveBeenCalledWith('a', {
      lang: 'json',
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    });
  });

  it('keeps blank lines as empty token lists', async () => {
    const lines = await highlightCode('a\n\nb', 'javascript');

    expect(lines).toHaveLength(3);
    expect(lines[1]).toEqual([]);
  });

  it('ignores one trailing newline', async () => {
    expect(await highlightCode('{"a": 1}\n', 'json')).toHaveLength(1);
    expect(await highlightCode('a\n\n', 'json')).toHaveLength(2);
  });

  describe('languages', () => {
    it('resolves aliases and any letter case to the language name', async () => {
      await highlightCode('echo hi', 'sh');
      await highlightCode('echo hi', 'BASH');
      await highlightCode('a: 1', 'yml');

      expect(mockCodeToTokens.mock.calls.map(([, options]) => options.lang)).toEqual(['bash', 'bash', 'yaml']);
    });

    it('creates one highlighter with the JavaScript regex engine and no WASM', async () => {
      await highlightCode('a', 'css');
      await highlightCode('b', 'html');

      // one highlighter for the whole session, whatever the languages
      expect(mockCreateHighlighterCore).toHaveBeenCalledTimes(1);
      expect(mockCreateJavaScriptRegexEngine).toHaveBeenCalledWith({ forgiving: true });
      expect(mockCreateHighlighterCore).toHaveBeenCalledWith(
        expect.objectContaining({ langs: [], engine: { engine: 'javascript' } }),
      );
    });

    it('loads a grammar on first use only', async () => {
      mockLoadLanguage.mockClear();

      const [first, second] = await Promise.all([highlightCode('a = 1', 'python'), highlightCode('a = 1', 'py')]);

      expect(first).toEqual(second);
      expect(mockLoadLanguage).toHaveBeenCalledTimes(1);
    });

    it('falls back to plain text for a language that is not listed, without loading anything', async () => {
      mockLoadLanguage.mockClear();
      const lines = await highlightCode('some code\n\nmore', 'brainfuck');

      expect(lines).toEqual([[{ content: 'some code' }], [], [{ content: 'more' }]]);
      expect(mockLoadLanguage).not.toHaveBeenCalled();
    });

    it.each(['__proto__', 'constructor', 'toString', 'hasOwnProperty'])(
      'treats the inherited property "%s" as an unknown language',
      async name => {
        mockLoadLanguage.mockClear();

        await expect(highlightCode('a', name)).resolves.toEqual([[{ content: 'a' }]]);
        expect(mockLoadLanguage).not.toHaveBeenCalled();
      },
    );

    it('lets the promise reject when a grammar cannot be loaded, and retries the next time', async () => {
      mockLoadLanguage.mockRejectedValueOnce(new Error('chunk failed'));

      await expect(highlightCode('SELECT 1', 'sql')).rejects.toThrow('chunk failed');
      await expect(highlightCode('SELECT 1', 'sql')).resolves.toHaveLength(1);
    });
  });

  it('does not cache a failed highlighter, so the next call tries again', async () => {
    mockCreateHighlighterCore.mockRejectedValueOnce(new Error('theme failed'));

    // a fresh copy of the module, whose highlighter has not been created yet
    await jest.isolateModulesAsync(async () => {
      const fresh = await import('./code-block.highlight');

      await expect(fresh.highlightCode('a', 'css')).rejects.toThrow('theme failed');
      await expect(fresh.highlightCode('a', 'css')).resolves.toHaveLength(1);
    });
  });

  describe('ansi', () => {
    it('is tokenized without loading a grammar', async () => {
      mockLoadLanguage.mockClear();
      await highlightCode('\u001b[31mfailed\u001b[0m', 'ansi');

      expect(mockLoadLanguage).not.toHaveBeenCalled();
      expect(mockCodeToTokens.mock.calls[0][1].lang).toBe('ansi');
    });

    it('tokenizes each line on its own so colors do not carry over', async () => {
      const lines = await highlightCode('\u001b[31mred\nplain\n\nlast', 'ansi');

      expect(mockCodeToTokens).toHaveBeenCalledTimes(4);
      expect(mockCodeToTokens.mock.calls.map(([code]) => code)).toEqual(['\u001b[31mred', 'plain', '', 'last']);
      expect(lines).toHaveLength(4);
      expect(lines[2]).toEqual([]);
    });
  });

  it('does not use the DOM, so it can run during SSR', async () => {
    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;
    // @ts-expect-error simulating a server environment
    delete globalThis.window;
    // @ts-expect-error simulating a server environment
    delete globalThis.document;

    try {
      const lines = await highlightCode('{"ssr": true}', 'json');
      expect(text(lines[0])).toBe('{"ssr": true}');
    } finally {
      globalThis.window = originalWindow;
      globalThis.document = originalDocument;
    }
  });
});
