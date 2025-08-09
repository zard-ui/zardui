import { visit } from 'unist-util-visit';

interface FileIconMapping {
  [key: string]: string;
}

const FILE_ICONS: FileIconMapping = {
  'component.ts': '/icons/angular-component.svg',
  'service.ts': '/icons/angular-service.svg',
  'directive.ts': '/icons/angular-directive.svg',
  'guard.ts': '/icons/angular-service.svg',
  'pipe.ts': '/icons/angular-service.svg',
  'module.ts': '/icons/angular.svg',

  ts: '/icons/typescript.svg',
  html: '/icons/html.svg',
  css: 'icon-code',
  json: 'icon-braces',
  md: '/icons/html.svg',
  bash: 'icon-terminal',
  terminal: 'icon-terminal',
};

const LANGUAGE_ICONS: FileIconMapping = {
  typescript: '/icons/typescript.svg',
  javascript: '/icons/typescript.svg',
  html: '/icons/html.svg',
  css: 'icon-code',
  json: 'icon-braces',
  bash: 'icon-terminal',
  shell: 'icon-terminal',
  sh: 'icon-terminal',
  angular: '/icons/angular.svg',
  ts: '/icons/typescript.svg',
  js: '/icons/typescript.svg',
};

function getIconForFile(filename: string): string | null {
  if (!filename) return null;

  for (const [pattern, icon] of Object.entries(FILE_ICONS)) {
    if (pattern.includes('.') && filename.endsWith(pattern)) {
      return icon;
    }
  }

  const extension = filename.split('.').pop()?.toLowerCase();
  if (extension && FILE_ICONS[extension]) {
    return FILE_ICONS[extension];
  }

  return null;
}

function getIconForLanguage(language: string): string | null {
  if (!language) return null;
  return LANGUAGE_ICONS[language.toLowerCase()] || null;
}

function createCopyButton(codeContent: string, hasTitle = false): any {
  return {
    type: 'element',
    tagName: 'button',
    properties: {
      class: [
        hasTitle ?? 'absolute',
        'top-3',
        hasTitle ?? 'right-3', // Left if has title, right if no title
        hasTitle ?? 'z-20',
        hasTitle && 'ml-auto',
        'flex',
        'h-6',
        'w-6',
        'items-center',
        'justify-center',
        'rounded-md',
        hasTitle ?? 'border',
        hasTitle ? 'bg-transparent' : 'bg-secondary',
        'text-muted-foreground',
        'transition-all',
        'duration-200',
        'ease-in-out',
        'hover:bg-muted',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
      ],
      onClick: `copyCodeToClipboard(this, \`${codeContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)`,
      'aria-label': 'Copy code',
      title: 'Copy code',
    },
    children: [
      {
        type: 'element',
        tagName: 'i',
        properties: {
          class: ['icon-clipboard'],
        },
        children: [],
      },
    ],
  };
}

function createCodeTitle(filename: string, icon: string | null, copyButton: boolean, codeContent: string): any {
  const titleChildren = [];

  if (icon?.includes('/')) {
    titleChildren.push({
      type: 'element',
      tagName: 'img',
      properties: {
        src: icon,
        alt: '',
        class: ['h-4', 'w-4', 'shrink-0', 'invert-0', 'dark:invert'],
      },
      children: [],
    });
  } else {
    titleChildren.push({
      type: 'element',
      tagName: 'i',
      properties: {
        class: [icon, 'text-base', 'text-neutral-500', 'dark:text-neutral-600'],
      },
      children: [],
    });
  }

  // Add filename
  titleChildren.push({
    type: 'element',
    tagName: 'span',
    properties: {
      class: ['text-[13px]', 'font-medium', 'leading-none', 'text-neutral-500'],
    },
    children: [
      {
        type: 'text',
        value: filename,
      },
    ],
  });
  if (copyButton) {
    const copyButtonHtml = createCopyButton(codeContent, copyButton);
    titleChildren.push(copyButtonHtml);
  }

  return {
    type: 'element',
    tagName: 'div',
    properties: {
      class: ['flex', 'items-center', 'gap-2', 'border-b', 'bg-muted/50', 'px-4', 'py-2', 'text-sm', 'text-muted-foreground', copyButton ?? 'justify-between'],
    },
    children: titleChildren,
  };
}

function extractCodeContent(node: any): string {
  if (node.type === 'text') {
    return node.value || '';
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children.map((child: any) => extractCodeContent(child)).join('');
  }

  return '';
}

export function rehypeEnhancedCode() {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      if (index === undefined || !parent) return;
      // Handle pre > code blocks
      if (node.tagName === 'pre' && node.children && node.children[0]?.tagName === 'code') {
        const codeNode = node.children[0];
        const codeContent = extractCodeContent(codeNode);

        // Get language from class (e.g., language-typescript)
        const codeClasses = codeNode.properties?.className || [];
        const languageClass = codeClasses.find((cls: string) => cls.startsWith('language-'));
        const language = languageClass ? languageClass.replace('language-', '') : null;

        // Check if there's a title from rehype-code-titles (usually in a previous sibling)
        let filename = null;

        // Look for title in previous sibling or in data attributes
        if (parent && index > 0) {
          const prevSibling = parent.children[index - 1];
          if (prevSibling?.tagName === 'div' && prevSibling.properties?.className?.includes('rehype-code-title')) {
            filename = extractCodeContent(prevSibling);
            // Remove the old title element
            parent.children.splice(index - 1, 1);
            index = index - 1; // Adjust index since we removed an element
          }
        }

        // Try to get filename from meta or title attributes
        if (!filename) {
          const meta = codeNode.data?.meta || '';
          const titleMatch = meta.match(/title="([^"]+)"/);
          filename = titleMatch ? titleMatch[1] : null;
        }

        // Check if showLineNumbers was in the original meta (before rehype-code-titles processing)
        const originalMeta = codeNode.data?.meta || '';
        const hasShowLineNumbers = originalMeta.includes('showLineNumbers');
        const hasCopyButton = originalMeta.includes('copyButton');
        const hasTitle = originalMeta.includes('title');

        // If showLineNumbers was requested but attributes are missing, restore them
        if (hasShowLineNumbers && !codeNode.properties?.['data-line-numbers']) {
          // Count lines in the code to set proper attributes
          const codeContent = extractCodeContent(codeNode);
          const lineCount = codeContent.split('\n').length;
          const maxDigits = lineCount.toString().length;

          // Restore the line numbers attributes that rehype-pretty-code should have added
          codeNode.properties = {
            ...codeNode.properties,
            'data-line-numbers': '',
            'data-line-numbers-max-digits': maxDigits.toString(),
          };
        }

        // Get appropriate icon
        let icon = null;
        if (filename) {
          icon = getIconForFile(filename);
        } else if (language) {
          icon = getIconForLanguage(language);
        }

        // Create wrapper with enhanced styling
        const wrapper: any = {
          type: 'element',
          tagName: 'div',
          properties: {
            class: ['group', 'relative', 'my-6', 'overflow-hidden', 'rounded-lg', 'border', 'bg-neutral-200/30', 'dark:bg-neutral-900/40'],
          },
          children: [],
        };

        // Add title if we have filename or language
        if (filename || (language && icon)) {
          const displayTitle = filename || language;
          wrapper.children.push(createCodeTitle(displayTitle, icon, hasCopyButton, codeContent));
        }

        // Update pre styling while preserving existing properties
        const existingPreClasses = node.properties?.class || [];
        const existingPreProps = node.properties || {};

        node.properties = {
          ...existingPreProps,
          class: [
            ...existingPreClasses,
            'relative',
            'overflow-x-auto',
            'scrollbar-hide',
            'bg-muted/30',
            'p-4',
            'text-sm',
            '[&>code]:bg-transparent',
            filename || (language && icon) ? '' : 'rounded-lg', // Only round if no title
          ].filter(Boolean),
        };

        // Don't touch code node properties - they have syntax highlighting and line numbers
        // Just leave codeNode untouched to preserve rehype-pretty-code work

        // Add the pre to wrapper
        wrapper.children.push(node);

        // Add copy button only if copyButton parameter is present
        if (hasCopyButton && !hasTitle) {
          const hasTitle = !!(filename || (language && icon));
          wrapper.children.push(createCopyButton(codeContent, hasTitle));
        }

        // Replace the original pre with our wrapper
        parent.children[index] = wrapper;
      }
    });
  };
}

// Plugin for handling code tabs (simplified - only for explicitly marked tab groups)
export function rehypeCodeTabs() {
  return (_tree: any) => {
    // For now, let's disable automatic tab grouping and keep it simple
    // Users can use individual code blocks which work well with titles and copy buttons
    // If needed later, we can add explicit tab markup support
  };
}
