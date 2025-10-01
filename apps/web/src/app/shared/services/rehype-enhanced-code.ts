import { visit } from 'unist-util-visit';

interface FileIconMapping {
  [key: string]: string;
}

const FILE_ICONS: FileIconMapping = {
  'component.ts': '/icons/angular-file.svg',
  'service.ts': '/icons/angular-file.svg',
  'directive.ts': '/icons/angular-file.svg',
  'guard.ts': '/icons/angular-file.svg',
  'pipe.ts': '/icons/angular-file.svg',
  'module.ts': '/icons/angular-file.svg',

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
  angular: '/icons/angular-file.svg',
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
        hasTitle ? '' : 'absolute',
        'top-3',
        hasTitle ? '' : 'right-3',
        hasTitle ? '' : 'z-20',
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

function createExpandableOverlay(title: string): any {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      class: [
        'absolute',
        'inset-0',
        'z-10',
        'flex',
        'items-center',
        'justify-center',
        'bg-background/90',
        'backdrop-blur-md',
        'transition-all',
        'duration-300',
        'ease-in-out',
        'expandable-overlay',
      ],
    },
    children: [
      {
        type: 'element',
        tagName: 'button',
        properties: {
          class: [
            'flex',
            'cursor-pointer',
            'items-center',
            'gap-2',
            'rounded-lg',
            'border',
            'bg-background',
            'px-6',
            'py-3',
            'text-sm',
            'font-medium',
            'shadow-lg',
            'transition-all',
            'duration-200',
            'hover:bg-muted',
            'hover:scale-105',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring',
            'focus-visible:ring-offset-2',
          ],
          onClick: 'toggleExpandableCode(this)',
          'aria-label': `Expand ${title}`,
        },
        children: [
          {
            type: 'element',
            tagName: 'i',
            properties: {
              class: ['icon-eye', 'text-base'],
            },
            children: [],
          },
          {
            type: 'text',
            value: title,
          },
        ],
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

        // Check for expandable parameter
        const expandableMatch = originalMeta.match(/expandable="([^"]+)"/);
        const isExpandable = expandableMatch && (expandableMatch[1] === 'true' || expandableMatch[1] === 'on');
        const expandableTitleMatch = originalMeta.match(/expandableTitle="([^"]+)"/);
        const expandableTitle = expandableMatch ? (expandableTitleMatch ? expandableTitleMatch[1] : 'View Code') : null;

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
            class: ['group', 'relative', 'my-6', 'overflow-hidden', 'rounded-lg', 'border', 'bg-neutral-200/30', 'dark:bg-neutral-900/40', isExpandable ? 'min-h-32' : ''].filter(
              Boolean,
            ),
          },
          children: [],
        };

        // Create the code block content
        const codeBlockContent: any = {
          type: 'element',
          tagName: 'div',
          properties: {
            class: ['group', 'relative', 'overflow-hidden', 'rounded-lg', 'border', 'bg-neutral-200/30', 'dark:bg-neutral-900/40'],
          },
          children: [],
        };

        // Add title if we have filename or language
        if (filename || (language && icon)) {
          const displayTitle = filename || language;
          codeBlockContent.children.push(createCodeTitle(displayTitle, icon, hasCopyButton, codeContent));
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

        // Add the pre to code block content
        codeBlockContent.children.push(node);

        // Add copy button only if copyButton parameter is present
        if (hasCopyButton && !hasTitle) {
          const hasTitle = !!(filename || (language && icon));
          codeBlockContent.children.push(createCopyButton(codeContent, hasTitle));
        }

        // If expandable, add overlay to the wrapper
        if (isExpandable) {
          // Add content to wrapper first
          wrapper.children = codeBlockContent.children;
          // Then add the overlay on top
          const overlay = createExpandableOverlay(expandableTitle || 'View Code');
          wrapper.children.push(overlay);
          // Make wrapper position relative for absolute overlay positioning
          wrapper.properties.class.push('expandable-wrapper');
        } else {
          // If not expandable, add content directly to wrapper
          wrapper.children = codeBlockContent.children;
        }

        // Replace the original pre with our wrapper
        parent.children[index] = wrapper;
      }
    });
  };
}

// Plugin for handling code tabs - processes BEFORE rehypeEnhancedCode
export function rehypeCodeTabs() {
  return (tree: any) => {
    const processed = new Set<any>();

    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      if (index === undefined || !parent || processed.has(node)) return;

      // Look for figure elements with rehype-pretty-code-figure
      if (node.tagName === 'figure' && node.properties?.['data-rehype-pretty-code-figure'] !== undefined) {
        // Look for pre > code with tab syntax in meta
        const preNode = node.children?.find((child: any) => child.tagName === 'pre');
        const codeNode = preNode?.children?.[0];

        if (!codeNode || codeNode.tagName !== 'code') return;

        const meta = codeNode.data?.meta || '';
        const tabMatch = meta.match(/tab="([^"]+)"/);

        if (!tabMatch) return;

        // This is a tab - look for subsequent tab siblings
        const tabGroup = [node];
        const tabLabels = [tabMatch[1]];

        // Look ahead for consecutive tab blocks, skipping non-figure elements
        let nextIndex = index + 1;
        const elementsToRemove = []; // Track empty elements to remove

        while (nextIndex < parent.children.length) {
          const nextNode = parent.children[nextIndex];

          // Skip empty text nodes or paragraphs between code blocks
          if (nextNode.tagName !== 'figure') {
            // Check if this is an empty text node or paragraph that we should skip
            if (nextNode.type === 'text' && nextNode.value?.trim() === '') {
              elementsToRemove.push(nextIndex);
              nextIndex++;
              continue;
            } else if (
              nextNode.tagName === 'p' &&
              (!nextNode.children ||
                nextNode.children.length === 0 ||
                (nextNode.children.length === 1 && nextNode.children[0].type === 'text' && nextNode.children[0].value?.trim() === ''))
            ) {
              elementsToRemove.push(nextIndex);
              nextIndex++;
              continue;
            } else {
              // Non-empty, non-paragraph element - stop looking for tabs
              break;
            }
          }

          // Check if this figure has rehype-pretty-code-figure
          if (nextNode.properties?.['data-rehype-pretty-code-figure'] === undefined) {
            break;
          }

          const nextPreNode = nextNode.children?.find((child: any) => child.tagName === 'pre');
          const nextCodeNode = nextPreNode?.children?.[0];

          if (!nextCodeNode || nextCodeNode.tagName !== 'code') break;

          const nextMeta = nextCodeNode.data?.meta || '';
          const nextTabMatch = nextMeta.match(/tab="([^"]+)"/);

          if (!nextTabMatch) break;

          // This is another tab in the group
          tabGroup.push(nextNode);
          tabLabels.push(nextTabMatch[1]);
          processed.add(nextNode);
          nextIndex++;
        }

        // Remove empty elements between tabs if we're creating a tab group
        if (tabGroup.length > 1 && elementsToRemove.length > 0) {
          // Remove in reverse order to maintain correct indices
          for (let i = elementsToRemove.length - 1; i >= 0; i--) {
            parent.children.splice(elementsToRemove[i], 1);
            // Adjust indices of elements after the removed ones
            for (let j = i; j < elementsToRemove.length; j++) {
              if (elementsToRemove[j] > elementsToRemove[i]) {
                elementsToRemove[j]--;
              }
            }
          }
        }

        // If we have more than one tab, create a tab wrapper and mark as processed
        if (tabGroup.length > 1) {
          const tabsWrapper = createTabsWrapper(tabGroup, tabLabels);

          // Replace all the individual code blocks with the tabs wrapper
          parent.children.splice(index, tabGroup.length, tabsWrapper);
          processed.add(tabsWrapper);

          // Since we modified the tree, the visit will continue with the new structure
          return;
        }
      }
    });
  };
}

function createTabsWrapper(codeBlocks: any[], tabLabels: string[]): any {
  const tabButtons = tabLabels.map((label, tabIndex) => ({
    type: 'element',
    tagName: 'button',
    properties: {
      class: [
        'rounded-t-lg',
        'border-b-0',
        'px-3',
        'py-2',
        'text-sm',
        'font-medium',
        'transition-colors',
        'hover:bg-muted',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        tabIndex === 0 ? 'bg-background' : '',
        tabIndex === 0 ? 'text-foreground' : 'text-muted-foreground',
      ].filter(Boolean),
      'data-tab': tabIndex.toString(),
      onClick: `switchCodeTab(event, ${tabIndex})`,
    },
    children: [
      {
        type: 'text',
        value: label,
      },
    ],
  }));

  // Transform the figure elements to tab contents
  const tabContents = codeBlocks.map((figureBlock, tabIndex) => {
    // Convert figure to a div with tab content styling
    return {
      type: 'element',
      tagName: 'div',
      properties: {
        class: [
          'code-tab-content',
          'group',
          'relative',
          'overflow-hidden',
          'rounded-b-lg',
          'border',
          'border-t-0',
          'bg-neutral-200/30',
          'dark:bg-neutral-900/40',
          tabIndex === 0 ? 'block' : 'hidden',
        ],
      },
      children: figureBlock.children, // Keep the original pre/code structure
    };
  });

  return {
    type: 'element',
    tagName: 'div',
    properties: {
      class: ['code-tabs-wrapper', 'my-6'],
    },
    children: [
      // Tab buttons header
      {
        type: 'element',
        tagName: 'div',
        properties: {
          class: ['flex', 'border', 'border-b-0', 'bg-muted/50', 'rounded-t-lg'],
        },
        children: tabButtons,
      },
      // Tab contents
      ...tabContents,
    ],
  };
}
