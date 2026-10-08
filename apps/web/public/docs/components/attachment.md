---
title: Attachment
description: Composable file and image attachment
---

# Attachment

Composable file and image attachment

## Installation

### CLI

```bash
npx zard-cli@latest add attachment
```

### Manual

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import {
  buttonVariants,
  type ZardButtonSizeVariants,
  type ZardButtonTypeVariants,
} from '@/shared/components/button/button.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  attachmentVariants,
  attachmentMediaVariants,
  attachmentContentVariants,
  attachmentTitleVariants,
  attachmentDescriptionVariants,
  attachmentActionsVariants,
  attachmentActionVariants,
  attachmentTriggerVariants,
  attachmentGroupVariants,
  type ZardAttachmentStateVariants,
  type ZardAttachmentSizeVariants,
  type ZardAttachmentOrientationVariants,
  type ZardAttachmentMediaVariantVariants,
} from './attachment.variants';

@Component({
  selector: 'z-attachment, [z-attachment]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'attachment',
    '[class]': 'classes()',
    '[attr.data-state]': 'zState()',
    '[attr.data-size]': 'zSize()',
    '[attr.data-orientation]': 'zOrientation()',
    '[attr.aria-busy]': 'busy() ? "true" : null',
  },
  exportAs: 'zAttachment',
})
export class ZardAttachmentComponent {
  readonly class = input<ClassValue>('');
  readonly zState = input<ZardAttachmentStateVariants>('done');
  readonly zSize = input<ZardAttachmentSizeVariants>('default');
  readonly zOrientation = input<ZardAttachmentOrientationVariants>('horizontal');

  readonly busy = computed(() => this.zState() === 'uploading' || this.zState() === 'processing');
  protected readonly classes = computed(() =>
    mergeClasses(
      attachmentVariants({ zState: this.zState(), zSize: this.zSize(), zOrientation: this.zOrientation() }),
      this.class(),
    ),
  );
}

@Component({
  selector: 'z-attachment-media, [z-attachment-media]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'attachment-media', '[class]': 'classes()', '[attr.data-variant]': 'zVariant()' },
  exportAs: 'zAttachmentMedia',
})
export class ZardAttachmentMediaComponent {
  readonly class = input<ClassValue>('');
  readonly zVariant = input<ZardAttachmentMediaVariantVariants>('icon');
  protected readonly classes = computed(() =>
    mergeClasses(attachmentMediaVariants({ zVariant: this.zVariant() }), this.class()),
  );
}

@Component({
  selector: 'z-attachment-content, [z-attachment-content]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'attachment-content', '[class]': 'classes()' },
  exportAs: 'zAttachmentContent',
})
export class ZardAttachmentContentComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(attachmentContentVariants(), this.class()));
}

@Component({
  selector: 'z-attachment-title, [z-attachment-title]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'attachment-title', '[class]': 'classes()' },
  exportAs: 'zAttachmentTitle',
})
export class ZardAttachmentTitleComponent {
  private readonly attachment = inject(ZardAttachmentComponent, { optional: true });
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() =>
    mergeClasses(attachmentTitleVariants(), this.attachment?.busy() && 'motion-safe:animate-pulse', this.class()),
  );
}

@Component({
  selector: 'z-attachment-description, [z-attachment-description]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'attachment-description', '[class]': 'classes()' },
  exportAs: 'zAttachmentDescription',
})
export class ZardAttachmentDescriptionComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(attachmentDescriptionVariants(), this.class()));
}

@Component({
  selector: 'z-attachment-actions, [z-attachment-actions]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'attachment-actions', '[class]': 'classes()' },
  exportAs: 'zAttachmentActions',
})
export class ZardAttachmentActionsComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(attachmentActionsVariants(), this.class()));
}

@Component({
  selector: 'button[z-attachment-action], a[z-attachment-action]',
  imports: [NgIcon],
  template: `
    @if (zLoading()) {
      <ng-icon name="lucideLoaderCircle" class="animate-spin duration-2000" />
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideLoaderCircle })],
  host: {
    'data-slot': 'attachment-action',
    '[class]': 'classes()',
    '[attr.role]': 'null',
    '[attr.tabindex]': 'isLink && disabledState() ? -1 : tabindex()',
    '[attr.disabled]': '!isLink && disabledState() ? "" : null',
    '[attr.aria-disabled]': 'disabledState() ? "true" : null',
    '[attr.data-disabled]': 'disabledState() || null',
    '[attr.type]': 'isLink ? null : type()',
  },
  exportAs: 'zAttachmentAction',
})
export class ZardAttachmentActionComponent extends ZardButtonComponent {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly renderer = inject(Renderer2);
  protected readonly isLink = this.host.tagName === 'A';
  override readonly zType = input<ZardButtonTypeVariants>('ghost');
  override readonly zSize = input<ZardButtonSizeVariants>('icon-xs');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly tabindex = input<string | number | null>(null);
  protected readonly disabledState = computed(() => this.zDisabled() || this.disabled());

  protected override readonly classes = computed(() =>
    mergeClasses(
      buttonVariants({
        zType: this.zType(),
        zSize: this.zSize(),
        zShape: this.zShape(),
        zLoading: this.zLoading(),
        zDisabled: this.disabledState(),
      }),
      attachmentActionVariants(),
      this.class(),
    ),
  );

  // Capture precedes Angular's coalesced consumer listeners.
  private readonly removeClickListener = this.renderer.listen(
    this.host,
    'click',
    (event: MouseEvent) => this.onClick(event),
    { capture: true },
  );

  private readonly removeKeyListener = this.renderer.listen(
    this.host,
    'keydown',
    (event: KeyboardEvent) => this.onKeyDown(event),
    { capture: true },
  );

  override ngOnDestroy(): void {
    this.removeClickListener();
    this.removeKeyListener();
    super.ngOnDestroy();
  }

  onClick(event: MouseEvent): void {
    if (this.disabledState()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabledState() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}

@Directive({
  selector: 'button[z-attachment-trigger], a[z-attachment-trigger]',
  host: {
    'data-slot': 'attachment-trigger',
    '[class]': 'classes()',
    '[attr.type]': 'isLink ? null : type()',
  },
  exportAs: 'zAttachmentTrigger',
})
export class ZardAttachmentTriggerDirective {
  protected readonly isLink = inject(ElementRef<HTMLElement>).nativeElement.tagName === 'A';
  readonly class = input<ClassValue>('');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  protected readonly classes = computed(() => mergeClasses(attachmentTriggerVariants(), this.class()));
}

@Component({
  selector: 'z-attachment-group, [z-attachment-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'attachment-group',
    role: 'group',
    tabindex: '0',
    '[class]': 'classes()',
    '(keydown)': 'onKeyDown($event)',
  },
  exportAs: 'zAttachmentGroup',
})
export class ZardAttachmentGroupComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(attachmentGroupVariants(), this.class()));

  onKeyDown(event: KeyboardEvent): void {
    const host = this.elementRef.nativeElement;
    if (
      event.target !== host ||
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
      return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (!host.children.length || host.clientWidth <= 0 || host.scrollWidth <= host.clientWidth) return;
    event.preventDefault();
    host.scrollBy({ left: event.key === 'ArrowRight' ? host.clientWidth : -host.clientWidth, behavior: 'auto' });
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const attachmentVariants = cva(
  'group/attachment relative isolate flex w-fit max-w-full min-w-0 shrink-0 snap-start items-center rounded-2xl border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/30 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/50 data-[state=idle]:border-dashed text-sm',
  {
    variants: {
      zState: {
        idle: 'border-border border-dashed',
        uploading: 'border-border bg-muted/50',
        processing: 'border-border bg-muted/50',
        error: 'border-destructive/50 text-destructive',
        done: 'border-border',
      },
      zSize: {
        default: 'gap-3 p-3',
        sm: 'gap-2 p-2.5 text-sm',
        xs: 'gap-1.5 p-2 text-xs rounded-xl',
      },
      zOrientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col items-start',
      },
    },
    defaultVariants: { zState: 'done', zSize: 'default', zOrientation: 'horizontal' },
  },
);

export const attachmentMediaVariants = cva(
  'relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive group-data-[size=xs]/attachment:rounded-md [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*="size-"])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*="size-"])]:size-3.5',
  {
    variants: {
      zVariant: {
        icon: 'size-10 bg-muted text-muted-foreground group-data-[size=sm]/attachment:size-8 group-data-[size=xs]/attachment:size-6 [&_svg]:size-4',
        image:
          'size-16 group-data-[size=sm]/attachment:size-12 group-data-[size=xs]/attachment:size-8 [&_img]:size-full [&_img]:object-cover opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover group-data-[orientation=vertical]/attachment:size-auto group-data-[orientation=vertical]/attachment:w-full',
      },
    },
    defaultVariants: { zVariant: 'icon' },
  },
);

export const attachmentContentVariants = cva(
  'flex min-w-0 flex-1 flex-col gap-0.5 leading-tight group-data-[orientation=vertical]/attachment:w-full',
);
export const attachmentTitleVariants = cva('block w-fit max-w-full truncate font-medium');
export const attachmentDescriptionVariants = cva(
  'text-muted-foreground text-xs group-data-[state=error]/attachment:text-destructive/80',
);
export const attachmentActionsVariants = cva(
  'relative z-20 flex shrink-0 items-center gap-1 group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-2.5 group-data-[orientation=vertical]/attachment:right-2.5',
);
export const attachmentActionVariants = cva(
  'relative z-20 group-data-[orientation=vertical]/attachment:bg-background/80 group-data-[orientation=vertical]/attachment:backdrop-blur-xs group-data-[orientation=vertical]/attachment:rounded-full group-data-[orientation=vertical]/attachment:shadow-xs group-data-[orientation=vertical]/attachment:hover:bg-background',
);
export const attachmentTriggerVariants = cva(
  'absolute inset-0 z-10 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring',
);
export const attachmentGroupVariants = cva(
  'flex w-full min-w-0 gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-1 scrollbar-none py-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start',
);

export type ZardAttachmentStateVariants = NonNullable<VariantProps<typeof attachmentVariants>['zState']>;
export type ZardAttachmentSizeVariants = NonNullable<VariantProps<typeof attachmentVariants>['zSize']>;
export type ZardAttachmentOrientationVariants = NonNullable<VariantProps<typeof attachmentVariants>['zOrientation']>;
export type ZardAttachmentMediaVariantVariants = NonNullable<VariantProps<typeof attachmentMediaVariants>['zVariant']>;
```

```angular-ts
import {
  ZardAttachmentComponent,
  ZardAttachmentMediaComponent,
  ZardAttachmentContentComponent,
  ZardAttachmentTitleComponent,
  ZardAttachmentDescriptionComponent,
  ZardAttachmentActionsComponent,
  ZardAttachmentActionComponent,
  ZardAttachmentTriggerDirective,
  ZardAttachmentGroupComponent,
} from './attachment.component';

export const ZardAttachmentImports = [
  ZardAttachmentComponent,
  ZardAttachmentMediaComponent,
  ZardAttachmentContentComponent,
  ZardAttachmentTitleComponent,
  ZardAttachmentDescriptionComponent,
  ZardAttachmentActionsComponent,
  ZardAttachmentActionComponent,
  ZardAttachmentTriggerDirective,
  ZardAttachmentGroupComponent,
] as const;
```

```angular-ts
export * from './attachment.component';
export * from './attachment.variants';
export * from './attachment.imports';
```

## Usage

```angular-ts
import { ZardAttachmentImports } from '@/shared/components/attachment/attachment.imports';
```

```angular-html
<z-attachment>
  <z-attachment-media><ng-icon name="lucideFileText" /></z-attachment-media>
  <z-attachment-content>
    <z-attachment-title>report.pdf</z-attachment-title>
    <z-attachment-description>PDF · 1.2 MB</z-attachment-description>
  </z-attachment-content>
  <z-attachment-actions>
    <button z-attachment-action aria-label="Remove report.pdf">
      <ng-icon name="lucideX" />
    </button>
  </z-attachment-actions>
</z-attachment>
```

## Examples

### Image

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';

import { ZardAttachmentImports } from '../attachment.imports';

@Component({
  selector: 'z-demo-attachment-image',
  imports: [NgIcon, ZardButtonComponent, ...ZardAttachmentImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-6">
      @if (!removed()) {
        <z-attachment zOrientation="vertical" class="w-64 overflow-hidden">
          <z-attachment-media zVariant="image" class="h-36 w-full">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Crect width='240' height='120' fill='%23558078'/%3E%3Cpath d='M0 120L80 20L140 100L190 40L240 120' fill='%23b6d9cc'/%3E%3C/svg%3E"
              alt="Illustration of green mountain peaks"
              class="size-full object-cover"
            />
          </z-attachment-media>
          <z-attachment-content class="w-full px-1">
            <z-attachment-title>Mountains.svg</z-attachment-title>
            <z-attachment-description>Image · 1 KB · Ready</z-attachment-description>
          </z-attachment-content>
          <z-attachment-actions>
            <button type="button" z-attachment-action aria-label="Remove Mountains.svg" (click)="removed.set(true)">
              <ng-icon name="lucideX" class="size-3.5" />
            </button>
          </z-attachment-actions>
        </z-attachment>
      } @else {
        <button type="button" z-button zType="outline" class="w-fit" (click)="removed.set(false)">Restore image</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideX })],
})
export class ZardDemoAttachmentImageComponent {
  readonly removed = signal(false);
}
```

### States

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideClock,
  lucideFileText,
  lucideLoaderCircle,
  lucideRefreshCw,
  lucideTriangleAlert,
  lucideX,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';

import { ZardAttachmentImports } from '../attachment.imports';
import type { ZardAttachmentStateVariants } from '../attachment.variants';

@Component({
  selector: 'z-demo-attachment-states',
  imports: [NgIcon, ZardButtonComponent, ...ZardAttachmentImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-6">
      <div
        role="group"
        class="bg-muted/40 flex flex-wrap items-center gap-1.5 rounded-lg border p-1"
        aria-label="Upload state controls"
      >
        @for (value of states; track value) {
          <button
            type="button"
            z-button
            [zType]="state() === value ? 'default' : 'ghost'"
            zSize="xs"
            [attr.aria-pressed]="state() === value"
            (click)="state.set(value)"
          >
            {{ value }}
          </button>
        }
      </div>

      @if (!removed()) {
        <z-attachment [zState]="state()" class="w-full">
          <z-attachment-media aria-hidden="true">
            @switch (state()) {
              @case ('idle') {
                <ng-icon name="lucideClock" class="size-4" />
              }
              @case ('uploading') {
                <ng-icon name="lucideLoaderCircle" class="text-muted-foreground size-4 animate-spin" />
              }
              @case ('processing') {
                <ng-icon name="lucideFileText" class="size-4" />
              }
              @case ('error') {
                <ng-icon name="lucideTriangleAlert" class="text-destructive size-4" />
              }
              @case ('done') {
                <ng-icon name="lucideCheck" class="size-4 text-emerald-500 dark:text-emerald-400" />
              }
            }
          </z-attachment-media>
          <z-attachment-content>
            <z-attachment-title>Report.pdf</z-attachment-title>
            <z-attachment-description aria-live="polite">{{ descriptions[state()] }}</z-attachment-description>
          </z-attachment-content>
          <z-attachment-actions>
            @if (state() === 'error') {
              <button type="button" z-attachment-action aria-label="Retry Report.pdf" (click)="state.set('uploading')">
                <ng-icon name="lucideRefreshCw" class="size-3.5" />
              </button>
            }
            <button type="button" z-attachment-action aria-label="Remove Report.pdf" (click)="removed.set(true)">
              <ng-icon name="lucideX" class="size-3.5" />
            </button>
          </z-attachment-actions>
        </z-attachment>
      }

      <z-attachment class="w-full">
        <z-attachment-media aria-hidden="true">
          <ng-icon name="lucideFileText" class="size-4" />
        </z-attachment-media>
        <z-attachment-content>
          <z-attachment-title>Independent.txt</z-attachment-title>
          <z-attachment-description>Ready · Unaffected by Report.pdf</z-attachment-description>
        </z-attachment-content>
      </z-attachment>

      @if (removed()) {
        <button type="button" z-button zType="outline" class="w-fit" (click)="removed.set(false)">
          Restore Report.pdf
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideClock,
      lucideFileText,
      lucideLoaderCircle,
      lucideRefreshCw,
      lucideTriangleAlert,
      lucideX,
    }),
  ],
})
export class ZardDemoAttachmentStatesComponent {
  readonly states: ZardAttachmentStateVariants[] = ['idle', 'uploading', 'processing', 'error', 'done'];
  readonly state = signal<ZardAttachmentStateVariants>('uploading');
  readonly removed = signal(false);
  readonly descriptions = {
    idle: 'Waiting to upload',
    uploading: 'Uploading · 42%',
    processing: 'Processing file',
    error: 'Upload failed. Retry or remove the file.',
    done: 'Upload complete · 240 KB',
  };
}
```

### Sizes

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink, lucideFileText } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';

import { ZardAttachmentImports } from '../attachment.imports';
import type { ZardAttachmentSizeVariants } from '../attachment.variants';

@Component({
  selector: 'z-demo-attachment-sizes',
  imports: [NgIcon, ZardButtonComponent, ...ZardAttachmentImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-6">
      <div class="flex flex-wrap gap-2">
        <button type="button" z-button zType="outline" zSize="sm" (click)="vertical.set(!vertical())">
          Toggle orientation
        </button>
        <button type="button" z-button zType="outline" zSize="sm" (click)="image.set(!image())">Toggle media</button>
      </div>

      <div class="flex flex-col gap-3">
        @for (size of sizes; track size) {
          <z-attachment [zSize]="size" [zOrientation]="vertical() ? 'vertical' : 'horizontal'" class="w-full">
            <z-attachment-media [zVariant]="image() ? 'image' : 'icon'">
              @if (image()) {
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23558078'/%3E%3C/svg%3E"
                  alt="Green colour sample"
                  class="size-full object-cover"
                />
              } @else {
                <ng-icon name="lucideFileText" class="size-4" />
              }
            </z-attachment-media>
            <z-attachment-content>
              <z-attachment-title>{{ size }} attachment</z-attachment-title>
              <z-attachment-description>Ready · 24 KB</z-attachment-description>
            </z-attachment-content>
            <z-attachment-actions>
              <button
                type="button"
                z-attachment-action
                [attr.aria-label]="'Inspect ' + size + ' attachment'"
                (click)="selected.set(size)"
              >
                <ng-icon name="lucideExternalLink" class="size-3.5" />
              </button>
            </z-attachment-actions>
          </z-attachment>
        }
      </div>

      <p role="status" class="text-muted-foreground text-xs">Selected: {{ selected() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideExternalLink, lucideFileText })],
})
export class ZardDemoAttachmentSizesComponent {
  readonly sizes: ZardAttachmentSizeVariants[] = ['default', 'sm', 'xs'];
  readonly vertical = signal(false);
  readonly image = signal(false);
  readonly selected = signal('none');
}
```

### Group

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileCode, lucideFileText, lucideImage, lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';

import { ZardAttachmentImports } from '../attachment.imports';

@Component({
  selector: 'z-demo-attachment-group',
  imports: [NgIcon, ZardButtonComponent, ...ZardAttachmentImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-6">
      <z-attachment-group aria-label="Attached files" class="max-w-sm">
        @for (file of files(); track file) {
          <z-attachment class="w-64">
            <z-attachment-media aria-hidden="true">
              @if (file.endsWith('.pdf')) {
                <ng-icon name="lucideFileText" class="size-4" />
              } @else if (file.endsWith('.png')) {
                <ng-icon name="lucideImage" class="size-4" />
              } @else if (file.endsWith('.csv')) {
                <ng-icon name="lucideFileText" class="size-4" />
              } @else {
                <ng-icon name="lucideFileCode" class="size-4" />
              }
            </z-attachment-media>
            <z-attachment-content>
              <z-attachment-title>{{ file }}</z-attachment-title>
              <z-attachment-description>Ready · 24 KB</z-attachment-description>
            </z-attachment-content>
            <z-attachment-actions>
              <button type="button" z-attachment-action [attr.aria-label]="'Remove ' + file" (click)="remove(file)">
                <ng-icon name="lucideX" class="size-3.5" />
              </button>
            </z-attachment-actions>
          </z-attachment>
        }
      </z-attachment-group>
      <button type="button" z-button zType="outline" class="w-fit" (click)="restore()">Restore files</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideFileCode,
      lucideFileText,
      lucideImage,
      lucideX,
    }),
  ],
})
export class ZardDemoAttachmentGroupComponent {
  readonly files = signal(['Notes.pdf', 'Photo.png', 'Budget.csv', 'Archive.zip']);

  remove(file: string): void {
    this.files.update(files => files.filter(value => value !== file));
  }

  restore(): void {
    this.files.set(['Notes.pdf', 'Photo.png', 'Budget.csv', 'Archive.zip']);
  }
}
```

### Trigger

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideFileText, lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';

import { ZardAttachmentImports } from '../attachment.imports';

@Component({
  selector: 'z-demo-attachment-trigger',
  imports: [NgIcon, ZardButtonComponent, ...ZardAttachmentImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-6">
      @if (!removed()) {
        <z-attachment class="w-full">
          <z-attachment-media aria-hidden="true">
            <ng-icon name="lucideFileText" class="size-4" />
          </z-attachment-media>
          <z-attachment-content>
            <z-attachment-title>Preview.pdf</z-attachment-title>
            <z-attachment-description>Ready · Click card to preview</z-attachment-description>
          </z-attachment-content>
          <button
            type="button"
            z-attachment-trigger
            aria-label="Preview Preview.pdf"
            (click)="opened.update(increment)"
          ></button>
          <z-attachment-actions>
            <button type="button" z-attachment-action aria-label="Remove Preview.pdf" (click)="removed.set(true)">
              <ng-icon name="lucideX" class="size-3.5" />
            </button>
            <a z-attachment-action href="#attachment-download" download="Preview.pdf" aria-label="Download Preview.pdf">
              <ng-icon name="lucideDownload" class="size-3.5" />
            </a>
          </z-attachment-actions>
        </z-attachment>
      }

      <p role="status" class="text-muted-foreground text-xs">Preview opened {{ opened() }} times</p>

      @if (removed()) {
        <button type="button" z-button zType="outline" class="w-fit" (click)="removed.set(false)">
          Restore Preview.pdf
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideDownload, lucideFileText, lucideX })],
})
export class ZardDemoAttachmentTriggerComponent {
  readonly removed = signal(false);
  readonly opened = signal(0);
  readonly increment = (value: number) => value + 1;
}
```

## API Reference

### z-attachment

File or image container. Consumer projection owns labels, URLs, progress and transport.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zState]` | Upload state | `idle \| uploading \| processing \| error \| done` | `done` |
| `[zSize]` | Density | `default \| sm \| xs` | `default` |
| `[zOrientation]` | Layout | `horizontal \| vertical` | `horizontal` |
| `[class]` | Override or extend default classes. | `ClassValue` | `''` |

### z-attachment-media

Projected icon or image. Give images meaningful alt text.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zVariant]` | Media presentation | `icon \| image` | `icon` |
| `[class]` | Override or extend default classes. | `ClassValue` | `''` |

### z-attachment-content

Projected text container.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `''` |

### z-attachment-title

Title; pulses only while the nearest attachment is busy, unless the user prefers reduced motion.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `''` |

### z-attachment-description

Projected progress or error description; use an aria-live region when appropriate.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `''` |

### z-attachment-actions

Independent controls above the full-card trigger.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `''` |

### button[z-attachment-action]

Also a[z-attachment-action]. Native actions inherit the complete z-button API and loading observer lifecycle. Native href, target and download remain consumer attributes.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zType]` | Button appearance | `default \| destructive \| outline \| secondary \| ghost \| link` | `ghost` |
| `[zSize]` | Button size | `default \| xs \| sm \| lg \| icon \| icon-xs \| icon-sm \| icon-lg` | `icon-xs` |
| `[zShape]` | Button shape | `default \| circle \| square` | `default` |
| `[zLoading]` | Loading indicator | `boolean` | `false` |
| `[zDisabled]` | Disabled state | `boolean` | `false` |
| `[disabled]` | Native disabled state | `boolean` | `false` |
| `[type]` | Native button type (ignored on anchors) | `button \| submit \| reset` | `button` |
| `[tabindex]` | Consumer tab order; disabled links use -1 | `string \| number \| null` | `null` |
| `[class]` | Override or extend default classes. | `ClassValue` | `''` |

### button[z-attachment-trigger]

Also a[z-attachment-trigger]. Project a named native overlay button or link alongside actions, never around them.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[type]` | Native button type (ignored on anchors) | `button \| submit \| reset` | `button` |
| `[class]` | Override or extend default classes. | `ClassValue` | `''` |

### z-attachment-group

Horizontal snapping group. Provide aria-label or aria-labelledby. Host arrow keys scroll one current viewport; descendant controls keep their keys.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/attachment)
