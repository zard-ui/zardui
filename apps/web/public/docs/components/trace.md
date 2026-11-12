---
title: Trace
description: Displays the steps an agent takes as a list of lines: tool calls, reasoning, sources and file changes.
---

# Trace

Displays the steps an agent takes as a list of lines: tool calls, reasoning, sources and file changes.

## Installation

### CLI

```bash
npx zard-cli@latest add trace
```

### Manual

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import {
  ZardCollapsibleContentComponent,
  ZardCollapsibleDirective,
  ZardCollapsibleTriggerDirective,
} from '@/shared/components/collapsible/collapsible.component';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  traceChevronVariants,
  traceCollapsibleContentVariants,
  traceCollapsibleTriggerVariants,
  traceCollapsibleVariants,
  traceDescriptionVariants,
  traceIconVariants,
  traceLineVariants,
  traceTitleVariants,
  traceVariants,
  type ZardTraceStatusVariants,
} from './trace.variants';

@Component({
  selector: 'z-trace, [z-trace]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'trace',
    '[class]': 'classes()',
  },
  exportAs: 'zTrace',
})
export class ZardTraceComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(traceVariants(), this.class()));
}

/**
 * One row. It is never interactive on its own, so it renders as a span-like box and is not a tab stop:
 * wrap it in a collapsible trigger, a link or a dialog/sheet/drawer/popover trigger to make it do something.
 */
@Component({
  selector: 'z-trace-line, [z-trace-line]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'trace-line',
    '[attr.data-status]': 'zStatus()',
    '[class]': 'classes()',
  },
  exportAs: 'zTraceLine',
})
export class ZardTraceLineComponent {
  readonly zStatus = input<ZardTraceStatusVariants>();
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(traceLineVariants({ zStatus: this.zStatus() }), this.class()),
  );
}

@Component({
  selector: 'z-trace-icon, [z-trace-icon]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'trace-icon',
    'aria-hidden': 'true',
    '[class]': 'classes()',
  },
  exportAs: 'zTraceIcon',
})
export class ZardTraceIconComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(traceIconVariants(), this.class()));
}

@Component({
  selector: 'z-trace-title, [z-trace-title]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'trace-title',
    '[class]': 'classes()',
  },
  exportAs: 'zTraceTitle',
})
export class ZardTraceTitleComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(traceTitleVariants(), this.class()));
}

@Component({
  selector: 'z-trace-description, [z-trace-description]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'trace-description',
    '[class]': 'classes()',
  },
  exportAs: 'zTraceDescription',
})
export class ZardTraceDescriptionComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(traceDescriptionVariants(), this.class()));
}

/** An expandable row. State, ids and `aria-*` come from `z-collapsible`, applied here as a host directive. */
@Component({
  selector: 'z-trace-collapsible, [z-trace-collapsible]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  hostDirectives: [{ directive: ZardCollapsibleDirective, inputs: ['zOpen'], outputs: ['zOpenChange'] }],
  exportAs: 'zTraceCollapsible',
})
export class ZardTraceCollapsibleComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(traceCollapsibleVariants(), this.class()));
}

/**
 * Wraps its content in a real `<button>`, so the line inside never nests an interactive element, and appends
 * the chevron. The host itself is layout-neutral (`display: contents`); `class` styles the button.
 */
@Component({
  selector: 'z-trace-collapsible-trigger, [z-trace-collapsible-trigger]',
  imports: [NgIcon, ZardCollapsibleTriggerDirective, ZardTraceIconComponent],
  template: `
    <button z-collapsible-trigger type="button" [class]="classes()">
      <ng-content />
      <z-trace-icon>
        <ng-icon name="lucideChevronRight" [class]="chevronClasses" />
      </z-trace-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronRight })],
  host: {
    'data-slot': 'trace-collapsible-trigger',
    class: 'contents',
  },
  exportAs: 'zTraceCollapsibleTrigger',
})
export class ZardTraceCollapsibleTriggerComponent {
  readonly class = input<ClassValue>('');

  protected readonly chevronClasses = traceChevronVariants();
  protected readonly classes = computed(() => mergeClasses(traceCollapsibleTriggerVariants(), this.class()));
}

/**
 * The detail revealed by the trigger. Closed content stays out of the DOM unless `zKeepMounted` is set; it
 * leaves once the collapse animation has finished, never mid-way.
 */
@Component({
  selector: 'z-trace-collapsible-content, [z-trace-collapsible-content]',
  imports: [ZardCollapsibleContentComponent],
  template: `
    <z-collapsible-content (transitionend)="onTransitionEnd($event)">
      <div data-slot="trace-collapsible-content-inner" [class]="innerClasses()">
        @if (mounted()) {
          <ng-content />
        }
      </div>
    </z-collapsible-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'trace-collapsible-content',
    class: 'block min-w-0',
  },
  exportAs: 'zTraceCollapsibleContent',
})
export class ZardTraceCollapsibleContentComponent {
  private readonly collapsible = inject(ZardCollapsibleDirective);

  readonly zKeepMounted = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  /** Flips to `true` once the collapse has finished; opening flips it back. */
  private readonly settledClosed = signal(!this.collapsible.open());

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private settleTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly mounted = computed(() => this.zKeepMounted() || this.collapsible.open() || !this.settledClosed());
  protected readonly innerClasses = computed(() => mergeClasses(traceCollapsibleContentVariants(), this.class()));

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearSettleTimer());

    effect(() => {
      if (this.collapsible.open()) {
        this.clearSettleTimer();
        this.settledClosed.set(false);
      } else if (!untracked(this.settledClosed)) {
        this.scheduleSettle();
      }
    });
  }

  protected onTransitionEnd(event: TransitionEvent): void {
    if (event.target === event.currentTarget && event.propertyName !== 'visibility') {
      this.settle();
    }
  }

  /**
   * `transitionend` is the fast path, but it never fires when the collapse does not animate (a `transition: none`
   * override, or a browser that does not interpolate `grid-template-rows`). So the same close also arms a timer sized
   * from the panel's computed transition, which is 0 (settle now) when there is none.
   */
  private scheduleSettle(): void {
    this.clearSettleTimer();
    const panel = this.isBrowser ? this.host.nativeElement.querySelector('[data-slot="collapsible-content"]') : null;
    const duration = panel ? this.transitionTime(getComputedStyle(panel)) : 0;

    if (duration <= 0) {
      this.settle();
      return;
    }
    this.settleTimer = setTimeout(() => this.settle(), duration + 50);
  }

  private settle(): void {
    if (!this.collapsible.open()) {
      this.clearSettleTimer();
      this.settledClosed.set(true);
    }
  }

  private clearSettleTimer(): void {
    clearTimeout(this.settleTimer);
    this.settleTimer = undefined;
  }

  /** Longest `delay + duration` among the element's transitions, in ms. */
  private transitionTime(style: CSSStyleDeclaration): number {
    const toMs = (list: string): number[] =>
      list
        .split(',')
        .map(value => value.trim())
        .filter(Boolean)
        .map(value => (value.endsWith('ms') ? parseFloat(value) : parseFloat(value) * 1000) || 0);
    const durations = toMs(style.transitionDuration);
    const delays = toMs(style.transitionDelay);

    return Math.max(0, ...durations.map((duration, index) => duration + (delays[index % (delays.length || 1)] ?? 0)));
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

/**
 * The list. Besides stacking its rows it styles any trigger or link that directly wraps a
 * `z-trace-line` (an `<a>`, a `<button>`...), so the line itself never has to know what it is wrapped in.
 */
export const traceVariants = cva(
  mergeClasses(
    'flex w-full min-w-0 flex-col gap-2',
    '*:has-[>[data-slot=trace-line]]:flex *:has-[>[data-slot=trace-line]]:w-fit *:has-[>[data-slot=trace-line]]:max-w-full *:has-[>[data-slot=trace-line]]:min-w-0',
    '*:has-[>[data-slot=trace-line]]:rounded-md *:has-[>[data-slot=trace-line]]:text-start *:has-[>[data-slot=trace-line]]:outline-none',
    '*:has-[>[data-slot=trace-line]]:focus-visible:ring-3 *:has-[>[data-slot=trace-line]]:focus-visible:ring-ring/50',
  ),
);

export const traceLineVariants = cva(
  mergeClasses(
    'flex w-fit max-w-full min-w-0 items-center gap-2 text-sm text-muted-foreground transition-colors',
    'in-[a,button]:cursor-pointer in-[a:hover,button:hover]:text-foreground',
  ),
  {
    variants: {
      zStatus: {
        // `shimmer` comes from utilities.css; the title opts out with `motion-reduce:shimmer-none`.
        running: '*:data-[slot=trace-title]:shimmer',
        error: 'text-destructive in-[a:hover,button:hover]:text-destructive',
        pending: 'opacity-60',
      },
    },
  },
);

export const traceIconVariants = cva(
  mergeClasses(
    'flex size-4 shrink-0 items-center justify-center [--ng-icon__size:1rem] [&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4',
    // A trailing icon (a chevron, an "opens in a new tab" arrow) tucks in toward the title.
    '[[data-slot=trace-title]~&]:-ms-1',
  ),
);

export const traceTitleVariants = cva('min-w-0 truncate motion-reduce:shimmer-none');

export const traceDescriptionVariants = cva('shrink-0 text-muted-foreground tabular-nums');

export const traceCollapsibleVariants = cva('flex w-full min-w-0 flex-col');

export const traceCollapsibleTriggerVariants = cva(
  mergeClasses(
    'group/trace-collapsible-trigger flex w-fit max-w-full min-w-0 cursor-pointer items-center gap-1 rounded-md text-start text-muted-foreground transition-colors outline-none',
    'hover:text-foreground has-[[data-status=error]]:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50',
  ),
);

/** Turns the right-pointing chevron down when open, and mirrors it in RTL so it still points inline-end. */
export const traceChevronVariants = cva(
  mergeClasses(
    'transition-transform rtl:-scale-x-100',
    'group-aria-expanded/trace-collapsible-trigger:rotate-90 rtl:group-aria-expanded/trace-collapsible-trigger:-rotate-90',
  ),
);

export const traceCollapsibleContentVariants = cva(
  'mt-2 mb-1 ms-[calc(--spacing(2)-1px)] min-w-0 border-s ps-4 pe-1 leading-relaxed wrap-break-word text-muted-foreground',
);

export type ZardTraceStatusVariants = NonNullable<VariantProps<typeof traceLineVariants>['zStatus']>;
```

```angular-ts
export * from './trace.component';
export * from './trace.imports';
export * from './trace.variants';
```

```angular-ts
export {
  ZardTraceCollapsibleComponent,
  ZardTraceCollapsibleContentComponent,
  ZardTraceCollapsibleTriggerComponent,
  ZardTraceComponent,
  ZardTraceDescriptionComponent,
  ZardTraceIconComponent,
  ZardTraceLineComponent,
  ZardTraceTitleComponent,
} from './trace.component';

import {
  ZardTraceCollapsibleComponent,
  ZardTraceCollapsibleContentComponent,
  ZardTraceCollapsibleTriggerComponent,
  ZardTraceComponent,
  ZardTraceDescriptionComponent,
  ZardTraceIconComponent,
  ZardTraceLineComponent,
  ZardTraceTitleComponent,
} from './trace.component';

export const ZardTraceImports = [
  ZardTraceComponent,
  ZardTraceLineComponent,
  ZardTraceIconComponent,
  ZardTraceTitleComponent,
  ZardTraceDescriptionComponent,
  ZardTraceCollapsibleComponent,
  ZardTraceCollapsibleTriggerComponent,
  ZardTraceCollapsibleContentComponent,
] as const;
```

## Usage

```angular-ts
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

// Add NgIcon to the component imports and provideIcons({ lucideTerminal }) to its viewProviders.
```

```angular-html
<z-trace>
  <z-trace-line>
    <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
    <z-trace-title>Ran pnpm install</z-trace-title>
    <z-trace-description>12s</z-trace-description>
  </z-trace-line>
</z-trace>
```

## Examples

### Line

Plain text rows: an icon and a one-line title. A `z-trace-line` is a span-like box, so on its own it is read as text and is not a tab stop.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilePen, lucideSearch, lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-line',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
        <z-trace-title>Searched for minimumReleaseAge</z-trace-title>
      </z-trace-line>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Ran pnpm install</z-trace-title>
      </z-trace-line>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideFilePen" /></z-trace-icon>
        <z-trace-title>Edited trace.component.ts</z-trace-title>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFilePen, lucideSearch, lucideTerminal })],
})
export class ZardDemoTraceLineComponent {}
```

### Status

Set `zStatus` to `running`, `error` or `pending` when a step is in progress, failed or not started. Completed work has no status. Say the state in the title as well ("Running", "Failed to run"), because the color and the shimmer are not read out.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-status',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Ran pnpm install</z-trace-title>
      </z-trace-line>
      <z-trace-line zStatus="error">
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Failed to run pnpm lint</z-trace-title>
      </z-trace-line>
      <z-trace-line zStatus="running">
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Running pnpm build</z-trace-title>
      </z-trace-line>
      <z-trace-line zStatus="pending">
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Run pnpm test</z-trace-title>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
})
export class ZardDemoTraceStatusComponent {}
```

### Description

Put secondary text such as a duration, a count or diff stats in `z-trace-description`, after the title. It does not truncate.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilePen, lucideSearch, lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-description',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Ran pnpm install</z-trace-title>
        <z-trace-description>12s</z-trace-description>
      </z-trace-line>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
        <z-trace-title>Searched the codebase</z-trace-title>
        <z-trace-description>3 results</z-trace-description>
      </z-trace-line>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideFilePen" /></z-trace-icon>
        <z-trace-title>Edited trace.component.ts</z-trace-title>
        <z-trace-description>+24 -6</z-trace-description>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFilePen, lucideSearch, lucideTerminal })],
})
export class ZardDemoTraceDescriptionComponent {}
```

### Collapsible

Wrap the line in `z-trace-collapsible-trigger` to expand it into `z-trace-collapsible-content`. Bind `[(zOpen)]` to control a row, and set `zKeepMounted` to keep the detail in the DOM while it is closed.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-collapsible',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran node --version</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>v24.18.0</z-trace-collapsible-content>
      </z-trace-collapsible>

      <z-trace-collapsible [(zOpen)]="open">
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran pnpm install</z-trace-title>
            <z-trace-description>12s</z-trace-description>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <pre class="bg-muted text-foreground rounded-lg p-3 font-mono text-xs whitespace-pre-wrap">{{ output }}</pre>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
})
export class ZardDemoTraceCollapsibleComponent {
  protected readonly open = signal(true);

  protected readonly output = `Packages: +142
Progress: resolved 142, reused 142, downloaded 0
Done in 11.8s`;
}
```

### Link

Wrap the line in an anchor. For a new tab, add an arrow-up-right icon and an `sr-only` "(opens in a new tab)" to the title.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideBookOpen } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-link',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <a href="https://docs.astro.build" target="_blank" rel="noreferrer">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideBookOpen" /></z-trace-icon>
          <z-trace-title>
            Read the Astro docs
            <span class="sr-only">(opens in a new tab)</span>
          </z-trace-title>
          <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
        </z-trace-line>
      </a>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideBookOpen })],
})
export class ZardDemoTraceLinkComponent {}
```

### Dialog

Wrap the line in the button that opens the dialog. The dialog owns its open state, Escape and focus return.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideGlobe } from '@ng-icons/lucide';

import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-dialog',
  imports: [NgIcon, ...ZardDialogImports, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <button type="button" (click)="open.set(true)">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
          <z-trace-title>Searched the web for cache keys</z-trace-title>
          <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
        </z-trace-line>
      </button>
    </z-trace>

    <z-dialog [(zVisible)]="open">
      <z-dialog-header>
        <z-dialog-title>Searched the web for cache keys</z-dialog-title>
        <z-dialog-description>The agent ran one query and read the top three results.</z-dialog-description>
      </z-dialog-header>
      <ul class="list-disc ps-5 text-sm">
        <li>Cache keys in a monorepo build</li>
        <li>Content-addressed cache invalidation</li>
        <li>Hashing lockfiles for CI caches</li>
      </ul>
    </z-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideGlobe })],
})
export class ZardDemoTraceDialogComponent {
  protected readonly open = signal(false);
}
```

### Sheet

The same shape as the dialog: a button around the line opens a sheet. Drawer and popover triggers work the same way.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFilePen } from '@ng-icons/lucide';

import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-sheet',
  imports: [NgIcon, ...ZardSheetImports, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <button type="button" (click)="open.set(true)">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideFilePen" /></z-trace-icon>
          <z-trace-title>Edited trace.component.ts</z-trace-title>
          <z-trace-description>+24 -6</z-trace-description>
          <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
        </z-trace-line>
      </button>
    </z-trace>

    <z-sheet [(zVisible)]="open">
      <z-sheet-header>
        <z-sheet-title>trace.component.ts</z-sheet-title>
        <z-sheet-description>24 additions and 6 deletions.</z-sheet-description>
      </z-sheet-header>
      <pre class="bg-muted mx-4 rounded-lg p-3 font-mono text-xs whitespace-pre-wrap">{{ diff }}</pre>
    </z-sheet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFilePen })],
})
export class ZardDemoTraceSheetComponent {
  protected readonly open = signal(false);

  protected readonly diff = `- readonly zOpen = input(false);
+ readonly zOpen = model(false);
+ readonly zKeepMounted = input(false, { transform: booleanAttribute });`;
}
```

### Group

Put rows that sit next to each other in a `z-trace`. It also styles any trigger or link that directly wraps a `z-trace-line`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFilePen, lucideSearch, lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-group',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
        <z-trace-title>Searched for minimumReleaseAge</z-trace-title>
      </z-trace-line>

      <a href="https://pnpm.io/settings" target="_blank" rel="noreferrer">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
          <z-trace-title>
            Read the pnpm settings
            <span class="sr-only">(opens in a new tab)</span>
          </z-trace-title>
          <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
        </z-trace-line>
      </a>

      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran pnpm install</z-trace-title>
            <z-trace-description>12s</z-trace-description>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>Lockfile is up to date, resolution step is skipped.</z-trace-collapsible-content>
      </z-trace-collapsible>

      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideFilePen" /></z-trace-icon>
        <z-trace-title>Edited pnpm-workspace.yaml</z-trace-title>
        <z-trace-description>+1 -0</z-trace-description>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideFilePen, lucideSearch, lucideTerminal })],
})
export class ZardDemoTraceGroupComponent {}
```

### Sources

A collapsible row whose detail is a `z-trace` of link rows.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideBookOpen, lucideGlobe } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-sources',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideBookOpen" /></z-trace-icon>
            <z-trace-title>Used 3 sources</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <z-trace>
            @for (source of sources; track source.url) {
              <a [href]="source.url" target="_blank" rel="noreferrer">
                <z-trace-line>
                  <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
                  <z-trace-title>
                    {{ source.title }}
                    <span class="sr-only">(opens in a new tab)</span>
                  </z-trace-title>
                  <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
                </z-trace-line>
              </a>
            }
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideBookOpen, lucideGlobe })],
})
export class ZardDemoTraceSourcesComponent {
  protected readonly sources = [
    { title: 'Install Astro', url: 'https://docs.astro.build/en/install-and-setup/' },
    { title: 'Project structure', url: 'https://docs.astro.build/en/basics/project-structure/' },
    { title: 'Deploy your site', url: 'https://docs.astro.build/en/guides/deploy/' },
  ];
}
```

### Chain Of Thought

A collapsible row with step rows inside. Set the parent status and title from its children.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBrain, lucideCheck, lucideCircleDashed, lucideSearch } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-chain-of-thought',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line zStatus="running">
            <z-trace-icon><ng-icon name="lucideBrain" /></z-trace-icon>
            <z-trace-title>Thinking through the migration</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <z-trace class="gap-1.5">
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideCheck" /></z-trace-icon>
              <z-trace-title>Read the current config</z-trace-title>
            </z-trace-line>
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
              <z-trace-title>Compared it with the migration guide</z-trace-title>
            </z-trace-line>
            <z-trace-line zStatus="pending">
              <z-trace-icon><ng-icon name="lucideCircleDashed" /></z-trace-icon>
              <z-trace-title>Write the new config</z-trace-title>
            </z-trace-line>
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBrain, lucideCheck, lucideCircleDashed, lucideSearch })],
})
export class ZardDemoTraceChainOfThoughtComponent {}
```

### Commit

A collapsible row with a line per changed file. Say what changed in the title and put the line counts in the description; each file opens its diff in a sheet.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideFileMinus,
  lucideFilePen,
  lucideFilePlus,
  lucideGitCommitHorizontal,
} from '@ng-icons/lucide';

import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface ChangedFile {
  readonly path: string;
  readonly title: string;
  readonly icon: string;
  readonly stats: string;
  readonly diff: string;
}

@Component({
  selector: 'z-demo-trace-commit',
  imports: [NgIcon, ...ZardSheetImports, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideGitCommitHorizontal" /></z-trace-icon>
            <z-trace-title>Committed 3 files</z-trace-title>
            <z-trace-description>+31 -9</z-trace-description>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <z-trace>
            @for (file of files; track file.path) {
              <button type="button" (click)="select(file)">
                <z-trace-line>
                  <z-trace-icon><ng-icon [name]="file.icon" /></z-trace-icon>
                  <z-trace-title>{{ file.title }}</z-trace-title>
                  <z-trace-description>{{ file.stats }}</z-trace-description>
                  <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
                </z-trace-line>
              </button>
            }
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>

    <z-sheet [zVisible]="sheetOpen()" (zVisibleChange)="sheetOpen.set($event)">
      <z-sheet-header>
        <z-sheet-title>{{ selected().path }}</z-sheet-title>
        <z-sheet-description>{{ selected().stats }}</z-sheet-description>
      </z-sheet-header>
      <pre class="bg-muted mx-4 rounded-lg p-3 font-mono text-xs whitespace-pre-wrap">{{ selected().diff }}</pre>
    </z-sheet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({ lucideChevronRight, lucideFileMinus, lucideFilePen, lucideFilePlus, lucideGitCommitHorizontal }),
  ],
})
export class ZardDemoTraceCommitComponent {
  protected readonly files: readonly ChangedFile[] = [
    {
      path: 'src/trace.component.ts',
      title: 'Added trace.component.ts',
      icon: 'lucideFilePlus',
      stats: '+24',
      diff: `+ @Component({ selector: 'z-trace, [z-trace]' })\n+ export class ZardTraceComponent {}`,
    },
    {
      path: 'src/index.ts',
      title: 'Edited index.ts',
      icon: 'lucideFilePen',
      stats: '+7 -1',
      diff: `- export * from './marker';\n+ export * from './marker';\n+ export * from './trace';`,
    },
    {
      path: 'src/legacy-steps.ts',
      title: 'Deleted legacy-steps.ts',
      icon: 'lucideFileMinus',
      stats: '-8',
      diff: `- export const legacySteps = [];`,
    },
  ];

  protected readonly sheetOpen = signal(false);
  protected readonly selected = signal<ChangedFile>(this.files[0]);

  protected select(file: ChangedFile): void {
    this.selected.set(file);
    this.sheetOpen.set(true);
  }
}
```

### Rtl

To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl).

```angular-ts
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideSearch, lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{
  searched: string;
  ran: string;
  duration: string;
  output: string;
  running: string;
  read: string;
  opensInNewTab: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      searched: 'Searched for minimumReleaseAge',
      ran: 'Ran pnpm install',
      duration: '12s',
      output: 'Done in 11.8s',
      running: 'Running pnpm build',
      read: 'Read the pnpm docs',
      opensInNewTab: '(opens in a new tab)',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      searched: 'تم البحث عن minimumReleaseAge',
      ran: 'تم تشغيل pnpm install',
      duration: '12 ث',
      output: 'تم في 11.8 ثانية',
      running: 'جارٍ تشغيل pnpm build',
      read: 'قراءة وثائق pnpm',
      opensInNewTab: '(يفتح في علامة تبويب جديدة)',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      searched: 'חיפוש של minimumReleaseAge',
      ran: 'הורץ pnpm install',
      duration: '12 שנ׳',
      output: 'הסתיים ב-11.8 שניות',
      running: 'מריץ את pnpm build',
      read: 'קריאת התיעוד של pnpm',
      opensInNewTab: '(נפתח בלשונית חדשה)',
    },
  },
};

@Component({
  selector: 'z-demo-trace-rtl',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
        <z-trace-title>{{ i18n.t().searched }}</z-trace-title>
      </z-trace-line>

      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>{{ i18n.t().ran }}</z-trace-title>
            <z-trace-description>{{ i18n.t().duration }}</z-trace-description>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>{{ i18n.t().output }}</z-trace-collapsible-content>
      </z-trace-collapsible>

      <a href="https://pnpm.io" target="_blank" rel="noreferrer">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
          <z-trace-title>
            {{ i18n.t().read }}
            <span class="sr-only">{{ i18n.t().opensInNewTab }}</span>
          </z-trace-title>
          <z-trace-icon><ng-icon name="lucideArrowUpRight" class="rtl:-scale-x-100" /></z-trace-icon>
        </z-trace-line>
      </a>

      <z-trace-line zStatus="running">
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>{{ i18n.t().running }}</z-trace-title>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideSearch, lucideTerminal })],
})
export class ZardDemoTraceRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
```

## API Reference

### z-trace, [z-trace]

A list of rows. It also styles any trigger or link that directly wraps a `z-trace-line`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-trace-line, [z-trace-line]

One row. Renders as a span-like box, so it is not a button or a tab stop; wrap it in a trigger or a link to make it do something.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zStatus]` | Work that is running (shimmering title), failed (destructive) or not started yet (dimmed) | `running \| error \| pending` | `-` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-trace-icon, [z-trace-icon]

Decorative icon slot, hidden from assistive tech.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-trace-title, [z-trace-title]

One-line sentence that truncates and shimmers while running. It is the accessible name.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-trace-description, [z-trace-description]

Secondary text such as a count, a duration or diff stats. Does not truncate.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-trace-collapsible, [z-trace-collapsible]

An expandable row, built on `z-collapsible`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zOpen]` | Open state; supports `[(zOpen)]` | `boolean` | `false` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(zOpenChange)` | Emitted with the new open state | `EventEmitter<boolean>` | `-` |

### z-trace-collapsible-trigger, [z-trace-collapsible-trigger]

Wraps its content in a button that toggles the row, with `aria-expanded`, and adds the chevron. `class` styles the button.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-trace-collapsible-content, [z-trace-collapsible-content]

The detail shown when the row is open; its text is muted.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zKeepMounted]` | Keep the content in the DOM while the row is closed instead of removing it after the collapse | `boolean` | `false` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/trace)
