---
title: Collapsible
description: An interactive component which expands and collapses a panel.
---

# Collapsible

An interactive component which expands and collapses a panel.

## Installation

### CLI

```bash
npx zard-cli@latest add collapsible
```

### Manual

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { collapsibleContentVariants, collapsibleVariants } from '@/shared/components/collapsible/collapsible.variants';
import { ZardIdDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';

/**
 * A directive rather than a component: it renders no markup of its own, and being a directive is
 * what lets it share an element with a component — `<li z-sidebar-menu-item z-collapsible>` is the
 * idiomatic translation of shadcn's `asChild`. Two components on one node is an Angular error
 * (NG0300).
 */
@Directive({
  selector: 'z-collapsible, [z-collapsible]',
  host: {
    'data-slot': 'collapsible',
    '[class]': 'classes()',
    '[attr.data-state]': "open() ? 'open' : 'closed'",
    '[attr.data-disabled]': "zDisabled() ? '' : null",
  },
  hostDirectives: [ZardIdDirective],
  exportAs: 'zCollapsible',
})
export class ZardCollapsibleDirective {
  private readonly uniqueId = inject(ZardIdDirective);
  private readonly isElement = inject(ElementRef<HTMLElement>).nativeElement.tagName.toLowerCase() === 'z-collapsible';

  readonly zOpen = input(false, { transform: booleanAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  readonly zOpenChange = output<boolean>();

  private readonly internalOpen = signal(false);

  /** Current state of the panel. Readonly for consumers — drive it through `zOpen` or `toggle()`. */
  readonly open = this.internalOpen.asReadonly();

  /** Stable id of the projected content, wired into the trigger's `aria-controls`. */
  readonly contentId = computed(() => `${this.uniqueId.id()}-content`);

  protected readonly classes = computed(() =>
    mergeClasses(collapsibleVariants({ isElement: this.isElement }), this.class()),
  );

  constructor() {
    effect(() => {
      this.internalOpen.set(this.zOpen());
    });
  }

  toggle(): void {
    this.setOpen(!this.internalOpen());
  }

  setOpen(open: boolean): void {
    if (this.zDisabled() || this.internalOpen() === open) {
      return;
    }

    this.internalOpen.set(open);
    this.zOpenChange.emit(open);
  }
}

@Directive({
  selector: '[z-collapsible-trigger]',
  host: {
    'data-slot': 'collapsible-trigger',
    type: 'button',
    '[attr.aria-controls]': 'collapsible.contentId()',
    '[attr.aria-expanded]': 'collapsible.open()',
    '[attr.data-state]': "collapsible.open() ? 'open' : 'closed'",
    '[attr.data-disabled]': "collapsible.zDisabled() ? '' : null",
    '[attr.disabled]': 'collapsible.zDisabled() ? true : null',
    '(click)': 'collapsible.toggle()',
  },
  exportAs: 'zCollapsibleTrigger',
})
export class ZardCollapsibleTriggerDirective {
  protected readonly collapsible = inject(ZardCollapsibleDirective);
}

@Component({
  selector: 'z-collapsible-content',
  template: `
    <div class="overflow-hidden">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'collapsible-content',
    '[class]': 'classes()',
    '[id]': 'collapsible.contentId()',
    '[attr.data-state]': "collapsible.open() ? 'open' : 'closed'",
  },
  exportAs: 'zCollapsibleContent',
})
export class ZardCollapsibleContentComponent {
  protected readonly collapsible = inject(ZardCollapsibleDirective);

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(collapsibleContentVariants({ isOpen: this.collapsible.open() }), this.class()),
  );
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const collapsibleVariants = cva('', {
  variants: {
    // `z-collapsible` is a custom element and would default to `display: inline`. As an attribute on
    // an existing element (the `asChild` case) the host's own display has to win instead.
    isElement: {
      true: 'block',
      false: '',
    },
  },
  defaultVariants: {
    isElement: false,
  },
});

export const collapsibleContentVariants = cva('grid transition-[grid-template-rows,visibility] duration-200 ease-out', {
  variants: {
    isOpen: {
      true: 'visible grid-rows-[1fr]',
      false: 'invisible grid-rows-[0fr]',
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});

export type ZardCollapsibleVariants = VariantProps<typeof collapsibleVariants>;
export type ZardCollapsibleContentVariants = VariantProps<typeof collapsibleContentVariants>;
```

```angular-ts
import {
  ZardCollapsibleDirective,
  ZardCollapsibleContentComponent,
  ZardCollapsibleTriggerDirective,
} from '@/shared/components/collapsible/collapsible.component';

export const ZardCollapsibleImports = [
  ZardCollapsibleDirective,
  ZardCollapsibleTriggerDirective,
  ZardCollapsibleContentComponent,
] as const;
```

```angular-ts
export * from '@/shared/components/collapsible/collapsible.component';
export * from '@/shared/components/collapsible/collapsible.variants';
export * from '@/shared/components/collapsible/collapsible.imports';
```

## Usage

```angular-ts
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';
```

```angular-html
<z-collapsible>
  <button z-collapsible-trigger>Toggle</button>
  <z-collapsible-content>Content</z-collapsible-content>
</z-collapsible>
```

## Examples

### Basic

A minimal `[z-collapsible]` wrapped in a `z-card`. The trigger is a full-width ghost `z-button` whose chevron rotates through `group-data-[state=open]`, driven entirely by the directive's own `data-state` — no host state needed.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';

@Component({
  selector: 'z-demo-collapsible-basic',
  imports: [ZardCollapsibleImports, ZardButtonComponent, ZardCardImports, NgIcon],
  template: `
    <z-card class="w-full max-w-sm">
      <div z-card-content>
        <z-collapsible class="data-[state=open]:bg-muted flex flex-col gap-1 rounded-lg p-1 transition-colors">
          <button z-button z-collapsible-trigger zType="ghost" class="group w-full justify-between">
            Product details
            <ng-icon name="lucideChevronDown" class="transition-transform group-data-[state=open]:rotate-180" />
          </button>

          <z-collapsible-content>
            <div class="flex flex-col gap-2 px-2 pt-1 pb-2">
              <p class="text-muted-foreground text-sm">
                This panel can be expanded or collapsed to reveal additional content.
              </p>
              <button z-button zSize="xs" class="w-fit">Learn More</button>
            </div>
          </z-collapsible-content>
        </z-collapsible>
      </div>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
})
export class ZardDemoCollapsibleBasicComponent {}
```

### Settings Panel

A collapsible that grows a form in place: the first two radius fields are always visible, and `z-collapsible-content` reveals the other two inside the same `z-field-group` grid. The icon trigger flips between maximize and minimize with the `zOpen`/`zOpenChange` pair.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMaximize, lucideMinimize } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-collapsible-settings-panel',
  imports: [ZardCollapsibleImports, ZardCardImports, ZardFieldImports, ZardButtonComponent, ZardInputComponent, NgIcon],
  template: `
    <z-card zSize="sm" class="mx-auto w-full min-w-xs">
      <z-card-header>
        <z-card-title zTitle="Radius" />
        <z-card-description zDescription="Set the corner radius of the element." />
      </z-card-header>
      <z-card-content>
        <z-collapsible class="flex items-start gap-2" [zOpen]="isOpen()" (zOpenChange)="isOpen.set($event)">
          <div z-field-group class="grid w-full grid-cols-2 gap-2">
            <div z-field>
              <label z-field-label for="radius-top-left" class="sr-only">Radius top left</label>
              <input z-input id="radius-top-left" placeholder="0" value="0" />
            </div>
            <div z-field>
              <label z-field-label for="radius-top-right" class="sr-only">Radius top right</label>
              <input z-input id="radius-top-right" placeholder="0" value="0" />
            </div>
            <z-collapsible-content class="col-span-full">
              <div class="grid grid-cols-2 gap-2">
                <div z-field>
                  <label z-field-label for="radius-bottom-left" class="sr-only">Radius bottom left</label>
                  <input z-input id="radius-bottom-left" placeholder="0" value="0" />
                </div>
                <div z-field>
                  <label z-field-label for="radius-bottom-right" class="sr-only">Radius bottom right</label>
                  <input z-input id="radius-bottom-right" placeholder="0" value="0" />
                </div>
              </div>
            </z-collapsible-content>
          </div>
          <button z-button z-collapsible-trigger zType="outline" zSize="icon" aria-label="Toggle all corners">
            <ng-icon [name]="isOpen() ? 'lucideMinimize' : 'lucideMaximize'" />
          </button>
        </z-collapsible>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideMaximize, lucideMinimize })],
})
export class ZardDemoCollapsibleSettingsPanelComponent {
  protected readonly isOpen = signal(false);
}
```

### File Tree

A recursive file explorer: every folder is its own `z-collapsible` whose content renders the same template again, so nested folders open and close independently of one another.

```angular-ts
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFile, lucideFolder } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

interface FileTreeItem {
  name: string;
  items?: FileTreeItem[];
}

@Component({
  selector: 'z-demo-collapsible-file-tree',
  imports: [ZardCollapsibleImports, ZardCardImports, ZardTabsImports, ZardButtonComponent, NgIcon, NgTemplateOutlet],
  template: `
    <z-card zSize="sm" class="mx-auto w-full max-w-[16rem] gap-2">
      <z-card-header>
        <z-tab-group class="w-full [&_[role=tablist]]:w-full">
          <z-tab label="Explorer" />
          <z-tab label="Outline" />
        </z-tab-group>
      </z-card-header>
      <z-card-content>
        <div class="flex flex-col gap-1">
          @for (item of fileTree; track item.name) {
            <ng-container *ngTemplateOutlet="node; context: { $implicit: item }" />
          }
        </div>
      </z-card-content>
    </z-card>

    <ng-template #node let-item>
      @if (item.items) {
        <z-collapsible>
          <button
            z-button
            z-collapsible-trigger
            zType="ghost"
            zSize="sm"
            class="hover:bg-accent hover:text-accent-foreground group w-full justify-start transition-none"
          >
            <ng-icon name="lucideChevronRight" class="transition-transform group-data-[state=open]:rotate-90" />
            <ng-icon name="lucideFolder" />
            {{ item.name }}
          </button>
          <z-collapsible-content class="ml-5 data-[state=open]:mt-1">
            <div class="flex flex-col gap-1">
              @for (child of item.items; track child.name) {
                <ng-container *ngTemplateOutlet="node; context: { $implicit: child }" />
              }
            </div>
          </z-collapsible-content>
        </z-collapsible>
      } @else {
        <button z-button zType="link" zSize="sm" class="text-foreground w-full justify-start gap-2">
          <ng-icon name="lucideFile" />
          <span>{{ item.name }}</span>
        </button>
      }
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFolder, lucideFile })],
})
export class ZardDemoCollapsibleFileTreeComponent {
  protected readonly fileTree: FileTreeItem[] = [
    {
      name: 'components',
      items: [
        {
          name: 'ui',
          items: [
            { name: 'button.component.ts' },
            { name: 'card.component.ts' },
            { name: 'dialog.component.ts' },
            { name: 'input.component.ts' },
            { name: 'select.component.ts' },
            { name: 'table.component.ts' },
          ],
        },
        { name: 'login-form.component.ts' },
        { name: 'register-form.component.ts' },
      ],
    },
    {
      name: 'services',
      items: [{ name: 'auth.service.ts' }, { name: 'api.service.ts' }, { name: 'storage.service.ts' }],
    },
    {
      name: 'utils',
      items: [{ name: 'merge-classes.ts' }, { name: 'debounce.ts' }, { name: 'media-query.ts' }],
    },
    {
      name: 'types',
      items: [{ name: 'index.d.ts' }, { name: 'api.d.ts' }],
    },
    {
      name: 'public',
      items: [{ name: 'favicon.ico' }, { name: 'logo.svg' }, { name: 'images' }],
    },
    { name: 'app.component.ts' },
    { name: 'app.config.ts' },
    { name: 'app.routes.ts' },
    { name: 'styles.css' },
    { name: 'project.json' },
    { name: 'nx.json' },
    { name: 'tsconfig.json' },
    { name: 'README.md' },
    { name: '.gitignore' },
  ];
}
```

### Controlled

Bind `zOpen` to a signal and listen to `zOpenChange` to drive the panel from outside the component.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';

@Component({
  selector: 'z-demo-collapsible-controlled',
  imports: [ZardCollapsibleImports, ZardButtonComponent],
  template: `
    <div class="flex w-[350px] flex-col gap-3">
      <div class="flex items-center justify-between gap-4">
        <span class="text-muted-foreground text-sm">The panel is {{ open() ? 'open' : 'closed' }}</span>

        <button z-button zType="outline" zSize="sm" (click)="open.set(!open())">
          {{ open() ? 'Close' : 'Open' }} from outside
        </button>
      </div>

      <z-collapsible class="flex flex-col gap-2" [zOpen]="open()" (zOpenChange)="open.set($event)">
        <button z-button z-collapsible-trigger zType="secondary" zSize="sm">Toggle from inside</button>

        <z-collapsible-content>
          <div class="text-muted-foreground rounded-md border px-4 py-3 text-sm">
            Both buttons drive the same signal, so the component stays in sync with the host state.
          </div>
        </z-collapsible-content>
      </z-collapsible>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCollapsibleControlledComponent {
  readonly open = signal(true);
}
```

### Disabled

Use `zDisabled` to block the trigger. The panel keeps whatever state it was rendered with.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';

@Component({
  selector: 'z-demo-collapsible-disabled',
  imports: [ZardCollapsibleImports, ZardButtonComponent],
  template: `
    <z-collapsible class="flex w-[350px] flex-col gap-2" zDisabled zOpen>
      <button z-button z-collapsible-trigger zType="outline" zSize="sm">Cannot be toggled</button>

      <z-collapsible-content>
        <div class="text-muted-foreground rounded-md border px-4 py-3 text-sm">
          The trigger is disabled, so this panel stays exactly as it was rendered.
        </div>
      </z-collapsible-content>
    </z-collapsible>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCollapsibleDisabledComponent {}
```

## API Reference

### z-collapsible, [z-collapsible]

An interactive component which expands and collapses a panel. It renders no markup of its own, so it can also be applied as an attribute to an element that is already a component — for example li[z-sidebar-menu-item].

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zOpen]` | Open state of the panel. Supports two-way binding through [(zOpen)] | `boolean` | `false` |
| `[zDisabled]` | Blocks the trigger from toggling the panel | `boolean` | `false` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `(zOpenChange)` | Emits the new open state whenever the panel toggles | `EventEmitter<boolean>` | `-` |

### [z-collapsible-trigger]

Toggles the panel. Apply it to your own button — the directive only wires the behaviour and the ARIA attributes, it does not style anything.

### z-collapsible-content

The panel revealed by the trigger. Animates its height with a CSS grid transition.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/collapsible)
