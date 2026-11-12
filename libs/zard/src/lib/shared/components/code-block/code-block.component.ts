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
  selector: 'z-code-block-copy-button, [z-code-block-copy-button]',
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
    class: 'contents',
    'data-slot': 'code-block-copy',
  },
  exportAs: 'zCodeBlockCopyButton',
})
export class ZardCodeBlockCopyButtonComponent {
  private readonly clipboard = inject(Clipboard);

  readonly zValue = input.required<string>();
  readonly class = input<ClassValue>('');

  protected readonly copied = signal(false);

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
      <span data-slot="code-block-line-source" class="contents"><ng-content /></span>
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
