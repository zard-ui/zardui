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
