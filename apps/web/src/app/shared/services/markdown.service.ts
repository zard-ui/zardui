import { Injectable } from '@angular/core';

import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import { rehypeComponentBadges } from './rehype-component-badges';
import { rehypeEnhancedCode, rehypeCodeTabs } from './rehype-enhanced-code';
import { rehypeNotTypeset, rehypeScrollableTables } from './rehype-typeset';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  private processor: any;
  private initialized = false;

  async initializeProcessor() {
    if (this.initialized) return;

    this.processor = unified()
      .use(remarkParse, { fragment: true })
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypePrettyCode, {
        theme: {
          dark: 'github-dark',
          light: 'github-light',
        },
        keepBackground: false,
        // Remove the default copy button transformer since we'll handle it in our custom plugin
      })
      .use(rehypeCodeTabs) // Our custom plugin for code tabs (BEFORE rehypeEnhancedCode)
      .use(rehypeEnhancedCode) // Our custom plugin for enhanced code blocks
      .use(rehypeNotTypeset) // Keep typeset off the code block it just built
      .use(rehypeScrollableTables) // Wrap tables so a wide one scrolls instead of squashing
      .use(rehypeComponentBadges) // Add classes to component badges in API docs (AFTER table wrapper)
      .use(rehypeStringify);

    this.initialized = true;
  }

  async processMarkdown(markdown: string): Promise<string> {
    await this.initializeProcessor();
    const result = await this.processor.process(markdown);
    return result.toString();
  }
}
