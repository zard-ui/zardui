import { CODE_BLOCK_DEMO_BASIC } from '@generated/components/code-block/demo/basic';
import { CODE_BLOCK_DEMO_DIFF } from '@generated/components/code-block/demo/diff';
import { CODE_BLOCK_DEMO_HEADER } from '@generated/components/code-block/demo/header';
import { CODE_BLOCK_DEMO_HEIGHT } from '@generated/components/code-block/demo/height';
import { CODE_BLOCK_DEMO_HIGHLIGHTING } from '@generated/components/code-block/demo/highlighting';
import { CODE_BLOCK_DEMO_LINE_NUMBERS } from '@generated/components/code-block/demo/line-numbers';
import { CODE_BLOCK_DEMO_PREVIEW } from '@generated/components/code-block/demo/preview';
import { CODE_BLOCK_DEMO_RTL } from '@generated/components/code-block/demo/rtl';
import { CODE_BLOCK_DEMO_SHOW_MORE } from '@generated/components/code-block/demo/show-more';
import { CODE_BLOCK_DEMO_TERMINAL } from '@generated/components/code-block/demo/terminal';
import { CODE_BLOCK_DEMO_VARIANTS } from '@generated/components/code-block/demo/variants';
import { CODE_BLOCK_DEMO_WRAP } from '@generated/components/code-block/demo/wrap';
import { CODE_BLOCK_CLI_ADD } from '@generated/installation/cli/add-code-block';
import { CODE_BLOCK_MANUAL_CODE } from '@generated/installation/manual/code-block';
import { CODE_BLOCK_USAGE_CODE, CODE_BLOCK_USAGE_IMPORT } from '@generated/usage/code-block';

import { ZardDemoCodeBlockBasicComponent } from './basic';
import { ZardDemoCodeBlockDiffComponent } from './diff';
import { ZardDemoCodeBlockHeaderComponent } from './header';
import { ZardDemoCodeBlockHeightComponent } from './height';
import { ZardDemoCodeBlockHighlightingComponent } from './highlighting';
import { ZardDemoCodeBlockLineNumbersComponent } from './line-numbers';
import { ZardDemoCodeBlockPreviewComponent } from './preview';
import { ZardDemoCodeBlockRtlComponent } from './rtl';
import { ZardDemoCodeBlockShowMoreComponent } from './show-more';
import { ZardDemoCodeBlockTerminalComponent } from './terminal';
import { ZardDemoCodeBlockVariantsComponent } from './variants';
import { ZardDemoCodeBlockWrapComponent } from './wrap';
import { CODE_BLOCK_API } from '../doc/api';

export const CODE_BLOCK = {
  componentName: 'code-block',
  componentType: 'code-block',
  description: 'Displays code, terminal output and diffs with an optional header, line numbers and a copy button.',
  api: CODE_BLOCK_API,
  installData: {
    cliAdd: CODE_BLOCK_CLI_ADD,
    manualCode: CODE_BLOCK_MANUAL_CODE,
  },
  usage: { importBlock: CODE_BLOCK_USAGE_IMPORT, codeBlock: CODE_BLOCK_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoCodeBlockPreviewComponent,
    column: false,
    codeData: CODE_BLOCK_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'basic',
      description:
        'Project a string into `z-code-block-content`; it renders as one text node. Without a header, put `z-code-block-actions` directly in `z-code-block` to float a copy button at the top end.',
      component: ZardDemoCodeBlockBasicComponent,
      column: true,
      codeData: CODE_BLOCK_DEMO_BASIC,
    },
    {
      name: 'header',
      description:
        'Put a `z-code-block-title`, with an optional `ng-icon`, and `z-code-block-actions` in a `z-code-block-header`. `z-code-block-copy-button` copies its `[zValue]`. A long title truncates.',
      component: ZardDemoCodeBlockHeaderComponent,
      column: true,
      codeData: CODE_BLOCK_DEMO_HEADER,
    },
    {
      name: 'line-numbers',
      description:
        'Add `zLineNumbers` to number the lines; a string is split into lines for you. Use `[zStartLine]` for a snippet from the middle of a file. The numbers are generated content, so they are not selected, copied or read by screen readers, and blank lines are kept. A `z-code-block-line` with `zType="highlighted"` calls a line out.',
      component: ZardDemoCodeBlockLineNumbersComponent,
      column: true,
      codeData: CODE_BLOCK_DEMO_LINE_NUMBERS,
    },
    {
      name: 'wrap',
      description:
        'Long lines scroll by default. Add `zWrap` to wrap them, which suits tool output and error messages. To let the reader toggle it, keep the state yourself and give the button `aria-pressed`.',
      component: ZardDemoCodeBlockWrapComponent,
      column: true,
      codeData: CODE_BLOCK_DEMO_WRAP,
    },
    {
      name: 'diff',
      description:
        'Render each line as a `z-code-block-line` and set `zType` to `added` or `removed`. Each adds a `+` or `−` marker next to the tint, so the change does not rely on color. The markers are not part of the text and are not copied with a selection.',
      component: ZardDemoCodeBlockDiffComponent,
      column: true,
      codeData: CODE_BLOCK_DEMO_DIFF,
    },
    {
      name: 'height',
      description:
        'Cap the height with a `max-h-*` class on `z-code-block-content`. The content scrolls inside the block and is focusable, so keyboard users can scroll it. Add `scroll-fade-y` to fade the edges.',
      component: ZardDemoCodeBlockHeightComponent,
      column: true,
      codeData: CODE_BLOCK_DEMO_HEIGHT,
    },
    {
      name: 'show-more',
      description:
        'Use `z-code-block-footer` for a slot below the content. For Show more, cap the content while it is collapsed and put a ghost `xs` button in the footer, with `aria-expanded` and `aria-controls` pointing at the content `id`.',
      component: ZardDemoCodeBlockShowMoreComponent,
      column: true,
      codeData: CODE_BLOCK_DEMO_SHOW_MORE,
    },
    {
      name: 'highlighting',
      description:
        'Syntax highlighting is opt-in. `highlightCode()` loads Shiki and the language on first use, with its JavaScript engine, and resolves one list of tokens per line; pass each one to `[zTokens]`. Colors follow the light and dark theme without highlighting again.',
      component: ZardDemoCodeBlockHighlightingComponent,
      column: true,
      codeData: CODE_BLOCK_DEMO_HIGHLIGHTING,
    },
    {
      name: 'terminal',
      description:
        'Pass `ansi` as the language to render the colors of terminal output. Without it the escape codes show as text. ANSI colors do not carry from one line to the next.',
      component: ZardDemoCodeBlockTerminalComponent,
      column: true,
      codeData: CODE_BLOCK_DEMO_TERMINAL,
    },
    {
      name: 'variants',
      description:
        'Use `zType="destructive"` for errors and failed output, and `zSize="sm"` for tight tool output: it has smaller padding and `text-xs` code.',
      component: ZardDemoCodeBlockVariantsComponent,
      column: true,
      codeData: CODE_BLOCK_DEMO_VARIANTS,
    },
    {
      name: 'rtl',
      description:
        'To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl). Code always reads left to right; the header follows the page direction.',
      type: 'rtl' as const,
      component: ZardDemoCodeBlockRtlComponent,
      codeData: CODE_BLOCK_DEMO_RTL,
    },
  ],
};
