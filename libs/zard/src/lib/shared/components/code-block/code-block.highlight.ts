import type { HighlighterCore } from 'shiki/core';

import type { ZardCodeBlockLineTokens } from './code-block.types';

/**
 * Optional syntax highlighting for `z-code-block`, powered by Shiki.
 *
 * - Shiki is only reached through dynamic `import()` calls, so an application that never calls `highlightCode()` does
 *   not bundle it, and each grammar is its own chunk that loads the first time its language is used.
 * - It uses Shiki's JavaScript regex engine: no WASM file to ship or load.
 * - Nothing here touches the DOM, so it runs on the server (SSR / prerendering) as well as in the browser.
 * - It returns tokens, not HTML. `z-code-block-line` renders them with Angular bindings (text interpolation and style
 *   bindings), so no markup string is ever injected and no sanitizer has to be bypassed.
 *
 * Add the languages you need to `LANGUAGES`; a language that is not listed renders as plain text.
 */
const LANGUAGES = {
  'angular-html': () => import('shiki/langs/angular-html.mjs'),
  'angular-ts': () => import('shiki/langs/angular-ts.mjs'),
  bash: () => import('shiki/langs/shellscript.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  diff: () => import('shiki/langs/diff.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  scss: () => import('shiki/langs/scss.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
};

const ALIASES: Record<string, keyof typeof LANGUAGES> = {
  js: 'javascript',
  md: 'markdown',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  shellscript: 'bash',
  ts: 'typescript',
  yml: 'yaml',
  zsh: 'bash',
};

const THEMES = { light: 'github-light', dark: 'github-dark' } as const;

let highlighter: Promise<HighlighterCore> | undefined;
const loadingLanguages = new Map<string, Promise<void>>();

function getHighlighter(): Promise<HighlighterCore> {
  highlighter ??= Promise.all([import('shiki/core'), import('shiki/engine/javascript')]).then(
    ([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
      createHighlighterCore({
        themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
        langs: [],
        engine: createJavaScriptRegexEngine({ forgiving: true }),
      }),
  );

  return highlighter;
}

function resolveLanguage(language: string): keyof typeof LANGUAGES | 'ansi' | null {
  const name = language.trim().toLowerCase();

  if (name === 'ansi') {
    return name;
  }

  if (name in LANGUAGES) {
    return name as keyof typeof LANGUAGES;
  }

  return ALIASES[name] ?? null;
}

async function loadLanguage(shiki: HighlighterCore, language: keyof typeof LANGUAGES): Promise<void> {
  if (shiki.getLoadedLanguages().includes(language)) {
    return;
  }

  let loading = loadingLanguages.get(language);

  if (!loading) {
    loading = shiki.loadLanguage(LANGUAGES[language]()).catch((error: unknown) => {
      loadingLanguages.delete(language);
      throw error;
    });
    loadingLanguages.set(language, loading);
  }

  await loading;
}

function plainLines(code: string): ZardCodeBlockLineTokens[] {
  return code.split('\n').map(line => (line === '' ? [] : [{ content: line }]));
}

/**
 * Highlights `code` and returns one list of tokens per line, ready for `<z-code-block-line [zTokens]="line" />`.
 *
 * - `language` is a language of the list above (`'typescript'`, `'json'`, `'bash'`...), one of its aliases (`'ts'`,
 *   `'sh'`...) or `'ansi'` for terminal output. Anything else resolves with plain, unstyled lines.
 * - One trailing newline is ignored, so it does not render as an extra empty line.
 * - Blank lines are kept (an empty token list).
 * - ANSI colors do not carry from one line to the next: each line is tokenized on its own.
 * - Colors come in a light and a dark variant (`--shiki-light` / `--shiki-dark`); the line component picks one with the
 *   `dark:` variant, so the output follows the theme without being highlighted again.
 *
 * The promise rejects if Shiki or a grammar cannot be loaded (for instance when the `shiki` package is not installed).
 */
export async function highlightCode(code: string, language: string): Promise<ZardCodeBlockLineTokens[]> {
  const source = code.endsWith('\n') ? code.slice(0, -1) : code;
  const resolved = resolveLanguage(language);

  if (!resolved) {
    return plainLines(source);
  }

  const shiki = await getHighlighter();

  if (resolved !== 'ansi') {
    await loadLanguage(shiki, resolved);
  }

  const tokenize = (text: string) =>
    shiki.codeToTokens(text, { lang: resolved, themes: THEMES, defaultColor: false }).tokens;

  const lines = resolved === 'ansi' ? source.split('\n').flatMap(line => tokenize(line)) : tokenize(source);

  return lines.map(line =>
    line
      .filter(token => token.content !== '')
      .map(token =>
        token.htmlStyle ? { content: token.content, style: token.htmlStyle } : { content: token.content },
      ),
  );
}
