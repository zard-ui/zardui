---
title: Map Style Select
description: Picks the basemap of every map on the page, live. Presets are grouped by provider.
---

# Map Style Select

Picks the basemap of every map on the page, live. Presets are grouped by provider.

## Installation

### CLI

```bash
npx zard-cli@latest add map-style-select
```

### Manual

```angular-ts
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideKeyRound } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZARD_MAP_STYLE_CONFIG, ZardMapStyleService } from '@/shared/components/map/map-style.service';
import { ZARD_MAP_PROVIDERS, type ZardMapPreset, type ZardMapProviderInfo } from '@/shared/components/map/map-styles';
import { ZardSelectImports } from '@/shared/components/select/select.imports';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { mapStyleSelectVariants, mapStyleSwatchVariants } from './map-style-select.variants';

let nextId = 0;

interface MapStyleGroup {
  readonly provider: ZardMapProviderInfo;
  readonly presets: readonly ZardMapPreset[];
}

/**
 * Picks the basemap of every map on the page, live. It lists the presets of `ZardMapStyleService` grouped by provider,
 * with a swatch per style, and asks for an API key inline when a key-based preset is picked. Drop it in a toolbar, an
 * app header or over a map corner. It only has an effect where `provideZardMap()` is registered.
 */
@Component({
  selector: 'z-map-style-select',
  imports: [ZardSelectImports, ZardButtonComponent, ZardInputComponent, NgIcon],
  template: `
    <z-select
      [(zValue)]="selected"
      [zLabel]="triggerLabel()"
      zPosition="popper"
      zAlign="start"
      (zSelectionChange)="onSelect($event)"
    >
      @for (group of groups(); track group.provider.id; let last = $last) {
        <z-select-group>
          <z-select-label>{{ group.provider.label }}</z-select-label>
          @for (preset of group.presets; track preset.id) {
            <z-select-item [zValue]="preset.id">
              <span class="flex items-center gap-2">
                <span aria-hidden="true" [class]="swatchClasses" [style.background]="swatch(preset)"></span>
                {{ preset.label }}
                @if (preset.requiresKey) {
                  <ng-icon name="lucideKeyRound" class="text-muted-foreground size-3" aria-hidden="true" />
                }
                @if (preset.devOnly) {
                  <span class="text-muted-foreground text-xs">dev only</span>
                }
              </span>
            </z-select-item>
          }
        </z-select-group>
        @if (!last) {
          <z-select-separator />
        }
      }
    </z-select>

    @if (pending(); as preset) {
      <form
        class="bg-muted/40 flex flex-col gap-2 rounded-lg border p-3"
        (submit)="applyKey($event)"
        (keydown.escape)="cancel()"
      >
        <label class="text-xs font-medium" [for]="inputId">{{ providerOf(preset).label }} API key</label>
        <div class="flex gap-2">
          <input
            #keyInput
            z-input
            type="password"
            autocomplete="off"
            spellcheck="false"
            placeholder="Paste your key"
            [id]="inputId"
            [attr.aria-describedby]="hintId"
            [attr.aria-invalid]="invalid() ? 'true' : null"
          />
          <button z-button zSize="sm" type="submit">Apply</button>
          <button z-button zSize="sm" zType="ghost" type="button" (click)="cancel()">Cancel</button>
        </div>
        <p class="text-muted-foreground text-xs" [id]="hintId">
          {{ preset.label }} needs a key. It is only used to request tiles from {{ providerOf(preset).label }} and stays
          in this browser.
          @if (providerOf(preset).keyUrl; as keyUrl) {
            <a
              class="text-foreground underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
              [href]="keyUrl"
            >
              Get a key
            </a>
          }
        </p>
      </form>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideKeyRound })],
  host: {
    'data-slot': 'map-style-select',
    role: 'group',
    '[attr.aria-label]': 'zAriaLabel()',
    '[class]': 'classes()',
  },
  exportAs: 'zMapStyleSelect',
})
export class ZardMapStyleSelectComponent {
  private readonly service = inject(ZardMapStyleService);
  private readonly keyInput = viewChild('keyInput', { read: ElementRef<HTMLInputElement> });

  readonly class = input<ClassValue>('');
  readonly zAriaLabel = input('Map style');

  /** Emits the preset that is now in use, after a pick (and, for a key-based one, after its key was accepted). */
  readonly zStyleChange = output<ZardMapPreset>();

  protected readonly inputId = `z-map-style-key-${nextId++}`;
  protected readonly hintId = `${this.inputId}-hint`;
  protected readonly swatchClasses = mapStyleSwatchVariants({ zSize: 'default' });
  protected readonly classes = computed(() => mergeClasses(mapStyleSelectVariants(), this.class()));

  protected readonly pending = signal<ZardMapPreset | null>(null);
  protected readonly invalid = signal(false);
  /** Bound two-way to the select, and put back to the preset in use when a pick had to wait for a key. */
  protected readonly selected = linkedSignal<string | string[]>(() => this.service.presetId());

  protected readonly groups = computed<readonly MapStyleGroup[]>(() => {
    const presets = this.service.presets();

    return ZARD_MAP_PROVIDERS.map(provider => ({
      provider,
      presets: presets.filter(preset => preset.provider === provider.id),
    })).filter(group => group.presets.length > 0);
  });

  /** "Carto · Positron": the preset name alone is ambiguous, two providers ship a Positron. */
  protected readonly triggerLabel = computed(() => {
    const preset = this.service.preset();
    return `${this.providerOf(preset).label} · ${preset.label}`;
  });

  constructor() {
    // The picker can render before any map does; reading the stored choice here keeps it from flashing the default.
    this.service.configure(inject(ZARD_MAP_STYLE_CONFIG, { optional: true }) ?? {});

    afterNextRender(() => this.keyInput()?.nativeElement.focus());
  }

  protected providerOf(preset: ZardMapPreset): ZardMapProviderInfo {
    return ZARD_MAP_PROVIDERS.find(provider => provider.id === preset.provider) ?? ZARD_MAP_PROVIDERS[0];
  }

  protected swatch(preset: ZardMapPreset): string {
    const { light, dark } = preset.swatch;
    return light === dark ? light : `linear-gradient(135deg, ${light} 50%, ${dark} 50%)`;
  }

  protected onSelect(value: string | string[]): void {
    const id = Array.isArray(value) ? value[0] : value;
    this.invalid.set(false);

    const result = this.service.select(id);
    if (result === 'selected') {
      this.pending.set(null);
      this.zStyleChange.emit(this.service.preset());
      return;
    }

    // Nothing changed: the maps keep their basemap until the key arrives. Put the select back where the maps are.
    this.selected.set(this.service.presetId());
    if (result === 'needs-key') {
      this.pending.set(this.service.presets().find(preset => preset.id === id) ?? null);
      queueMicrotask(() => this.keyInput()?.nativeElement.focus());
    }
  }

  protected applyKey(event: Event): void {
    event.preventDefault();
    const preset = this.pending();
    if (!preset) {
      return;
    }

    const key = this.keyInput()?.nativeElement.value ?? '';
    if (!key.trim()) {
      this.invalid.set(true);
      return;
    }

    if (this.service.select(preset.id, key) === 'selected') {
      this.pending.set(null);
      this.invalid.set(false);
      this.selected.set(this.service.presetId());
      this.zStyleChange.emit(this.service.preset());
    }
  }

  protected cancel(): void {
    this.pending.set(null);
    this.invalid.set(false);
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const mapStyleSelectVariants = cva('flex w-full min-w-48 flex-col gap-2');

export const mapStyleSwatchVariants = cva(
  'inline-block shrink-0 rounded-full border border-black/15 dark:border-white/20',
  {
    variants: {
      zSize: {
        sm: 'size-3',
        default: 'size-4',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export type ZardMapStyleSwatchSizeVariants = NonNullable<VariantProps<typeof mapStyleSwatchVariants>['zSize']>;
```

```angular-ts
export * from './map-style-select.component';
export * from './map-style-select.variants';
```

## Usage

```angular-ts
import { ZardMapStyleSelectComponent } from '@/shared/components/map-style-select/map-style-select.component';
```

```angular-html
<z-map-style-select />
```

## Examples

### Style Override

A map with its own `[styles]` ignores the picker.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardMapStyleSelectComponent } from '@/shared/components/map-style-select/map-style-select.component';

/** Defined once, outside the component: `<ng-map>` compares styles by identity before it restyles. */
const FIORD = {
  light: 'https://tiles.openfreemap.org/styles/fiord',
  dark: 'https://tiles.openfreemap.org/styles/fiord',
};

@Component({
  selector: 'z-demo-map-style-override',
  imports: [ZardMapImports, ZardMapStyleSelectComponent, ZardBadgeComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <z-map-style-select class="max-w-60" />

      <div class="grid gap-4 md:grid-cols-2">
        <div class="relative h-[320px] overflow-hidden rounded-xl border">
          <ng-map [center]="[4.9041, 52.3676]" [zoom]="11" />
          <z-badge zType="secondary" class="absolute top-3 left-3">Follows the picker</z-badge>
        </div>

        <div class="relative h-[320px] overflow-hidden rounded-xl border">
          <!-- A map with its own [styles] ignores the picker. -->
          <ng-map [styles]="fiord" [center]="[4.9041, 52.3676]" [zoom]="11" />
          <z-badge zType="secondary" class="absolute top-3 left-3">Own [styles]: Fiord</z-badge>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapStyleOverrideComponent {
  protected readonly fiord = FIORD;
}
```

## API Reference

### z-map-style-select

Picks the basemap of every map on the page, live. It lists the presets of `ZardMapStyleService` grouped by provider, with a swatch per style, and asks for an API key inline when a key-based preset is picked. It has an effect wherever `provideZardMap()` is registered, and a map with its own `[styles]` ignores it.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zAriaLabel]` | Accessible name of the picker | `string` | `'Map style'` |
| `(zStyleChange)` | Emits the preset in use after a pick, and for a key-based preset after its key was accepted | `ZardMapPreset` | `-` |

---

[Open in browser](https://zardui.com/docs/components/map-style-select)
