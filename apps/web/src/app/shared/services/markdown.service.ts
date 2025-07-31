import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

// src/app/services/markdown.service.ts
import { Injectable } from '@angular/core';
import { transformerCopyButton } from '@rehype-pretty/transformers';

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

          if (node.tagName === 'p') {
            node.properties = {
              ...node.properties,
              style: [],
              class: ['text-base', 'leading-7', 'text-muted-foreground', '[&:not(:first-child)]:mt-6'],
            };
          }

          if (node.tagName === 'pre') {
            node.properties = {
              ...node.properties,
              style: [],
              class: ['relative', 'overflow-x-auto', 'no-scrollbar', 'rounded-lg', 'bg-code', 'px-4', 'py-3', 'text-sm', 'mb-4', 'group', '[&>code]:bg-transparent'],
            };
          }

          if (node.tagName === 'code') {
            // Check if this code is inside a pre (code block) or standalone (inline code)
            const isInPre = parent && parent.tagName === 'pre';

            if (isInPre) {
              // Code inside pre blocks - no additional styling, let syntax highlighting handle it
              node.properties = {
                ...node.properties,
                class: ['font-mono', 'text-sm'],
              };
            } else {
              // Inline code styling
              node.properties = {
                ...node.properties,
                class: ['relative', 'rounded', 'bg-muted', 'px-[0.3rem]', 'py-[0.2rem]', 'font-mono', 'text-sm', 'font-semibold'],
              };
            }
          }

          if (node.tagName === 'button') {
            const replaceSpanClasses = (children: any[], mapping: Record<string, string>) => {
              return (
                children?.map(child => {
                  if (child.tagName === 'span' && child.properties?.className) {
                    return {
                      ...child,
                      properties: {
                        ...child.properties,
                        className: child.properties.className.map((cls: string) => mapping[cls] || cls),
                      },
                    };
                  }
                  return child;
                }) || []
              );
            };

            const classMapping: Record<string, string> = {
              ready: 'icon-clipboard',
              success: 'icon-check',
            };

            node.properties = {
              ...node.properties,
              className: [
                'absolute',
                'right-4',
                'top-3',
                'z-10',
                'h-6',
                'w-6',
                'text-muted-foreground',
                'hover:text-foreground',
                'transition-all',
                'hover:bg-muted',
                'cursor-pointer',
                'rounded-md',
                'bg-transparent',
                'p-1',
                'text-xs',
                'flex',
                'items-center',
                'justify-center',
              ],
            };

            node.children = replaceSpanClasses(node.children, classMapping);
          }

          if (node.tagName === 'h3') {
            const headingText = node.children
              .filter((child: { type: string }) => child.type === 'text')
              .map((child: { value: any }) => child.value)
              .join('');

            let icon = null;
            if (headingText.endsWith('.component.ts')) {
              icon = {
                type: 'element',
                tagName: 'img',
                properties: {
                  src: '/icons/angular-component.svg',
                  class: 'w-5 h-5 inline mr-2',
                  alt: 'Angular',
                },
                children: [],
              };
            } else if (headingText.endsWith('.service.ts')) {
              icon = {
                type: 'element',
                tagName: 'img',
                properties: {
                  src: '/icons/angular-service.svg',
                  class: 'w-5 h-5 inline mr-2',
                  alt: 'Angular',
                },
                children: [],
              };
            } else if (headingText.endsWith('.directive.ts')) {
              icon = {
                type: 'element',
                tagName: 'img',
                properties: {
                  src: '/icons/angular-directive.svg',
                  class: 'w-5 h-5 inline mr-2',
                  alt: 'Angular',
                },
                children: [],
              };
            } else if (headingText.endsWith('.html')) {
              icon = {
                type: 'element',
                tagName: 'img',
                properties: {
                  src: '/icons/html.svg',
                  class: 'w-5 h-5 inline mr-2',
                  alt: 'HTML',
                },
                children: [],
              };
            } else if (headingText.endsWith('.ts') && !headingText.includes('.component.') && !headingText.includes('.service.') && !headingText.includes('.directive.')) {
              // Apenas .ts "puro" - sem outros sufixos específicos do Angular
              icon = {
                type: 'element',
                tagName: 'img',
                properties: {
                  src: '/icons/ts-blue.svg',
                  class: 'w-5 h-5 inline mr-2',
                  alt: 'TypeScript',
                },
                children: [],
              };
            }

            // Adiciona a classe ao h3
            node.properties = {
              ...node.properties,
              class: ['w-full', 'text-base', 'font-semibold'],
            };

            // Se tiver ícone, insere como primeiro filho do h3
            if (icon) {
              node.children.unshift(icon);
            }

            // Cria o wrapper
            const wrapper = {
              type: 'element',
              tagName: 'div',
              properties: {
                class: ['overflow-auto', 'my-4'],
              },
              children: [node],
            };

            parent.children[index] = wrapper;
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
              class: ['order-b', 'transition-colors', 'hover:bg-muted/50'],
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
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(remarkGfm)
      .use(rehypePrettyCode, {
        theme: {
          dark: 'github-dark',
          light: 'github-light',
        },
        transformers: [
          transformerCopyButton({
            visibility: 'always',
            feedbackDuration: 3_000,
          }),
        ],
      })
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
