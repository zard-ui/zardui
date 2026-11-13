---
title: Code Block
description: Displays code, terminal output and diffs with an optional header, line numbers and a copy button.
---

# Code Block

Displays code, terminal output and diffs with an optional header, line numbers and a copy button.

`z-code-block` displays code, terminal output, logs and diffs. It has a header with a title and actions, line numbers, wrapping, diff and highlighted lines, and a small size for tool output in a [Trace](/docs/components/trace).

Syntax highlighting is optional and lives in a separate file, `code-block.highlight.ts`, so a block that only shows plain output stays small.

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
      [class]="buttonClasses()"
      [zDisabled]="zDisabled()"
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
  /** Disables the button, such as while streamed code is still incomplete. */
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  protected readonly copied = signal(false);

  // The host only wraps the button and the live region, so it adds no box of its own.
  protected readonly classes = computed(() => mergeClasses('contents'));
  protected readonly buttonClasses = computed(() =>
    mergeClasses('hover:bg-foreground/5 dark:hover:bg-foreground/10', this.class()),
  );

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
    'group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded-2xl text-sm data-[size=sm]:rounded-xl',
    'has-[>[data-slot=code-block-content]:focus-visible]:ring-3 has-[>[data-slot=code-block-content]:focus-visible]:ring-ring/30',
  ),
  {
    variants: {
      zType: {
        default: 'bg-muted text-foreground ring-1 ring-foreground/5 dark:ring-foreground/10',
        // shadcn/ui tints the light surface with `bg-destructive/5`, which takes the red text to 4.36:1. A 2% tint
        // keeps the same look and stays above the 4.5:1 that WCAG AA asks of body text.
        destructive:
          'bg-destructive/2 text-destructive ring-1 ring-destructive/15 dark:bg-destructive/10 dark:ring-destructive/20',
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
    'flex min-w-0 shrink-0 items-center gap-2 px-4 pt-4 text-muted-foreground *:has-[>[data-slot=code-block-title]]:min-w-0',
    'group-data-[variant=destructive]/code-block:text-destructive group-data-[size=sm]/code-block:px-3 group-data-[size=sm]/code-block:pt-3',
  ),
);

export const codeBlockTitleVariants = cva(
  mergeClasses(
    'min-w-0 truncate font-sans text-sm font-medium text-foreground',
    'group-data-[variant=destructive]/code-block:text-destructive group-data-[size=sm]/code-block:text-xs',
    '[&_ng-icon]:me-1.5 [&_ng-icon]:inline-block [&_ng-icon]:align-middle [&_svg]:pointer-events-none',
    '[--ng-icon__size:1rem] [&_svg:not([class*="size-"])]:size-4 group-data-[size=sm]/code-block:[--ng-icon__size:0.875rem] group-data-[size=sm]/code-block:[&_svg:not([class*="size-"])]:size-3.5',
  ),
);

export const codeBlockActionsVariants = cva(
  mergeClasses(
    'ms-auto -my-1 -me-1.5 flex shrink-0 items-center gap-1 *:data-[slot=button]:hover:bg-foreground/5 dark:*:data-[slot=button]:hover:bg-foreground/10',
    // Without a header the actions float over the top end of the block until it is hovered or focused.
    '[[data-slot=code-block]>&]:absolute [[data-slot=code-block]>&]:end-3 [[data-slot=code-block]>&]:top-3 [[data-slot=code-block]>&]:z-10 [[data-slot=code-block]>&]:m-0',
    '[[data-slot=code-block]>&]:opacity-0 [[data-slot=code-block]>&]:transition-opacity [[data-slot=code-block]>&]:group-focus-within/code-block:opacity-100 [[data-slot=code-block]>&]:group-hover/code-block:opacity-100 [[data-slot=code-block]>&]:pointer-coarse:opacity-100',
    'group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:end-2 group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:top-2',
    '[[data-slot=code-block]>&]:**:data-[slot=code-block-copy-button]:bg-background [[data-slot=code-block]>&]:**:data-[slot=code-block-copy-button]:ring-1 [[data-slot=code-block]>&]:**:data-[slot=code-block-copy-button]:ring-foreground/10',
  ),
);

export const codeBlockContentVariants = cva(
  mergeClasses(
    'block min-h-0 min-w-0 scroll-fade-x scrollbar-thin overflow-auto px-4 py-4 text-start font-mono leading-relaxed outline-none',
    'group-has-data-[slot=code-block-header]/code-block:pt-2 group-has-data-[slot=code-block-footer]/code-block:pb-2',
    'group-data-[size=sm]/code-block:px-3 group-data-[size=sm]/code-block:py-3 group-data-[size=sm]/code-block:group-has-data-[slot=code-block-header]/code-block:pt-1.5',
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
    'relative -mx-4 block min-h-lh px-4 group-data-[size=sm]/code-block:-mx-3 group-data-[size=sm]/code-block:px-3',
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
        added: 'bg-foreground/5 after:content-["+"]',
        removed: 'bg-destructive/10 after:text-destructive after:content-["−"]',
        highlighted: 'bg-foreground/5',
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
    'flex min-w-0 shrink-0 items-center gap-2 px-4 pb-4 text-muted-foreground',
    'group-data-[size=sm]/code-block:px-3 group-data-[size=sm]/code-block:pb-3',
  ),
);
```

```angular-ts
import { computed, effect, resource, signal, type Signal } from '@angular/core';

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

/** The rows of `code`, ignoring one trailing newline like `highlightCode()` does. */
function toRows(code: string): string[] {
  return (code.endsWith('\n') ? code.slice(0, -1) : code).split('\n');
}

function toPlainLine(line: string): ZardCodeBlockLineTokens {
  return line === '' ? [] : [{ content: line }];
}

/**
 * The lines of `code`, highlighted, as a signal: the Angular counterpart of shadcn/ui's `useHighlightedCode`. Call it
 * in an injection context (a field initializer or the constructor of a component).
 *
 * - It returns plain lines until Shiki has highlighted the code, and for a language that is not in the list.
 * - `code` and `language` can be signals: when they change, the code is highlighted again. While a new pass runs, every
 *   line that did not change keeps its colors, so streamed code does not flicker as it grows.
 * - It runs through a `resource`, so a server render waits for the highlighted lines.
 *
 * ```ts
 * protected readonly lines = injectHighlightedCode(this.code, 'typescript');
 * ```
 * ```html
 * @for (line of lines(); track $index) {
 *   <z-code-block-line [zTokens]="line" />
 * }
 * ```
 */
export function injectHighlightedCode(
  code: string | (() => string),
  language: string | (() => string),
): Signal<ZardCodeBlockLineTokens[]> {
  const read = (value: string | (() => string)) => (typeof value === 'function' ? value() : value);

  const highlighted = resource({
    params: () => ({ code: read(code), language: read(language) }),
    loader: async ({ params }) => ({ source: params.code, lines: await highlightCode(params.code, params.language) }),
  });

  // The last finished pass, kept while the next one runs. Recorded by an effect as soon as a pass finishes, not when
  // the lines are next read, so a change that lands before the first read does not drop the colors.
  const settled = signal<{ rows: string[]; lines: ZardCodeBlockLineTokens[] } | undefined>(undefined);

  effect(() => {
    // Reading `value()` of a failed resource throws, so check it first.
    if (highlighted.hasValue()) {
      const { source, lines } = highlighted.value();
      settled.set({ rows: toRows(source), lines });
    }
  });

  return computed(() => {
    const last = highlighted.hasValue()
      ? { rows: toRows(highlighted.value().source), ...highlighted.value() }
      : settled();

    return toRows(read(code)).map((row, index) => (last?.rows[index] === row ? last.lines[index] : toPlainLine(row)));
  });
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
    <z-code-block-title>Terminal</z-code-block-title>
    <z-code-block-actions>
      <z-code-block-copy-button [zValue]="output" />
    </z-code-block-actions>
  </z-code-block-header>
  <z-code-block-content>{{ output }}</z-code-block-content>
</z-code-block>
```

## Composition

```text
z-code-block
├── z-code-block-header
│   ├── z-code-block-title
│   └── z-code-block-actions
│       └── z-code-block-copy-button
├── z-code-block-actions (floating, when there is no header)
├── z-code-block-content
│   └── z-code-block-line
└── z-code-block-footer
```

`z-code-block-content` takes a string or a list of `z-code-block-line`. Use lines when you need line types or highlighted tokens.

## Features

- **It streams cheaply.** A string renders as one text node, and while code streams the highlighter keeps the colors of the lines that did not change.
- **It copies cleanly.** Line numbers and diff markers are left out of a selection, and blank lines survive the copy.
- **It reads left to right.** The content is always `dir="ltr"`. The header follows the page direction.
- **It highlights without WASM.** `highlightCode()` uses Shiki's JavaScript engine, loads each language on first use and renders ANSI colors in terminal output. It also runs on the server, so prerendered pages ship highlighted.
- **It fits where code shows up.** Use it in a message, a Trace line, Tabs, a Dialog or a `typeset` container.
- **It scrolls by keyboard.** The content is focusable, and floating actions show on focus as well as on hover.

## Basic

Project a string into `z-code-block-content`. It renders as one text node, so it stays cheap while output streams.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-basic',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-content>{{ output }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockBasicComponent {
  protected readonly output = `$ ng build
Initial chunk files   | Names         |  Raw size | Estimated transfer size
main-HJ2K4QXZ.js      | main          | 208.31 kB |                56.24 kB
styles-5INURTSO.css   | styles        |  14.07 kB |                 3.18 kB

                      | Initial total | 222.38 kB |                59.42 kB

Application bundle generation complete. [4.218 seconds]`;
}
```

## Header

`z-code-block-header` holds a `z-code-block-title` and `z-code-block-actions`. `z-code-block-copy-button` copies its `[zValue]`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const COMMAND = 'pnpm add @angular/cdk @ng-icons/core @ng-icons/lucide';

@Component({
  selector: 'z-demo-code-block-header',
  imports: [NgIcon, ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>
          <ng-icon name="lucideTerminal" />
          Terminal
        </z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="command" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content>{{ output }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockHeaderComponent {
  protected readonly command = COMMAND;
  protected readonly output = `$ ${COMMAND}
Packages: +9
Progress: resolved 412, reused 403, downloaded 9, added 9, done
Done in 2.8s using pnpm v10.18.0`;
}
```

A long title truncates. To link the title to a file, wrap `z-code-block-title` in an anchor.

```angular-html
<z-code-block-header>
  <a href="/files/chat.service.ts">
    <z-code-block-title>src/app/chat/chat.service.ts</z-code-block-title>
  </a>
</z-code-block-header>
```

## Actions

`z-code-block-actions` holds any number of buttons. For a wrap toggle, keep the state yourself and bind it to `zWrap`.

```angular-ts
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideTerminal, lucideWrapText } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const OUTPUT = `$ ng lint
src/app/chat/message-list.component.ts
  18:22  error    Unsafe call of an \`any\` typed value. Add a type to messages before calling map  @typescript-eslint/no-unsafe-call
  42:7   warning  Prefer signal inputs over @Input() decorators so the template reacts to changes  @angular-eslint/prefer-signals

✖ 2 problems (1 error, 1 warning)`;

@Component({
  selector: 'z-demo-code-block-actions',
  imports: [NgIcon, ZardButtonComponent, ...ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>
          <ng-icon name="lucideTerminal" />
          Terminal
        </z-code-block-title>
        <z-code-block-actions>
          <button
            type="button"
            z-button
            zType="ghost"
            zSize="icon-xs"
            aria-label="Wrap lines"
            class="aria-pressed:text-foreground"
            [attr.aria-pressed]="wrap()"
            (click)="wrap.set(!wrap())"
          >
            <ng-icon name="lucideWrapText" />
          </button>
          <button type="button" z-button zType="ghost" zSize="icon-xs" aria-label="Download" (click)="download()">
            <ng-icon name="lucideDownload" />
          </button>
          <z-code-block-copy-button [zValue]="output" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content [zWrap]="wrap()">{{ output }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideDownload, lucideTerminal, lucideWrapText })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockActionsComponent {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly output = OUTPUT;
  protected readonly wrap = signal(true);

  protected download(): void {
    if (!this.isBrowser) {
      return;
    }

    const url = URL.createObjectURL(new Blob([OUTPUT], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lint.log';
    link.click();
    URL.revokeObjectURL(url);
  }
}
```

```angular-html
<z-code-block-actions>
  <button
    type="button"
    z-button
    zType="ghost"
    zSize="icon-xs"
    aria-label="Wrap lines"
    [attr.aria-pressed]="wrap()"
    (click)="wrap.set(!wrap())"
  >
    <ng-icon name="lucideWrapText" />
  </button>
  <z-code-block-copy-button [zValue]="output" />
</z-code-block-actions>
<z-code-block-content [zWrap]="wrap()">{{ output }}</z-code-block-content>
```

## Floating Actions

Without a header, put `z-code-block-actions` directly inside `z-code-block`. The actions float at the top end and stay hidden until the block is hovered or focused. They always show on touch screens.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-floating-actions',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-actions>
        <z-code-block-copy-button [zValue]="output" />
      </z-code-block-actions>
      <z-code-block-content>{{ output }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockFloatingActionsComponent {
  protected readonly output = `$ pnpm add @angular/cdk @ng-icons/core @ng-icons/lucide
Progress: resolved 412, reused 403, downloaded 9, added 9, done
dependencies:
+ @angular/cdk 21.0.2
+ @ng-icons/core 32.2.0
+ @ng-icons/lucide 32.2.0
Done in 2.8s using pnpm v10.18.0`;
}
```

## Line Numbers

Add `zLineNumbers` to `z-code-block-content`. A string is split into lines, and the numbers are not copied with a selection.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-line-numbers',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-content zLineNumbers>{{ code }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockLineNumbersComponent {
  protected readonly code = `{
  "name": "chat",
  "private": true,
  "scripts": {
    "start": "ng serve",
    "build": "ng build"
  }
}`;
}
```

## Start Line

Set `[zStartLine]` to number lines from a given line, for a snippet from the middle of a file. The gutter grows to fit the widest number.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CODE = `  if (!session) {
    return this.router.parseUrl('/login');
  }

  const projects = await this.projects.findAll({
    ownerId: session.user.id,
    orderBy: 'updatedAt',
  });

  this.projectList.set(projects);
}`;

@Component({
  selector: 'z-demo-code-block-start-line',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>src/app/dashboard/dashboard.component.ts</z-code-block-title>
      </z-code-block-header>
      <z-code-block-content zLineNumbers [zStartLine]="995">
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockStartLineComponent {
  protected readonly lines = injectHighlightedCode(CODE, 'typescript');
}
```

## Wrap

Long lines scroll by default. Add `zWrap` to wrap them, which suits tool output and error messages. To let the reader toggle it, see [Actions](/docs/components/code-block#actions).

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-wrap',
  imports: [ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      <z-code-block>
        <z-code-block-content>{{ output }}</z-code-block-content>
      </z-code-block>
      <z-code-block>
        <z-code-block-content zWrap>{{ output }}</z-code-block-content>
      </z-code-block>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockWrapComponent {
  protected readonly output =
    'NG0201: No provider found for `HttpClient`. Source: Standalone[ChatComponent]. Path: ChatService -> HttpClient. Add provideHttpClient() to the providers of your application config and try again.';
}
```

## Highlighted Lines

Render each line as a `z-code-block-line` and set `zType="highlighted"` on the lines to call out.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CODE = `export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
  ],
};`;

@Component({
  selector: 'z-demo-code-block-highlighted-lines',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-content zLineNumbers>
        @for (line of lines; track $index) {
          <z-code-block-line [zTokens]="line" [zType]="highlighted.includes($index) ? 'highlighted' : 'default'" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockHighlightedLinesComponent {
  // One token list per line: plain text, no highlighting.
  protected readonly lines = CODE.split('\n').map(line => (line ? [{ content: line }] : []));
  protected readonly highlighted = [2, 3];
}
```

## Diff

Set `zType` to `added` or `removed` on a `z-code-block-line`. Each one adds a `+` or `−` marker.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import type { ZardCodeBlockLineTypeVariants } from '@/shared/components/code-block/code-block.variants';

const PATCH = ` @Component({
   selector: 'app-greeting',
-  template: '<p>Hello, {{ name() }}</p>',
+  template: \`<p class="text-muted-foreground text-sm">
+    Hello, {{ name() }}!
+  </p>\`,
 })`;

function lineType(line: string): ZardCodeBlockLineTypeVariants {
  if (line.startsWith('+')) {
    return 'added';
  }

  if (line.startsWith('-')) {
    return 'removed';
  }

  return 'default';
}

@Component({
  selector: 'z-demo-code-block-diff',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>src/app/greeting/greeting.component.ts</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="patch" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content>
        @for (line of lines; track $index) {
          <z-code-block-line [zType]="line.type">{{ line.text }}</z-code-block-line>
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockDiffComponent {
  protected readonly patch = PATCH;

  // The first character of a diff row is the marker (+, - or a space); the line component draws it instead.
  protected readonly lines = PATCH.split('\n').map(line => ({ type: lineType(line), text: line.slice(1) }));
}
```

## Height

Cap the height with a `max-h-*` class on `z-code-block-content`. The content scrolls inside the block.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const LOGS = Array.from(
  { length: 40 },
  (_, index) => `[${String(index + 1).padStart(2, '0')}] GET /api/chat 200 in ${12 + ((index * 7) % 40)}ms`,
).join('\n');

@Component({
  selector: 'z-demo-code-block-height',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>Logs</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="logs" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content class="scroll-fade-y max-h-48">{{ logs }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockHeightComponent {
  protected readonly logs = LOGS;
}
```

`z-code-block-content` fades its edges with [`scroll-fade`](/docs/utils/scroll-fade) as it scrolls: left and right by default, top and bottom when it wraps. Add `scroll-fade-y` to a capped block that does not wrap.

## Show More

`z-code-block-footer` is a slot below the content. For Show More, cap the content while it is collapsed and put a ghost `xs` button in the footer.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CHAT_COMPONENT_CODE = `@Component({
  selector: 'app-chat',
  imports: [FormsModule, ZardButtonComponent, ZardInputDirective],
  template: \`
    <div class="flex flex-col gap-4">
      @for (message of chat.messages(); track message.id) {
        <p>{{ message.text }}</p>
      }
      <form (ngSubmit)="send()">
        <input z-input name="draft" [(ngModel)]="draft" />
        <button z-button [disabled]="chat.status() !== 'ready'">Send</button>
      </form>
    </div>
  \`,
})
export class ChatComponent {
  protected readonly chat = inject(ChatService);
  protected draft = '';

  protected send(): void {
    this.chat.send(this.draft);
    this.draft = '';
  }
}`;

@Component({
  selector: 'z-demo-code-block-show-more',
  imports: [NgIcon, ZardButtonComponent, ...ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>src/app/chat/chat.component.ts</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content id="code-block-show-more" zLineNumbers [class]="cap()">
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
      <z-code-block-footer class="justify-center">
        <button
          type="button"
          z-button
          zType="ghost"
          zSize="xs"
          aria-controls="code-block-show-more"
          [attr.aria-expanded]="expanded()"
          (click)="expanded.set(!expanded())"
        >
          <ng-icon name="lucideChevronDown" class="transition-transform in-aria-expanded:rotate-180" />
          {{ expanded() ? 'Show less' : 'Show more' }}
        </button>
      </z-code-block-footer>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockShowMoreComponent {
  protected readonly code = CHAT_COMPONENT_CODE;
  protected readonly expanded = signal(false);
  protected readonly lines = injectHighlightedCode(CHAT_COMPONENT_CODE, 'angular-ts');

  protected readonly cap = computed(() => (this.expanded() ? '' : 'scroll-fade-y max-h-64 overflow-y-hidden'));
}
```

```angular-html
<!-- cap() is 'scroll-fade-y max-h-64 overflow-y-hidden' while collapsed. -->
<z-code-block-content id="chat-code" [class]="cap()">{{ code }}</z-code-block-content>
<z-code-block-footer class="justify-center">
  <button
    type="button"
    z-button
    zType="ghost"
    zSize="xs"
    aria-controls="chat-code"
    [attr.aria-expanded]="expanded()"
    (click)="expanded.set(!expanded())"
  >
    {{ expanded() ? 'Show less' : 'Show more' }}
  </button>
</z-code-block-footer>
```

## Max Height

To keep a long block from taking over the page, raise the cap instead of removing it. The expanded content scrolls, and the edges fade as you scroll.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CODE = `@Component({
  selector: 'app-chat',
  imports: [FormsModule, ZardButtonComponent, ZardInputDirective],
  template: \`
    <div class="flex flex-col gap-4">
      @for (message of chat.messages(); track message.id) {
        <p>{{ message.text }}</p>
      }
      <form (ngSubmit)="send()">
        <input z-input name="draft" [(ngModel)]="draft" />
        <button z-button [disabled]="chat.status() !== 'ready'">Send</button>
      </form>
    </div>
  \`,
})
export class ChatComponent {
  protected readonly chat = inject(ChatService);
  protected draft = '';

  protected send(): void {
    this.chat.send(this.draft);
    this.draft = '';
  }
}`;

@Component({
  selector: 'z-demo-code-block-show-more-scroll',
  imports: [NgIcon, ZardButtonComponent, ...ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>src/app/chat/chat.component.ts</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content id="code-block-show-more-scroll" zLineNumbers [class]="cap()">
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
      <z-code-block-footer class="justify-center">
        <button
          type="button"
          z-button
          zType="ghost"
          zSize="xs"
          aria-controls="code-block-show-more-scroll"
          [attr.aria-expanded]="expanded()"
          (click)="expanded.set(!expanded())"
        >
          <ng-icon name="lucideChevronDown" class="transition-transform in-aria-expanded:rotate-180" />
          {{ expanded() ? 'Show less' : 'Show more' }}
        </button>
      </z-code-block-footer>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockShowMoreScrollComponent {
  protected readonly code = CODE;
  protected readonly expanded = signal(false);
  protected readonly lines = injectHighlightedCode(CODE, 'angular-ts');

  // Expanded, the cap is raised rather than removed, so a long block still scrolls inside the page.
  protected readonly cap = computed(() =>
    this.expanded() ? 'scroll-fade-y max-h-96' : 'scroll-fade-y max-h-64 overflow-y-hidden',
  );
}
```

## Size

Use `zSize="sm"` for tool and [Trace](/docs/components/code-block#trace) output. It has tighter padding and `text-xs` text.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-size',
  imports: [NgIcon, ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      @for (size of sizes; track size) {
        <z-code-block [zSize]="size">
          <z-code-block-header>
            <z-code-block-title>
              <ng-icon name="lucideTerminal" />
              Terminal
            </z-code-block-title>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="output" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content zWrap>{{ output }}</z-code-block-content>
        </z-code-block>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockSizeComponent {
  protected readonly sizes = ['default', 'sm'] as const;

  protected readonly output = `$ pnpm add @angular/cdk @ng-icons/core @ng-icons/lucide
Progress: resolved 412, reused 403, downloaded 9, added 9, done
Done in 2.8s using pnpm v10.18.0`;
}
```

## Destructive

Use `zType="destructive"` for errors and failed output.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-destructive',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block zType="destructive" class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>Error</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="error" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zWrap>{{ error }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockDestructiveComponent {
  protected readonly error = `ERROR TypeError: Cannot read properties of undefined (reading 'map')
    at MessageListComponent_Template (message-list.component.html:4:22)
    at executeTemplate (core.mjs:12162:9)`;
}
```

## Trace

Put a `z-code-block` with `zSize="sm"` in `z-trace-collapsible-content` for tool and terminal output. Add `zWrap` and a `max-h-64` class to `z-code-block-content` so long output wraps and scrolls inside the trace. The block sets its own text color, so `z-trace-collapsible-content` does not mute it.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-code-block-trace',
  imports: [NgIcon, ...ZardCodeBlockImports, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-md">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran node --version</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <z-code-block zSize="sm">
            <z-code-block-content zWrap class="max-h-64">{{ output }}</z-code-block-content>
          </z-code-block>
        </z-trace-collapsible-content>
      </z-trace-collapsible>

      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line zStatus="error">
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Failed to run ng serve</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <z-code-block zSize="sm" zType="destructive">
            <z-code-block-content zWrap class="max-h-64">{{ error }}</z-code-block-content>
          </z-code-block>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockTraceComponent {
  protected readonly output = `$ node --version
v24.18.0`;

  protected readonly error = `$ ng serve
Port 4200 is already in use.
Would you like to use a different port? Use '--port' to specify one.`;
}
```

## Tabs

Show several files with [Tabs](/docs/components/tabs), one `z-code-block` in each `z-tab`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardTabComponent, ZardTabGroupComponent } from '@/shared/components/tabs/tabs.component';

const FILES = [
  {
    title: 'src/app/chat/chat.service.ts',
    language: 'typescript',
    code: `@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  send(messages: ChatMessage[]) {
    return this.http.post('/api/chat', { messages }, { responseType: 'text' });
  }
}`,
  },
  {
    title: 'src/app/chat/chat.component.ts',
    language: 'angular-ts',
    code: `@Component({
  selector: 'app-chat',
  template: \`<app-message-list [messages]="chat.messages()" />\`,
})
export class ChatComponent {
  protected readonly chat = inject(ChatService);
}`,
  },
  {
    title: 'proxy.conf.json',
    language: 'json',
    code: `{
  "/api": { "target": "http://localhost:3000", "secure": false }
}`,
  },
];

@Component({
  selector: 'z-demo-code-block-tabs',
  imports: [ZardTabComponent, ZardTabGroupComponent, ...ZardCodeBlockImports],
  template: `
    <z-tab-group class="w-full max-w-md">
      @for (file of files; track file.title) {
        <z-tab [label]="file.title.split('/').at(-1)!">
          <z-code-block>
            <z-code-block-header>
              <z-code-block-title>{{ file.title }}</z-code-block-title>
              <z-code-block-actions>
                <z-code-block-copy-button [zValue]="file.code" />
              </z-code-block-actions>
            </z-code-block-header>
            <z-code-block-content zLineNumbers>
              @for (line of file.lines(); track $index) {
                <z-code-block-line [zTokens]="line" />
              }
            </z-code-block-content>
          </z-code-block>
        </z-tab>
      }
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockTabsComponent {
  protected readonly files = FILES.map(file => ({ ...file, lines: injectHighlightedCode(file.code, file.language) }));
}
```

## Message

Put a `z-code-block` between paragraphs inside a [Message](/docs/components/message).

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

const CODE = `@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  stream(messages: ChatMessage[]) {
    return this.http.post('/api/chat', { messages }, {
      observe: 'events',
      reportProgress: true,
      responseType: 'text',
    });
  }
}`;

@Component({
  selector: 'z-demo-code-block-message',
  imports: [...ZardBubbleImports, ...ZardCodeBlockImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4 text-sm">
      <z-message zAlign="end">
        <z-message-content>
          <z-bubble zAlign="end" zVariant="muted">
            <z-bubble-content>How do I stream a response?</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>
      <z-message>
        <z-message-content class="gap-3">
          <p>Create a service that asks for the progress events:</p>
          <z-code-block>
            <z-code-block-header>
              <z-code-block-title>src/app/chat/chat.service.ts</z-code-block-title>
              <z-code-block-actions>
                <z-code-block-copy-button [zValue]="code" />
              </z-code-block-actions>
            </z-code-block-header>
            <z-code-block-content>
              @for (line of lines(); track $index) {
                <z-code-block-line [zTokens]="line" />
              }
            </z-code-block-content>
          </z-code-block>
          <p>The component reads the partial text from each event.</p>
        </z-message-content>
      </z-message>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockMessageComponent {
  protected readonly code = CODE;
  protected readonly lines = injectHighlightedCode(CODE, 'typescript');
}
```

## Typeset

A `z-code-block` inside a [`typeset`](/docs/typeset) container keeps its own styles and gets the same space above as a paragraph.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileCode } from '@ng-icons/lucide';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CODE = `@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  send(messages: ChatMessage[]) {
    return this.http.post('/api/chat', { messages }, { responseType: 'text' });
  }
}`;

@Component({
  selector: 'z-demo-code-block-typeset',
  imports: [NgIcon, ...ZardCodeBlockImports],
  template: `
    <div class="typeset w-full max-w-md">
      <h3>Stream a response</h3>
      <p>
        Create a service that posts the messages with
        <code>HttpClient</code>
        and returns the response to the component.
      </p>
      <z-code-block>
        <z-code-block-header>
          <z-code-block-title>
            <ng-icon name="lucideFileCode" />
            src/app/chat/chat.service.ts
          </z-code-block-title>
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
      <p>
        The component turns the response into a signal with
        <code>toSignal</code>
        and renders the answer while it is written.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFileCode })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockTypesetComponent {
  protected readonly code = CODE;
  protected readonly lines = injectHighlightedCode(CODE, 'typescript');
}
```

## RTL

To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl). Code always reads left to right. The header follows the page direction.

```angular-ts
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface CodeBlockRtlValues {
  description: string;
  title: string;
}

const translations: ZardRtlTranslations<CodeBlockRtlValues> = {
  en: {
    dir: 'ltr',
    values: { description: 'Install the packages, then start the dev server.', title: 'Terminal' },
  },
  ar: {
    dir: 'rtl',
    values: { description: 'ثبّت الحزم، ثم شغّل خادم التطوير.', title: 'الطرفية' },
  },
  he: {
    dir: 'rtl',
    values: { description: 'התקן את החבילות, ואז הפעל את שרת הפיתוח.', title: 'מסוף' },
  },
};

const CODE = `pnpm add @angular/cdk @ng-icons/core @ng-icons/lucide
ng serve`;

@Component({
  selector: 'z-demo-code-block-rtl',
  imports: [NgIcon, ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-3 text-sm">
      <p>{{ i18n.t().description }}</p>
      <z-code-block>
        <z-code-block-header>
          <z-code-block-title>
            <ng-icon name="lucideTerminal" />
            {{ i18n.t().title }}
          </z-code-block-title>
          <z-code-block-actions>
            <z-code-block-copy-button [zValue]="code" />
          </z-code-block-actions>
        </z-code-block-header>
        <!-- Code always reads left to right: only the header follows the page direction. -->
        <z-code-block-content zLineNumbers>
          @for (line of lines(); track $index) {
            <z-code-block-line [zTokens]="line" />
          }
        </z-code-block-content>
      </z-code-block>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  protected readonly code = CODE;
  protected readonly lines = injectHighlightedCode(CODE, 'bash');
}
```

## Syntax Highlighting

`injectHighlightedCode()` highlights with [Shiki](https://shiki.style) and returns a signal with one list of tokens per line, for `[zTokens]` on `z-code-block-line`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CODE = `{
  "location": "San Francisco",
  "temperature": 18,
  "unit": "celsius",
  "conditions": ["fog", "wind"]
}`;

@Component({
  selector: 'z-demo-code-block-highlighting',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>getWeather output</z-code-block-title>
      </z-code-block-header>
      <z-code-block-content>
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockHighlightingComponent {
  protected readonly lines = injectHighlightedCode(CODE, 'json');
}
```

```angular-ts
import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';

export class WeatherOutputComponent {
  // Plain lines until Shiki has run, then the highlighted ones.
  protected readonly lines = injectHighlightedCode(this.code, 'json');
}
```

```angular-html
<z-code-block>
  <z-code-block-content>
    @for (line of lines(); track $index) {
      <z-code-block-line [zTokens]="line" />
    }
  </z-code-block-content>
</z-code-block>
```

Shiki uses its JavaScript regex engine, so there is no WASM to load.

## Languages

Each language loads the first time it is used. Edit the list in `code-block.highlight.ts`. A language that is not in the list renders as plain text.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const SAMPLES = [
  {
    language: 'css',
    title: 'src/styles.css',
    code: `@import "tailwindcss";

:root {
  --radius: 0.625rem;
}`,
  },
  {
    language: 'angular-html',
    title: 'src/app/app.html',
    code: `@if (user(); as user) {
  <p>Hello, {{ user.name }}!</p>
}`,
  },
  {
    language: 'text',
    title: 'notes.txt',
    code: 'A language that is not in the list renders as plain text.',
  },
];

@Component({
  selector: 'z-demo-code-block-languages',
  imports: [ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      @for (sample of samples; track sample.language) {
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>{{ sample.title }}</z-code-block-title>
          </z-code-block-header>
          <z-code-block-content>
            @for (line of sample.lines(); track $index) {
              <z-code-block-line [zTokens]="line" />
            }
          </z-code-block-content>
        </z-code-block>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockLanguagesComponent {
  protected readonly samples = SAMPLES.map(sample => ({
    ...sample,
    lines: injectHighlightedCode(sample.code, sample.language),
  }));
}
```

The list ships with `angular-html`, `angular-ts`, `bash`, `css`, `diff`, `html`, `javascript`, `json`, `jsx`, `markdown`, `python`, `scss`, `sql`, `tsx`, `typescript` and `yaml`, plus aliases such as `ts`, `js`, `sh` and `yml`.

## Terminal Output

Pass `ansi` as the language to render the colors in terminal output. Without it, escape codes show as text.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const ESC = String.fromCharCode(27);

const OUTPUT = [
  '$ ng test',
  `${ESC}[32m✓${ESC}[39m src/app/format.spec.ts ${ESC}[2m(4 tests)${ESC}[22m`,
  `${ESC}[32m✓${ESC}[39m src/app/parse.spec.ts ${ESC}[2m(7 tests)${ESC}[22m`,
  `${ESC}[31m✗${ESC}[39m src/app/chat/chat.service.spec.ts ${ESC}[2m(3 tests | 1 failed)${ESC}[22m`,
  '',
  `${ESC}[31mAssertionError: expected 'hello' to be 'hello world'${ESC}[39m`,
  '',
  `Tests  ${ESC}[31m1 failed${ESC}[39m | ${ESC}[32m13 passed${ESC}[39m (14)`,
].join('\n');

// The text to copy has no escape codes.
const PLAIN_OUTPUT = OUTPUT.replace(new RegExp(`${ESC}\\[[0-9;]*m`, 'g'), '');

@Component({
  selector: 'z-demo-code-block-terminal',
  imports: [NgIcon, ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>
          <ng-icon name="lucideTerminal" />
          Terminal
        </z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="plainOutput" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zWrap>
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockTerminalComponent {
  protected readonly plainOutput = PLAIN_OUTPUT;
  protected readonly lines = injectHighlightedCode(OUTPUT, 'ansi');
}
```

ANSI colors do not carry from one line to the next.

## Server Rendering

`highlightCode()` is async and has no DOM dependency, so it runs during server rendering and prerendering. A `resource` holds the render until the lines are ready, so the HTML ships already highlighted.

```angular-ts
import { Component, input, resource } from '@angular/core';

import { highlightCode } from '@/shared/components/code-block/code-block.highlight';

@Component({
  selector: 'app-server-code',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block>
      <z-code-block-content zLineNumbers>
        @for (line of highlighted.value() ?? []; track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
})
export class ServerCodeComponent {
  readonly code = input.required<string>();

  // A resource holds the server render until the lines are highlighted, so the HTML ships with its colors.
  protected readonly highlighted = resource({
    params: () => this.code(),
    loader: ({ params }) => highlightCode(params, 'typescript'),
  });
}
```

## Streaming

While the code streams, `injectHighlightedCode()` highlights it again, and every line that did not change keeps its colors, so the block does not flicker as it grows. Disable the copy button with `zDisabled` until the code is complete.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRotateCcw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import type { ZardCodeBlockLineTypeVariants } from '@/shared/components/code-block/code-block.variants';

interface StreamedBlock {
  readonly title?: string;
  readonly language: string;
  readonly code: string;
  readonly lineNumbers?: boolean;
  readonly highlight?: readonly number[];
  /** Rows start with `+`, `-` or a space; the marker is not part of the code. */
  readonly diff?: boolean;
}

const BLOCKS: readonly StreamedBlock[] = [
  {
    title: 'src/app/shared/debounced.ts',
    language: 'typescript',
    lineNumbers: true,
    code: `export function debounced<T>(source: Signal<T>, delay = 300): Signal<T> {
  const value = signal(source());

  effect(onCleanup => {
    const next = source();
    const timeout = setTimeout(() => value.set(next), delay);
    onCleanup(() => clearTimeout(timeout));
  });

  return value.asReadonly();
}`,
  },
  {
    language: 'bash',
    code: 'npx zard-cli@latest add code-block',
  },
  {
    title: 'src/app/search/search.component.ts',
    language: 'typescript',
    lineNumbers: true,
    diff: true,
    code: ` export class SearchComponent {
   protected readonly query = signal('');
-  protected readonly results = injectSearch(this.query);
+  protected readonly debouncedQuery = debounced(this.query, 300);
+  protected readonly results = injectSearch(this.debouncedQuery);
 }`,
  },
  {
    title: 'src/app/chat/chat.service.ts',
    language: 'typescript',
    lineNumbers: true,
    highlight: [4, 5, 6, 7, 8],
    code: `@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  stream(messages: ChatMessage[]) {
    return this.http.post('/api/chat', { messages }, {
      observe: 'events',
      reportProgress: true,
    });
  }
}`,
  },
  {
    title: 'proxy.conf.json',
    language: 'json',
    code: `{ "/api": { "target": "http://localhost:3000" } }`,
  },
];

/** Where each block starts in the stream. */
const OFFSETS = BLOCKS.map((_, index) => BLOCKS.slice(0, index).reduce((total, block) => total + block.code.length, 0));
const TOTAL = BLOCKS.reduce((sum, block) => sum + block.code.length, 0);

@Component({
  selector: 'z-demo-code-block-streaming',
  imports: [NgIcon, ZardButtonComponent, ...ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      @for (block of blocks; track $index) {
        @if (block.visible()) {
          <z-code-block>
            @if (block.title) {
              <z-code-block-header>
                <z-code-block-title>{{ block.title }}</z-code-block-title>
                <z-code-block-actions>
                  <!-- Copying is disabled until the block has arrived in full. -->
                  <z-code-block-copy-button [zValue]="block.source()" [zDisabled]="!block.complete()" />
                </z-code-block-actions>
              </z-code-block-header>
            }
            <z-code-block-content [zLineNumbers]="block.lineNumbers ?? false">
              @for (line of block.lines(); track $index) {
                <z-code-block-line [zTokens]="line" [zType]="block.lineType($index)" />
              }
            </z-code-block-content>
          </z-code-block>
        }
      }
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        class="self-start"
        [zDisabled]="length() < total"
        (click)="replay()"
      >
        <ng-icon name="lucideRotateCcw" />
        Replay
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideRotateCcw })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockStreamingComponent {
  protected readonly total = TOTAL;
  /** How many characters of the whole stream have arrived. The page opens on the finished blocks. */
  protected readonly length = signal(TOTAL);

  protected readonly blocks = BLOCKS.map((block, index) => {
    const code = computed(() => block.code.slice(0, Math.max(0, this.length() - OFFSETS[index])));
    const rows = computed(() => code().split('\n'));
    const source = computed(() =>
      block.diff
        ? rows()
            .map(row => row.slice(1))
            .join('\n')
        : code(),
    );

    return {
      ...block,
      visible: computed(() => this.length() > OFFSETS[index]),
      complete: computed(() => code().length === block.code.length),
      source,
      // Highlighted again as the code grows; the lines that did not change keep their colors.
      lines: injectHighlightedCode(source, block.language),
      lineType: (line: number): ZardCodeBlockLineTypeVariants => {
        if (block.diff) {
          const row = rows()[line] ?? '';
          return row.startsWith('+') ? 'added' : row.startsWith('-') ? 'removed' : 'default';
        }
        return block.highlight?.includes(line) ? 'highlighted' : 'default';
      },
    };
  });

  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected replay(): void {
    this.length.set(0);
    this.tick();
  }

  private tick(): void {
    if (this.length() >= TOTAL) {
      return;
    }

    this.timer = setTimeout(() => {
      this.length.update(length => Math.min(TOTAL, length + 3));
      this.tick();
    }, 16);
  }
}
```

## Accessibility

- `z-code-block-content` holds a `code` element and always sets `dir="ltr"`, so code reads left to right on an RTL page.
- `z-code-block-content` has `tabindex="0"`, so keyboard users can focus it and scroll it. Set `tabindex="-1"` to remove the tab stop.
- Floating actions show when focus is inside the block, not only on hover, so keyboard users can reach them.
- Line numbers are generated content, so they are not read by screen readers.
- Diff lines carry a `+` or `−` marker as well as a tint, so the change does not rely on color.
- `z-code-block-copy-button` is labelled "Copy", and a polite live region announces "Copied" after a successful copy.
- Give a wrap toggle `aria-pressed` so its state is announced.
- Give a Show More button `aria-expanded` and point `aria-controls` at the `id` of `z-code-block-content`.

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
| `[zDisabled]` | Disables the button, such as while streamed code is incomplete | `boolean` | `false` |
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

### injectHighlightedCode(code, language)

The highlighted lines of `code` as a signal, for `@for` + `[zTokens]` (the counterpart of the shadcn/ui `useHighlightedCode` hook). Call it in an injection context. It returns plain lines until Shiki has run, highlights again when a signal argument changes, keeps the colors of unchanged lines while code streams, and holds a server render until the lines are ready.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `code` | The code, or a function / signal that returns it | `string \| (() => string)` | `-` |
| `language` | A language or alias of `code-block.highlight.ts`, or `ansi`; or a function / signal that returns it | `string \| (() => string)` | `-` |
| `returns` | One list of tokens per line | `Signal<ZardCodeBlockLineTokens[]>` | `-` |

### highlightCode(code, language)

Optional syntax highlighting with Shiki (JavaScript regex engine, no WASM). Shiki and each language load on first use, and it runs on the server. Returns tokens, not HTML: render each line with `[zTokens]`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `code` | The code to highlight; one trailing newline is ignored | `string` | `-` |
| `language` | A language of `code-block.highlight.ts`, an alias (`ts`, `js`, `sh`, `yml`...) or `ansi` for terminal output. Any other value gives plain lines | `string` | `-` |
| `returns` | One list of tokens per line, with light and dark colors; blank lines are empty lists | `Promise<ZardCodeBlockLineTokens[]>` | `-` |

---

[Open in browser](https://zardui.com/docs/components/code-block)
