import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZARD_MAP_STYLE_CONFIG, ZardMapStyleService } from '@/shared/components/map/map-style.service';
import {
  ZARD_MAP_DEFAULT_PRESET_ID,
  ZARD_MAP_PROVIDERS,
  type ZardMapPreset,
  type ZardMapProviderInfo,
  type ZardMapSwatchPalette,
} from '@/shared/components/map/map-styles';
import type { ZardPopoverAlign, ZardPopoverDirective } from '@/shared/components/popover/popover.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { mapStyleOptionVariants, mapStyleSelectVariants, mapStyleSwatchVariants } from './map-style-select.variants';

let nextId = 0;

interface MapStyleGroup {
  readonly provider: ZardMapProviderInfo;
  readonly presets: readonly ZardMapPreset[];
}

const swatchVars = (prefix: 'l' | 'd', palette: ZardMapSwatchPalette): Record<string, string> => ({
  [`--${prefix}-land`]: palette.land,
  [`--${prefix}-water`]: palette.water,
  [`--${prefix}-park`]: palette.park,
  [`--${prefix}-road`]: palette.road,
  [`--${prefix}-casing`]: palette.casing,
  [`--${prefix}-major`]: palette.major,
});

/**
 * Picks the basemap of every map on the page, live. A button shows the style in use, with a mini-map of it; it opens a
 * popover that lists the presets of `ZardMapStyleService` by provider, and asks for an API key inline when a key-based
 * preset is picked. Drop it in a toolbar, an app header or over a map corner. It only has an effect where
 * `provideZardMap()` is registered.
 */
@Component({
  selector: 'z-map-style-select',
  imports: [
    NgTemplateOutlet,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardInputComponent,
    NgIcon,
    ...ZardPopoverImports,
  ],
  template: `
    @let current = service.preset();
    <button
      #popover="zPopover"
      type="button"
      z-button
      zType="outline"
      zPopover
      [zAlign]="zAlign()"
      class="gap-2 pr-2 pl-1"
      [zContent]="content"
      [attr.aria-label]="zAriaLabel() + ', current: ' + triggerLabel()"
    >
      <ng-container *ngTemplateOutlet="swatchTpl; context: { $implicit: current, size: 'sm' }" />
      <span class="flex flex-col items-start gap-0.5 leading-none">
        <span class="text-muted-foreground text-[10px] font-normal">{{ zAriaLabel() }}</span>
        <span class="text-xs font-medium">{{ triggerLabel() }}</span>
      </span>
      <ng-icon name="lucideChevronsUpDown" size="14" class="text-muted-foreground" aria-hidden="true" />
    </button>

    <ng-template #content>
      <z-popover class="max-h-[min(30rem,50dvh)] w-80 gap-0 overflow-hidden p-0">
        <div z-popover-header class="shrink-0 px-3.5 pt-3 pb-2">
          <h4 z-popover-title>{{ zAriaLabel() }}</h4>
          <p z-popover-description class="text-xs">Every map on this page follows your pick.</p>
        </div>

        <div
          role="radiogroup"
          [attr.aria-label]="zAriaLabel()"
          class="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-1.5 pt-0"
        >
          @for (group of groups(); track group.provider.id) {
            <p class="text-muted-foreground px-1.5 pt-2 pb-0.5 text-[11px] font-medium tracking-wide uppercase">
              {{ group.provider.label }}
            </p>
            @for (preset of group.presets; track preset.id) {
              <button
                type="button"
                role="radio"
                [class]="optionClasses"
                [attr.aria-checked]="preset.id === service.presetId()"
                [attr.data-selected]="preset.id === service.presetId()"
                (click)="onSelect(preset.id, popover)"
              >
                <ng-container *ngTemplateOutlet="swatchTpl; context: { $implicit: preset, size: 'default' }" />
                <span class="flex min-w-0 flex-1 flex-col gap-1">
                  <span class="flex items-center gap-1.5 text-sm font-medium">
                    {{ preset.label }}
                    @if (preset.id === defaultPresetId) {
                      <z-badge zType="secondary" class="px-1.5 py-0 text-[10px]">Default</z-badge>
                    }
                  </span>
                  <span class="text-muted-foreground text-xs">{{ detail(preset) }}</span>
                </span>
                <ng-icon
                  name="lucideCheck"
                  size="16"
                  class="text-foreground mr-1 shrink-0 opacity-0 group-data-[selected=true]:opacity-100"
                  aria-hidden="true"
                />
              </button>
            }
          }
        </div>

        @if (pending(); as preset) {
          <form
            class="flex shrink-0 flex-col gap-2 border-t p-3"
            (submit)="applyKey($event, popover)"
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
              {{ preset.label }} needs a key. It is only used to request tiles from {{ providerOf(preset).label }} and
              stays in this browser.
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
      </z-popover>
    </ng-template>

    <!-- A tiny map, painted with CSS variables so it follows the theme. The vars are set on the swatch itself. -->
    <ng-template #swatchTpl let-preset let-size="size">
      <span
        aria-hidden="true"
        data-slot="map-style-swatch"
        [class]="size === 'sm' ? smallSwatchClasses : swatchClasses"
        [style]="vars(preset)"
      >
        <svg viewBox="0 0 96 64" preserveAspectRatio="xMidYMid slice" aria-hidden="true" class="block size-full">
          <rect width="96" height="64" class="fill-(--l-land) dark:fill-(--d-land)"></rect>
          <path
            d="M60 0h36v64H78c-4-8-12-10-14-18s6-14 2-22S58 8 60 0Z"
            class="fill-(--l-water) dark:fill-(--d-water)"
          ></path>
          <path d="M8 40l14-4 6 12-10 8-12-4Z" class="fill-(--l-park) dark:fill-(--d-park)"></path>
          <ellipse cx="40" cy="14" rx="7" ry="4" class="fill-(--l-water) dark:fill-(--d-water)"></ellipse>
          <g fill="none" stroke-linecap="round">
            <g stroke-width="1.6" class="stroke-(--l-road) dark:stroke-(--d-road)">
              <path d="M0 22h58M0 54h70M30 0v64M48 24v40M12 0v34"></path>
              <path d="M38 30l20 10"></path>
            </g>
            <path
              d="M-2 46C18 40 30 30 42 30s20-8 28-30"
              stroke-width="5"
              class="stroke-(--l-casing) dark:stroke-(--d-casing)"
            ></path>
            <path
              d="M-2 46C18 40 30 30 42 30s20-8 28-30"
              stroke-width="3"
              class="stroke-(--l-major) dark:stroke-(--d-major)"
            ></path>
          </g>
        </svg>
      </span>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideCheck, lucideChevronsUpDown })],
  host: {
    'data-slot': 'map-style-select',
    '[class]': 'classes()',
  },
  exportAs: 'zMapStyleSelect',
})
export class ZardMapStyleSelectComponent {
  protected readonly service = inject(ZardMapStyleService);
  private readonly injector = inject(Injector);
  private readonly keyInput = viewChild('keyInput', { read: ElementRef<HTMLInputElement> });

  readonly class = input<ClassValue>('');
  /** Accessible name of the picker, also its visible caption and the title of the popover. */
  readonly zAriaLabel = input('Map style');
  /** Which edge of the trigger the list lines up with: `end` at the right of a toolbar, `start` at the left. */
  readonly zAlign = input<ZardPopoverAlign>('end');

  /** Emits the preset that is now in use, after a pick (and, for a key-based one, after its key was accepted). */
  readonly zStyleChange = output<ZardMapPreset>();

  protected readonly inputId = `z-map-style-key-${nextId++}`;
  protected readonly hintId = `${this.inputId}-hint`;
  protected readonly defaultPresetId = ZARD_MAP_DEFAULT_PRESET_ID;
  protected readonly swatchClasses = mapStyleSwatchVariants({ zSize: 'default' });
  protected readonly smallSwatchClasses = mapStyleSwatchVariants({ zSize: 'sm' });
  protected readonly optionClasses = mapStyleOptionVariants();
  protected readonly classes = computed(() => mergeClasses(mapStyleSelectVariants(), this.class()));

  protected readonly pending = signal<ZardMapPreset | null>(null);
  protected readonly invalid = signal(false);

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

  private readonly varsCache = new Map<string, Record<string, string>>();

  constructor() {
    // The picker can render before any map does; reading the stored choice here keeps it from flashing the default.
    this.service.configure(inject(ZARD_MAP_STYLE_CONFIG, { optional: true }) ?? {});
  }

  protected providerOf(preset: ZardMapPreset): ZardMapProviderInfo {
    return ZARD_MAP_PROVIDERS.find(provider => provider.id === preset.provider) ?? ZARD_MAP_PROVIDERS[0];
  }

  /** The line under a preset's name: how it is served and whether it needs a key. */
  protected detail(preset: ZardMapPreset): string {
    const kind = preset.provider === 'osm' ? 'Raster' : 'Vector';
    let access = 'No key needed';
    if (preset.requiresKey) {
      access = 'API key';
    } else if (preset.devOnly) {
      access = 'Dev only';
    }
    return `${kind} · ${access}`;
  }

  /** The palette of both themes as CSS variables; the SVG picks the light or dark set with `dark:`. */
  protected vars(preset: ZardMapPreset): Record<string, string> {
    let vars = this.varsCache.get(preset.id);
    if (!vars) {
      vars = { ...swatchVars('l', preset.swatch.light), ...swatchVars('d', preset.swatch.dark) };
      this.varsCache.set(preset.id, vars);
    }
    return vars;
  }

  protected onSelect(id: string, popover?: ZardPopoverDirective): void {
    this.invalid.set(false);

    const result = this.service.select(id);
    if (result === 'selected') {
      this.pending.set(null);
      this.zStyleChange.emit(this.service.preset());
      popover?.hide();
      return;
    }

    // Nothing changed: the maps keep their basemap until the key arrives, and the popover stays open for it.
    if (result === 'needs-key') {
      this.pending.set(this.service.presets().find(preset => preset.id === id) ?? null);
      // The form is not in the DOM until the next render.
      afterNextRender(() => this.keyInput()?.nativeElement.focus(), { injector: this.injector });
    }
  }

  protected applyKey(event: Event, popover?: ZardPopoverDirective): void {
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
      this.zStyleChange.emit(this.service.preset());
      popover?.hide();
    }
  }

  protected cancel(): void {
    this.pending.set(null);
    this.invalid.set(false);
  }
}
