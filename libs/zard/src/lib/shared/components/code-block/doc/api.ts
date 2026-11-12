import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

const CLASS_PROP = { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" };

export const CODE_BLOCK_API: ApiSection[] = [
  {
    selector: 'z-code-block, [z-code-block]',
    description: 'The surface that holds the header, the content and the footer.',
    props: [
      {
        name: '[zType]',
        description: 'Visual variant; `destructive` is for error output',
        type: "'default' | 'destructive'",
        default: "'default'",
      },
      {
        name: '[zSize]',
        description: 'Size; `sm` has tighter padding and `text-xs` code, for tool output',
        type: "'default' | 'sm'",
        default: "'default'",
      },
      CLASS_PROP,
    ],
  },
  {
    selector: 'z-code-block-header, [z-code-block-header]',
    description: 'Row above the content for a title and actions.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-code-block-title, [z-code-block-title]',
    description: 'Filename or label, with an optional `ng-icon`. A long title truncates.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-code-block-actions, [z-code-block-actions]',
    description:
      'Holds buttons at the end of the header. As a direct child of `z-code-block` it floats at the top end, hidden until the block is hovered or has focus inside (always visible on touch screens).',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-code-block-copy-button, [z-code-block-copy-button]',
    description:
      'Ghost icon button that copies its value to the clipboard and announces "Copied" in a polite live region.',
    props: [
      { name: '[zValue]', description: 'Text to copy (required)', type: 'string', default: '-' },
      { name: '[class]', description: 'Custom CSS classes for the button', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-code-block-content, [z-code-block-content]',
    description:
      'The scrollable, keyboard-focusable code area; it is always `dir="ltr"`. Project a string, or `z-code-block-line` children when lines need a type or highlighted tokens.',
    props: [
      {
        name: '[zWrap]',
        description: 'Wrap long lines instead of scrolling horizontally',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zLineNumbers]',
        description: 'Number each line. A string is split into lines; numbers are not selectable or copied',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zStartLine]',
        description: 'Number of the first line when `zLineNumbers` is set',
        type: 'number',
        default: '1',
      },
      CLASS_PROP,
    ],
  },
  {
    selector: 'z-code-block-line, [z-code-block-line]',
    description: 'One line of code.',
    props: [
      {
        name: '[zType]',
        description: 'State of the line; `added` and `removed` also draw a `+` or `−` marker',
        type: "'default' | 'added' | 'removed' | 'highlighted'",
        default: "'default'",
      },
      {
        name: '[zTokens]',
        description: 'One line returned by `highlightCode()`; replaces the projected text',
        type: 'ZardCodeBlockLineTokens',
        default: '-',
      },
      CLASS_PROP,
    ],
  },
  {
    selector: 'z-code-block-footer, [z-code-block-footer]',
    description: 'Row below the content, for example for a Show more button.',
    props: [CLASS_PROP],
  },
  {
    selector: 'highlightCode(code, language)',
    description:
      'Optional syntax highlighting with Shiki (JavaScript regex engine, no WASM). Shiki and each language load on first use, and it runs on the server. Returns tokens, not HTML: render each line with `[zTokens]`.',
    props: [
      {
        name: 'code',
        description: 'The code to highlight; one trailing newline is ignored',
        type: 'string',
        default: '-',
      },
      {
        name: 'language',
        description:
          'A language of `code-block.highlight.ts`, an alias (`ts`, `js`, `sh`, `yml`...) or `ansi` for terminal output. Any other value gives plain lines',
        type: 'string',
        default: '-',
      },
      {
        name: 'returns',
        description: 'One list of tokens per line, with light and dark colors; blank lines are empty lists',
        type: 'Promise<ZardCodeBlockLineTokens[]>',
        default: '-',
      },
    ],
  },
];
