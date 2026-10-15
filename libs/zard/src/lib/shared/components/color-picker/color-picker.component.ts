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
        <span class="data-[empty=true]:text-muted-foreground min-w-0 truncate" [attr.data-empty]="isEmpty()">
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
          [attr.aria-valuetext]="'Saturation ' + percent(color().s) + '%, brightness ' + percent(color().v) + '%'"
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
    () =>
      `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), ${this.hueColor()}`,
  );

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
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? max : current + (delta.x || delta.y) * step;
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
