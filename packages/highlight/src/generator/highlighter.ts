import { createHighlighter, type Highlighter } from 'shiki';

let highlighterInstance: Highlighter | null = null;

const THEMES = ['github-dark', 'github-light'] as const;

const LANGUAGES = [
  'typescript',
  'javascript',
  'html',
  'css',
  'json',
  'bash',
  'shell',
  'angular-ts',
  'angular-html',
] as const;

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: [...THEMES],
      langs: [...LANGUAGES],
    });
  }
  return highlighterInstance;
}

export async function highlightCode(code: string, lang: string, highlightLines?: number[]): Promise<string> {
  const highlighter = await getHighlighter();

  const resolvedLang = resolveLanguage(lang);

  const lines = code.split('\n');
  const decorations = highlightLines?.map(line => ({
    start: { line: line - 1, character: 0 },
    end: { line: line - 1, character: lines[line - 1]?.length ?? 0 },
    properties: { class: 'highlighted' },
  }));

  return highlighter.codeToHtml(code, {
    lang: resolvedLang,
    themes: {
      dark: 'github-dark',
      light: 'github-light',
    },
    defaultColor: false,
    decorations,
  });
}

function resolveLanguage(lang: string): string {
  const aliases: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    sh: 'bash',
    zsh: 'bash',
  };
  return aliases[lang] ?? lang;
}

export function disposeHighlighter(): void {
  if (highlighterInstance) {
    highlighterInstance.dispose();
    highlighterInstance = null;
  }
}
