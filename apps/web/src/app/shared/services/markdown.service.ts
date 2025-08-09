import { transformerCopyButton } from '@rehype-pretty/transformers';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypeStringify from 'rehype-stringify';
// src/app/services/markdown.service.ts
import { Injectable } from '@angular/core';
import remarkRehype from 'remark-rehype';
import { visit } from 'unist-util-visit';
import remarkParse from 'remark-parse';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { unified } from 'unified';

import { rehypeEnhancedCode, rehypeCodeTabs } from './rehype-enhanced-code';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  private processor: any;
  private initialized = false;

  private extractTextContent(node: any): string {
    if (!node) return '';

    if (node.type === 'text') {
      return node.value || '';
    }

    if (node.children && Array.isArray(node.children)) {
      return node.children.map((child: any) => this.extractTextContent(child)).join('');
    }

    return '';
  }

  private rehypeTailwindClasses() {
    return () => {
      return (tree: any) => {
        visit(tree, 'element', (node: any, index: any, parent: any) => {
          if (node.tagName === 'h1') {
            node.properties = {
              ...node.properties,
              style: [],
              class: ['text-4xl', 'font-semibold', 'scroll-m-20', 'tracking-tight', 'sm:text-3xl', 'xl:text-4xl'],
            };
          }

          if (node.tagName === 'h3') {
            node.properties = {
              ...node.properties,
              style: [],
              class: ['w-full', 'text-base', 'font-semibold'],
            };
          }

          if (node.tagName === 'p') {
            node.properties = {
              ...node.properties,
              style: [],
              class: ['text-base', 'leading-7', 'text-muted-foreground', '[&:not(:first-child)]:mt-6'],
            };
          }

          // Inline code styling (pre/code blocks are handled by our custom plugin)
          if (node.tagName === 'code') {
            // Check if this code is inside a pre (code block) or standalone (inline code)
            const isInPre = parent && parent.tagName === 'pre';

            if (!isInPre) {
              // Only style inline code - block code is handled by rehypeEnhancedCode
              node.properties = {
                ...node.properties,
                class: ['relative', 'rounded', 'bg-muted', 'px-[0.3rem]', 'py-[0.2rem]', 'font-mono', 'text-sm', 'font-semibold'],
              };
            }
          }

          if (node.tagName === 'figcaption') {
            node.properties = {
              ...node.properties,
              class: ['sr-only'],
            };
          }

          if (node.tagName === 'table' && parent) {
            node.properties = {
              ...node.properties,
              class: ['w-full', 'caption-bottom', 'text-sm'],
            };

            const wrapper = {
              type: 'element',
              tagName: 'div',
              properties: {
                class: ['overflow-auto', 'rounded-md', 'border', 'my-4'],
              },
              children: [node],
            };

            parent.children[index] = wrapper;
          }

          if (node.tagName === 'thead') {
            node.properties = {
              ...node.properties,
              class: ['[&_tr]:text-primary', 'bg-accent'],
            };
          }

          if (node.tagName === 'tbody') {
            node.properties = {
              ...node.properties,
              class: ['&_tr:last-child]:border-0', 'bg-accent/20'],
            };
          }

          if (node.tagName === 'tfoot') {
            node.properties = {
              ...node.properties,
              class: ['border-t', 'bg-muted/50', 'font-medium', '[&>tr]:last:border-b-0'],
            };
          }

          if (node.tagName === 'tr') {
            node.properties = {
              ...node.properties,
              class: ['transition-colors', 'hover:bg-muted/50'],
            };
          }

          if (node.tagName === 'th') {
            node.properties = {
              ...node.properties,
              class: ['h-12', 'px-4', 'text-left', 'align-middle', 'font-medium;'],
            };
          }

          if (node.tagName === 'td') {
            node.properties = {
              ...node.properties,
              class: [
                'p-4',
                'align-middle',
                'text-left',
                'align-middle',
                'font-medium',
                'first:[&_code]:bg-blue-500/10',
                'first:[&_code]:text-blue-600',
                'first:[&_code]:dark:text-blue-400',
                '[&_code]:bg-accent',
                '[&_code]:rounded-sm',
                '[&_code]:border-none',
                '[&_code]:font-sans',
                '[&_code]:whitespace-nowrap',
                '[&_code]:rounded',
                '[&_code]:border-ring',
                '[&_code]:border',
                '[&_code]:bg-muted',
                '[&_code]:text-xs',
                '[&_code]:py-1',
                '[&_code]:px-2',
                '[&_code]:mx-1',
              ],
            };
          }

          if (node.tagName === 'caption') {
            node.properties = {
              ...node.properties,
              class: ['mt-4', 'text-sm', 'text-muted-foreground'],
            };
          }

          if (node.tagName === 'h5') {
            node.properties = {
              ...node.properties,
              class: ['text-xl', 'font-semibold', 'mt-4', 'text-primary'],
            };
          }
        });
      };
    };
  }

  async initializeProcessor() {
    if (this.initialized) return;

    this.processor = unified()
      .use(remarkParse, { fragment: true })
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeCodeTitles, {})
      .use(rehypePrettyCode, {
        theme: {
          dark: 'github-dark',
          light: 'github-light',
        },
        keepBackground: false,
        // Remove the default copy button transformer since we'll handle it in our custom plugin
      })
      .use(rehypeEnhancedCode) // Our custom plugin for enhanced code blocks
      .use(rehypeCodeTabs) // Our custom plugin for code tabs
      .use(this.rehypeTailwindClasses())
      .use(rehypeStringify);

    this.initialized = true;
  }

  async processMarkdown(markdown: string): Promise<string> {
    await this.initializeProcessor();
    const result = await this.processor.process(markdown);
    return result.toString();
  }
}
