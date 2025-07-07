// src/app/services/markdown.service.ts
import { Injectable } from '@angular/core';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';
import { visit } from 'unist-util-visit';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  private processor: any;
  private initialized = false;

  // Plugin correto para adicionar classes do Tailwind
  private rehypeTailwindClasses() {
    return () => {
      return (tree: any) => {
        visit(tree, 'element', (node: any) => {
          // Estilizar elementos PRE (container do código)
          if (node.tagName === 'pre') {
            node.properties = {
              ...node.properties,
              style: [],
              class: [
                // "no-scrollbar",
                // "min-w-0",
                'overflow-x-auto',
                // "px-4",
                // "py-3.5",
                // "outline-none",
                // "has-[[data-highlighted-line]]:px-0",
                // "has-[[data-line-numbers]]:px-0",
                // "has-[[data-slot=tabs]]:p-0",
                // "!bg-transparent",
                'max-h-[50dvh]',
                // "md:-mx-4",
                'border',
                'rounded-md',
                'border-neutral-300/50',
                'bg-neutral-200/30',
                'dark:border-neutral-800/60',
                'dark:bg-neutral-900/40',
                // "relative",
                // "border-code"
              ],
            };
          }

          // Estilizar elementos CODE dentro do PRE
          if (node.tagName === 'code') {
            node.properties = {
              ...node.properties,
              class: ['font-sans', 'text-[.95em]', 'leading-relaxed'],
            };
          }

          // Estilizar CODE inline (não dentro de PRE)
          // if (node.tagName === 'code' && !this.isInsidePre(node)) {
          //     node.properties = {
          //         ...node.properties,
          //         class: [
          //             ...(node.properties?.class || []),
          //             'bg-gray-100',
          //             'text-gray-800',
          //             'px-2',
          //             'py-1',
          //             'rounded',
          //             'text-sm',
          //             'font-mono',
          //             'border'
          //         ]
          //     };
          // }

          // Estilizar outros elementos markdown
          // if (node.tagName === 'h1') {
          //     node.properties = {
          //         ...node.properties,
          //         class: ['text-4xl', 'font-bold', 'mb-6', 'text-gray-900']
          //     };
          // }

          // if (node.tagName === 'h2') {
          //     node.properties = {
          //         ...node.properties,
          //         class: ['text-3xl', 'font-semibold', 'mb-4', 'text-gray-800']
          //     };
          // }

          // if (node.tagName === 'h3') {
          //     node.properties = {
          //         ...node.properties,
          //         class: ['text-2xl', 'font-semibold', 'mb-3', 'text-gray-800']
          //     };
          // }

          // if (node.tagName === 'p') {
          //     node.properties = {
          //         ...node.properties,
          //         class: ['mb-4', 'text-gray-700', 'leading-relaxed']
          //     };
          // }

          // if (node.tagName === 'blockquote') {
          //     node.properties = {
          //         ...node.properties,
          //         class: [
          //             'border-l-4',
          //             'border-blue-500',
          //             'pl-4',
          //             'py-2',
          //             'my-4',
          //             'bg-blue-50',
          //             'text-blue-900',
          //             'italic'
          //         ]
          //     };
          // }

          // if (node.tagName === 'ul') {
          //     node.properties = {
          //         ...node.properties,
          //         class: ['list-disc', 'list-inside', 'mb-4', 'text-gray-700']
          //     };
          // }

          // if (node.tagName === 'ol') {
          //     node.properties = {
          //         ...node.properties,
          //         class: ['list-decimal', 'list-inside', 'mb-4', 'text-gray-700']
          //     };
          // }

          // if (node.tagName === 'li') {
          //     node.properties = {
          //         ...node.properties,
          //         class: ['mb-1']
          //     };
          // }

          // if (node.tagName === 'a') {
          //     node.properties = {
          //         ...node.properties,
          //         class: [
          //             'text-blue-600',
          //             'hover:text-blue-800',
          //             'underline',
          //             'transition-colors'
          //         ]
          //     };
          // }

          // if (node.tagName === 'table') {
          //     node.properties = {
          //         ...node.properties,
          //         class: [
          //             'min-w-full',
          //             'border-collapse',
          //             'border',
          //             'border-gray-300',
          //             'my-4'
          //         ]
          //     };
          // }

          // if (node.tagName === 'th') {
          //     node.properties = {
          //         ...node.properties,
          //         class: [
          //             'border',
          //             'border-gray-300',
          //             'bg-gray-100',
          //             'px-4',
          //             'py-2',
          //             'text-left',
          //             'font-semibold'
          //         ]
          //     };
          // }

          // if (node.tagName === 'td') {
          //     node.properties = {
          //         ...node.properties,
          //         class: [
          //             'border',
          //             'border-gray-300',
          //             'px-4',
          //             'py-2'
          //         ]
          //     };
          // }
        });
      };
    };
  }

  // Método auxiliar para verificar se code está dentro de pre
  private isInsidePre(node: any): boolean {
    let parent = node.parent;
    while (parent) {
      if (parent.tagName === 'pre') {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  async initializeProcessor() {
    if (this.initialized) return;

    this.processor = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings)
      .use(rehypeShiki, {
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        defaultColor: 'dark',
        langs: ['javascript', 'typescript', 'html', 'css', 'json', 'bash', 'angular-ts', 'angular-html'],
      })
      .use(this.rehypeTailwindClasses()) // Agora funciona corretamente
      .use(rehypeStringify);

    this.initialized = true;
  }

  async processMarkdown(markdown: string): Promise<string> {
    await this.initializeProcessor();
    const result = await this.processor.process(markdown);
    return result.toString();
  }
}
