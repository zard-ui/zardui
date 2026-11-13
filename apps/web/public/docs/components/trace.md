---
title: Trace
description: The building block for reasoning, tool calls, sources and more.
---

# Trace

The building block for reasoning, tool calls, sources and more.

`z-trace` is a list of lines. Each line has an icon, a title, and an optional description and status. A line can expand to show more detail, link to a page, or open a dialog or sheet.

Every line has the same shape, so reasoning, tool calls, sources and plans built from `z-trace` look and behave the same.

Use `z-trace` for the steps an agent takes, like calling a tool, running a subagent or editing a file. Use [Message](/docs/components/message) for its reply, and [Marker](/docs/components/marker) for notes and dividers between turns.

## Installation

### CLI

```bash
npx zard-cli@latest add trace
```

### Manual

```angular-ts
import { isPlatformBrowser } from '@angular/common';
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

Use a `z-trace-line` for a single step:

```angular-ts
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

// Add NgIcon to the component imports and provideIcons({ lucideSearch, lucideTerminal }) to its viewProviders.
```

```angular-html
<z-trace>
  <z-trace-line>
    <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
    <z-trace-title>Searched for minimumReleaseAge</z-trace-title>
  </z-trace-line>
</z-trace>
```

Wrap the line in a `z-trace-collapsible` to show more detail when it expands:

```angular-html
<z-trace>
  <z-trace-collapsible>
    <z-trace-collapsible-trigger>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Ran node --version</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>v24.18.0</z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Composition

```text
z-trace
└── z-trace-line
    ├── z-trace-icon
    ├── z-trace-title
    ├── z-trace-description
    └── z-trace-icon
```

Wrap the line in a `z-trace-collapsible` to show more detail when it expands:

```text
z-trace
└── z-trace-collapsible
    ├── z-trace-collapsible-trigger
    │   └── z-trace-line
    └── z-trace-collapsible-content
```

`z-trace-line` is always the line. To make a line do something, wrap it in that thing’s trigger.

## Features

- One row for reasoning, tool calls, sources, plans and tasks
- Rows that expand, link out, or open a dialog, sheet, drawer or popover
- `running`, `error` and `pending` states, with a shimmer while running
- Nested rows, so a summary expands into steps and a step into its output
- Keyboard and screen reader support from the trigger that wraps each row
- Customizable styling through the `class` input on every part

## Trace Line

Use a `z-trace-line` on its own for a step with no detail to show. It reads as plain text.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-line',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideGitBranch" /></z-trace-icon>
        <z-trace-title>Created branch fix/frozen-lockfile</z-trace-title>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideGitBranch })],
  host: { class: 'contents' },
})
export class ZardDemoTraceLineComponent {}
```

## Status

Set `zStatus` on `z-trace-line` when a step is running, has failed or hasn’t started yet.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircle, lucideCircleAlert, lucideCircleCheck, lucideLoaderCircle } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-status',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
        <z-trace-title>Ran pnpm install</z-trace-title>
      </z-trace-line>
      <z-trace-line zStatus="error">
        <z-trace-icon><ng-icon name="lucideCircleAlert" /></z-trace-icon>
        <z-trace-title>Failed to run pnpm lint</z-trace-title>
      </z-trace-line>
      <z-trace-line zStatus="running">
        <z-trace-icon><ng-icon name="lucideLoaderCircle" class="animate-spin" /></z-trace-icon>
        <z-trace-title>Running pnpm build</z-trace-title>
      </z-trace-line>
      <z-trace-line zStatus="pending">
        <z-trace-icon><ng-icon name="lucideCircle" /></z-trace-icon>
        <z-trace-title>Run pnpm test</z-trace-title>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircle, lucideCircleAlert, lucideCircleCheck, lucideLoaderCircle })],
  host: { class: 'contents' },
})
export class ZardDemoTraceStatusComponent {}
```

| Status | Use for |
| --- | --- |
| none | Work that is done: "Ran pnpm install". |
| `error` | Work that failed. Say so in the title: "Failed to run pnpm lint". |
| `running` | Work in progress. Write the title in the present tense: "Running pnpm build". |
| `pending` | Work that has not started, such as a plan step: "Run pnpm test". |

## Description

Put secondary text such as a diff stat, a duration or a count in a `z-trace-description` after the `z-trace-title`. It does not truncate.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilePen, lucideSearch, lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-description',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideFilePen" /></z-trace-icon>
        <z-trace-title>Edited src/app/settings/notification-preferences.component.ts</z-trace-title>
        <z-trace-description class="font-mono">+48 −12</z-trace-description>
      </z-trace-line>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Ran pnpm test</z-trace-title>
        <z-trace-description>14s</z-trace-description>
      </z-trace-line>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
        <z-trace-title>Searched for provideHttpClient</z-trace-title>
        <z-trace-description>8 results</z-trace-description>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFilePen, lucideSearch, lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoTraceDescriptionComponent {}
```

## Collapsible

Wrap the line in a `z-trace-collapsible` to show more detail when it expands. Put the `z-trace-line` inside `z-trace-collapsible-trigger` and the detail in `z-trace-collapsible-content`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-collapsible',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <div class="w-full max-w-sm">
      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran node --version</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <pre
            class="bg-muted/50 text-foreground max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
            >{{ output }}</pre>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoTraceCollapsibleComponent {
  protected readonly output = '$ node --version\nv24.18.0';
}
```

## Open State

Rows start closed. Set `zOpen` on `z-trace-collapsible` to start open, or bind `[(zOpen)]` to control a row.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-open',
  imports: [NgIcon, ZardButtonComponent, ...ZardTraceImports],
  template: `
    <div class="flex w-full max-w-sm flex-col items-start gap-4">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran node --version</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <pre
            class="bg-muted/50 text-foreground max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
            >{{ nodeOutput }}</pre>
        </z-trace-collapsible-content>
      </z-trace-collapsible>

      <z-trace-collapsible [(zOpen)]="open">
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran pnpm --version</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <pre
            class="bg-muted/50 text-foreground max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
            >{{ pnpmOutput }}</pre>
        </z-trace-collapsible-content>
      </z-trace-collapsible>

      <button type="button" z-button zType="outline" zSize="sm" (click)="open.set(!open())">
        {{ open() ? 'Hide' : 'Show' }} the pnpm output
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoTraceOpenComponent {
  protected readonly open = signal(false);
  protected readonly nodeOutput = '$ node --version\nv24.18.0';
  protected readonly pnpmOutput = '$ pnpm --version\n10.33.4';
}
```

To open a row while it streams and let the reader’s click win, keep the reader’s choice in a signal that starts `undefined` and bind `open() ?? running()`.

```angular-ts
// Undefined until the reader toggles the row, so it follows `running` until then.
protected readonly open = signal<boolean | undefined>(undefined);
```

```angular-html
<z-trace-collapsible [zOpen]="open() ?? running()" (zOpenChange)="open.set($event)">
  <z-trace-collapsible-trigger>
    <z-trace-line [zStatus]="running() ? 'running' : undefined">…</z-trace-line>
  </z-trace-collapsible-trigger>
  <z-trace-collapsible-content>{{ text() }}</z-trace-collapsible-content>
</z-trace-collapsible>
```

## Link

Wrap the `z-trace-line` in an anchor. For a new tab, use an arrow-up-right icon and an `sr-only` "(opens in a new tab)".

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideChevronRight, lucideFileText, lucideGlobe } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-link',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <a href="#link">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
          <z-trace-title>Read src/app/app.config.ts</z-trace-title>
          <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
        </z-trace-line>
      </a>
      <a href="https://angular.dev/installation" target="_blank" rel="noreferrer">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
          <z-trace-title>
            Installation | angular.dev
            <span class="sr-only">(opens in a new tab)</span>
          </z-trace-title>
          <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
        </z-trace-line>
      </a>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideChevronRight, lucideFileText, lucideGlobe })],
  host: { class: 'contents' },
})
export class ZardDemoTraceLinkComponent {}
```

```angular-html
<a href="https://angular.dev/installation" target="_blank" rel="noreferrer">
  <z-trace-line>
    <z-trace-title>
      Install Angular
      <span class="sr-only">(opens in a new tab)</span>
    </z-trace-title>
    <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
  </z-trace-line>
</a>
```

## Dialog

Wrap the `z-trace-line` in the button that opens the dialog. The dialog owns its open state, Escape and focus return.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideChevronRight, lucideGlobe } from '@ng-icons/lucide';

import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-dialog',
  imports: [NgIcon, ...ZardDialogImports, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <button type="button" (click)="open.set(true)">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
          <z-trace-title>Searched the web for build cache settings</z-trace-title>
          <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
        </z-trace-line>
      </button>
    </z-trace>

    <z-dialog [(zVisible)]="open">
      <z-dialog-header>
        <z-dialog-title>Searched the web for build cache settings</z-dialog-title>
        <z-dialog-description>Three results were used in the response.</z-dialog-description>
      </z-dialog-header>
      <z-trace>
        @for (result of results; track result.url) {
          <a [href]="result.url" target="_blank" rel="noreferrer">
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
              <z-trace-title>
                {{ result.title }}
                <span class="sr-only">(opens in a new tab)</span>
              </z-trace-title>
              <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
            </z-trace-line>
          </a>
        }
      </z-trace>
    </z-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideChevronRight, lucideGlobe })],
  host: { class: 'contents' },
})
export class ZardDemoTraceDialogComponent {
  protected readonly open = signal(false);

  protected readonly results = [
    { title: 'Build cache | angular.dev', url: 'https://angular.dev/cli/cache' },
    { title: 'Image optimization | angular.dev', url: 'https://angular.dev/guide/image-optimization' },
    { title: 'Building Angular apps | angular.dev', url: 'https://angular.dev/tools/cli/build' },
  ];
}
```

```angular-html
<button type="button" (click)="open.set(true)">
  <z-trace-line>
    <z-trace-title>Searched the web for build cache settings</z-trace-title>
    <z-trace-icon><ng-icon name="lucideChevronRight" /></z-trace-icon>
  </z-trace-line>
</button>

<z-dialog [(zVisible)]="open">…</z-dialog>
```

## Sheet

The same shape as the dialog. Drawer and Popover work the same way.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFolderSearch } from '@ng-icons/lucide';

import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-sheet',
  imports: [NgIcon, ...ZardSheetImports, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <button type="button" (click)="open.set(true)">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideFolderSearch" /></z-trace-icon>
          <z-trace-title>Explored {{ files.length }} files</z-trace-title>
          <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
        </z-trace-line>
      </button>
    </z-trace>

    <z-sheet [(zVisible)]="open">
      <z-sheet-header>
        <z-sheet-title>Explored {{ files.length }} files</z-sheet-title>
        <z-sheet-description>Files read while preparing the response.</z-sheet-description>
      </z-sheet-header>
      <ul class="flex flex-col gap-2 px-6 font-mono text-xs">
        @for (file of files; track file) {
          <li>{{ file }}</li>
        }
      </ul>
    </z-sheet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFolderSearch })],
  host: { class: 'contents' },
})
export class ZardDemoTraceSheetComponent {
  protected readonly open = signal(false);

  protected readonly files = ['src/app/app.config.ts', 'src/app/app.routes.ts', 'angular.json', 'package.json'];
}
```

## Group

Put rows that sit next to each other in a `z-trace`. It also styles any trigger or link that wraps a `z-trace-line`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileText, lucideSearch, lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-group',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
        <z-trace-title>Searched for minimumReleaseAge</z-trace-title>
      </z-trace-line>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
        <z-trace-title>Read pnpm-workspace.yaml</z-trace-title>
      </z-trace-line>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Ran pnpm install</z-trace-title>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFileText, lucideSearch, lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoTraceGroupComponent {}
```

## Sources

A collapsible row whose detail is a `z-trace` of link rows.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideGlobe } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-sources',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <div class="w-full max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
            <z-trace-title>Used {{ sources.length }} sources</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <z-trace>
            @for (source of sources; track source.href) {
              <a [href]="source.href" target="_blank" rel="noreferrer">
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
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideGlobe })],
  host: { class: 'contents' },
})
export class ZardDemoTraceSourcesComponent {
  protected readonly sources = [
    { title: 'Installation | angular.dev', href: 'https://angular.dev/installation' },
    { title: '@angular/cli | npmjs.com', href: 'https://www.npmjs.com/package/@angular/cli' },
    { title: 'Settings: minimumReleaseAge | pnpm.io', href: 'https://pnpm.io/settings#minimumreleaseage' },
  ];
}
```

## Chain of Thought

A chain of thought is a collapsible row with step rows inside. Set the parent’s status and title from its children.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFileText, lucideSearch } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-chain-of-thought',
  imports: [NgIcon, ZardBadgeComponent, ...ZardTraceImports],
  template: `
    <div class="w-full max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line zStatus="running">
            <z-trace-title>Looking into the slow deploy</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <z-trace>
            <z-trace-collapsible>
              <z-trace-collapsible-trigger>
                <z-trace-line>
                  <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
                  <z-trace-title>Searched for the checkout build log</z-trace-title>
                </z-trace-line>
              </z-trace-collapsible-trigger>
              <z-trace-collapsible-content class="flex flex-wrap gap-1.5">
                <z-badge zType="secondary">angular.dev</z-badge>
                <z-badge zType="secondary">github.com</z-badge>
              </z-trace-collapsible-content>
            </z-trace-collapsible>

            <a href="#chain-of-thought">
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                <z-trace-title>Read the last twelve deploys</z-trace-title>
                <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
              </z-trace-line>
            </a>

            <z-trace-collapsible>
              <z-trace-collapsible-trigger>
                <z-trace-line zStatus="running">
                  <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
                  <z-trace-title>Searching for the cache key</z-trace-title>
                </z-trace-line>
              </z-trace-collapsible-trigger>
              <z-trace-collapsible-content>
                <pre
                  class="bg-muted/50 text-foreground max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                >
cache key image optimization</pre>
              </z-trace-collapsible-content>
            </z-trace-collapsible>
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFileText, lucideSearch })],
  host: { class: 'contents' },
})
export class ZardDemoTraceChainOfThoughtComponent {}
```

## Commit

A commit is a collapsible row with a line for each changed file. Say what changed in the title, Added, Edited or Deleted, and put the line counts in the description. Each file opens its diff in a [Sheet](/docs/components/trace#sheet).

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFilePen, lucideFilePlus, lucideGitCommitHorizontal } from '@ng-icons/lucide';

import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface ChangedFile {
  readonly path: string;
  readonly added: boolean;
  readonly additions: number;
  readonly deletions: number;
  readonly diff: string;
}

type DiffKind = 'hunk' | 'added' | 'removed' | 'context';

@Component({
  selector: 'z-demo-trace-commit',
  imports: [NgIcon, ...ZardSheetImports, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideGitCommitHorizontal" /></z-trace-icon>
            <z-trace-title>Committed a1b2c3: Fix the login redirect</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <z-trace>
            @for (file of files; track file.path) {
              <button type="button" (click)="show(file)">
                <z-trace-line>
                  <z-trace-icon><ng-icon [name]="file.added ? 'lucideFilePlus' : 'lucideFilePen'" /></z-trace-icon>
                  <z-trace-title>{{ file.added ? 'Added' : 'Edited' }} {{ file.path }}</z-trace-title>
                  <z-trace-description class="font-mono">
                    +{{ file.additions }} −{{ file.deletions }}
                  </z-trace-description>
                  <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
                </z-trace-line>
              </button>
            }
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>

    <z-sheet [(zVisible)]="open" zSize="lg">
      <z-sheet-header>
        <z-sheet-title class="font-mono">{{ selected().path }}</z-sheet-title>
        <z-sheet-description>
          {{ selected().additions }} additions, {{ selected().deletions }} deletions
        </z-sheet-description>
      </z-sheet-header>
      <pre
        class="bg-muted/50 mx-6 mb-6 rounded-lg border py-3 font-mono text-xs leading-relaxed"
      ><code>@for (line of lines(); track $index) {<span class="block px-3 wrap-break-word whitespace-pre-wrap" [class]="lineClass[line.kind]">{{ line.text }}</span>}</code></pre>
    </z-sheet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFilePen, lucideFilePlus, lucideGitCommitHorizontal })],
  host: { class: 'contents' },
})
export class ZardDemoTraceCommitComponent {
  protected readonly files: readonly ChangedFile[] = [
    {
      path: 'src/app/login/login.component.ts',
      added: false,
      additions: 2,
      deletions: 2,
      diff: `@@ -18,7 +18,7 @@ export class LoginComponent {
   private readonly route = inject(ActivatedRoute);
   private readonly router = inject(Router);
 
-  private readonly redirectTo =
-    this.route.snapshot.queryParamMap.get('next') ?? '/';
+  private readonly redirectTo = safeRedirect(
+    this.route.snapshot.queryParamMap.get('next'));
 
   protected onSignedIn(): void {`,
    },
    {
      path: 'src/app/auth/safe-redirect.ts',
      added: true,
      additions: 7,
      deletions: 0,
      diff: `@@ -0,0 +1,7 @@
+export function safeRedirect(next: string | null): string {
+  if (!next || !next.startsWith('/') || next.startsWith('//')) {
+    return '/';
+  }
+
+  return next;
+}`,
    },
  ];

  protected readonly open = signal(false);
  protected readonly selected = signal<ChangedFile>(this.files[0]);

  protected readonly lineClass: Record<DiffKind, string> = {
    hunk: 'text-muted-foreground',
    added: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    removed: 'bg-red-500/10 text-red-700 dark:text-red-400',
    context: 'text-foreground',
  };

  /** One entry per diff line, without the leading `+`, `-` or space. */
  protected readonly lines = computed(() =>
    this.selected()
      .diff.split('\n')
      .map(line => {
        if (line.startsWith('@@')) return { kind: 'hunk' as DiffKind, text: line };
        const kind: DiffKind = line.startsWith('+') ? 'added' : line.startsWith('-') ? 'removed' : 'context';
        return { kind, text: line.slice(1) || ' ' };
      }),
  );

  protected show(file: ChangedFile): void {
    this.selected.set(file);
    this.open.set(true);
  }
}
```

## Whole Turn

Three levels: the turn, a summary, and the rows. Text between steps sits between two `z-trace` lists.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBrain, lucideChevronRight, lucideFileText, lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-whole-turn',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <div class="w-full max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line zStatus="error">
            <z-trace-title>Worked for 2m 4s, 1 command failed</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted class="flex flex-col gap-2">
          <z-trace>
            <z-trace-collapsible>
              <z-trace-collapsible-trigger>
                <z-trace-line>
                  <z-trace-icon><ng-icon name="lucideBrain" /></z-trace-icon>
                  <z-trace-title>Thought</z-trace-title>
                  <z-trace-description>12s</z-trace-description>
                </z-trace-line>
              </z-trace-collapsible-trigger>
              <z-trace-collapsible-content class="whitespace-pre-wrap">
                I should check which package managers are installed before I scaffold anything.
              </z-trace-collapsible-content>
            </z-trace-collapsible>

            <z-trace-collapsible zOpen>
              <z-trace-collapsible-trigger>
                <z-trace-line zStatus="error">
                  <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                  <z-trace-title>Ran 2 commands, 1 failed</z-trace-title>
                </z-trace-line>
              </z-trace-collapsible-trigger>
              <z-trace-collapsible-content zKeepMounted>
                <z-trace>
                  <z-trace-line>
                    <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                    <z-trace-title>Ran node --version</z-trace-title>
                  </z-trace-line>
                  <z-trace-collapsible>
                    <z-trace-collapsible-trigger>
                      <z-trace-line zStatus="error">
                        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                        <z-trace-title>Failed to run pnpm --version</z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content>
                      <pre
                        class="border-destructive/30 bg-destructive/5 text-destructive max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                        >{{ error }}</pre>
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                </z-trace>
              </z-trace-collapsible-content>
            </z-trace-collapsible>
          </z-trace>

          <p class="text-foreground">Node is installed and pnpm is not. Reading the workspace config.</p>

          <z-trace>
            <a href="#whole-turn">
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                <z-trace-title>Read angular.json</z-trace-title>
                <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
              </z-trace-line>
            </a>
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBrain, lucideChevronRight, lucideFileText, lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoTraceWholeTurnComponent {
  protected readonly error = 'command not found: pnpm';
}
```

## Reasoning

Render the reasoning of a streamed reply. The row is a `z-trace-line` until the first text arrives. See [Open State](/docs/components/trace#open).

```angular-ts
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBrain } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

const QUESTION = 'Why is the checkout deploy so slow?';
const REASONING =
  'The build log shows install and compile finish in under a minute. Image optimization takes almost four, and it reruns on every deploy because the cache key includes the commit hash.';
const ANSWER =
  'Image optimization is the bottleneck. Key its cache on the lockfile and the image directory instead of the commit hash.';

@Component({
  selector: 'z-demo-trace-reasoning',
  imports: [
    NgIcon,
    NgTemplateOutlet,
    ZardButtonComponent,
    ...ZardBubbleImports,
    ...ZardMessageImports,
    ...ZardTraceImports,
  ],
  template: `
    <div class="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      @if (sent()) {
        <z-message zAlign="end">
          <z-message-content>
            <z-bubble zAlign="end" zVariant="muted">
              <z-bubble-content>{{ question }}</z-bubble-content>
            </z-bubble>
          </z-message-content>
        </z-message>
      }

      @if (thinking() || reasoning()) {
        <z-message>
          <z-message-content class="gap-4">
            <z-trace>
              <ng-template #line>
                <z-trace-line [zStatus]="thinking() ? 'running' : undefined">
                  <z-trace-icon><ng-icon name="lucideBrain" /></z-trace-icon>
                  <z-trace-title>{{ thinking() ? 'Thinking' : 'Thought' }}</z-trace-title>
                </z-trace-line>
              </ng-template>

              <!-- A plain line until the first text arrives, then a row that follows the stream until it is toggled. -->
              @if (reasoning()) {
                <z-trace-collapsible [zOpen]="open() ?? thinking()" (zOpenChange)="open.set($event)">
                  <z-trace-collapsible-trigger>
                    <ng-container *ngTemplateOutlet="line" />
                  </z-trace-collapsible-trigger>
                  <z-trace-collapsible-content class="whitespace-pre-wrap">
                    {{ reasoning() }}
                  </z-trace-collapsible-content>
                </z-trace-collapsible>
              } @else {
                <ng-container *ngTemplateOutlet="line" />
              }
            </z-trace>

            @if (answer()) {
              <p>{{ answer() }}</p>
            }
          </z-message-content>
        </z-message>
      }

      @if (!busy()) {
        <button type="button" z-button zType="outline" zSize="sm" class="mt-auto self-start" (click)="next()">
          {{ sent() ? 'Reset' : 'Send message' }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBrain })],
  host: { class: 'contents' },
})
export class ZardDemoTraceReasoningComponent {
  protected readonly question = QUESTION;

  protected readonly sent = signal(false);
  protected readonly thinking = signal(false);
  protected readonly reasoning = signal('');
  protected readonly open = signal<boolean | undefined>(undefined);
  protected readonly answer = signal('');
  protected readonly busy = signal(false);

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  protected next(): void {
    if (this.sent()) {
      this.reset();
    } else {
      void this.send();
    }
  }

  private reset(): void {
    this.run++;
    this.sent.set(false);
    this.thinking.set(false);
    this.reasoning.set('');
    this.open.set(undefined);
    this.answer.set('');
  }

  private async send(): Promise<void> {
    const run = ++this.run;
    this.sent.set(true);
    this.busy.set(true);
    this.thinking.set(true);

    if (!(await this.wait(400, run))) return;
    if (!(await this.stream(REASONING, text => this.reasoning.set(text), 60, run))) return;
    this.thinking.set(false);

    if (!(await this.wait(400, run))) return;
    if (!(await this.stream(ANSWER, text => this.answer.set(text), 20, run))) return;
    this.busy.set(false);
  }

  /** Reveals `text` a word at a time, like a streamed response. Resolves `false` if the run was replaced. */
  private async stream(text: string, set: (value: string) => void, delay: number, run: number): Promise<boolean> {
    let shown = '';
    for (const word of text.split(/(?<= )/)) {
      if (!(await this.wait(delay, run))) return false;
      shown += word;
      set(shown);
    }
    return true;
  }

  private wait(ms: number, run: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(run === this.run), ms));
  }
}
```

## Tool

Render the tool calls of a streamed reply: a running line while the call runs, then a row that expands into its output.

```angular-ts
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface ToolCall {
  readonly command: string;
  readonly state: 'running' | 'done' | 'error';
  readonly output: string;
}

const QUESTION = 'Which package managers are installed?';
const COMMANDS = [
  { command: 'node --version', output: 'v24.18.0', failed: false },
  { command: 'npm --version', output: '11.6.2', failed: false },
  { command: 'pnpm --version', output: 'command not found: pnpm', failed: true },
];
const ANSWER = 'Node 24 and npm 11 are installed. pnpm is not.';

@Component({
  selector: 'z-demo-trace-tool',
  imports: [NgIcon, ZardButtonComponent, ...ZardBubbleImports, ...ZardMessageImports, ...ZardTraceImports],
  template: `
    <div class="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      @if (sent()) {
        <z-message zAlign="end">
          <z-message-content>
            <z-bubble zAlign="end" zVariant="muted">
              <z-bubble-content>{{ question }}</z-bubble-content>
            </z-bubble>
          </z-message-content>
        </z-message>
      }

      @if (tools().length) {
        <z-message>
          <z-message-content class="gap-4">
            <z-trace>
              @for (tool of tools(); track tool.command) {
                @if (tool.state === 'running') {
                  <z-trace-line zStatus="running">
                    <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                    <z-trace-title>Running {{ tool.command }}</z-trace-title>
                  </z-trace-line>
                } @else {
                  <z-trace-collapsible>
                    <z-trace-collapsible-trigger>
                      <z-trace-line [zStatus]="tool.state === 'error' ? 'error' : undefined">
                        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                        <z-trace-title>
                          {{ tool.state === 'error' ? 'Failed to run' : 'Ran' }} {{ tool.command }}
                        </z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content>
                      <pre
                        class="bg-muted/50 text-foreground max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                        >{{ tool.output }}</pre>
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                }
              }
            </z-trace>

            @if (answer()) {
              <p>{{ answer() }}</p>
            }
          </z-message-content>
        </z-message>
      }

      @if (!busy()) {
        <button type="button" z-button zType="outline" zSize="sm" class="mt-auto self-start" (click)="next()">
          {{ sent() ? 'Reset' : 'Send message' }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoTraceToolComponent {
  protected readonly question = QUESTION;

  protected readonly sent = signal(false);
  protected readonly tools = signal<ToolCall[]>([]);
  protected readonly answer = signal('');
  protected readonly busy = signal(false);

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  protected next(): void {
    if (this.sent()) {
      this.run++;
      this.sent.set(false);
      this.tools.set([]);
      this.answer.set('');
    } else {
      void this.send();
    }
  }

  private async send(): Promise<void> {
    const run = ++this.run;
    this.sent.set(true);
    this.busy.set(true);

    for (const { failed, ...tool } of COMMANDS) {
      this.tools.update(tools => [...tools, { ...tool, state: 'running' }]);
      if (!(await this.wait(900, run))) return;
      this.tools.update(tools =>
        tools.map(item => (item.command === tool.command ? { ...item, state: failed ? 'error' : 'done' } : item)),
      );
    }

    let shown = '';
    for (const word of ANSWER.split(/(?<= )/)) {
      if (!(await this.wait(20, run))) return;
      shown += word;
      this.answer.set(shown);
    }
    this.busy.set(false);
  }

  private wait(ms: number, run: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(run === this.run), ms));
  }
}
```

## RTL

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
    <z-trace class="max-w-sm">
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
  host: { class: 'contents' },
})
export class ZardDemoTraceRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
```

## Accessibility

`z-trace` adds no roles of its own. Each line gets its semantics from the element that wraps it.

- A `z-trace-line` on its own is a span-like box. It is read as text and is not a tab stop.
- Wrap it in a `z-trace-collapsible-trigger` and it becomes a button with `aria-expanded`. Wrap it in a link, or in the trigger for a dialog or sheet, and it takes the keyboard and focus behavior of that element.
- `z-trace-icon` is hidden from assistive tech, so `z-trace-title` is the accessible name. Write it as a sentence that says what happened, like "Edited trace.component.ts", not just "trace.component.ts".
- When a link opens a new tab, add "(opens in a new tab)" to the title with `sr-only`.
- Status is shown with color and motion, so put it in the title too. Write "Running pnpm build" while it runs and "Failed to run pnpm build" when it errors.
- The shimmer on a running title stops when the reader prefers reduced motion. The title still says what is happening.
- `z-trace-collapsible-content` mutes its text. If you put a block with a muted background inside it, give the block `text-foreground` so it keeps its contrast.

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
