import { CODE_BLOCK_DEMO_ACTIONS } from '@generated/components/code-block/demo/actions';
import { CODE_BLOCK_DEMO_BASIC } from '@generated/components/code-block/demo/basic';
import { CODE_BLOCK_DEMO_DESTRUCTIVE } from '@generated/components/code-block/demo/destructive';
import { CODE_BLOCK_DEMO_DIFF } from '@generated/components/code-block/demo/diff';
import { CODE_BLOCK_DEMO_FLOATING_ACTIONS } from '@generated/components/code-block/demo/floating-actions';
import { CODE_BLOCK_DEMO_HEADER } from '@generated/components/code-block/demo/header';
import { CODE_BLOCK_DEMO_HEIGHT } from '@generated/components/code-block/demo/height';
import { CODE_BLOCK_DEMO_HIGHLIGHTED_LINES } from '@generated/components/code-block/demo/highlighted-lines';
import { CODE_BLOCK_DEMO_HIGHLIGHTING } from '@generated/components/code-block/demo/highlighting';
import { CODE_BLOCK_DEMO_LANGUAGES } from '@generated/components/code-block/demo/languages';
import { CODE_BLOCK_DEMO_LINE_NUMBERS } from '@generated/components/code-block/demo/line-numbers';
import { CODE_BLOCK_DEMO_MESSAGE } from '@generated/components/code-block/demo/message';
import { CODE_BLOCK_DEMO_PREVIEW } from '@generated/components/code-block/demo/preview';
import { CODE_BLOCK_DEMO_RTL } from '@generated/components/code-block/demo/rtl';
import { CODE_BLOCK_DEMO_SHOW_MORE } from '@generated/components/code-block/demo/show-more';
import { CODE_BLOCK_DEMO_SHOW_MORE_SCROLL } from '@generated/components/code-block/demo/show-more-scroll';
import { CODE_BLOCK_DEMO_SIZE } from '@generated/components/code-block/demo/size';
import { CODE_BLOCK_DEMO_START_LINE } from '@generated/components/code-block/demo/start-line';
import { CODE_BLOCK_DEMO_STREAMING } from '@generated/components/code-block/demo/streaming';
import { CODE_BLOCK_DEMO_TABS } from '@generated/components/code-block/demo/tabs';
import { CODE_BLOCK_DEMO_TERMINAL } from '@generated/components/code-block/demo/terminal';
import { CODE_BLOCK_DEMO_TRACE } from '@generated/components/code-block/demo/trace';
import { CODE_BLOCK_DEMO_TYPESET } from '@generated/components/code-block/demo/typeset';
import { CODE_BLOCK_DEMO_WRAP } from '@generated/components/code-block/demo/wrap';
import {
  CODE_BLOCK_SNIPPET_COMPOSITION,
  CODE_BLOCK_SNIPPET_HIGHLIGHTING,
  CODE_BLOCK_SNIPPET_HIGHLIGHTING_TEMPLATE,
  CODE_BLOCK_SNIPPET_SERVER_RENDERING,
  CODE_BLOCK_SNIPPET_SHOW_MORE,
  CODE_BLOCK_SNIPPET_TITLE_LINK,
  CODE_BLOCK_SNIPPET_WRAP_TOGGLE,
} from '@generated/components/code-block/snippets';
import { CODE_BLOCK_CLI_ADD } from '@generated/installation/cli/add-code-block';
import { CODE_BLOCK_MANUAL_CODE } from '@generated/installation/manual/code-block';
import { CODE_BLOCK_USAGE_CODE, CODE_BLOCK_USAGE_IMPORT } from '@generated/usage/code-block';

import { ZardDemoCodeBlockActionsComponent } from './actions';
import { ZardDemoCodeBlockBasicComponent } from './basic';
import { ZardDemoCodeBlockDestructiveComponent } from './destructive';
import { ZardDemoCodeBlockDiffComponent } from './diff';
import { ZardDemoCodeBlockFloatingActionsComponent } from './floating-actions';
import { ZardDemoCodeBlockHeaderComponent } from './header';
import { ZardDemoCodeBlockHeightComponent } from './height';
import { ZardDemoCodeBlockHighlightedLinesComponent } from './highlighted-lines';
import { ZardDemoCodeBlockHighlightingComponent } from './highlighting';
import { ZardDemoCodeBlockLanguagesComponent } from './languages';
import { ZardDemoCodeBlockLineNumbersComponent } from './line-numbers';
import { ZardDemoCodeBlockMessageComponent } from './message';
import { ZardDemoCodeBlockPreviewComponent } from './preview';
import { ZardDemoCodeBlockRtlComponent } from './rtl';
import { ZardDemoCodeBlockShowMoreComponent } from './show-more';
import { ZardDemoCodeBlockShowMoreScrollComponent } from './show-more-scroll';
import { ZardDemoCodeBlockSizeComponent } from './size';
import { ZardDemoCodeBlockStartLineComponent } from './start-line';
import { ZardDemoCodeBlockStreamingComponent } from './streaming';
import { ZardDemoCodeBlockTabsComponent } from './tabs';
import { ZardDemoCodeBlockTerminalComponent } from './terminal';
import { ZardDemoCodeBlockTraceComponent } from './trace';
import { ZardDemoCodeBlockTypesetComponent } from './typeset';
import { ZardDemoCodeBlockWrapComponent } from './wrap';
import { CODE_BLOCK_API } from '../doc/api';

/**
 * Laid out like the shadcn/ui page: every example is its own section, so it gets its own heading and anchor.
 * Each section id is its example name, which is also where the e2e tests look for it.
 */
export const CODE_BLOCK = {
  componentName: 'code-block',
  componentType: 'code-block',
  description: 'Displays code, terminal output and diffs with an optional header, line numbers and a copy button.',
  api: CODE_BLOCK_API,
  installData: {
    cliAdd: CODE_BLOCK_CLI_ADD,
    manualCode: CODE_BLOCK_MANUAL_CODE,
  },
  intro: [
    '`z-code-block` displays code, terminal output, logs and diffs. It has a header with a title and actions, line numbers, wrapping, diff and highlighted lines, and a small size for tool output in a [Trace](/docs/components/trace).',
    'Syntax highlighting is optional and lives in a separate file, `code-block.highlight.ts`, so a block that only shows plain output stays small.',
  ],
  usage: { importBlock: CODE_BLOCK_USAGE_IMPORT, codeBlock: CODE_BLOCK_USAGE_CODE },
  composition: CODE_BLOCK_SNIPPET_COMPOSITION,
  compositionNote:
    '`z-code-block-content` takes a string or a list of `z-code-block-line`. Use lines when you need line types or highlighted tokens.',
  features: [
    '**It streams cheaply.** A string renders as one text node, and while code streams the highlighter keeps the colors of the lines that did not change.',
    '**It copies cleanly.** Line numbers and diff markers are left out of a selection, and blank lines survive the copy.',
    '**It reads left to right.** The content is always `dir="ltr"`. The header follows the page direction.',
    "**It highlights without WASM.** `highlightCode()` uses Shiki's JavaScript engine, loads each language on first use and renders ANSI colors in terminal output. It also runs on the server, so prerendered pages ship highlighted.",
    '**It fits where code shows up.** Use it in a message, a Trace line, Tabs, a Dialog or a `typeset` container.',
    '**It scrolls by keyboard.** The content is focusable, and floating actions show on focus as well as on hover.',
  ],
  preview: {
    name: 'preview',
    component: ZardDemoCodeBlockPreviewComponent,
    codeData: CODE_BLOCK_DEMO_PREVIEW,
  },
  examples: [],
  sections: [
    {
      id: 'basic',
      title: 'Basic',
      description:
        'Project a string into `z-code-block-content`. It renders as one text node, so it stays cheap while output streams.',
      examples: [{ name: 'basic', component: ZardDemoCodeBlockBasicComponent, codeData: CODE_BLOCK_DEMO_BASIC }],
    },
    {
      id: 'header',
      title: 'Header',
      description:
        '`z-code-block-header` holds a `z-code-block-title` and `z-code-block-actions`. `z-code-block-copy-button` copies its `[zValue]`.',
      examples: [
        {
          name: 'header',
          component: ZardDemoCodeBlockHeaderComponent,
          codeData: CODE_BLOCK_DEMO_HEADER,
          codeAfter: {
            description: 'A long title truncates. To link the title to a file, wrap `z-code-block-title` in an anchor.',
            codeData: CODE_BLOCK_SNIPPET_TITLE_LINK,
          },
        },
      ],
    },
    {
      id: 'actions',
      title: 'Actions',
      description:
        '`z-code-block-actions` holds any number of buttons. For a wrap toggle, keep the state yourself and bind it to `zWrap`.',
      examples: [
        {
          name: 'actions',
          component: ZardDemoCodeBlockActionsComponent,
          codeData: CODE_BLOCK_DEMO_ACTIONS,
          codeAfter: { codeData: CODE_BLOCK_SNIPPET_WRAP_TOGGLE },
        },
      ],
    },
    {
      id: 'floating-actions',
      title: 'Floating Actions',
      description:
        'Without a header, put `z-code-block-actions` directly inside `z-code-block`. The actions float at the top end and stay hidden until the block is hovered or focused. They always show on touch screens.',
      examples: [
        {
          name: 'floating-actions',
          component: ZardDemoCodeBlockFloatingActionsComponent,
          codeData: CODE_BLOCK_DEMO_FLOATING_ACTIONS,
        },
      ],
    },
    {
      id: 'line-numbers',
      title: 'Line Numbers',
      description:
        'Add `zLineNumbers` to `z-code-block-content`. A string is split into lines, and the numbers are not copied with a selection.',
      examples: [
        {
          name: 'line-numbers',
          component: ZardDemoCodeBlockLineNumbersComponent,
          codeData: CODE_BLOCK_DEMO_LINE_NUMBERS,
        },
      ],
    },
    {
      id: 'start-line',
      title: 'Start Line',
      description:
        'Set `[zStartLine]` to number lines from a given line, for a snippet from the middle of a file. The gutter grows to fit the widest number.',
      examples: [
        { name: 'start-line', component: ZardDemoCodeBlockStartLineComponent, codeData: CODE_BLOCK_DEMO_START_LINE },
      ],
    },
    {
      id: 'wrap',
      title: 'Wrap',
      description:
        'Long lines scroll by default. Add `zWrap` to wrap them, which suits tool output and error messages. To let the reader toggle it, see [Actions](/docs/components/code-block#actions).',
      examples: [{ name: 'wrap', component: ZardDemoCodeBlockWrapComponent, codeData: CODE_BLOCK_DEMO_WRAP }],
    },
    {
      id: 'highlighted-lines',
      title: 'Highlighted Lines',
      description: 'Render each line as a `z-code-block-line` and set `zType="highlighted"` on the lines to call out.',
      examples: [
        {
          name: 'highlighted-lines',
          component: ZardDemoCodeBlockHighlightedLinesComponent,
          codeData: CODE_BLOCK_DEMO_HIGHLIGHTED_LINES,
        },
      ],
    },
    {
      id: 'diff',
      title: 'Diff',
      description: 'Set `zType` to `added` or `removed` on a `z-code-block-line`. Each one adds a `+` or `−` marker.',
      examples: [{ name: 'diff', component: ZardDemoCodeBlockDiffComponent, codeData: CODE_BLOCK_DEMO_DIFF }],
    },
    {
      id: 'height',
      title: 'Height',
      description:
        'Cap the height with a `max-h-*` class on `z-code-block-content`. The content scrolls inside the block.',
      examples: [{ name: 'height', component: ZardDemoCodeBlockHeightComponent, codeData: CODE_BLOCK_DEMO_HEIGHT }],
      note: '`z-code-block-content` fades its edges with [`scroll-fade`](/docs/utils/scroll-fade) as it scrolls: left and right by default, top and bottom when it wraps. Add `scroll-fade-y` to a capped block that does not wrap.',
    },
    {
      id: 'show-more',
      title: 'Show More',
      description:
        '`z-code-block-footer` is a slot below the content. For Show More, cap the content while it is collapsed and put a ghost `xs` button in the footer.',
      examples: [
        {
          name: 'show-more',
          component: ZardDemoCodeBlockShowMoreComponent,
          codeData: CODE_BLOCK_DEMO_SHOW_MORE,
          codeAfter: { codeData: CODE_BLOCK_SNIPPET_SHOW_MORE },
        },
      ],
    },
    {
      id: 'show-more-scroll',
      title: 'Max Height',
      description:
        'To keep a long block from taking over the page, raise the cap instead of removing it. The expanded content scrolls, and the edges fade as you scroll.',
      examples: [
        {
          name: 'show-more-scroll',
          component: ZardDemoCodeBlockShowMoreScrollComponent,
          codeData: CODE_BLOCK_DEMO_SHOW_MORE_SCROLL,
        },
      ],
    },
    {
      id: 'size',
      title: 'Size',
      description:
        'Use `zSize="sm"` for tool and [Trace](/docs/components/code-block#trace) output. It has tighter padding and `text-xs` text.',
      examples: [{ name: 'size', component: ZardDemoCodeBlockSizeComponent, codeData: CODE_BLOCK_DEMO_SIZE }],
    },
    {
      id: 'destructive',
      title: 'Destructive',
      description: 'Use `zType="destructive"` for errors and failed output.',
      examples: [
        {
          name: 'destructive',
          component: ZardDemoCodeBlockDestructiveComponent,
          codeData: CODE_BLOCK_DEMO_DESTRUCTIVE,
        },
      ],
    },
    {
      id: 'trace',
      title: 'Trace',
      description:
        'Put a `z-code-block` with `zSize="sm"` in `z-trace-collapsible-content` for tool and terminal output. Add `zWrap` and a `max-h-64` class to `z-code-block-content` so long output wraps and scrolls inside the trace. The block sets its own text color, so `z-trace-collapsible-content` does not mute it.',
      examples: [{ name: 'trace', component: ZardDemoCodeBlockTraceComponent, codeData: CODE_BLOCK_DEMO_TRACE }],
    },
    {
      id: 'tabs',
      title: 'Tabs',
      description: 'Show several files with [Tabs](/docs/components/tabs), one `z-code-block` in each `z-tab`.',
      examples: [{ name: 'tabs', component: ZardDemoCodeBlockTabsComponent, codeData: CODE_BLOCK_DEMO_TABS }],
    },
    {
      id: 'message',
      title: 'Message',
      description: 'Put a `z-code-block` between paragraphs inside a [Message](/docs/components/message).',
      examples: [{ name: 'message', component: ZardDemoCodeBlockMessageComponent, codeData: CODE_BLOCK_DEMO_MESSAGE }],
    },
    {
      id: 'typeset',
      title: 'Typeset',
      description:
        'A `z-code-block` inside a [`typeset`](/docs/typeset) container keeps its own styles and gets the same space above as a paragraph.',
      examples: [{ name: 'typeset', component: ZardDemoCodeBlockTypesetComponent, codeData: CODE_BLOCK_DEMO_TYPESET }],
    },
    {
      id: 'rtl',
      title: 'RTL',
      description:
        'To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl). Code always reads left to right. The header follows the page direction.',
      examples: [
        { name: 'rtl', component: ZardDemoCodeBlockRtlComponent, codeData: CODE_BLOCK_DEMO_RTL, type: 'rtl' as const },
      ],
    },
    {
      id: 'highlighting',
      title: 'Syntax Highlighting',
      description:
        '`injectHighlightedCode()` highlights with [Shiki](https://shiki.style) and returns a signal with one list of tokens per line, for `[zTokens]` on `z-code-block-line`.',
      examples: [
        {
          name: 'highlighting',
          component: ZardDemoCodeBlockHighlightingComponent,
          codeData: CODE_BLOCK_DEMO_HIGHLIGHTING,
          codeAfter: [
            { codeData: CODE_BLOCK_SNIPPET_HIGHLIGHTING },
            { codeData: CODE_BLOCK_SNIPPET_HIGHLIGHTING_TEMPLATE },
          ],
        },
      ],
      note: 'Shiki uses its JavaScript regex engine, so there is no WASM to load.',
    },
    {
      id: 'languages',
      title: 'Languages',
      description:
        'Each language loads the first time it is used. Edit the list in `code-block.highlight.ts`. A language that is not in the list renders as plain text.',
      examples: [
        { name: 'languages', component: ZardDemoCodeBlockLanguagesComponent, codeData: CODE_BLOCK_DEMO_LANGUAGES },
      ],
      note: 'The list ships with `angular-html`, `angular-ts`, `bash`, `css`, `diff`, `html`, `javascript`, `json`, `jsx`, `markdown`, `python`, `scss`, `sql`, `tsx`, `typescript` and `yaml`, plus aliases such as `ts`, `js`, `sh` and `yml`.',
    },
    {
      id: 'terminal',
      title: 'Terminal Output',
      description:
        'Pass `ansi` as the language to render the colors in terminal output. Without it, escape codes show as text.',
      examples: [
        { name: 'terminal', component: ZardDemoCodeBlockTerminalComponent, codeData: CODE_BLOCK_DEMO_TERMINAL },
      ],
      note: 'ANSI colors do not carry from one line to the next.',
    },
    {
      id: 'server-rendering',
      title: 'Server Rendering',
      description:
        '`highlightCode()` is async and has no DOM dependency, so it runs during server rendering and prerendering. A `resource` holds the render until the lines are ready, so the HTML ships already highlighted.',
      examples: [{ name: 'server-rendering', codeData: CODE_BLOCK_SNIPPET_SERVER_RENDERING }],
    },
    {
      id: 'streaming',
      title: 'Streaming',
      description:
        'While the code streams, `injectHighlightedCode()` highlights it again, and every line that did not change keeps its colors, so the block does not flicker as it grows. Disable the copy button with `zDisabled` until the code is complete.',
      examples: [
        { name: 'streaming', component: ZardDemoCodeBlockStreamingComponent, codeData: CODE_BLOCK_DEMO_STREAMING },
      ],
    },
  ],
  accessibility: [
    [
      '- `z-code-block-content` holds a `code` element and always sets `dir="ltr"`, so code reads left to right on an RTL page.',
      '- `z-code-block-content` has `tabindex="0"`, so keyboard users can focus it and scroll it. Set `tabindex="-1"` to remove the tab stop.',
      '- Floating actions show when focus is inside the block, not only on hover, so keyboard users can reach them.',
      '- Line numbers are generated content, so they are not read by screen readers.',
      '- Diff lines carry a `+` or `−` marker as well as a tint, so the change does not rely on color.',
      '- `z-code-block-copy-button` is labelled "Copy", and a polite live region announces "Copied" after a successful copy.',
      '- Give a wrap toggle `aria-pressed` so its state is announced.',
      '- Give a Show More button `aria-expanded` and point `aria-controls` at the `id` of `z-code-block-content`.',
    ].join('\n'),
  ],
};
