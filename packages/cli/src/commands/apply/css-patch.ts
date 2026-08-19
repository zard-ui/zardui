/**
 * A troca cirúrgica dos tokens dentro de um CSS que já existe.
 *
 * O `init` reescreve o arquivo inteiro, e isso é aceitável lá: ele avisa, pede
 * confirmação e roda num projeto que está começando. O `apply` roda num projeto
 * vivo, onde o CSS global acumulou meses de coisas — uma fonte importada, uma
 * classe de utilidade, um `@media print`. Substituir o arquivo apagaria tudo
 * isso para trocar uma cor.
 *
 * Então o que se troca são exatamente três coisas: o corpo de `:root`, o corpo
 * de `.dark` e o valor de `--radius`. Tudo o mais fica onde está, byte a byte —
 * inclusive o que estiver escrito dentro desses dois blocos e não for um token
 * nosso.
 */

const BLOCK_TIMEOUT_GUARD = 1_000_000;

export interface CssPatchResult {
  readonly css: string;
  /** O que foi trocado, para o relatório. */
  readonly changed: readonly string[];
}

export class CssPatchError extends Error {
  constructor(
    readonly reason: 'no-root' | 'no-dark',
    message: string,
  ) {
    super(message);
    this.name = 'CssPatchError';
  }
}

/**
 * O corpo de um bloco, achado contando chaves.
 *
 * Regex não serve aqui: o CSS do Tailwind 4 tem blocos aninhados (`@layer base
 * { * { … } }`), e `\{([^}]*)\}` para na primeira chave de fechamento, que pode
 * ser de um bloco interno. Contar é a única leitura que não depende de o arquivo
 * ser simples.
 */
function findBlock(css: string, selector: string): { start: number; end: number } | null {
  const pattern = new RegExp(`(^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`, 'g');
  const match = pattern.exec(css);
  if (!match) return null;

  const open = css.indexOf('{', match.index);
  let depth = 0;

  for (let index = open; index < css.length && index - open < BLOCK_TIMEOUT_GUARD; index++) {
    const char = css[index];
    if (char === '{') depth++;
    else if (char === '}') {
      depth--;
      if (depth === 0) return { start: open + 1, end: index };
    }
  }

  return null;
}

/** As declarações de um bloco, indexadas pela propriedade. */
function declarationsOf(body: string): Map<string, string> {
  const declarations = new Map<string, string>();

  for (const line of body.split('\n')) {
    const match = /^\s*(--[a-z0-9-]+)\s*:\s*(.+?);\s*$/i.exec(line);
    if (match) declarations.set(match[1] as string, match[2] as string);
  }

  return declarations;
}

/**
 * O bloco reescrito: os tokens novos no lugar dos antigos, o resto intacto.
 *
 * Uma declaração que o preset não conhece — algo que a pessoa acrescentou ali —
 * é preservada onde está. Ela não é nossa para apagar, e apagá-la seria a
 * diferença entre "trocou o tema" e "perdi o meu CSS".
 */
function rewriteBlock(body: string, tokens: Map<string, string>): string {
  const seen = new Set<string>();
  const indent = /\n(\s+)--/.exec(body)?.[1] ?? '  ';

  const lines = body.split('\n').map(line => {
    const match = /^(\s*)(--[a-z0-9-]+)(\s*:\s*)(.+?)(;\s*)$/i.exec(line);
    if (!match) return line;

    const property = match[2] as string;
    const replacement = tokens.get(property);
    if (replacement === undefined) return line;

    seen.add(property);
    return `${match[1]}${property}${match[3]}${replacement}${match[5]}`;
  });

  // Um token que o bloco ainda não declarava entra no fim. É o que faz um tema
  // ganhar uma variável nova sem exigir que todo mundo reinicialize o projeto.
  const added = [...tokens.entries()]
    .filter(([property]) => !seen.has(property))
    .map(([property, value]) => `${indent}${property}: ${value};`);

  if (added.length === 0) return lines.join('\n');

  const lastDeclaration = lines.reduce((last, line, index) => (/--[a-z0-9-]+\s*:/.test(line) ? index : last), -1);

  if (lastDeclaration === -1) return [...lines.slice(0, -1), ...added, lines[lines.length - 1] ?? ''].join('\n');

  return [...lines.slice(0, lastDeclaration + 1), ...added, ...lines.slice(lastDeclaration + 1)].join('\n');
}

export interface PatchThemeOptions {
  /** As declarações do modo claro, `--radius` incluído. */
  readonly light: Map<string, string>;
  readonly dark: Map<string, string>;
}

/**
 * Troca os tokens de `:root` e `.dark`, preservando todo o resto do arquivo.
 *
 * Levanta `CssPatchError` quando não encontra um dos dois blocos: sem eles não
 * há onde escrever, e inventar um lugar seria adivinhar a estrutura do CSS de
 * outra pessoa. O comando traduz isso em um aviso com a sugestão de `--force`.
 */
export function patchThemeCss(css: string, options: PatchThemeOptions): CssPatchResult {
  const root = findBlock(css, ':root');
  if (!root) {
    throw new CssPatchError('no-root', 'No `:root { … }` block to write the theme tokens into.');
  }

  const changed: string[] = [];

  const rootBody = css.slice(root.start, root.end);
  const patchedRoot = rewriteBlock(rootBody, options.light);
  if (patchedRoot !== rootBody) changed.push(':root');

  let result = css.slice(0, root.start) + patchedRoot + css.slice(root.end);

  const dark = findBlock(result, '.dark');
  if (!dark) {
    throw new CssPatchError('no-dark', 'No `.dark { … }` block to write the dark mode tokens into.');
  }

  const darkBody = result.slice(dark.start, dark.end);
  const patchedDark = rewriteBlock(darkBody, options.dark);
  if (patchedDark !== darkBody) changed.push('.dark');

  result = result.slice(0, dark.start) + patchedDark + result.slice(dark.end);

  return { css: result, changed };
}

/** As declarações de um bloco de tokens renderizado, prontas para o patch. */
export function tokensFrom(block: string): Map<string, string> {
  return declarationsOf(block);
}
