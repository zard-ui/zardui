import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import { Injectable } from '@angular/core';
import remarkRehype from 'remark-rehype';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

@Injectable({
  providedIn: 'root',
})
export class CodeHighlightService {
  private processor: any;
  private initialized = false;

  async initializeProcessor(showLineNumbers: boolean = false) {
    this.processor = unified()
      .use(remarkParse, { fragment: true })
      .use(remarkRehype)
      .use(rehypePrettyCode, {
        theme: {
          dark: 'github-dark',
          light: 'github-light',
        },
        keepBackground: false,
        ...(showLineNumbers && {
          onVisitLine(node: any) {
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className = ['line', 'line--highlighted'];
          },
          onVisitHighlightedChars(node: any) {
            node.properties.className = ['word', 'word--highlighted'];
          },
        }),
      })
      .use(rehypeStringify);

    this.initialized = true;
  }

  async highlightCode(code: string, language: string, showLineNumbers: boolean = false): Promise<string> {
    await this.initializeProcessor(showLineNumbers);

    const languageTag = showLineNumbers ? `${language} showLineNumbers` : language;
    const markdown = `\`\`\`${languageTag}\n${code}\n\`\`\``;

    try {
      const result = await this.processor.process(markdown);
      return result.toString();
    } catch (error) {
      console.error('Error highlighting code:', error);
      return `<pre><code>${this.escapeHtml(code)}</code></pre>`;
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
