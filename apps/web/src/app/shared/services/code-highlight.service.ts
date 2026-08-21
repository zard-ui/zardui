import { DOCUMENT, inject, Injectable } from '@angular/core';

import rehypePrettyCode, { type CharsElement, type LineElement, type Options } from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

/**
 * Builds a processor for one line-number setting.
 *
 * The visitors that draw line numbers are baked in here, which is why the result
 * cannot be shared between the two settings.
 */
function buildProcessor(showLineNumbers: boolean) {
  const lineNumberVisitors: Options = showLineNumbers
    ? {
        onVisitLine(element: LineElement) {
          if (element.children.length === 0) {
            element.children = [{ type: 'text', value: ' ' }];
          }
        },
        onVisitHighlightedLine(element: LineElement) {
          element.properties.className = ['line', 'line--highlighted'];
        },
        onVisitHighlightedChars(element: CharsElement) {
          element.properties.className = ['word', 'word--highlighted'];
        },
      }
    : {};

  return unified()
    .use(remarkParse, { fragment: true })
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: {
        dark: 'github-dark',
        light: 'github-light',
      },
      keepBackground: false,
      ...lineNumberVisitors,
    })
    .use(rehypeStringify);
}

type CodeProcessor = ReturnType<typeof buildProcessor>;

@Injectable({
  providedIn: 'root',
})
export class CodeHighlightService {
  private readonly document = inject(DOCUMENT);

  /**
   * One processor per line-number setting.
   *
   * A single cached instance served whichever setting happened to ask first, so
   * every later block silently got the other one's configuration.
   */
  private readonly processors = new Map<boolean, CodeProcessor>();

  private processorFor(showLineNumbers: boolean): CodeProcessor {
    let processor = this.processors.get(showLineNumbers);

    if (!processor) {
      processor = buildProcessor(showLineNumbers);
      this.processors.set(showLineNumbers, processor);
    }

    return processor;
  }

  async highlightCode(code: string, language: string, showLineNumbers = false): Promise<string> {
    const languageTag = showLineNumbers ? `${language} showLineNumbers` : language;
    const markdown = `\`\`\`${languageTag}\n${code}\n\`\`\``;

    try {
      const result = await this.processorFor(showLineNumbers).process(markdown);
      return result.toString();
    } catch (error) {
      console.error('Error highlighting code:', error);
      return `<pre><code>${this.escapeHtml(code)}</code></pre>`;
    }
  }

  private escapeHtml(text: string): string {
    const div = this.document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
