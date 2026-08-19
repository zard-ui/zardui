import { logger } from '@cli/utils/logger.js';
import { lineEndingOf } from '@cli/utils/source-file.js';
import { existsSync } from 'fs';
import * as fsPromises from 'fs/promises';

const TYPESET_IMPORT = "@import './typeset.css';";

/** Todo `@import` de CSS do arquivo, na ordem em que aparecem. */
function cssImports(content: string): RegExpExecArray[] {
  // O `url(...)` e a lista de media query são opcionais e vão até o `;`, então
  // o padrão fecha no ponto e vírgula em vez de fechar na aspa: um
  // `@import 'x' layer(base);` também precisa ser reconhecido como o último.
  const importRegex = /^[ \t]*@import\s[^;]*;/gm;

  const matches: RegExpExecArray[] = [];
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content)) !== null) matches.push(match);

  return matches;
}

/**
 * Liga o typeset importando-o no CSS global do projeto.
 *
 * O arquivo foi gravado ao lado desse CSS, mas um arquivo que ninguém importa
 * não estiliza nada — e a ordem importa: entrar depois dos outros `@import`
 * deixa o typeset ver os tokens do tema, que é de onde ele tira cor e raio.
 *
 * Chamar duas vezes é o mesmo que chamar uma; um `add typeset` repetido não
 * pode duplicar a linha.
 */
export async function setupTypeset(tailwindCssPath: string): Promise<void> {
  if (!existsSync(tailwindCssPath)) {
    logger.warn(`${tailwindCssPath} not found. Import typeset.css in your global stylesheet manually.`);
    return;
  }

  const content = await fsPromises.readFile(tailwindCssPath, 'utf8');

  if (content.includes('typeset.css')) {
    logger.info('Typeset already imported in your global stylesheet.');
    return;
  }

  const imports = cssImports(content);
  const last = imports[imports.length - 1];

  // Sem nenhum `@import` para se ancorar, não há posição segura: antes de uma
  // `@layer` ou de um `@charset` o import é inválido, e adivinhar corromperia
  // o CSS de quem instalou. Melhor uma linha para copiar do que um arquivo
  // quebrado.
  if (!last) {
    logger.warn(`No @import found in ${tailwindCssPath}. Add \`${TYPESET_IMPORT}\` to it manually.`);
    return;
  }

  const eol = lineEndingOf(content);
  const end = last.index + last[0].length;
  const updated = content.slice(0, end) + eol + TYPESET_IMPORT + content.slice(end);

  await fsPromises.writeFile(tailwindCssPath, updated, 'utf8');
  logger.info('Typeset imported in your global stylesheet.');
}
