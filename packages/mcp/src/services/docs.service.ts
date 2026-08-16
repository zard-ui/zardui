/**
 * A documentação de um componente, lida da página publicada.
 *
 * O registry carregava `docs` e `demos` dentro do JSON de cada componente. Isso
 * saiu por dois motivos. O primeiro é que `docs` estava morto: procurava
 * `overview.md`/`api.md`, que a biblioteca trocou por `api.ts`, e de 46
 * componentes documentados apenas um ainda tinha os arquivos antigos — para o
 * resto, este servidor respondia "sem documentação". O segundo é que o `.md` da
 * página é melhor: instalação, uso, exemplos com código e referência de API num
 * documento coerente, que é como um modelo lê bem, em vez de fragmentos soltos.
 *
 * A base é configurável porque um registry de terceiros não tem essas páginas;
 * o site oficial é o padrão.
 */

import { assertRegistryId } from '../utils/identifiers.js';

const DOCS_TTL = 5 * 60 * 1000;
const FETCH_TIMEOUT = 10_000;

class DocsService {
  private cache = new Map<string, { text: string; timestamp: number }>();

  private get baseUrl(): string {
    return (process.env['ZARD_DOCS_URL'] || 'https://zardui.com').replace(/\/+$/, '');
  }

  urlFor(name: string): string {
    // O nome vira caminho, então passa pela mesma validação do registry: sem
    // isto, `../../algo` sairia de /docs/components e traria outra página.
    return `${this.baseUrl}/docs/components/${assertRegistryId(name, 'component')}`;
  }

  /** O markdown da página, ou null quando ela não existe. */
  async getComponentMarkdown(name: string): Promise<string | null> {
    const url = `${this.urlFor(name)}.md`;

    const cached = this.cache.get(name);
    if (cached && Date.now() - cached.timestamp < DOCS_TTL) return cached.text;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'zard-mcp' },
      });

      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const text = await response.text();

      // O site é uma SPA: um caminho que não existe volta 200 com o HTML do
      // próprio site, não 404. Sem esta checagem, pedir a documentação de um
      // componente inexistente entregava cinquenta kB de markup ao modelo, que
      // é pior do que não responder — ele gasta contexto e não diz o que houve.
      if (!isMarkdown(response, text)) return null;

      this.cache.set(name, { text, timestamp: Date.now() });
      return text;
    } finally {
      clearTimeout(timeout);
    }
  }
}

/**
 * Se a resposta é mesmo a página em markdown.
 *
 * O content-type decide quando existe — o site serve `text/markdown` para os
 * `.md` e `text/html` para a SPA. Quando não vem, o começo do corpo desempata:
 * a página gerada abre com o front matter ou com um cabeçalho, nunca com uma
 * tag.
 */
function isMarkdown(response: Response, body: string): boolean {
  const type = response.headers.get('content-type') ?? '';

  if (type.includes('text/markdown') || type.includes('text/plain')) return true;
  if (type.includes('text/html')) return false;

  return !/^\s*<(!doctype|html)/i.test(body);
}

/**
 * Recorta uma seção de nível 2 do markdown, com as subseções dela.
 *
 * Vai até o próximo `## ` ou até o fim. Serve para entregar só os exemplos a
 * quem pediu exemplos, sem mandar o documento inteiro de volta.
 */
export function sectionOf(markdown: string, heading: string): string | null {
  const lines = markdown.split('\n');
  const start = lines.findIndex(line => line.trim().toLowerCase() === `## ${heading.toLowerCase()}`);

  if (start === -1) return null;

  const rest = lines.slice(start + 1);
  const end = rest.findIndex(line => line.startsWith('## '));

  return [lines[start], ...(end === -1 ? rest : rest.slice(0, end))].join('\n').trim();
}

export const docsService = new DocsService();
