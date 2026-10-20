---
title: Color Picker
description: A swatch button that opens a panel to pick a color, with optional alpha and presets.
---

# Color Picker

A swatch button that opens a panel to pick a color, with optional alpha and presets.

## Installation

### CLI

```bash
npx zard-cli@latest add color-picker
```

### Manual

```angular-ts
import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  type ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  linkedSignal,
  model,
  output,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation,
  type TemplateRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePipette } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent, type ZardButtonSizeVariants } from '@/shared/components/button';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardPopoverComponent, ZardPopoverDirective, type ZardPopoverAlign } from '@/shared/components/popover';
import { mergeClasses } from '@/shared/utils/merge-classes';
import { noopFn } from '@/shared/utils/noop';
import { clamp } from '@/shared/utils/number';

import {
  formatColor,
  parseColor,
  toCssColor,
  type ZardColorFormat,
  type ZardColorResolver,
  type ZardHsva,
} from './color-picker.utils';
import {
  colorPickerAreaVariants,
  colorPickerFillVariants,
  colorPickerFormatGroupVariants,
  colorPickerFormatIndicatorVariants,
  colorPickerFormatVariants,
  colorPickerPanelVariants,
  colorPickerPresetVariants,
  colorPickerSwatchVariants,
  colorPickerThumbVariants,
  colorPickerTrackVariants,
  colorPickerTriggerVariants,
  colorPickerVariants,
  type ZardColorPickerSizeVariants,
} from './color-picker.variants';

type ZardColorChannel = 'area' | 'hue' | 'alpha';

/** The EyeDropper API is Chromium-only and not in every TypeScript DOM lib yet. */
type ZardEyeDropper = new () => { open(): Promise<{ sRGBHex: string }> };

/** Shown in the panel while the value is empty, so the first drag starts from a visible color. */
const DEFAULT_COLOR: ZardHsva = { h: 0, s: 0, v: 0, a: 1 };

const STEP = 1;
const SHIFT_STEP = 10;

/** Order of the format tabs above the text field. */
const FORMATS: ZardColorFormat[] = ['hex', 'rgb', 'hsl', 'oklch'];

/** Swatch-only triggers are square, so they use the icon sizes of the button scale. */
const ICON_SIZES: Record<ZardColorPickerSizeVariants, ZardButtonSizeVariants> = {
  sm: 'icon-sm',
  default: 'icon',
  lg: 'icon-lg',
};

/** Gray and black have no hue of their own, so the current one is kept instead of snapping back to red. */
function keepHue(color: ZardHsva, current: ZardHsva | undefined): ZardHsva {
  return current && (color.s === 0 || color.v === 0) ? { ...color, h: current.h } : color;
}

@Component({
  selector: 'z-color-picker, [z-color-picker]',
  imports: [ZardButtonComponent, ZardInputComponent, ZardPopoverComponent, ZardPopoverDirective, NgIcon],
  template: `
    <button
      z-button
      type="button"
      zType="outline"
      [attr.id]="zId() || null"
      [zSize]="triggerSize()"
      [zDisabled]="disabled()"
      [class]="triggerClasses()"
      [attr.data-empty]="isEmpty() ? 'true' : null"
      [attr.aria-label]="zId() ? null : 'Choose color, ' + displayText()"
      zPopover
      #popoverDirective="zPopover"
      [zContent]="panelTemplate"
      zTrigger="click"
      [zAlign]="zAlign()"
      (zVisibleChange)="onPopoverVisibilityChange($event)"
    >
      <span data-slot="color-picker-swatch" [class]="swatchClasses()">
        @if (!isEmpty()) {
          <span
            [class]="fillClasses"
            [style.background-color]="swatchColor()"
            [attr.data-dragging]="dragging() ? '' : null"
          ></span>
        }
      </span>
      @if (zShowValue()) {
        <span class="data-[empty=true]:text-muted-foreground min-w-0 truncate" [attr.data-empty]="isEmpty()">
          {{ displayText() }}
        </span>
      }
    </button>

    <ng-template #panelTemplate>
      <z-popover aria-label="Choose color" [class]="panelClasses" [attr.data-dragging]="dragging() ? '' : null">
        <div
          #area
          data-slot="color-picker-area"
          role="slider"
          tabindex="0"
          aria-label="Saturation and brightness"
          aria-roledescription="2D slider"
          aria-valuemin="0"
          aria-valuemax="100"
          [attr.aria-valuenow]="percent(color().s)"
          [attr.aria-valuetext]="'Saturation ' + percent(color().s) + '%, brightness ' + percent(color().v) + '%'"
          [class]="areaClasses"
          [style.background-color]="hueColor()"
          (pointerdown)="onPointerDown($event, 'area')"
          (pointermove)="onPointerMove($event, 'area')"
          (pointerup)="onPointerUp()"
          (pointercancel)="onPointerUp()"
          (keydown)="onKeydown($event, 'area')"
        >
          <span
            [class]="thumbClasses"
            [style.left.%]="color().s * 100"
            [style.top.%]="(1 - color().v) * 100"
            [style.background-color]="opaqueColor()"
            [attr.data-active]="dragging() === 'area' ? '' : null"
          ></span>
        </div>

        <div class="flex items-center gap-2">
          <div class="flex min-w-0 flex-1 flex-col gap-3">
            <div
              data-slot="color-picker-hue"
              role="slider"
              tabindex="0"
              aria-label="Hue"
              aria-valuemin="0"
              aria-valuemax="360"
              [attr.aria-valuenow]="hue()"
              [attr.aria-valuetext]="hue() + ' degrees'"
              [class]="hueTrackClasses"
              (pointerdown)="onPointerDown($event, 'hue')"
              (pointermove)="onPointerMove($event, 'hue')"
              (pointerup)="onPointerUp()"
              (pointercancel)="onPointerUp()"
              (keydown)="onKeydown($event, 'hue')"
            >
              <span
                [class]="thumbClasses"
                [style.left.%]="(color().h / 360) * 100"
                [style.background-color]="hueColor()"
                [attr.data-active]="dragging() === 'hue' ? '' : null"
              ></span>
            </div>

            @if (zAlpha()) {
              <div
                data-slot="color-picker-alpha"
                role="slider"
                tabindex="0"
                aria-label="Alpha"
                aria-valuemin="0"
                aria-valuemax="100"
                [attr.aria-valuenow]="percent(color().a)"
                [attr.aria-valuetext]="percent(color().a) + '%'"
                [class]="alphaTrackClasses"
                (pointerdown)="onPointerDown($event, 'alpha')"
                (pointermove)="onPointerMove($event, 'alpha')"
                (pointerup)="onPointerUp()"
                (pointercancel)="onPointerUp()"
                (keydown)="onKeydown($event, 'alpha')"
              >
                <span class="absolute inset-0 rounded-full" [style.background]="alphaBackground()"></span>
                <span
                  [class]="thumbClasses"
                  [style.left.%]="color().a * 100"
                  [style.background-color]="cssColor()"
                  [attr.data-active]="dragging() === 'alpha' ? '' : null"
                ></span>
              </div>
            }
          </div>
          @if (eyeDropper) {
            <button
              z-button
              type="button"
              zType="outline"
              zSize="icon-sm"
              data-slot="color-picker-eyedropper"
              aria-label="Pick a color from the screen"
              class="shrink-0"
              (click)="pickFromScreen()"
            >
              <ng-icon name="lucidePipette" class="size-3.5!" />
            </button>
          }
        </div>

        @if (zShowFormatToggle()) {
          <div role="group" aria-label="Color format" data-slot="color-picker-format" [class]="formatGroupClasses">
            <span
              aria-hidden="true"
              data-slot="color-picker-format-indicator"
              [class]="formatIndicatorClasses"
              [style.width]="'calc((100% - 0.25rem) / ' + formats.length + ')'"
              [style.transform]="'translateX(' + formatIndex() * 100 + '%)'"
            ></span>
            @for (format of formats; track format) {
              <button
                type="button"
                [class]="formatClasses"
                [attr.aria-pressed]="format === displayFormat()"
                (click)="displayFormat.set(format)"
              >
                {{ format.toUpperCase() }}
              </button>
            }
          </div>
        }

        <input
          z-input
          aria-label="Color value"
          spellcheck="false"
          autocomplete="off"
          class="h-7 px-2 font-mono text-[11px] md:text-[11px]"
          [value]="inputText()"
          (change)="onTextCommit($event)"
          (keydown.enter)="onTextCommit($event)"
        />

        @if (presets().length) {
          <div data-slot="color-picker-presets" class="flex flex-wrap gap-1.5">
            @for (preset of presets(); track $index) {
              <button
                type="button"
                [class]="presetClasses"
                [attr.aria-label]="preset.value"
                [attr.aria-pressed]="preset.hex === activeHex()"
                (click)="commit(keepHue(preset.color, color()))"
              >
                <span [class]="fillClasses" [style.background-color]="preset.css"></span>
              </button>
            }
          </div>
        }
      </z-popover>
    </ng-template>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardColorPickerComponent),
      multi: true,
    },
  ],
  viewProviders: [provideIcons({ lucidePipette })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'color-picker',
    '[class]': 'classes()',
    '[attr.data-empty]': "isEmpty() ? 'true' : null",
  },
  exportAs: 'zColorPicker',
})
export class ZardColorPickerComponent implements ControlValueAccessor {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');
  readonly popoverDirective = viewChild.required<ZardPopoverDirective>('popoverDirective');
  /** Only resolves while the popover is open — the panel lives in a lazily rendered template. */
  private readonly area = viewChild<ElementRef<HTMLElement>>('area');

  readonly class = input<ClassValue>('');
  /** Applied to the trigger button, so a `<label for="…">` points at something focusable. */
  readonly zId = input<string>('');
  readonly zFormat = input<ZardColorFormat>('hex');
  readonly zAlpha = input(false, { transform: booleanAttribute });
  readonly zPresets = input<string[]>([]);
  readonly zSize = input<ZardColorPickerSizeVariants>('default');
  readonly zShowValue = input(false, { transform: booleanAttribute });
  readonly zShowFormatToggle = input(true, { transform: booleanAttribute });
  readonly zPlaceholder = input<string>('Pick a color');
  readonly zAlign = input<ZardPopoverAlign>('start');
  readonly value = model<string | null>(null);
  readonly disabled = model<boolean>(false);

  /** Every change, including each frame of a drag. */
  readonly zColorChange = output<string>();
  /** Settled changes only: the end of a drag, a key press, a preset, the text field or the eyedropper. */
  readonly zColorCommit = output<string>();

  private onChange: (value: string | null) => void = noopFn;
  private onTouched: () => void = noopFn;

  /** The channel being dragged; drives `data-dragging` / `data-active`, which pause or adjust the transitions. */
  protected readonly dragging = signal<ZardColorChannel | null>(null);
  /** Read once per drag: the track does not move while the pointer is captured. */
  private dragRect: DOMRect | null = null;
  private dragStartValue: string | null = null;
  private pendingPointer: { x: number; y: number } | null = null;
  private frame = 0;
  private canvasContext: CanvasRenderingContext2D | null | undefined;

  private readonly resolveColor: ZardColorResolver | undefined = this.isBrowser
    ? value => this.resolveWithCanvas(value)
    : undefined;

  protected readonly eyeDropper: ZardEyeDropper | undefined = this.isBrowser
    ? (this.document.defaultView as (Window & { EyeDropper?: ZardEyeDropper }) | null)?.EyeDropper
    : undefined;

  protected readonly keepHue = keepHue;

  private readonly parsedValue = computed(() => parseColor(this.value(), this.resolveColor));

  /**
   * The working color. HSV is kept here instead of re-parsed from `value`, otherwise the hue would
   * reset to red every time the color passes through gray or black, where hue is undefined.
   */
  protected readonly color = linkedSignal<ZardHsva | null, ZardHsva>({
    source: this.parsedValue,
    computation: (parsed, previous) => {
      if (!parsed) {
        return previous?.value ?? DEFAULT_COLOR;
      }
      // The value is just the working color written out (usually our own emit echoed back): keep the
      // unrounded working color, so a drag is not snapped to 8-bit steps on every frame.
      if (previous && untracked(() => this.format(previous.value) === this.value())) {
        return previous.value;
      }
      return keepHue(parsed, previous?.value);
    },
  });

  protected readonly isEmpty = computed(() => !this.parsedValue());

  protected readonly presets = computed(() => {
    const alpha = this.zAlpha();
    return this.zPresets().flatMap(value => {
      const parsed = parseColor(value, this.resolveColor);
      if (!parsed) {
        return [];
      }
      const color = alpha ? parsed : { ...parsed, a: 1 };
      return [{ value, color, css: toCssColor(color), hex: formatColor(color, 'hex', true) }];
    });
  });

  /** Compared against each preset's hex, so the active swatch costs one format per change, not one per preset. */
  protected readonly activeHex = computed(() => (this.isEmpty() ? null : formatColor(this.color(), 'hex', true)));

  /** Format of the text field. Starts at `zFormat`; the toggle changes only what is shown, not what is emitted. */
  protected readonly displayFormat = linkedSignal(() => this.zFormat());
  protected readonly formats = FORMATS;
  protected readonly formatIndex = computed(() => FORMATS.indexOf(this.displayFormat()));

  protected readonly displayText = computed(() => (this.isEmpty() ? this.zPlaceholder() : this.format(this.color())));
  protected readonly inputText = computed(() =>
    this.isEmpty() ? '' : formatColor(this.color(), this.displayFormat(), this.zAlpha()),
  );

  protected readonly hue = computed(() => Math.round(this.color().h));
  protected readonly cssColor = computed(() => toCssColor(this.color()));
  protected readonly opaqueColor = computed(() => toCssColor({ ...this.color(), a: 1 }));
  protected readonly hueColor = computed(() => `hsl(${this.color().h}, 100%, 50%)`);
  protected readonly swatchColor = computed(() => (this.zAlpha() ? this.cssColor() : this.opaqueColor()));

  protected readonly alphaBackground = computed(() => `linear-gradient(to right, transparent, ${this.opaqueColor()})`);

  protected readonly classes = computed(() =>
    mergeClasses(colorPickerVariants({ zShowValue: this.zShowValue() }), this.class()),
  );

  protected readonly triggerClasses = computed(() => colorPickerTriggerVariants({ zShowValue: this.zShowValue() }));
  protected readonly triggerSize = computed(() => (this.zShowValue() ? this.zSize() : ICON_SIZES[this.zSize()]));
  protected readonly swatchClasses = computed(() => colorPickerSwatchVariants({ zSize: this.zSize() }));

  protected readonly panelClasses = colorPickerPanelVariants();
  protected readonly areaClasses = colorPickerAreaVariants();
  protected readonly hueTrackClasses = colorPickerTrackVariants({ zChannel: 'hue' });
  protected readonly alphaTrackClasses = colorPickerTrackVariants({ zChannel: 'alpha' });
  protected readonly thumbClasses = colorPickerThumbVariants();
  protected readonly presetClasses = colorPickerPresetVariants();
  protected readonly formatGroupClasses = colorPickerFormatGroupVariants();
  protected readonly formatClasses = colorPickerFormatVariants();
  protected readonly formatIndicatorClasses = colorPickerFormatIndicatorVariants();
  protected readonly fillClasses = colorPickerFillVariants();

  constructor() {
    inject(DestroyRef).onDestroy(() => this.cancelFrame());
  }

  /**
   * Sets the working color and emits it in `zFormat`, once per distinct string. `final: false` is for the
   * frames of a drag, which only emit `zColorCommit` once the pointer is released.
   */
  commit(color: ZardHsva, { final = true }: { final?: boolean } = {}): void {
    if (this.disabled()) {
      return;
    }

    const next = this.zAlpha() ? color : { ...color, a: 1 };
    this.color.set(next);

    const formatted = this.format(next);
    if (formatted === this.value()) {
      return;
    }

    this.value.set(formatted);
    this.onChange(formatted);
    this.zColorChange.emit(formatted);
    if (final) {
      this.zColorCommit.emit(formatted);
    }
  }

  protected percent(fraction: number): number {
    return Math.round(fraction * 100);
  }

  protected async pickFromScreen(): Promise<void> {
    if (!this.eyeDropper || this.disabled()) {
      return;
    }

    try {
      const { sRGBHex } = await new this.eyeDropper().open();
      const parsed = parseColor(sRGBHex);
      if (parsed) {
        this.commit(keepHue(parsed, this.color()));
      }
    } catch {
      // Dismissed with Escape — nothing to apply.
    }
  }

  protected onPointerDown(event: PointerEvent, channel: ZardColorChannel): void {
    if (this.disabled() || event.button !== 0) {
      return;
    }

    const element = event.currentTarget as HTMLElement;
    element.focus();
    element.setPointerCapture?.(event.pointerId);
    this.dragging.set(channel);
    this.dragRect = element.getBoundingClientRect();
    this.dragStartValue = this.value();
    this.updateFromPointer(event.clientX, event.clientY);
  }

  /** Pointer events can fire far more often than the screen repaints, so moves are applied once per frame. */
  protected onPointerMove(event: PointerEvent, channel: ZardColorChannel): void {
    if (this.dragging() !== channel) {
      return;
    }

    this.pendingPointer = { x: event.clientX, y: event.clientY };
    this.frame ||= requestAnimationFrame(() => this.flushPointer());
  }

  protected onPointerUp(): void {
    if (!this.dragging()) {
      return;
    }

    this.flushPointer();
    this.dragging.set(null);
    this.dragRect = null;

    const value = this.value();
    if (value !== null && value !== this.dragStartValue) {
      this.zColorCommit.emit(value);
    }
  }

  protected onKeydown(event: KeyboardEvent, channel: ZardColorChannel): void {
    const next = this.colorForKey(event, channel);
    if (!next) {
      return;
    }

    event.preventDefault();
    this.commit(next);
  }

  protected onTextCommit(event: Event): void {
    const field = event.target as HTMLInputElement;
    const parsed = parseColor(field.value, this.resolveColor);

    if (parsed) {
      this.commit(keepHue(parsed, this.color()));
    }

    // Normalizes valid input (`#FFF` → `#ffffff`) and reverts invalid input to the current color.
    field.value = this.inputText();
  }

  protected onPopoverVisibilityChange(visible: boolean): void {
    if (!visible) {
      this.onPointerUp();
      this.onTouched();
      return;
    }

    // The panel is only created once the popover renders, hence the deferral.
    afterNextRender(() => this.area()?.nativeElement.focus(), { injector: this.injector });
  }

  private format(color: ZardHsva): string {
    return formatColor(color, this.zFormat(), this.zAlpha());
  }

  private flushPointer(): void {
    this.cancelFrame();
    const pending = this.pendingPointer;
    this.pendingPointer = null;
    if (pending) {
      this.updateFromPointer(pending.x, pending.y);
    }
  }

  private cancelFrame(): void {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
  }

  private updateFromPointer(clientX: number, clientY: number): void {
    const rect = this.dragRect;
    const channel = this.dragging();
    if (!rect || !channel) {
      return;
    }

    const x = rect.width ? clamp((clientX - rect.left) / rect.width, [0, 1]) : 0;
    const y = rect.height ? clamp((clientY - rect.top) / rect.height, [0, 1]) : 0;
    const color = this.color();

    switch (channel) {
      case 'area':
        this.commit({ ...color, s: x, v: 1 - y }, { final: false });
        break;
      case 'hue':
        this.commit({ ...color, h: x * 360 }, { final: false });
        break;
      case 'alpha':
        this.commit({ ...color, a: x }, { final: false });
        break;
    }
  }

  /** The color a key leads to, or `null` for keys the slider does not handle. */
  private colorForKey(event: KeyboardEvent, channel: ZardColorChannel): ZardHsva | null {
    const { key } = event;
    const color = this.color();
    const delta = this.keyDelta(key, event.shiftKey ? SHIFT_STEP : STEP);

    if (channel === 'area') {
      if (key === 'Home' || key === 'End') {
        return { ...color, s: key === 'Home' ? 0 : 1 };
      }
      if (!delta) {
        return null;
      }
      const s = clamp(this.percent(color.s) + delta.x, [0, 100]);
      const v = clamp(this.percent(color.v) + delta.y, [0, 100]);
      return { ...color, s: s / 100, v: v / 100 };
    }

    const max = channel === 'hue' ? 360 : 100;
    const current = channel === 'hue' ? this.hue() : this.percent(color.a);
    let next: number;
    if (key === 'Home' || key === 'End') {
      next = key === 'Home' ? 0 : max;
    } else if (delta) {
      next = clamp(current + (delta.x || delta.y), [0, max]);
    } else {
      return null;
    }
    return channel === 'hue' ? { ...color, h: next } : { ...color, a: next / 100 };
  }

  /** Right/up increase, left/down decrease; PageUp/PageDown move by the large step. In the area, y is brightness. */
  private keyDelta(key: string, step: number): { x: number; y: number } | null {
    switch (key) {
      case 'ArrowRight':
        return { x: step, y: 0 };
      case 'ArrowLeft':
        return { x: -step, y: 0 };
      case 'ArrowUp':
        return { x: 0, y: step };
      case 'ArrowDown':
        return { x: 0, y: -step };
      case 'PageUp':
        return { x: 0, y: SHIFT_STEP };
      case 'PageDown':
        return { x: 0, y: -SHIFT_STEP };
      default:
        return null;
    }
  }

  /**
   * Lets the browser parse what the utils don't (named colors such as `rebeccapurple`). The color is
   * painted over two different backgrounds: if both reads agree, the browser accepted it.
   */
  private resolveWithCanvas(value: string): string | null {
    if (!/^[a-z]+$/.test(value)) {
      return null;
    }

    if (this.canvasContext === undefined) {
      try {
        this.canvasContext = this.document.createElement('canvas').getContext('2d');
      } catch {
        this.canvasContext = null;
      }
    }

    const context = this.canvasContext;
    if (!context) {
      return null;
    }

    context.fillStyle = '#000';
    context.fillStyle = value;
    const first = String(context.fillStyle);
    context.fillStyle = '#fff';
    context.fillStyle = value;
    return first === String(context.fillStyle) ? first : null;
  }

  writeValue(value: string | null): void {
    this.value.set(value || null);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import type { ZardButtonSizeVariants } from '@/shared/components/button/button.variants';

/**
 * Transparency checkerboard drawn with theme tokens, so it reads in light and dark mode.
 * Sits under every color fill that can carry alpha (trigger swatch, alpha track, presets).
 */
const checkerboard =
  'bg-[repeating-conic-gradient(var(--color-muted)_0_25%,var(--color-background)_0_50%)] bg-size-[8px_8px]';

/**
 * Host wrapper. With the value text the trigger is a full-width field, like `z-date-picker`;
 * without it the trigger is a square swatch button, so the host shrinks to fit it.
 */
export const colorPickerVariants = cva('flex flex-col', {
  variants: {
    zShowValue: {
      true: 'w-[212px]',
      false: 'w-fit',
    },
  },
  defaultVariants: {
    zShowValue: false,
  },
});

/** Trigger button. Height, colors and focus ring come from `buttonVariants`, so only the delta lives here. */
export const colorPickerTriggerVariants = cva('font-normal', {
  variants: {
    zShowValue: {
      true: 'w-full justify-start text-left',
      false: '',
    },
  },
  defaultVariants: {
    zShowValue: false,
  },
});

export const colorPickerSwatchVariants = cva(
  `relative shrink-0 overflow-hidden rounded-sm ring-1 ring-foreground/15 ring-inset ${checkerboard}`,
  {
    variants: {
      zSize: {
        sm: 'size-3.5',
        default: 'size-4',
        lg: 'size-5',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

/**
 * Changes made from the keyboard, a preset or the text field glide; a drag must follow the pointer, so the
 * panel carries `data-dragging` while one is in progress and the transitions below switch off.
 */
const glide = 'duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';
const glideUnlessDragging = `${glide} group-data-dragging/color-picker:transition-none`;

/** Wide enough for the longest text value, `oklch(… / …)`, to show whole in the field. */
export const colorPickerPanelVariants = cva('group/color-picker w-72 gap-3 p-3');

/** Segmented control picking the format of the text field. */
export const colorPickerFormatGroupVariants = cva('relative isolate flex rounded-md bg-muted p-0.5');

/** The pill behind the active tab. Tabs share the width equally, so it only needs a `translateX` per index. */
export const colorPickerFormatIndicatorVariants = cva(
  'absolute inset-y-0.5 left-0.5 -z-10 rounded-sm bg-background shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
);

export const colorPickerFormatVariants = cva(
  'h-6 flex-1 rounded-sm font-mono text-[11px] font-medium text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:text-foreground',
);

/** The saturation (x) / brightness (y) area. Its hue background is set inline. */
export const colorPickerAreaVariants = cva(
  `relative h-36 w-full cursor-crosshair touch-none rounded-md bg-[linear-gradient(to_top,#000,transparent),linear-gradient(to_right,#fff,transparent)] outline-none select-none transition-[background-color] focus-visible:ring-3 focus-visible:ring-ring/50 ${glideUnlessDragging}`,
);

export const colorPickerTrackVariants = cva(
  'relative h-3 w-full cursor-pointer touch-none rounded-full outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50',
  {
    variants: {
      zChannel: {
        hue: 'bg-[linear-gradient(to_right,#f00_0%,#ff0_17%,#0f0_33%,#0ff_50%,#00f_67%,#f0f_83%,#f00_100%)]',
        alpha: checkerboard,
      },
    },
    defaultVariants: {
      zChannel: 'hue',
    },
  },
);

/** Thumb shared by the area and both tracks; positioned inline through `left` / `top`. */
export const colorPickerThumbVariants = cva(
  `pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3),0_1px_3px_rgb(0_0_0/0.3)] transition-[left,top,background-color,scale] ${glide} group-data-dragging/color-picker:transition-[scale] data-active:scale-125`,
);

/** The color layer over a checkerboard (trigger swatch, presets), fading between colors. */
export const colorPickerFillVariants = cva(
  `absolute inset-0 transition-[background-color] ${glide} data-dragging:transition-none`,
);

export const colorPickerPresetVariants = cva(
  `relative size-6 overflow-hidden rounded-md ring-1 ring-foreground/15 ring-inset outline-none ${checkerboard} transition-[scale,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:ring-2 aria-pressed:ring-ring motion-reduce:transition-none`,
);

export type ZardColorPickerSizeVariants = Extract<ZardButtonSizeVariants, 'sm' | 'default' | 'lg'>;
export type ZardColorPickerVariants = VariantProps<typeof colorPickerVariants>;
```

```angular-ts
import { clamp } from '@/shared/utils/number';

/** Format of the string the color picker emits and shows in its text field. */
export type ZardColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

/**
 * Internal color model. Hue in degrees (0–360), saturation, value and alpha in 0–1.
 * HSV maps one-to-one onto the picker UI: the area is s/v, the tracks are h and a.
 */
export interface ZardHsva {
  h: number;
  s: number;
  v: number;
  a: number;
}

export interface ZardRgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** OKLCH as CSS writes it: lightness 0–1, chroma from 0 (about 0.37 at the edge of sRGB), hue in degrees. */
export interface ZardOklch {
  l: number;
  c: number;
  h: number;
  a: number;
}

type Vec3 = [number, number, number];

/**
 * Turns a CSS color the parser does not understand (a named color like `rebeccapurple`)
 * into one it does. Injected so the utils stay pure; the component passes a canvas-based one in the browser.
 */
export type ZardColorResolver = (value: string) => string | null;

const HEX_PATTERN = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const FUNCTION_PATTERN = /^(rgba?|hsla?|oklch)\(\s*([^)]*)\)$/i;

/** Chroma that `100%` stands for in `oklch()`, per CSS Color 4. */
const OKLCH_CHROMA_PERCENT = 0.4;
/** Smallest OKLab distance a person can tell apart; gamut mapping stops once clipping costs less than this. */
const OKLAB_JND = 0.02;

export function hsvaToRgba({ h, s, v, a }: ZardHsva): ZardRgba {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return { r: f(5) * 255, g: f(3) * 255, b: f(1) * 255, a };
}

export function rgbaToHsva({ r, g, b, a }: ZardRgba): ZardHsva {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const delta = max - Math.min(rn, gn, bn);

  let h = 0;
  if (delta) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
  }

  return { h: (h * 60 + 360) % 360, s: max ? delta / max : 0, v: max, a };
}

export function hsvaToHsla({ h, s, v, a }: ZardHsva): { h: number; s: number; l: number; a: number } {
  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return { h, s: sl, l, a };
}

export function hslaToHsva(h: number, s: number, l: number, a: number): ZardHsva {
  const v = l + s * Math.min(l, 1 - l);
  return { h, s: v ? 2 * (1 - l / v) : 0, v, a };
}

export function rgbaToOklch({ r, g, b, a }: ZardRgba): ZardOklch {
  const [l, labA, labB] = linearRgbToOklab([r, g, b].map(channel => srgbToLinear(channel / 255)) as Vec3);
  const c = Math.hypot(labA, labB);
  // Below this the hue is noise from the matrices, not a color.
  const h = c < 1e-4 ? 0 : ((Math.atan2(labB, labA) * 180) / Math.PI + 360) % 360;
  return { l, c, h, a };
}

/** Converts to sRGB, bringing colors sRGB cannot show into gamut (lower chroma, same lightness and hue). */
export function oklchToRgba({ l, c, h, a }: ZardOklch): ZardRgba {
  const [r, g, b] = mapOklchToSrgb(clamp(l, [0, 1]), Math.max(c, 0), h);
  return { r: r * 255, g: g * 255, b: b * 255, a };
}

/**
 * Parses hex (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`), `rgb()`/`rgba()` and `hsl()`/`hsla()` in both the
 * comma and the space-separated (`rgb(0 0 0 / 50%)`) syntax, and `oklch()` (space-separated only, as in CSS).
 * Anything else goes through `resolve`, if given. Returns `null` for input that is not a color.
 */
export function parseColor(value: string | null | undefined, resolve?: ZardColorResolver): ZardHsva | null {
  const input = value?.trim().toLowerCase();
  if (!input) {
    return null;
  }

  const parsed = parseHex(input) ?? parseFunction(input);
  if (parsed || !resolve) {
    return parsed;
  }

  const resolved = resolve(input)?.trim().toLowerCase();
  return resolved && resolved !== input ? (parseHex(resolved) ?? parseFunction(resolved)) : null;
}

/** Serializes a color in the given format. Alpha is only written when `alpha` is on and the color is not opaque. */
export function formatColor(color: ZardHsva, format: ZardColorFormat, alpha = false): string {
  const a = alpha ? round(color.a, 2) : 1;

  if (format === 'oklch') {
    const { l, c, h } = rgbaToOklch(hsvaToRgba(color));
    // The fewest decimals that still read back as the same 8-bit color: chroma needs one more than lightness.
    const chroma = round(c, 5);
    // A gray rounded to no chroma has no hue either; writing one would only be noise.
    const body = `${round(l, 4)} ${chroma} ${chroma ? round(h, 2) % 360 : 0}`;
    return a < 1 ? `oklch(${body} / ${a})` : `oklch(${body})`;
  }

  if (format === 'hsl') {
    const { h, s, l } = hsvaToHsla(color);
    const body = `${Math.round(h) % 360}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
    return a < 1 ? `hsla(${body}, ${a})` : `hsl(${body})`;
  }

  const { r, g, b } = hsvaToRgba(color);
  const channels = [r, g, b].map(Math.round);

  if (format === 'rgb') {
    return a < 1 ? `rgba(${channels.join(', ')}, ${a})` : `rgb(${channels.join(', ')})`;
  }

  // Alpha is rounded straight to a byte here: going through two decimals first would turn `#ff000081` into `…82`.
  const hex = (n: number) => n.toString(16).padStart(2, '0');
  const alphaByte = alpha ? Math.round(color.a * 255) : 255;
  return `#${channels.map(hex).join('')}${alphaByte < 255 ? hex(alphaByte) : ''}`;
}

/** An `rgba()` string for inline styles, regardless of the emitted format. */
export function toCssColor(color: ZardHsva): string {
  const { r, g, b, a } = hsvaToRgba(color);
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${round(a, 3)})`;
}

/** Whether two colors render the same once rounded to 8-bit channels, used to mark the active preset. */
export function isSameColor(first: ZardHsva, second: ZardHsva): boolean {
  return formatColor(first, 'hex', true) === formatColor(second, 'hex', true);
}

function parseHex(input: string): ZardHsva | null {
  const match = HEX_PATTERN.exec(input);
  if (!match) {
    return null;
  }

  let digits = match[1];
  if (digits.length <= 4) {
    digits = [...digits].map(char => char + char).join('');
  }

  const [r, g, b, a = 255] = Array.from({ length: digits.length / 2 }, (_, i) =>
    parseInt(digits.slice(i * 2, i * 2 + 2), 16),
  );
  return rgbaToHsva({ r, g, b, a: a / 255 });
}

function parseFunction(input: string): ZardHsva | null {
  const match = FUNCTION_PATTERN.exec(input);
  if (!match) {
    return null;
  }

  const parts = match[2]
    .replace(/\s*\/\s*/, ' / ')
    .split(/\s*,\s*|\s+/)
    .filter(part => part && part !== '/');
  if (parts.length !== 3 && parts.length !== 4) {
    return null;
  }

  const alpha = parts[3] === undefined ? 1 : parseUnit(parts[3], 1);
  if (alpha === null) {
    return null;
  }
  const a = clamp(alpha, [0, 1]);

  if (match[1] === 'oklch') {
    return match[2].includes(',') ? null : parseOklch(parts, a);
  }

  if (match[1].startsWith('rgb')) {
    const channels = parts.slice(0, 3).map(part => parseUnit(part, 255));
    if (!channels.every(channel => channel !== null)) {
      return null;
    }
    const [r, g, b] = (channels as number[]).map(channel => clamp(channel, [0, 255]));
    return rgbaToHsva({ r, g, b, a });
  }

  // CSS Color 4 accepts bare numbers for saturation and lightness, read as percentages.
  const h = parseFloat(parts[0]);
  const [s, l] = parts.slice(1, 3).map(part => {
    const number = parseUnit(part.replace('%', ''), 1);
    return number === null ? null : number / 100;
  });
  if (Number.isNaN(h) || !/^-?[\d.]+(deg)?$/.test(parts[0]) || s === null || l === null) {
    return null;
  }
  return hslaToHsva(((h % 360) + 360) % 360, clamp(s, [0, 1]), clamp(l, [0, 1]), a);
}

/** `none` (a missing component, which CSS reads as 0) is allowed in any of the three channels. */
function parseOklch(parts: string[], a: number): ZardHsva | null {
  const [l, c] = [parseUnit(parts[0], 1), parseUnit(parts[1], OKLCH_CHROMA_PERCENT)].map((value, i) =>
    parts[i] === 'none' ? 0 : value,
  );
  const h = parts[2] === 'none' ? 0 : /^-?[\d.]+(deg)?$/.test(parts[2]) ? parseFloat(parts[2]) : NaN;
  if (l === null || c === null || Number.isNaN(h)) {
    return null;
  }
  return rgbaToHsva(oklchToRgba({ l, c, h: ((h % 360) + 360) % 360, a }));
}

function srgbToLinear(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/** Mirrored around 0, so the slightly negative channels of an out-of-gamut color survive the trip. */
function linearToSrgb(channel: number): number {
  const magnitude = Math.abs(channel);
  const encoded = magnitude <= 0.0031308 ? magnitude * 12.92 : 1.055 * magnitude ** (1 / 2.4) - 0.055;
  return Math.sign(channel) * encoded;
}

/** Linear sRGB → OKLab, with Björn Ottosson's matrices (the ones CSS Color 4 uses). */
function linearRgbToOklab([r, g, b]: Vec3): Vec3 {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToLinearRgb([lightness, a, b]: Vec3): Vec3 {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function oklchToOklab(l: number, c: number, h: number): Vec3 {
  const radians = (h * Math.PI) / 180;
  return [l, c * Math.cos(radians), c * Math.sin(radians)];
}

/** Gamma-encoded sRGB (0–1 when in gamut). */
function oklabToSrgb(lab: Vec3): Vec3 {
  return oklabToLinearRgb(lab).map(linearToSrgb) as Vec3;
}

function isInGamut(rgb: Vec3): boolean {
  return rgb.every(channel => channel >= -1e-6 && channel <= 1 + 1e-6);
}

function clip(rgb: Vec3): Vec3 {
  return rgb.map(channel => clamp(channel, [0, 1])) as Vec3;
}

function distance(first: Vec3, second: Vec3): number {
  return Math.hypot(first[0] - second[0], first[1] - second[1], first[2] - second[2]);
}

/**
 * The CSS Color 4 gamut mapping: bisect chroma at fixed lightness and hue until clipping what is left
 * changes the color by less than a just-noticeable difference.
 */
function mapOklchToSrgb(l: number, c: number, h: number): Vec3 {
  const origin = oklabToSrgb(oklchToOklab(l, c, h));
  if (isInGamut(origin)) {
    return clip(origin);
  }
  if (l >= 1) {
    return [1, 1, 1];
  }
  if (l <= 0) {
    return [0, 0, 0];
  }

  const clippedError = (chroma: number) => {
    const lab = oklchToOklab(l, chroma, h);
    const clipped = clip(oklabToSrgb(lab));
    return { clipped, error: distance(linearRgbToOklab(clipped.map(srgbToLinear) as Vec3), lab) };
  };

  let current = clippedError(c);
  if (current.error < OKLAB_JND) {
    return current.clipped;
  }

  let min = 0;
  let max = c;
  let minInGamut = true;
  while (max - min > 1e-4) {
    const chroma = (min + max) / 2;
    if (minInGamut && isInGamut(oklabToSrgb(oklchToOklab(l, chroma, h)))) {
      min = chroma;
      continue;
    }
    current = clippedError(chroma);
    if (current.error < OKLAB_JND) {
      if (OKLAB_JND - current.error < 1e-4) {
        return current.clipped;
      }
      minInGamut = false;
      min = chroma;
    } else {
      max = chroma;
    }
  }
  return current.clipped;
}

/** Reads a number or a percentage; a percentage is scaled to `max` (`50%` of 255 is 127.5). */
function parseUnit(part: string, max: number): number | null {
  if (!/^-?[\d.]+%?$/.test(part)) {
    return null;
  }
  const number = parseFloat(part);
  if (Number.isNaN(number)) {
    return null;
  }
  return part.endsWith('%') ? (number / 100) * max : number;
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
```

```angular-ts
export * from './color-picker.component';
export * from './color-picker.utils';
export * from './color-picker.variants';
```

## Usage

```angular-ts
import { ZardColorPickerComponent } from '@/shared/components/color-picker/color-picker.component';
```

```angular-html
<z-color-picker [(value)]="color" />
```

## Examples

### Basic

Without `zShowValue` the trigger is a square swatch. Pair it with a `<label>` through `zId`.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-basic',
  imports: [ZardColorPickerComponent, ZardFieldImports],
  template: `
    <div z-field zOrientation="horizontal" class="mx-auto w-fit">
      <z-color-picker zId="color-picker-basic" [(value)]="color" />
      <label z-field-label for="color-picker-basic">Accent color</label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerBasicComponent {
  readonly color = signal<string | null>('#16a34a');
}
```

### Formats

`zFormat` decides the string you get back — and the one typed in the text field.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-formats',
  imports: [ZardColorPickerComponent, ZardFieldImports],
  template: `
    <div z-field-group class="mx-auto w-60">
      <div z-field>
        <label z-field-label for="color-picker-format-hex">Hex</label>
        <z-color-picker zId="color-picker-format-hex" zShowValue [(value)]="hex" />
      </div>

      <div z-field>
        <label z-field-label for="color-picker-format-rgb">RGB</label>
        <z-color-picker zId="color-picker-format-rgb" zFormat="rgb" zShowValue [(value)]="rgb" />
      </div>

      <div z-field>
        <label z-field-label for="color-picker-format-hsl">HSL</label>
        <z-color-picker zId="color-picker-format-hsl" zFormat="hsl" zShowValue [(value)]="hsl" />
      </div>

      <div z-field>
        <label z-field-label for="color-picker-format-oklch">OKLCH</label>
        <z-color-picker zId="color-picker-format-oklch" zFormat="oklch" zShowValue [(value)]="oklch" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerFormatsComponent {
  readonly hex = signal<string | null>('#7c3aed');
  readonly rgb = signal<string | null>('rgb(234, 88, 12)');
  readonly hsl = signal<string | null>('hsl(199, 89%, 48%)');
  readonly oklch = signal<string | null>('oklch(0.723 0.219 149.579)');
}
```

### Alpha

`zAlpha` adds an alpha slider; the value only carries alpha while the color is not opaque.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-alpha',
  imports: [ZardColorPickerComponent, ZardFieldImports],
  template: `
    <div z-field class="mx-auto w-60">
      <label z-field-label for="color-picker-alpha">Overlay</label>
      <z-color-picker zId="color-picker-alpha" zFormat="rgb" zAlpha zShowValue [(value)]="color" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerAlphaComponent {
  readonly color = signal<string | null>('rgba(15, 23, 42, 0.6)');
}
```

### Presets

Pass `zPresets` to offer a palette under the panel. The matching swatch is marked as pressed.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-presets',
  imports: [ZardColorPickerComponent, ZardFieldImports],
  template: `
    <div z-field class="mx-auto w-60">
      <label z-field-label for="color-picker-presets">Label color</label>
      <z-color-picker zId="color-picker-presets" zShowValue [zPresets]="presets" [(value)]="color" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerPresetsComponent {
  protected readonly presets = [
    '#0f172a',
    '#dc2626',
    '#ea580c',
    '#f59e0b',
    '#16a34a',
    '#0d9488',
    '#2563eb',
    '#7c3aed',
    '#db2777',
  ];

  readonly color = signal<string | null>(null);
}
```

### Events

`zColorChange` fires on every frame of a drag; `zColorCommit` only once the change settles, so it is the one to save from.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-events',
  imports: [ZardColorPickerComponent, ZardFieldImports],
  template: `
    <div z-field class="mx-auto w-60">
      <label z-field-label for="color-picker-events">Theme color</label>
      <z-color-picker
        zId="color-picker-events"
        zShowValue
        zPlaceholder="No color yet"
        (zColorChange)="live.set($event)"
        (zColorCommit)="saved.set($event)"
      />
      <p z-field-description class="font-mono">
        Live: {{ live() ?? '—' }}
        <br />
        Saved: {{ saved() ?? '—' }}
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerEventsComponent {
  readonly live = signal<string | null>(null);
  readonly saved = signal<string | null>(null);
}
```

### Form

Works with `formControlName` / `ngModel`, including the disabled state of the control.

```angular-ts
import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-form',
  imports: [ZardColorPickerComponent, ...ZardFieldImports, ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form">
      <div z-field-group class="mx-auto w-60">
        <div z-field>
          <label z-field-label for="color-picker-form-brand">Brand color</label>
          <z-color-picker
            zId="color-picker-form-brand"
            formControlName="brand"
            zShowValue
            [zPresets]="['#0f172a', '#2563eb', '#16a34a', '#f59e0b', '#dc2626']"
          />
          <p z-field-description>Used for buttons and links.</p>
        </div>

        <div z-field data-disabled="true">
          <label z-field-label for="color-picker-form-locked">Logo color (locked)</label>
          <z-color-picker zId="color-picker-form-locked" formControlName="logo" zShowValue />
        </div>

        <p class="text-muted-foreground text-sm">Form value: {{ form.getRawValue() | json }}</p>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerFormComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    brand: ['#2563eb'],
    logo: [{ value: '#0f172a', disabled: true }],
  });
}
```

### Sizes

`zSize` follows the button scale, so the picker lines up with the inputs around it.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardInputComponent } from '@/shared/components/input/input.component';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-sizes',
  imports: [ZardColorPickerComponent, ZardInputComponent],
  template: `
    <div class="mx-auto flex w-fit flex-col gap-4">
      <div class="flex items-center gap-2">
        <z-color-picker zSize="sm" [(value)]="color" />
        <z-color-picker [(value)]="color" />
        <z-color-picker zSize="lg" [(value)]="color" />
      </div>

      <div class="flex items-center gap-2">
        <input z-input aria-label="Name" placeholder="Name" class="w-40" />
        <z-color-picker zShowValue class="w-36" [(value)]="color" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerSizesComponent {
  readonly color = signal<string | null>('#db2777');
}
```

## API Reference

### z-color-picker

A swatch button that opens a panel in a popover: a saturation/brightness area, a hue slider, an optional alpha slider, a text field and optional presets. The value is a plain CSS color string in `zFormat`, and it works with `formControl` / `ngModel` through a ControlValueAccessor. Any hex, `rgb()`, `hsl()`, `oklch()` or named CSS color is accepted as input; an `oklch()` color outside sRGB is brought into gamut by lowering its chroma, as browsers do. A value written from outside is shown as is and only normalized to `zFormat` (and stripped of alpha without `zAlpha`) on the next pick. Where the browser supports the EyeDropper API (Chromium), the panel also offers a button to pick a color from the screen.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes on the host. Also where the trigger width is overridden with `zShowValue` | `ClassValue` | `''` |
| `[zId]` | Applied to the trigger button, so a `<label for="…">` points at something focusable | `string` | `''` |
| `[value]` | Selected color, written in `zFormat`. `null` while nothing is picked | `string \| null` | `null` |
| `[zFormat]` | Format of the emitted value and of the text field. `oklch` is written like Tailwind CSS v4 tokens (`oklch(0.628 0.25768 29.23)`), with enough decimals to read back as the same color | `'hex' \| 'rgb' \| 'hsl' \| 'oklch'` | `'hex'` |
| `[zAlpha]` | Shows the alpha slider and includes alpha in the value when the color is not opaque | `boolean` | `false` |
| `[zPresets]` | Preset swatches shown below the panel. Invalid colors are skipped | `string[]` | `[]` |
| `[zSize]` | Trigger size, on the same scale as `z-button` and `z-input` | `'sm' \| 'default' \| 'lg'` | `'default'` |
| `[zShowValue]` | Shows the value next to the swatch, turning the square trigger into a full-width field | `boolean` | `false` |
| `[zPlaceholder]` | Text shown in the trigger while no color is picked | `string` | `'Pick a color'` |
| `[zAlign]` | Alignment of the panel relative to the trigger | `'start' \| 'center' \| 'end'` | `'start'` |
| `[zShowFormatToggle]` | Shows HEX / RGB / HSL / OKLCH tabs above the text field. Only the text changes: the value is still emitted in `zFormat` | `boolean` | `true` |
| `[disabled]` | Whether the color picker is disabled | `boolean` | `false` |
| `(zColorChange)` | Emitted with the new value whenever the user changes the color, including every frame of a drag | `EventEmitter<string>` | `-` |
| `(zColorCommit)` | Emitted once the change settles: when a drag ends, on each key press, and when a preset, the text field or the eyedropper sets the color. Use it to save or call an API without debouncing | `EventEmitter<string>` | `-` |

---

[Open in browser](https://zardui.com/docs/components/color-picker)
