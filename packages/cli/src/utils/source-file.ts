/**
 * Edições de código-fonte que mais de um passo do init precisa fazer.
 *
 * Inserir um import parece trivial até o arquivo estar em CRLF: um `\n` cru
 * gera terminações misturadas, faz o git marcar o arquivo inteiro como alterado
 * e — quando a expressão que procura os imports esquece o `\r` — emenda a linha
 * nova no fim da anterior.
 */

/** A quebra de linha que o arquivo já usa. */
export function lineEndingOf(content: string): string {
  return content.includes('\r\n') ? '\r\n' : '\n';
}

/** O último `import ... from '...'` do arquivo, ou null se não houver nenhum. */
function lastImport(content: string): RegExpExecArray | null {
  // `[\s\S]*?` em vez de `.*`: a lista de símbolos importados quebra em várias
  // linhas com frequência, e um padrão preso a uma linha só não a alcançava —
  // num arquivo assim o import novo era jogado para antes de todos os outros.
  const importRegex = /^import\s[\s\S]*?from\s+'[^']*';\r?\n?/gm;

  let last: RegExpExecArray | null = null;
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content)) !== null) last = match;

  return last;
}

/**
 * Insere uma linha de import logo depois do último import do arquivo.
 *
 * Devolve o conteúdo intocado quando o import já está lá, para que chamar duas
 * vezes seja o mesmo que chamar uma.
 */
export function withImport(content: string, importLine: string): string {
  if (content.includes(importLine)) return content;

  const eol = lineEndingOf(content);
  const last = lastImport(content);

  if (!last) return importLine + eol + content;

  const end = last.index + last[0].length;
  const alreadyBroken = /\r?\n$/.test(last[0]);

  return content.slice(0, end) + (alreadyBroken ? '' : eol) + importLine + eol + content.slice(end);
}

/** Onde um literal de array começa e termina, em índices do conteúdo. */
export interface ArrayRange {
  /** Índice do `[` que abre. */
  readonly open: number;
  /** Índice do `]` que fecha. */
  readonly close: number;
  /** O que está entre os dois, sem os colchetes. */
  readonly body: string;
}

/**
 * O intervalo do array atribuído a `key`, achado contando colchetes.
 *
 * Uma expressão regular para no primeiro `]` que aparece, e em código real esse
 * `]` costuma ser o de um array aninhado — `withInterceptors([...])` num
 * `providers`, um plugin com opções num `plugins`. O que fosse inserido ali
 * caía dentro do array errado, e o build quebrava com um erro de tipo que não
 * menciona ZardUI em lugar nenhum.
 *
 * Strings e comentários são pulados, para que um `]` escrito dentro deles não
 * conte como fechamento.
 */
export function arrayRange(content: string, key: string): ArrayRange | null {
  const opening = new RegExp(`\\b${key}\\s*:\\s*\\[`).exec(content);

  if (!opening) return null;

  const open = opening.index + opening[0].length - 1;
  let depth = 0;

  for (let index = open; index < content.length; index++) {
    const skipped = skipStringOrComment(content, index);

    if (skipped !== index) {
      index = skipped - 1;
      continue;
    }

    const char = content[index];

    if (char === '[') depth++;
    else if (char === ']' && --depth === 0) {
      return { open, close: index, body: content.slice(open + 1, index) };
    }
  }

  return null;
}

/**
 * O índice logo após a string ou o comentário que começa em `index`.
 *
 * Devolve o próprio `index` quando não há nenhum ali — quem chama usa isso para
 * saber que o caractere é código e deve ser considerado.
 */
function skipStringOrComment(content: string, index: number): number {
  const char = content[index];
  const next = content[index + 1];

  if (char === '/' && next === '/') {
    const end = content.indexOf('\n', index);
    return end === -1 ? content.length : end;
  }

  if (char === '/' && next === '*') {
    const end = content.indexOf('*/', index + 2);
    return end === -1 ? content.length : end + 2;
  }

  if (char !== '"' && char !== "'" && char !== '`') return index;

  for (let cursor = index + 1; cursor < content.length; cursor++) {
    if (content[cursor] === '\\') {
      cursor++;
      continue;
    }
    if (content[cursor] === char) return cursor + 1;
  }

  return content.length;
}
