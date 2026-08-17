---
title: Bubble
description: Displays conversational content in a message bubble. Supports variants, alignment, grouping, reactions, and collapsible content.
---

# Bubble

Displays conversational content in a message bubble. Supports variants, alignment, grouping, reactions, and collapsible content.

## Installation

### CLI

```bash
npx zard-cli@latest add bubble
```

### Manual

```angular-ts
import { ChangeDetectionStrategy, Component, computed, contentChild, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  bubbleContentVariants,
  bubbleGroupVariants,
  bubbleReactionsVariants,
  bubbleVariants,
  type ZardBubbleAlignVariants,
  type ZardBubbleReactionsAlignVariants,
  type ZardBubbleReactionsSideVariants,
  type ZardBubbleVariantVariants,
} from './bubble.variants';

@Component({
  selector: 'z-bubble-group, [z-bubble-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'bubble-group',
    '[class]': 'classes()',
  },
  exportAs: 'zBubbleGroup',
})
export class ZardBubbleGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(bubbleGroupVariants(), this.class()));
}

@Component({
  selector: 'z-bubble-content, [z-bubble-content]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'bubble-content',
    '[class]': 'classes()',
  },
  exportAs: 'zBubbleContent',
})
export class ZardBubbleContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(bubbleContentVariants(), this.class()));
}

@Component({
  selector: 'z-bubble, [z-bubble]',
  template: `
    <ng-content select="z-bubble-content, [z-bubble-content]" />
    <ng-content select="z-bubble-reactions, [z-bubble-reactions]" />
    @if (!hasContent()) {
      <div data-slot="bubble-content" [class]="contentClasses()">
        <ng-content />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'bubble',
    '[attr.data-variant]': 'zVariant()',
    '[attr.data-align]': 'zAlign()',
    '[class]': 'classes()',
  },
  exportAs: 'zBubble',
})
export class ZardBubbleComponent {
  readonly class = input<ClassValue>('');
  readonly zVariant = input<ZardBubbleVariantVariants>('default');
  readonly zAlign = input<ZardBubbleAlignVariants>('start');

  /**
   * A bubble with no `z-bubble-content` child gets the content surface for free, so
   * `<z-bubble>Hey there!</z-bubble>` is enough for a plain turn. Projecting the
   * content explicitly is what unlocks the rich cases — a `class` override, or the
   * whole turn rendered as a button or anchor.
   */
  private readonly projectedContent = contentChild(ZardBubbleContentComponent, { descendants: false });

  protected readonly hasContent = computed(() => !!this.projectedContent());
  protected readonly contentClasses = computed(() => bubbleContentVariants());
  protected readonly classes = computed(() =>
    mergeClasses(bubbleVariants({ zVariant: this.zVariant() }), this.class()),
  );
}

@Component({
  selector: 'z-bubble-reactions, [z-bubble-reactions]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'bubble-reactions',
    '[attr.data-side]': 'zSide()',
    '[attr.data-align]': 'zAlign()',
    '[class]': 'classes()',
  },
  exportAs: 'zBubbleReactions',
})
export class ZardBubbleReactionsComponent {
  readonly class = input<ClassValue>('');
  readonly zSide = input<ZardBubbleReactionsSideVariants>('bottom');
  readonly zAlign = input<ZardBubbleReactionsAlignVariants>('end');

  protected readonly classes = computed(() =>
    mergeClasses(bubbleReactionsVariants({ zSide: this.zSide(), zAlign: this.zAlign() }), this.class()),
  );
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const bubbleGroupVariants = cva('flex min-w-0 flex-col gap-2');

export const bubbleVariants = cva(
  mergeClasses(
    'group/bubble relative flex w-fit min-w-0 max-w-[80%] flex-col gap-1',
    'data-[align=end]:self-end data-[variant=ghost]:max-w-full group-data-[align=end]/message:self-end',
  ),
  {
    variants: {
      zVariant: {
        default: mergeClasses(
          '*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80',
        ),
        secondary: mergeClasses(
          '*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]',
        ),
        muted: mergeClasses(
          '*:data-[slot=bubble-content]:bg-muted',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]',
        ),
        tinted: mergeClasses(
          '*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-foreground',
          'dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)]',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)]',
          'dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]',
        ),
        outline: mergeClasses(
          '*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground',
          'dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30',
        ),
        ghost: mergeClasses(
          'border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground',
          'dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50',
        ),
        destructive: mergeClasses(
          '*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive',
          'dark:*:data-[slot=bubble-content]:bg-destructive/20',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20',
          'dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30',
        ),
      },
    },
    defaultVariants: {
      zVariant: 'default',
    },
  },
);

export const bubbleContentVariants = cva(
  mergeClasses(
    'w-fit min-w-0 max-w-full overflow-hidden rounded-3xl border border-transparent px-3 py-2.5 text-sm leading-relaxed wrap-break-word',
    'group-data-[align=end]/bubble:self-end',
    '[button]:text-left [button,a]:transition-colors [button,a]:outline-none',
    '[button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring/30',
  ),
);

export const bubbleReactionsVariants = cva(
  'absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-card has-[button]:p-0',
  {
    variants: {
      zSide: {
        top: 'top-0 -translate-y-3/4',
        bottom: 'bottom-0 translate-y-3/4',
      },
      zAlign: {
        start: 'left-3',
        end: 'right-3',
      },
    },
    defaultVariants: {
      zSide: 'bottom',
      zAlign: 'end',
    },
  },
);

export type ZardBubbleVariantVariants = NonNullable<VariantProps<typeof bubbleVariants>['zVariant']>;
export type ZardBubbleAlignVariants = 'start' | 'end';
export type ZardBubbleReactionsSideVariants = NonNullable<VariantProps<typeof bubbleReactionsVariants>['zSide']>;
export type ZardBubbleReactionsAlignVariants = NonNullable<VariantProps<typeof bubbleReactionsVariants>['zAlign']>;
```

```angular-ts
export {
  ZardBubbleComponent,
  ZardBubbleContentComponent,
  ZardBubbleGroupComponent,
  ZardBubbleReactionsComponent,
} from './bubble.component';

import {
  ZardBubbleComponent,
  ZardBubbleContentComponent,
  ZardBubbleGroupComponent,
  ZardBubbleReactionsComponent,
} from './bubble.component';

export const ZardBubbleImports = [
  ZardBubbleGroupComponent,
  ZardBubbleComponent,
  ZardBubbleContentComponent,
  ZardBubbleReactionsComponent,
] as const;
```

```angular-ts
export * from './bubble.component';
export * from './bubble.imports';
export * from './bubble.variants';
```

## Usage

```angular-ts
import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
```

```angular-html
<z-bubble>
  <z-bubble-content>I checked the registry output and removed the stale route.</z-bubble-content>
  <z-bubble-reactions>
    <span>👍</span>
  </z-bubble-reactions>
</z-bubble>
```

## Examples

### Default

```angular-ts
import { Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';

@Component({
  selector: 'z-demo-bubble-default',
  imports: [...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-bubble zAlign="end">
        <z-bubble-content>Hey there! what's up?</z-bubble-content>
      </z-bubble>
      <z-bubble-group>
        <z-bubble zVariant="muted">
          <z-bubble-content>Hey! Want to see chat bubbles?</z-bubble-content>
        </z-bubble>
        <z-bubble zVariant="muted">
          <z-bubble-content>
            I can group messages, switch sides, and keep the whole thread easy to scan.
          </z-bubble-content>
          <z-bubble-reactions role="img" aria-label="Reaction: thumbs up">
            <span>👍</span>
          </z-bubble-reactions>
        </z-bubble>
      </z-bubble-group>
      <z-bubble zAlign="end">
        <z-bubble-content>Sure. Hit me with your best demo.</z-bubble-content>
      </z-bubble>
      <z-bubble zVariant="muted">
        <z-bubble-content>
          Yes. You are reading a demo that is demoing itself. Very meta. Very on-brand.
        </z-bubble-content>
        <z-bubble-reactions role="img" aria-label="Reactions: thumbs up, fire, eyes, and 2 more">
          <span>👍</span>
          <span>🔥</span>
          <span>👀</span>
          <span>+2</span>
        </z-bubble-reactions>
      </z-bubble>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoBubbleDefaultComponent {}
```

### Variants

```angular-ts
import { Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';

@Component({
  selector: 'z-demo-bubble-variants',
  imports: [...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-12 py-12">
      <z-bubble>
        <z-bubble-content>This is the default primary bubble.</z-bubble-content>
      </z-bubble>
      <z-bubble zVariant="secondary" zAlign="end">
        <z-bubble-content>This is the secondary variant.</z-bubble-content>
      </z-bubble>
      <z-bubble zVariant="muted">
        <z-bubble-content>This one is muted. It uses a lower emphasis color for the chat bubble.</z-bubble-content>
        <z-bubble-reactions role="img" aria-label="Reaction: thumbs up">
          <span>👍</span>
        </z-bubble-reactions>
      </z-bubble>
      <z-bubble zVariant="tinted" zAlign="end">
        <z-bubble-content>
          This one is tinted. The tint is a softer color derived from the primary color.
        </z-bubble-content>
      </z-bubble>
      <z-bubble zVariant="outline">
        <z-bubble-content>We can also use an outlined variant.</z-bubble-content>
      </z-bubble>
      <z-bubble zVariant="destructive" zAlign="end">
        <z-bubble-content>Or a destructive variant with a reaction.</z-bubble-content>
        <z-bubble-reactions role="img" aria-label="Reaction: fire">
          <span>🔥</span>
        </z-bubble-reactions>
      </z-bubble>
      <z-bubble zVariant="ghost">
        <z-bubble-content class="flex flex-col gap-4">
          <!-- prettier-ignore -->
          <p>Ghost bubbles work for assistant text, <strong class="font-semibold">markdown</strong>, and other content that should not be framed.</p>
          <!-- prettier-ignore -->
          <p>This is perfect for assistant messages that should not have a frame and can take the full width of the container. You can also render <code class="bg-muted rounded px-1 py-0.5 font-mono text-[0.8rem]">code</code> in it.</p>
          <p>Ghost bubbles are full width and can take the full width of the container.</p>
        </z-bubble-content>
      </z-bubble>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoBubbleVariantsComponent {}
```

### Alignment

```angular-ts
import { Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';

@Component({
  selector: 'z-demo-bubble-alignment',
  imports: [...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-bubble zVariant="muted">
        <z-bubble-content>This bubble is aligned to the start. This is the default alignment.</z-bubble-content>
      </z-bubble>
      <z-bubble zAlign="end">
        <z-bubble-content>This bubble is aligned to the end. Use this for user messages.</z-bubble-content>
      </z-bubble>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoBubbleAlignmentComponent {}
```

### Group

```angular-ts
import { Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';

@Component({
  selector: 'z-demo-bubble-group',
  imports: [...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-bubble zVariant="muted">
        <z-bubble-content>Can you tell me what's the issue?</z-bubble-content>
      </z-bubble>
      <z-bubble-group>
        <z-bubble zAlign="end">
          <z-bubble-content>You tell me!</z-bubble-content>
        </z-bubble>
        <z-bubble zAlign="end">
          <z-bubble-content>It worked yesterday. You broke it!</z-bubble-content>
        </z-bubble>
        <z-bubble zAlign="end">
          <z-bubble-content>Find the bug and fix it.</z-bubble-content>
          <z-bubble-reactions role="img" aria-label="Reactions: eyes" zAlign="start">
            <span>👀</span>
          </z-bubble-reactions>
        </z-bubble>
      </z-bubble-group>
      <z-bubble zVariant="muted">
        <z-bubble-content>
          Want me to diff yesterday's you against today's you? It's a bit embarrassing.
        </z-bubble-content>
      </z-bubble>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoBubbleGroupComponent {}
```

### Link Button

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'z-demo-bubble-link-button',
  imports: [...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-bubble zVariant="muted">
        <z-bubble-content>How can I help you today?</z-bubble-content>
      </z-bubble>
      <z-bubble-group>
        <z-bubble zVariant="tinted" zAlign="end">
          <button type="button" z-bubble-content (click)="notify('You clicked forgot password')">
            I forgot my password
          </button>
        </z-bubble>
        <z-bubble zVariant="tinted" zAlign="end">
          <button type="button" z-bubble-content (click)="notify('You clicked help with subscription')">
            I need help with my subscription
          </button>
        </z-bubble>
        <z-bubble zVariant="tinted" zAlign="end">
          <button type="button" z-bubble-content (click)="notify('You clicked something else. Talk to a human.')">
            Something else. Talk to a human.
          </button>
        </z-bubble>
      </z-bubble-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoBubbleLinkButtonComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected notify(message: string) {
    this.sonner.show(message);
  }
}
```

### Reactions

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'z-demo-bubble-reactions',
  imports: [ZardButtonComponent, ...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-12 py-12">
      <z-bubble zVariant="muted" zAlign="end">
        <z-bubble-content>I don't need tests, I know my code works.</z-bubble-content>
        <z-bubble-reactions role="img" aria-label="Reactions: thumbs up, surprised" zAlign="start">
          <span>👍</span>
          <span>😮</span>
        </z-bubble-reactions>
      </z-bubble>
      <z-bubble zVariant="muted">
        <z-bubble-content>Bold. Fine I'll add some tests. I'll let you know when they're done.</z-bubble-content>
        <z-bubble-reactions role="img" aria-label="Reactions: eyes, rocket, and 2 more">
          <span>👀</span>
          <span>🚀</span>
          <span>+2</span>
        </z-bubble-reactions>
      </z-bubble>
      <z-bubble zVariant="default" zAlign="end">
        <z-bubble-content>Tests passed on the first try. All 142 of them. Looking good!</z-bubble-content>
        <z-bubble-reactions role="img" aria-label="Reactions: party popper, clapping hands" zSide="top" zAlign="start">
          <span>🎉</span>
          <span>👏</span>
        </z-bubble-reactions>
      </z-bubble>
      <z-bubble zVariant="destructive">
        <z-bubble-content>Are you sure I can run this command?</z-bubble-content>
        <z-bubble-reactions>
          <button type="button" z-button zType="ghost" zSize="xs" (click)="runCommand()">Yes, run it</button>
        </z-bubble-reactions>
      </z-bubble>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoBubbleReactionsComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected runCommand() {
    this.sonner.success('You clicked yes, running command...');
  }
}
```

### Collapsible

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

const TEXT = `The accessibility review found two focus states that were visually too subtle in dark mode.

I checked the dialog, menu, and drawer paths because each one renders focusable controls inside a layered surface.

The dialog and drawer are fine. The menu needs the hover and focus tokens split so keyboard focus stays visible when the pointer is not involved.

I also recommend keeping the change in the style file instead of the primitive so the other themes can choose their own focus treatment later.`;

const PREVIEW_LENGTH = 180;

@Component({
  selector: 'z-demo-bubble-collapsible',
  imports: [NgIcon, ZardButtonComponent, ...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-bubble zVariant="muted">
        <z-bubble-content>How can I help you today?</z-bubble-content>
      </z-bubble>

      <z-bubble zVariant="muted" zAlign="end">
        <z-bubble-content class="whitespace-pre-line">
          <div id="bubble-collapsible-text">{{ visibleText() }}</div>
          @if (isLong) {
            <button
              type="button"
              z-button
              zType="link"
              class="text-muted-foreground gap-1 p-0"
              aria-controls="bubble-collapsible-text"
              [attr.aria-expanded]="open()"
              (click)="open.set(!open())"
            >
              {{ open() ? 'Show less' : 'Show more' }}
              <ng-icon
                name="lucideChevronDown"
                data-icon="inline-end"
                class="transition-transform"
                [class.rotate-180]="open()"
              />
            </button>
          }
        </z-bubble-content>
      </z-bubble>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
  host: { class: 'contents' },
})
export class ZardDemoBubbleCollapsibleComponent {
  protected readonly open = signal(false);
  protected readonly isLong = TEXT.length > PREVIEW_LENGTH;
  protected readonly visibleText = computed(() =>
    this.open() || !this.isLong ? TEXT : `${TEXT.slice(0, PREVIEW_LENGTH)}...`,
  );
}
```

### Tooltip

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-bubble-tooltip',
  imports: [NgIcon, ZardButtonComponent, ZardTooltipImports, ...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-4 py-12">
      <z-bubble zVariant="secondary">
        <z-bubble-content>Did you remove the stale route?</z-bubble-content>
      </z-bubble>
      <z-bubble zAlign="end">
        <z-bubble-content>Yes, removed it from the registry.</z-bubble-content>
        <z-bubble-reactions>
          <button
            type="button"
            z-button
            zType="ghost"
            zSize="icon-xs"
            zTooltip="Read on Jan 5, 2026 at 4:32 PM"
            aria-label="Read receipt"
          >
            <ng-icon name="lucideCheck" />
          </button>
        </z-bubble-reactions>
      </z-bubble>
    </div>
  `,
  viewProviders: [provideIcons({ lucideCheck })],
  host: { class: 'contents' },
})
export class ZardDemoBubbleTooltipComponent {}
```

### Popover

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-demo-bubble-popover',
  imports: [NgIcon, ZardButtonComponent, ...ZardPopoverImports, ...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-4 py-12">
      <z-bubble zAlign="end">
        <z-bubble-content>Run the build script.</z-bubble-content>
      </z-bubble>
      <z-bubble zVariant="destructive">
        <z-bubble-content>Failed to run the command.</z-bubble-content>
        <z-bubble-reactions>
          <button
            type="button"
            z-button
            zType="ghost"
            zSize="icon-xs"
            zPopover
            aria-label="Show error details"
            class="aria-expanded:text-destructive"
            [zContent]="errorDetails"
          >
            <ng-icon name="lucideInfo" />
          </button>
        </z-bubble-reactions>
      </z-bubble>
    </div>

    <ng-template #errorDetails>
      <z-popover>
        <div z-popover-header>
          <h4 z-popover-title class="text-sm">Command failed with exit code 1</h4>
          <p z-popover-description class="text-sm">ENOENT: no such file or directory, open pnpm-lock.yaml</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  viewProviders: [provideIcons({ lucideInfo })],
  host: { class: 'contents' },
})
export class ZardDemoBubblePopoverComponent {}
```

### Shorthand

```angular-ts
import { Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';

@Component({
  selector: 'z-demo-bubble-shorthand',
  imports: [...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-bubble zVariant="muted">Short turns do not need the content wrapper.</z-bubble>
      <z-bubble zAlign="end">Hey there! what's up?</z-bubble>
      <z-bubble zVariant="muted">
        <z-bubble-content class="font-medium">
          Project the content when you need to style it, or render it as a button or link.
        </z-bubble-content>
      </z-bubble>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoBubbleShorthandComponent {}
```

## API Reference

### z-bubble

The root bubble wrapper. Content projected straight into it gets the bubble surface, so a plain turn needs no sub-component.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zVariant]` | The bubble visual treatment. | `default \| secondary \| muted \| tinted \| outline \| ghost \| destructive` | `default` |
| `[zAlign]` | The inline alignment of the bubble. | `start \| end` | `start` |
| `[class]` | Additional classes to apply to the root element. | `ClassValue` | `-` |

### z-bubble-content

The bubble content wrapper. Project it to style the surface, or use it as an attribute on a button or anchor to render the content as an interactive element.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional classes to apply to the content element. | `ClassValue` | `-` |

### z-bubble-reactions

Displays overlapped reactions for a bubble.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zSide]` | The side of the bubble to anchor the reactions. | `top \| bottom` | `bottom` |
| `[zAlign]` | The inline alignment of the reactions. | `start \| end` | `end` |
| `[class]` | Additional classes to apply to the reaction row. | `ClassValue` | `-` |

### z-bubble-group

Groups consecutive bubbles from the same sender.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional classes to apply to the group root. | `ClassValue` | `-` |

---

[Open in browser](https://zardui.com/docs/components/bubble)
