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
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  type ElementRef,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  PLATFORM_ID,
  viewChild,
  ViewEncapsulation,
  type TemplateRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { ZardButtonComponent, type ZardButtonSizeVariants } from '@/shared/components/button';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '@/shared/components/popover';
import { mergeClasses } from '@/shared/utils/merge-classes';
import { noopFn } from '@/shared/utils/noop';
import { clamp } from '@/shared/utils/number';

import {
  formatColor,
  isSameColor,
  parseColor,
  toCssColor,
  type ZardColorFormat,
  type ZardColorResolver,
  type ZardHsva,
} from './color-picker.utils';
import {
  colorPickerAreaVariants,
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

/** Shown in the panel while the value is empty, so the first drag starts from a visible color. */
const DEFAULT_COLOR: ZardHsva = { h: 0, s: 0, v: 0, a: 1 };

const STEP = 1;
const SHIFT_STEP = 10;

/** Swatch-only triggers are square, so they use the icon sizes of the button scale. */
const ICON_SIZES: Record<ZardColorPickerSizeVariants, ZardButtonSizeVariants> = {
  sm: 'icon-sm',
  default: 'icon',
  lg: 'icon-lg',
};

@Component({
  selector: 'z-color-picker, [z-color-picker]',
  imports: [ZardButtonComponent, ZardInputComponent, ZardPopoverComponent, ZardPopoverDirective],
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
      zAlign="start"
      (zVisibleChange)="onPopoverVisibilityChange($event)"
    >
      <span data-slot="color-picker-swatch" [class]="swatchClasses()">
        @if (!isEmpty()) {
          <span class="absolute inset-0" [style.background]="swatchColor()"></span>
        }
      </span>
      @if (zShowValue()) {
        <span class="min-w-0 truncate data-[empty=true]:text-muted-foreground" [attr.data-empty]="isEmpty()">
          {{ displayText() }}
        </span>
      }
    </button>

    <ng-template #panelTemplate>
      <z-popover aria-label="Choose color" [class]="panelClasses">
        <div
          #area
          data-slot="color-picker-area"
          role="slider"
          tabindex="0"
          aria-label="Saturation and brightness"
          aria-valuemin="0"
          aria-valuemax="100"
          [attr.aria-valuenow]="percent(color().s)"
          [attr.aria-valuetext]="
            'Saturation ' + percent(color().s) + '%, brightness ' + percent(color().v) + '%'
          "
          [class]="areaClasses"
          [style.background]="areaBackground()"
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
            [style.background]="opaqueColor()"
          ></span>
        </div>

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
          <span [class]="thumbClasses" [style.left.%]="(color().h / 360) * 100" [style.background]="hueColor()"></span>
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
            <span [class]="thumbClasses" [style.left.%]="color().a * 100" [style.background]="cssColor()"></span>
          </div>
        }

        <input
          z-input
          aria-label="Color value"
          spellcheck="false"
          autocomplete="off"
          class="h-7 font-mono text-xs"
          [value]="inputText()"
          (change)="onTextCommit($event)"
          (keydown.enter)="onTextCommit($event)"
        />

        @if (presets().length) {
          <div data-slot="color-picker-presets" class="flex flex-wrap gap-1.5">
            @for (preset of presets(); track preset.value) {
              <button
                type="button"
                [class]="presetClasses"
                [attr.aria-label]="preset.value"
                [attr.aria-pressed]="isActivePreset(preset.color)"
                (click)="commit(preset.color)"
              >
                <span class="absolute inset-0" [style.background]="presetColor(preset.color)"></span>
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
  readonly value = model<string | null>(null);
  readonly disabled = model<boolean>(false);

  readonly zColorChange = output<string>();

  private onChange: (value: string | null) => void = noopFn;
  private onTouched: () => void = noopFn;

  /** The last string this component emitted, so echoing it back does not round the working color. */
  private lastEmitted: string | null = null;
  private activeChannel: ZardColorChannel | null = null;
  private canvasContext: CanvasRenderingContext2D | null | undefined;

  private readonly resolveColor: ZardColorResolver | undefined = this.isBrowser
    ? value => this.resolveWithCanvas(value)
    : undefined;

  /**
   * The working color. HSV is kept here instead of re-parsed from `value`, otherwise the hue would
   * reset to red every time the color passes through gray or black, where hue is undefined.
   */
  protected readonly color = linkedSignal<string | null, ZardHsva>({
    source: this.value,
    computation: (value, previous) => {
      if (previous && value === this.lastEmitted) {
        return previous.value;
      }

      const parsed = parseColor(value, this.resolveColor);
      if (!parsed) {
        return previous?.value ?? DEFAULT_COLOR;
      }
      if (previous && (parsed.s === 0 || parsed.v === 0)) {
        return { ...parsed, h: previous.value.h };
      }
      return parsed;
    },
  });

  protected readonly isEmpty = computed(() => !parseColor(this.value(), this.resolveColor));

  protected readonly presets = computed(() =>
    this.zPresets().flatMap(value => {
      const color = parseColor(value, this.resolveColor);
      return color ? [{ value, color }] : [];
    }),
  );

  protected readonly formatted = computed(() => formatColor(this.color(), this.zFormat(), this.zAlpha()));
  protected readonly displayText = computed(() => (this.isEmpty() ? 'Pick a color' : this.formatted()));
  protected readonly inputText = computed(() => (this.isEmpty() ? '' : this.formatted()));

  protected readonly hue = computed(() => Math.round(this.color().h));
  protected readonly cssColor = computed(() => toCssColor(this.color()));
  protected readonly opaqueColor = computed(() => toCssColor({ ...this.color(), a: 1 }));
  protected readonly hueColor = computed(() => `hsl(${this.color().h}, 100%, 50%)`);
  protected readonly swatchColor = computed(() => (this.zAlpha() ? this.cssColor() : this.opaqueColor()));
  protected readonly areaBackground = computed(
    () => `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), ${this.hueColor()}`,
  );
  protected readonly alphaBackground = computed(
    () => `linear-gradient(to right, transparent, ${this.opaqueColor()})`,
  );

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

  /** Sets the working color and emits it in `zFormat`, once per distinct string. */
  commit(color: ZardHsva): void {
    if (this.disabled()) {
      return;
    }

    const next = this.zAlpha() ? color : { ...color, a: 1 };
    this.color.set(next);

    const formatted = formatColor(next, this.zFormat(), this.zAlpha());
    if (formatted === this.value()) {
      return;
    }

    this.lastEmitted = formatted;
    this.value.set(formatted);
    this.onChange(formatted);
    this.zColorChange.emit(formatted);
  }

  protected percent(fraction: number): number {
    return Math.round(fraction * 100);
  }

  protected presetColor(color: ZardHsva): string {
    return toCssColor(this.zAlpha() ? color : { ...color, a: 1 });
  }

  protected isActivePreset(color: ZardHsva): boolean {
    return !this.isEmpty() && isSameColor(this.zAlpha() ? color : { ...color, a: 1 }, this.color());
  }

  protected onPointerDown(event: PointerEvent, channel: ZardColorChannel): void {
    if (this.disabled() || event.button !== 0) {
      return;
    }

    const element = event.currentTarget as HTMLElement;
    element.focus();
    element.setPointerCapture?.(event.pointerId);
    this.activeChannel = channel;
    this.updateFromPointer(event, channel);
  }

  protected onPointerMove(event: PointerEvent, channel: ZardColorChannel): void {
    if (this.activeChannel === channel) {
      this.updateFromPointer(event, channel);
    }
  }

  protected onPointerUp(): void {
    this.activeChannel = null;
  }

  protected onKeydown(event: KeyboardEvent, channel: ZardColorChannel): void {
    const step = event.shiftKey ? SHIFT_STEP : STEP;
    const color = this.color();

    if (channel === 'area') {
      const delta = this.arrowDelta(event.key);
      const s = event.key === 'Home' ? 0 : event.key === 'End' ? 100 : this.percent(color.s) + delta.x * step;
      const v = this.percent(color.v) + delta.y * step;
      if (!delta.x && !delta.y && event.key !== 'Home' && event.key !== 'End') {
        return;
      }
      event.preventDefault();
      this.commit({ ...color, s: clamp(s, [0, 100]) / 100, v: clamp(v, [0, 100]) / 100 });
      return;
    }

    const max = channel === 'hue' ? 360 : 100;
    const current = channel === 'hue' ? Math.round(color.h) : this.percent(color.a);
    const delta = this.arrowDelta(event.key);
    const next =
      event.key === 'Home' ? 0 : event.key === 'End' ? max : current + (delta.x || delta.y) * step;
    if (next === current && event.key !== 'Home' && event.key !== 'End') {
      return;
    }

    event.preventDefault();
    const value = clamp(next, [0, max]);
    this.commit(channel === 'hue' ? { ...color, h: value } : { ...color, a: value / 100 });
  }

  protected onTextCommit(event: Event): void {
    const field = event.target as HTMLInputElement;
    const parsed = parseColor(field.value, this.resolveColor);

    if (parsed) {
      this.commit(parsed);
    }

    // Normalizes valid input (`#FFF` → `#ffffff`) and reverts invalid input to the current color.
    field.value = this.inputText();
  }

  protected onPopoverVisibilityChange(visible: boolean): void {
    if (!visible) {
      this.activeChannel = null;
      this.onTouched();
      return;
    }

    // The panel is only created once the popover renders, hence the deferral.
    setTimeout(() => this.area()?.nativeElement.focus());
  }

  private updateFromPointer(event: PointerEvent, channel: ZardColorChannel): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.width ? clamp((event.clientX - rect.left) / rect.width, [0, 1]) : 0;
    const y = rect.height ? clamp((event.clientY - rect.top) / rect.height, [0, 1]) : 0;
    const color = this.color();

    switch (channel) {
      case 'area':
        this.commit({ ...color, s: x, v: 1 - y });
        break;
      case 'hue':
        this.commit({ ...color, h: x * 360 });
        break;
      case 'alpha':
        this.commit({ ...color, a: x });
        break;
    }
  }

  /** Right/up increase, left/down decrease. In the area, x is saturation and y is brightness. */
  private arrowDelta(key: string): { x: number; y: number } {
    switch (key) {
      case 'ArrowRight':
        return { x: 1, y: 0 };
      case 'ArrowLeft':
        return { x: -1, y: 0 };
      case 'ArrowUp':
        return { x: 0, y: 1 };
      case 'ArrowDown':
        return { x: 0, y: -1 };
      default:
        return { x: 0, y: 0 };
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

export const colorPickerPanelVariants = cva('w-64 gap-3 p-3');

/** The saturation (x) / brightness (y) area. Its hue background is set inline. */
export const colorPickerAreaVariants = cva(
  'relative h-36 w-full cursor-crosshair touch-none rounded-md outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50',
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
  'pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3),0_1px_3px_rgb(0_0_0/0.3)]',
);

export const colorPickerPresetVariants = cva(
  `relative size-6 overflow-hidden rounded-md ring-1 ring-foreground/15 ring-inset outline-none ${checkerboard} transition-transform hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:ring-2 aria-pressed:ring-ring`,
);

export type ZardColorPickerSizeVariants = Extract<ZardButtonSizeVariants, 'sm' | 'default' | 'lg'>;
export type ZardColorPickerVariants = VariantProps<typeof colorPickerVariants>;
```

```angular-ts
import { clamp } from '@/shared/utils/number';

/** Format of the string the color picker emits and shows in its text field. */
export type ZardColorFormat = 'hex' | 'rgb' | 'hsl';

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

/**
 * Turns a CSS color the parser does not understand (a named color like `rebeccapurple`)
 * into one it does. Injected so the utils stay pure; the component passes a canvas-based one in the browser.
 */
export type ZardColorResolver = (value: string) => string | null;

const HEX_PATTERN = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const FUNCTION_PATTERN = /^(rgba?|hsla?)\(\s*([^)]*)\)$/i;

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

/**
 * Parses hex (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`), `rgb()`/`rgba()` and `hsl()`/`hsla()` in both the
 * comma and the space-separated (`rgb(0 0 0 / 50%)`) syntax. Anything else goes through `resolve`, if given.
 * Returns `null` for input that is not a color.
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

  const hex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${channels.map(hex).join('')}${a < 1 ? hex(Math.round(a * 255)) : ''}`;
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

  const [r, g, b, a = 255] = digits.match(/../g)!.map(pair => parseInt(pair, 16));
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

  if (match[1].startsWith('rgb')) {
    const channels = parts.slice(0, 3).map(part => parseUnit(part, 255));
    if (channels.some(channel => channel === null)) {
      return null;
    }
    const [r, g, b] = channels.map(channel => clamp(channel!, [0, 255]));
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
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerFormatsComponent {
  readonly hex = signal<string | null>('#7c3aed');
  readonly rgb = signal<string | null>('rgb(234, 88, 12)');
  readonly hsl = signal<string | null>('hsl(199, 89%, 48%)');
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

A swatch button that opens a panel in a popover: a saturation/brightness area, a hue slider, an optional alpha slider, a text field and optional presets. The value is a plain CSS color string in `zFormat`, and it works with `formControl` / `ngModel` through a ControlValueAccessor. Any hex, `rgb()`, `hsl()` or named CSS color is accepted as input.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes on the host. Also where the trigger width is overridden with `zShowValue` | `ClassValue` | `''` |
| `[zId]` | Applied to the trigger button, so a `<label for="…">` points at something focusable | `string` | `''` |
| `[value]` | Selected color, written in `zFormat`. `null` while nothing is picked | `string \| null` | `null` |
| `[zFormat]` | Format of the emitted value and of the text field | `'hex' \| 'rgb' \| 'hsl'` | `'hex'` |
| `[zAlpha]` | Shows the alpha slider and includes alpha in the value when the color is not opaque | `boolean` | `false` |
| `[zPresets]` | Preset swatches shown below the panel. Invalid colors are skipped | `string[]` | `[]` |
| `[zSize]` | Trigger size, on the same scale as `z-button` and `z-input` | `'sm' \| 'default' \| 'lg'` | `'default'` |
| `[zShowValue]` | Shows the value next to the swatch, turning the square trigger into a full-width field | `boolean` | `false` |
| `[disabled]` | Whether the color picker is disabled | `boolean` | `false` |

| Output | Description | Type | Default |
| --- | --- | --- | --- |
| `(zColorChange)` | Emitted with the new value whenever the user changes the color | `EventEmitter<string>` | `-` |

---

[Open in browser](https://zardui.com/docs/components/color-picker)
