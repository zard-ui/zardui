---
title: Code Block
description: Displays code, terminal output and diffs with an optional header, line numbers and a copy button.
---

# Code Block

Displays code, terminal output and diffs with an optional header, line numbers and a copy button.

## Installation

### CLI

```bash
npx zard-cli@latest add code-block
```

### Manual

```angular-ts
import { Clipboard } from '@angular/cdk/clipboard';
import {
  type AfterContentChecked,
  type AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  ElementRef,
  inject,
  input,
  numberAttribute,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { mergeClasses } from '@/shared/utils/merge-classes';

import type { ZardCodeBlockLineTokens } from './code-block.types';
import {
  codeBlockActionsVariants,
  codeBlockCodeVariants,
  codeBlockContentVariants,
  codeBlockFooterVariants,
  codeBlockHeaderVariants,
  codeBlockLineVariants,
  codeBlockTitleVariants,
  codeBlockVariants,
  type ZardCodeBlockLineTypeVariants,
  type ZardCodeBlockSizeVariants,
  type ZardCodeBlockTypeVariants,
} from './code-block.variants';

const COPIED_RESET_MS = 2000;

/**
 * Classes of a highlighted token. Shiki gives every token its light and dark colors as CSS custom properties
 * (`--shiki-light`, `--shiki-dark`, plus `-font-style`, `-font-weight` and `-text-decoration` when a theme sets them);
 * the `dark:` variant picks the dark set, so the output follows the theme of the page without being highlighted again.
 */
const TOKEN_CLASSES = [
  'text-(--shiki-light) [font-style:var(--shiki-light-font-style)] [font-weight:var(--shiki-light-font-weight)] [text-decoration:var(--shiki-light-text-decoration)]',
  'dark:text-(--shiki-dark) dark:[font-style:var(--shiki-dark-font-style)] dark:[font-weight:var(--shiki-dark-font-weight)] dark:[text-decoration:var(--shiki-dark-text-decoration)]',
].join(' ');

@Component({
  selector: 'z-code-block, [z-code-block]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'code-block',
    '[attr.data-variant]': 'zType()',
    '[attr.data-size]': 'zSize()',
    '[class]': 'classes()',
  },
  exportAs: 'zCodeBlock',
})
export class ZardCodeBlockComponent {
  readonly zType = input<ZardCodeBlockTypeVariants>('default');
  readonly zSize = input<ZardCodeBlockSizeVariants>('default');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(codeBlockVariants({ zType: this.zType(), zSize: this.zSize() }), this.class()),
  );
}

@Component({
  selector: 'z-code-block-header, [z-code-block-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'code-block-header',
    '[class]': 'classes()',
  },
  exportAs: 'zCodeBlockHeader',
})
export class ZardCodeBlockHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(codeBlockHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-code-block-title, [z-code-block-title]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'code-block-title',
    '[class]': 'classes()',
  },
  exportAs: 'zCodeBlockTitle',
})
export class ZardCodeBlockTitleComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(codeBlockTitleVariants(), this.class()));
}

@Component({
  selector: 'z-code-block-actions, [z-code-block-actions]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'code-block-actions',
    '[class]': 'classes()',
  },
  exportAs: 'zCodeBlockActions',
})
export class ZardCodeBlockActionsComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(codeBlockActionsVariants(), this.class()));
}

@Component({
  selector: 'z-code-block-copy-button',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button
      z-button
      type="button"
      zType="ghost"
      zSize="icon-xs"
      data-slot="code-block-copy-button"
      [class]="class()"
      [attr.data-copied]="copied() ? '' : null"
      [attr.aria-label]="copied() ? 'Copied' : 'Copy'"
      (click)="copy()"
    >
      <ng-icon [name]="copied() ? 'lucideCheck' : 'lucideCopy'" aria-hidden="true" />
    </button>
    <span aria-live="polite" class="sr-only">{{ copied() ? 'Copied' : '' }}</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideCheck, lucideCopy })],
  host: {
    'data-slot': 'code-block-copy',
    '[class]': 'classes()',
  },
  exportAs: 'zCodeBlockCopyButton',
})
export class ZardCodeBlockCopyButtonComponent {
  private readonly clipboard = inject(Clipboard);

  readonly zValue = input.required<string>();
  readonly class = input<ClassValue>('');

  protected readonly copied = signal(false);

  // The host only wraps the button and the live region, so it adds no box of its own.
  protected readonly classes = computed(() => mergeClasses('contents'));

  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.resetTimer));
  }

  protected async copy(): Promise<void> {
    const value = this.zValue();
    let succeeded = false;

    try {
      await navigator.clipboard.writeText(value);
      succeeded = true;
    } catch {
      // No async Clipboard API (insecure context, denied permission): fall back to the CDK's textarea copy.
      succeeded = this.clipboard.copy(value);
    }

    if (!succeeded) {
      return;
    }

    this.copied.set(true);
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.copied.set(false), COPIED_RESET_MS);
  }
}

@Component({
  selector: 'z-code-block-line, [z-code-block-line]',
  template: `
    <span data-slot="code-block-line-content" class="min-w-0">
      <span data-slot="code-block-line-source" [class]="zTokens() ? 'hidden' : 'contents'"><ng-content /></span>
      @for (token of zTokens(); track $index) {
        <span [class]="tokenClasses" [style]="token.style">{{ token.content }}</span>
      }
      @if (empty()) {
        <ng-container>{{ newline }}</ng-container>
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'code-block-line',
    '[attr.data-variant]': 'zType()',
    '[class]': 'classes()',
  },
  exportAs: 'zCodeBlockLine',
})
export class ZardCodeBlockLineComponent implements AfterContentInit, AfterContentChecked {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly zType = input<ZardCodeBlockLineTypeVariants>('default');
  readonly zTokens = input<ZardCodeBlockLineTokens>();
  readonly class = input<ClassValue>('');

  protected readonly tokenClasses = TOKEN_CLASSES;
  // A blank line holds a newline so that copying a selection keeps it.
  protected readonly newline = '\n';

  private readonly projectedEmpty = signal(false);

  protected readonly empty = computed(() => {
    const tokens = this.zTokens();
    return tokens ? tokens.every(token => token.content === '') : this.projectedEmpty();
  });

  protected readonly classes = computed(() =>
    mergeClasses(codeBlockLineVariants({ zType: this.zType() }), this.class()),
  );

  ngAfterContentInit(): void {
    this.measureProjectedContent();
  }

  ngAfterContentChecked(): void {
    this.measureProjectedContent();
  }

  private measureProjectedContent(): void {
    if (!this.zTokens()) {
      const source = this.host.nativeElement.querySelector('[data-slot="code-block-line-source"]');
      this.projectedEmpty.set((source?.textContent ?? '') === '');
    }
  }
}

@Component({
  selector: 'z-code-block-content, [z-code-block-content]',
  imports: [ZardCodeBlockLineComponent],
  template: `
    <code data-slot="code-block-code" [class]="codeClasses()">
      <span data-slot="code-block-source" [class]="textMode() ? 'hidden' : 'contents'"><ng-content /></span>
      @if (textMode()) {
        @for (line of textLines(); track $index) {
          <span z-code-block-line>{{ line === '' ? newline : line }}</span>
        }
      }
    </code>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'code-block-content',
    // Code always reads left to right, even on a right-to-left page.
    dir: 'ltr',
    // Focusable so keyboard users can scroll it.
    tabindex: '0',
    '[attr.data-wrap]': 'zWrap() ? "" : null',
    '[attr.data-numbered]': 'zLineNumbers() ? "" : null',
    '[style.counter-reset]': 'counterReset()',
    '[class]': 'classes()',
  },
  exportAs: 'zCodeBlockContent',
})
export class ZardCodeBlockContentComponent implements AfterContentChecked {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly zWrap = input(false, { transform: booleanAttribute });
  readonly zLineNumbers = input(false, { transform: booleanAttribute });
  readonly zStartLine = input(1, { transform: numberAttribute });
  readonly class = input<ClassValue>('');

  private readonly lines = contentChildren(ZardCodeBlockLineComponent);

  protected readonly newline = '\n';

  /** A plain string with line numbers: it is split into lines here, since a text node cannot be numbered by CSS. */
  protected readonly textMode = computed(() => this.zLineNumbers() && this.lines().length === 0);
  protected readonly textLines = signal<readonly string[]>([]);

  protected readonly counterReset = computed(() => `line ${this.zStartLine() - 1}`);

  protected readonly classes = computed(() =>
    mergeClasses(codeBlockContentVariants({ zWrap: this.zWrap() }), this.class()),
  );

  protected readonly codeClasses = computed(() =>
    mergeClasses(codeBlockCodeVariants({ zWrap: this.zWrap(), zLineNumbers: this.zLineNumbers() })),
  );

  ngAfterContentChecked(): void {
    if (!this.textMode()) {
      return;
    }

    const source = this.host.nativeElement.querySelector('[data-slot="code-block-source"]');
    const text = (source?.textContent ?? '').replace(/\n$/, '');
    const lines = text.split('\n');
    const current = this.textLines();

    if (lines.length !== current.length || lines.some((line, index) => line !== current[index])) {
      this.textLines.set(lines);
    }
  }
}

@Component({
  selector: 'z-code-block-footer, [z-code-block-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'code-block-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zCodeBlockFooter',
})
export class ZardCodeBlockFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(codeBlockFooterVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const codeBlockVariants = cva(
  mergeClasses(
    'group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded-lg border text-sm',
    'has-[>[data-slot=code-block-content]:focus-visible]:ring-3 has-[>[data-slot=code-block-content]:focus-visible]:ring-ring/50',
  ),
  {
    variants: {
      zType: {
        default:
          'border-input text-foreground dark:bg-input/30 has-[>[data-slot=code-block-content]:focus-visible]:border-ring',
        destructive: 'border-destructive/30 text-destructive dark:border-destructive/40',
      },
      zSize: {
        default: '',
        sm: 'text-xs',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
    },
  },
);

export type ZardCodeBlockTypeVariants = NonNullable<VariantProps<typeof codeBlockVariants>['zType']>;
export type ZardCodeBlockSizeVariants = NonNullable<VariantProps<typeof codeBlockVariants>['zSize']>;

export const codeBlockHeaderVariants = cva(
  mergeClasses(
    'flex min-w-0 shrink-0 items-center gap-2 px-3 pt-3 text-muted-foreground *:has-[>[data-slot=code-block-title]]:min-w-0',
    'group-data-[variant=destructive]/code-block:text-destructive group-data-[size=sm]/code-block:px-2.5 group-data-[size=sm]/code-block:pt-2.5',
  ),
);

export const codeBlockTitleVariants = cva(
  mergeClasses(
    'min-w-0 truncate font-sans text-sm font-medium text-foreground',
    'group-data-[variant=destructive]/code-block:text-destructive group-data-[size=sm]/code-block:text-xs',
    '[&_ng-icon]:me-1.5 [&_ng-icon]:inline-block [&_ng-icon]:align-middle [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-3.5',
  ),
);

export const codeBlockActionsVariants = cva(
  mergeClasses(
    'ms-auto -my-1 -me-1.5 flex shrink-0 items-center gap-1',
    // Without a header the actions float over the top end of the block until it is hovered or focused.
    '[[data-slot=code-block]>&]:absolute [[data-slot=code-block]>&]:end-2 [[data-slot=code-block]>&]:top-2 [[data-slot=code-block]>&]:z-10 [[data-slot=code-block]>&]:m-0',
    '[[data-slot=code-block]>&]:opacity-0 [[data-slot=code-block]>&]:transition-opacity [[data-slot=code-block]>&]:group-focus-within/code-block:opacity-100 [[data-slot=code-block]>&]:group-hover/code-block:opacity-100 [[data-slot=code-block]>&]:pointer-coarse:opacity-100',
    'group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:end-1.5 group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:top-1.5',
    '[[data-slot=code-block]>&]:**:data-[slot=code-block-copy-button]:bg-background [[data-slot=code-block]>&]:**:data-[slot=code-block-copy-button]:ring-1 [[data-slot=code-block]>&]:**:data-[slot=code-block-copy-button]:ring-foreground/10',
  ),
);

export const codeBlockContentVariants = cva(
  mergeClasses(
    'block min-h-0 min-w-0 scroll-fade-x scrollbar-thin overflow-auto px-3 py-3 text-start font-mono leading-relaxed outline-none',
    'group-has-data-[slot=code-block-header]/code-block:pt-2 group-has-data-[slot=code-block-footer]/code-block:pb-2',
    'group-data-[size=sm]/code-block:px-2.5 group-data-[size=sm]/code-block:py-2.5 group-data-[size=sm]/code-block:group-has-data-[slot=code-block-header]/code-block:pt-1.5',
  ),
  {
    variants: {
      zWrap: {
        true: 'scroll-fade-y wrap-anywhere whitespace-pre-wrap',
        false: 'whitespace-pre',
      },
    },
    defaultVariants: {
      zWrap: false,
    },
  },
);

export const codeBlockCodeVariants = cva('grid min-h-lh min-w-max content-start', {
  variants: {
    zWrap: {
      true: 'min-w-0',
      false: '',
    },
    zLineNumbers: {
      true: 'grid-cols-[auto_1fr]',
      false: '',
    },
  },
  defaultVariants: {
    zWrap: false,
    zLineNumbers: false,
  },
});

export const codeBlockLineVariants = cva(
  mergeClasses(
    'relative -mx-3 block min-h-lh px-3 group-data-[size=sm]/code-block:-mx-2.5 group-data-[size=sm]/code-block:px-2.5',
    // The `+` / `−` marker sits in the gutter on the start side, outside the selectable text.
    'after:absolute after:start-1 after:top-0 after:text-muted-foreground after:select-none',
    // Line numbers are a CSS counter, so they are not text: they cannot be selected or copied. The empty alternative
    // text (`/ ''`) also keeps them out of the accessibility tree where the browser supports it.
    'in-data-numbered:col-span-2 in-data-numbered:grid in-data-numbered:grid-cols-subgrid in-data-numbered:gap-x-3 in-data-numbered:[counter-increment:line]',
    'in-data-numbered:before:min-w-6 in-data-numbered:before:text-end in-data-numbered:before:text-muted-foreground in-data-numbered:before:content-[counter(line)] in-data-numbered:before:select-none in-data-numbered:supports-[content:counter(line)_/_""]:before:content-[counter(line)_/_""]',
  ),
  {
    variants: {
      zType: {
        default: '',
        added: 'bg-muted after:content-["+"]',
        removed: 'bg-destructive/10 after:text-destructive after:content-["−"]',
        highlighted: 'bg-muted',
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  },
);

export type ZardCodeBlockLineTypeVariants = NonNullable<VariantProps<typeof codeBlockLineVariants>['zType']>;

export const codeBlockFooterVariants = cva(
  mergeClasses(
    'flex min-w-0 shrink-0 items-center gap-2 px-3 pb-3 text-muted-foreground',
    'group-data-[size=sm]/code-block:px-2.5 group-data-[size=sm]/code-block:pb-2.5',
  ),
);
```

```angular-ts
import type { HighlighterCore } from 'shiki/core';

import type { ZardCodeBlockLineTokens } from './code-block.types';

/**
 * Optional syntax highlighting for `z-code-block`, powered by Shiki.
 *
 * - Shiki is only reached through dynamic `import()` calls, so an application that never calls `highlightCode()` does
 *   not bundle it, and each grammar is its own chunk that loads the first time its language is used.
 * - It uses Shiki's JavaScript regex engine: no WASM file to ship or load.
 * - Nothing here touches the DOM, so it runs on the server (SSR / prerendering) as well as in the browser.
 * - It returns tokens, not HTML. `z-code-block-line` renders them with Angular bindings (text interpolation and style
 *   bindings), so no markup string is ever injected and no sanitizer has to be bypassed.
 *
 * Add the languages you need to `LANGUAGES`; a language that is not listed renders as plain text.
 */
const LANGUAGES = {
  'angular-html': () => import('shiki/langs/angular-html.mjs'),
  'angular-ts': () => import('shiki/langs/angular-ts.mjs'),
  bash: () => import('shiki/langs/shellscript.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  diff: () => import('shiki/langs/diff.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  scss: () => import('shiki/langs/scss.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
};

const ALIASES: Record<string, keyof typeof LANGUAGES> = {
  js: 'javascript',
  md: 'markdown',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  shellscript: 'bash',
  ts: 'typescript',
  yml: 'yaml',
  zsh: 'bash',
};

const THEMES = { light: 'github-light', dark: 'github-dark' } as const;

let highlighter: Promise<HighlighterCore> | undefined;
const loadingLanguages = new Map<string, Promise<void>>();

function getHighlighter(): Promise<HighlighterCore> {
  highlighter ??= Promise.all([import('shiki/core'), import('shiki/engine/javascript')])
    .then(([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
      createHighlighterCore({
        themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
        langs: [],
        engine: createJavaScriptRegexEngine({ forgiving: true }),
      }),
    )
    .catch((error: unknown) => {
      // A failed load is not cached: the next call tries again.
      highlighter = undefined;
      throw error;
    });

  return highlighter;
}

function resolveLanguage(language: string): keyof typeof LANGUAGES | 'ansi' | null {
  const name = language.trim().toLowerCase();

  if (name === 'ansi') {
    return name;
  }

  // Own keys only: `__proto__` or `constructor` are not languages.
  if (Object.hasOwn(LANGUAGES, name)) {
    return name as keyof typeof LANGUAGES;
  }

  return Object.hasOwn(ALIASES, name) ? ALIASES[name] : null;
}

async function loadLanguage(shiki: HighlighterCore, language: keyof typeof LANGUAGES): Promise<void> {
  if (shiki.getLoadedLanguages().includes(language)) {
    return;
  }

  let loading = loadingLanguages.get(language);

  if (!loading) {
    loading = shiki.loadLanguage(LANGUAGES[language]()).catch((error: unknown) => {
      loadingLanguages.delete(language);
      throw error;
    });
    loadingLanguages.set(language, loading);
  }

  await loading;
}

function plainLines(code: string): ZardCodeBlockLineTokens[] {
  return code.split('\n').map(line => (line === '' ? [] : [{ content: line }]));
}

/**
 * Highlights `code` and returns one list of tokens per line, ready for `<z-code-block-line [zTokens]="line" />`.
 *
 * - `language` is a language of the list above (`'typescript'`, `'json'`, `'bash'`...), one of its aliases (`'ts'`,
 *   `'sh'`...) or `'ansi'` for terminal output. Anything else resolves with plain, unstyled lines.
 * - One trailing newline is ignored, so it does not render as an extra empty line.
 * - Blank lines are kept (an empty token list).
 * - ANSI colors do not carry from one line to the next: each line is tokenized on its own.
 * - Colors come in a light and a dark variant (`--shiki-light` / `--shiki-dark`); the line component picks one with the
 *   `dark:` variant, so the output follows the theme without being highlighted again.
 *
 * The promise rejects if Shiki or a grammar cannot be loaded (for instance when the `shiki` package is not installed).
 */
export async function highlightCode(code: string, language: string): Promise<ZardCodeBlockLineTokens[]> {
  const source = code.endsWith('\n') ? code.slice(0, -1) : code;
  const resolved = resolveLanguage(language);

  if (!resolved) {
    return plainLines(source);
  }

  const shiki = await getHighlighter();

  if (resolved !== 'ansi') {
    await loadLanguage(shiki, resolved);
  }

  const tokenize = (text: string) =>
    shiki.codeToTokens(text, { lang: resolved, themes: THEMES, defaultColor: false }).tokens;

  const lines = resolved === 'ansi' ? source.split('\n').flatMap(line => tokenize(line)) : tokenize(source);

  return lines.map(line =>
    line
      .filter(token => token.content !== '')
      .map(token =>
        token.htmlStyle ? { content: token.content, style: token.htmlStyle } : { content: token.content },
      ),
  );
}
```

```angular-ts
import {
  ZardCodeBlockActionsComponent,
  ZardCodeBlockComponent,
  ZardCodeBlockContentComponent,
  ZardCodeBlockCopyButtonComponent,
  ZardCodeBlockFooterComponent,
  ZardCodeBlockHeaderComponent,
  ZardCodeBlockLineComponent,
  ZardCodeBlockTitleComponent,
} from '@/shared/components/code-block/code-block.component';

export const ZardCodeBlockImports = [
  ZardCodeBlockComponent,
  ZardCodeBlockHeaderComponent,
  ZardCodeBlockTitleComponent,
  ZardCodeBlockActionsComponent,
  ZardCodeBlockCopyButtonComponent,
  ZardCodeBlockContentComponent,
  ZardCodeBlockLineComponent,
  ZardCodeBlockFooterComponent,
] as const;
```

```angular-ts
/**
 * One piece of a highlighted line.
 *
 * `style` carries Shiki's CSS custom properties (`--shiki-light`, `--shiki-dark`, ...). The line component renders it
 * through Angular's style binding, so nothing here is ever parsed as HTML.
 */
export interface ZardCodeBlockToken {
  readonly content: string;
  readonly style?: Readonly<Record<string, string>>;
}

/** The tokens of one line, as returned by `highlightCode()` and consumed by `z-code-block-line` through `[zTokens]`. */
export type ZardCodeBlockLineTokens = readonly ZardCodeBlockToken[];
```

```angular-ts
export * from './code-block.component';
export * from './code-block.highlight';
export * from './code-block.imports';
export * from './code-block.types';
export * from './code-block.variants';
```

## Usage

```angular-ts
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
```

```angular-html
<z-code-block>
  <z-code-block-header>
    <z-code-block-title>install.sh</z-code-block-title>
    <z-code-block-actions>
      <z-code-block-copy-button [zValue]="command" />
    </z-code-block-actions>
  </z-code-block-header>
  <z-code-block-content>{{ command }}</z-code-block-content>
</z-code-block>
```

## Examples

### Basic

Project a string into `z-code-block-content`; it renders as one text node. Without a header, put `z-code-block-actions` directly in `z-code-block` to float a copy button at the top end.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-basic',
  imports: [ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      <z-code-block>
        <z-code-block-content>npx zard-cli@latest add button</z-code-block-content>
      </z-code-block>

      <z-code-block>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="command" />
        </z-code-block-actions>
        <z-code-block-content>{{ command }}</z-code-block-content>
      </z-code-block>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockBasicComponent {
  protected readonly command = 'npx zard-cli@latest add button';
}
```

### Header

Put a `z-code-block-title`, with an optional `ng-icon`, and `z-code-block-actions` in a `z-code-block-header`. `z-code-block-copy-button` copies its `[zValue]`. A long title truncates.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileCode } from '@ng-icons/lucide';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-header',
  imports: [ZardCodeBlockImports, NgIcon],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>
          <ng-icon name="lucideFileCode" aria-hidden="true" />
          src/app/app.config.ts
        </z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content>{{ code }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFileCode })],
})
export class ZardDemoCodeBlockHeaderComponent {
  protected readonly code = `export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration()],
};`;
}
```

### Line Numbers

Add `zLineNumbers` to number the lines; a string is split into lines for you. Use `[zStartLine]` for a snippet from the middle of a file. The numbers are generated content, so they are not selected, copied or read by screen readers, and blank lines are kept. A `z-code-block-line` with `zType="highlighted"` calls a line out.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import type { ZardCodeBlockLineTypeVariants } from '@/shared/components/code-block/code-block.variants';

interface DemoLine {
  text: string;
  type?: ZardCodeBlockLineTypeVariants;
}

@Component({
  selector: 'z-demo-code-block-line-numbers',
  imports: [ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      <z-code-block>
        <z-code-block-content zLineNumbers>{{ commands }}</z-code-block-content>
      </z-code-block>

      <z-code-block>
        <z-code-block-header>
          <z-code-block-title>app.routes.ts</z-code-block-title>
        </z-code-block-header>
        <z-code-block-content zLineNumbers [zStartLine]="12">
          @for (line of routes; track $index) {
            <z-code-block-line [zType]="line.type ?? 'default'">{{ line.text }}</z-code-block-line>
          }
        </z-code-block-content>
      </z-code-block>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockLineNumbersComponent {
  protected readonly commands = `npm install zard-cli
npx zard-cli@latest init

npx zard-cli@latest add button`;

  protected readonly routes: DemoLine[] = [
    { text: 'export const routes: Routes = [' },
    { text: "  { path: '', component: HomePage }," },
    { text: "  { path: 'docs', component: DocsPage },", type: 'highlighted' },
    { text: '' },
    { text: "  { path: '**', redirectTo: '' }," },
    { text: '];' },
  ];
}
```

### Wrap

Long lines scroll by default. Add `zWrap` to wrap them, which suits tool output and error messages. To let the reader toggle it, keep the state yourself and give the button `aria-pressed`.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideWrapText } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-wrap',
  imports: [ZardCodeBlockImports, ZardButtonComponent, NgIcon],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      <z-code-block>
        <z-code-block-content zWrap>{{ output }}</z-code-block-content>
      </z-code-block>

      <z-code-block>
        <z-code-block-header>
          <z-code-block-title>build.log</z-code-block-title>
          <z-code-block-actions>
            <button
              z-button
              type="button"
              zType="ghost"
              zSize="icon-xs"
              aria-label="Wrap lines"
              [attr.aria-pressed]="wrap()"
              (click)="wrap.set(!wrap())"
            >
              <ng-icon name="lucideWrapText" aria-hidden="true" />
            </button>
            <z-code-block-copy-button [zValue]="output" />
          </z-code-block-actions>
        </z-code-block-header>
        <z-code-block-content [zWrap]="wrap()">{{ output }}</z-code-block-content>
      </z-code-block>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideWrapText })],
})
export class ZardDemoCodeBlockWrapComponent {
  protected readonly wrap = signal(false);

  protected readonly output =
    'Error: Cannot find module "@/shared/components/button/button.component" imported from /workspace/apps/web/src/app/domain/pages/dashboard/dashboard.page.ts. Did you run "npx zard-cli@latest add button"?';
}
```

### Diff

Render each line as a `z-code-block-line` and set `zType` to `added` or `removed`. Each adds a `+` or `−` marker next to the tint, so the change does not rely on color. The markers are not part of the text and are not copied with a selection.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import type { ZardCodeBlockLineTypeVariants } from '@/shared/components/code-block/code-block.variants';

const PATCH = ` export class ZardButtonComponent {
-  readonly zType = input('default');
+  readonly zType = input<ZardButtonTypeVariants>('default');
   readonly zSize = input<ZardButtonSizeVariants>('default');
 }`;

@Component({
  selector: 'z-demo-code-block-diff',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>button.component.ts</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="patch" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zLineNumbers>
        @for (line of lines; track $index) {
          <z-code-block-line [zType]="line.type">{{ line.text }}</z-code-block-line>
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockDiffComponent {
  protected readonly patch = PATCH;

  // The `+` / `-` marker is drawn by the line itself, so it is removed from the text.
  protected readonly lines: { text: string; type: ZardCodeBlockLineTypeVariants }[] = PATCH.split('\n').map(line => ({
    text: line.slice(1),
    type: line.startsWith('+') ? 'added' : line.startsWith('-') ? 'removed' : 'default',
  }));
}
```

### Height

Cap the height with a `max-h-*` class on `z-code-block-content`. The content scrolls inside the block and is focusable, so keyboard users can scroll it. Add `scroll-fade-y` to fade the edges.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-height',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>package.json</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zLineNumbers class="scroll-fade-y max-h-48">{{ code }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockHeightComponent {
  protected readonly code = `{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "@angular/core": "^21.2.0",
    "@angular/common": "^21.2.0",
    "@ng-icons/core": "^34.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.4.0"
  }
}`;
}
```

### Show More

Use `z-code-block-footer` for a slot below the content. For Show more, cap the content while it is collapsed and put a ghost `xs` button in the footer, with `aria-expanded` and `aria-controls` pointing at the content `id`.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-show-more',
  imports: [ZardCodeBlockImports, ZardButtonComponent],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>chat.component.ts</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content id="show-more-code" zLineNumbers [class]="cap()">{{ code }}</z-code-block-content>
      <z-code-block-footer class="justify-center">
        <button
          z-button
          type="button"
          zType="ghost"
          zSize="xs"
          aria-controls="show-more-code"
          [attr.aria-expanded]="expanded()"
          (click)="expanded.set(!expanded())"
        >
          {{ expanded() ? 'Show less' : 'Show more' }}
        </button>
      </z-code-block-footer>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockShowMoreComponent {
  protected readonly expanded = signal(false);

  protected readonly cap = computed(() => (this.expanded() ? 'max-h-96' : 'scroll-fade-y max-h-40 overflow-y-hidden'));

  protected readonly code = `@Component({
  selector: 'app-chat',
  imports: [FormsModule, ZardButtonComponent, ZardInputDirective],
  template: \`
    @for (message of messages(); track message.id) {
      <p>{{ message.text }}</p>
    }
    <input z-input [(ngModel)]="draft" />
    <button z-button (click)="send()">Send</button>
  \`,
})
export class ChatComponent {
  protected readonly messages = signal<Message[]>([]);
  protected draft = '';

  protected send(): void {
    this.messages.update(messages => [...messages, { id: crypto.randomUUID(), text: this.draft }]);
    this.draft = '';
  }
}`;
}
```

### Highlighting

Syntax highlighting is opt-in. `highlightCode()` loads Shiki and the language on first use, with its JavaScript engine, and resolves one list of tokens per line; pass each one to `[zTokens]`. Colors follow the light and dark theme without highlighting again.

```angular-ts
import { ChangeDetectionStrategy, Component, resource } from '@angular/core';

import { highlightCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CODE = `import { Component, input } from '@angular/core';

@Component({
  selector: 'app-greeting',
  template: \`<p>Hello, {{ name() }}!</p>\`,
})
export class GreetingComponent {
  readonly name = input('world');
}`;

@Component({
  selector: 'z-demo-code-block-highlighting',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>greeting.component.ts</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zLineNumbers>
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockHighlightingComponent {
  protected readonly code = CODE;

  // Shiki is loaded on demand. A resource also holds the server render until the code is highlighted.
  private readonly highlighted = resource({ loader: () => highlightCode(CODE, 'typescript') });

  // Plain lines are shown until the highlighted ones arrive.
  protected lines() {
    // Reading `value()` of a failed resource throws, so check it first.
    if (this.highlighted.hasValue()) {
      return this.highlighted.value();
    }

    return CODE.split('\n').map(line => (line ? [{ content: line }] : []));
  }
}
```

### Terminal

Pass `ansi` as the language to render the colors of terminal output. Without it the escape codes show as text. ANSI colors do not carry from one line to the next.

```angular-ts
import { ChangeDetectionStrategy, Component, resource } from '@angular/core';

import { highlightCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const ESC = String.fromCharCode(27);

const OUTPUT = [
  `${ESC}[1m$ npm test${ESC}[0m`,
  '',
  `${ESC}[32m PASS ${ESC}[0m libs/zard/button.component.spec.ts`,
  `${ESC}[32m PASS ${ESC}[0m libs/zard/card.component.spec.ts`,
  `${ESC}[31m FAIL ${ESC}[0m libs/zard/dialog.component.spec.ts`,
  `  ${ESC}[31m●${ESC}[0m opens and closes`,
  '',
  `${ESC}[1mTests:${ESC}[0m  ${ESC}[31m1 failed${ESC}[0m, ${ESC}[32m24 passed${ESC}[0m, 25 total`,
].join('\n');

// The text to copy has no escape codes.
const PLAIN_OUTPUT = OUTPUT.replace(new RegExp(`${ESC}\\[[0-9;]*m`, 'g'), '');

@Component({
  selector: 'z-demo-code-block-terminal',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>Terminal</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="copyValue" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content>
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockTerminalComponent {
  protected readonly copyValue = PLAIN_OUTPUT;

  private readonly highlighted = resource({ loader: () => highlightCode(OUTPUT, 'ansi') });

  // Without the highlighter the escape codes are removed, so the output stays readable.
  protected lines() {
    // Reading `value()` of a failed resource throws, so check it first.
    if (this.highlighted.hasValue()) {
      return this.highlighted.value();
    }

    return PLAIN_OUTPUT.split('\n').map(line => (line ? [{ content: line }] : []));
  }
}
```

### Variants

Use `zType="destructive"` for errors and failed output, and `zSize="sm"` for tight tool output: it has smaller padding and `text-xs` code.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-variants',
  imports: [ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      <z-code-block zType="destructive">
        <z-code-block-header>
          <z-code-block-title>Error</z-code-block-title>
          <z-code-block-actions>
            <z-code-block-copy-button [zValue]="error" />
          </z-code-block-actions>
        </z-code-block-header>
        <z-code-block-content zWrap>{{ error }}</z-code-block-content>
      </z-code-block>

      <z-code-block zSize="sm">
        <z-code-block-header>
          <z-code-block-title>Output</z-code-block-title>
          <z-code-block-actions>
            <z-code-block-copy-button [zValue]="output" />
          </z-code-block-actions>
        </z-code-block-header>
        <z-code-block-content zWrap>{{ output }}</z-code-block-content>
      </z-code-block>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockVariantsComponent {
  protected readonly error = `TypeError: Cannot read properties of undefined (reading 'name')
    at GreetingComponent.ngOnInit (greeting.component.ts:12:30)`;

  protected readonly output = `Compiled successfully in 1.2s
12 modules transformed.`;
}
```

### Rtl

To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl). Code always reads left to right; the header follows the page direction.

```angular-ts
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface CodeBlockRtlValues {
  title: string;
}

const translations: ZardRtlTranslations<CodeBlockRtlValues> = {
  en: { dir: 'ltr', values: { title: 'Install' } },
  ar: { dir: 'rtl', values: { title: 'التثبيت' } },
  he: { dir: 'rtl', values: { title: 'התקנה' } },
};

@Component({
  selector: 'z-demo-code-block-rtl',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>{{ i18n.t().title }}</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="command" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zLineNumbers>{{ command }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  // Code always reads left to right: only the header follows the page direction.
  protected readonly command = `npm install zard-cli
npx zard-cli@latest add button`;
}
```

## API Reference

### z-code-block, [z-code-block]

The surface that holds the header, the content and the footer.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zType]` | Visual variant; `destructive` is for error output | `'default' \| 'destructive'` | `'default'` |
| `[zSize]` | Size; `sm` has tighter padding and `text-xs` code, for tool output | `'default' \| 'sm'` | `'default'` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-code-block-header, [z-code-block-header]

Row above the content for a title and actions.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-code-block-title, [z-code-block-title]

Filename or label, with an optional `ng-icon`. A long title truncates.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-code-block-actions, [z-code-block-actions]

Holds buttons at the end of the header. As a direct child of `z-code-block` it floats at the top end, hidden until the block is hovered or has focus inside (always visible on touch screens).

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-code-block-copy-button

Ghost icon button that copies its value to the clipboard and announces "Copied" in a polite live region.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zValue]` | Text to copy (required) | `string` | `-` |
| `[class]` | Custom CSS classes for the button | `ClassValue` | `''` |

### z-code-block-content, [z-code-block-content]

The scrollable, keyboard-focusable code area; it is always `dir="ltr"`. Project a string, or `z-code-block-line` children when lines need a type or highlighted tokens.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zWrap]` | Wrap long lines instead of scrolling horizontally | `boolean` | `false` |
| `[zLineNumbers]` | Number each line. A string is split into lines; numbers are not selectable or copied | `boolean` | `false` |
| `[zStartLine]` | Number of the first line when `zLineNumbers` is set | `number` | `1` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-code-block-line, [z-code-block-line]

One line of code.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zType]` | State of the line; `added` and `removed` also draw a `+` or `−` marker | `'default' \| 'added' \| 'removed' \| 'highlighted'` | `'default'` |
| `[zTokens]` | One line returned by `highlightCode()`; the projected text is hidden while it is set | `ZardCodeBlockLineTokens` | `-` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-code-block-footer, [z-code-block-footer]

Row below the content, for example for a Show more button.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### highlightCode(code, language)

Optional syntax highlighting with Shiki (JavaScript regex engine, no WASM). Shiki and each language load on first use, and it runs on the server. Returns tokens, not HTML: render each line with `[zTokens]`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `code` | The code to highlight; one trailing newline is ignored | `string` | `-` |
| `language` | A language of `code-block.highlight.ts`, an alias (`ts`, `js`, `sh`, `yml`...) or `ansi` for terminal output. Any other value gives plain lines | `string` | `-` |
| `returns` | One list of tokens per line, with light and dark colors; blank lines are empty lists | `Promise<ZardCodeBlockLineTokens[]>` | `-` |

---

[Open in browser](https://zardui.com/docs/components/code-block)
