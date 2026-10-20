import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  afterRenderEffect,
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

import { formatColor, parseColor, toCssColor, type ZardColorFormat, type ZardHsva } from './color-picker.utils';
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
                (click)="commitParsed(preset.color)"
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
  /** The dragged element. Measured on every applied frame, since a scroll moves the popover under the pointer. */
  private dragTarget: HTMLElement | null = null;
  private dragStartValue: string | null = null;
  private pendingPointer: { x: number; y: number } | null = null;
  private frame = 0;

  protected readonly eyeDropper: ZardEyeDropper | undefined = this.isBrowser
    ? (this.document.defaultView as (Window & { EyeDropper?: ZardEyeDropper }) | null)?.EyeDropper
    : undefined;

  /**
   * The working color. HSV is kept here instead of re-parsed from `value`, otherwise the hue would
   * reset to red every time the color passes through gray or black, where hue is undefined.
   */
  protected readonly color = linkedSignal<string | null, ZardHsva>({
    source: this.value,
    computation: (value, previous) => {
      // The value is just the working color written out (usually our own emit echoed back): keep the
      // unrounded working color, so a drag is not snapped to 8-bit steps, and skip parsing it on every frame.
      if (value && previous && untracked(() => this.format(previous.value)) === value) {
        return previous.value;
      }
      const parsed = parseColor(value);
      return parsed ? keepHue(parsed, previous?.value) : (previous?.value ?? DEFAULT_COLOR);
    },
  });

  /** An echoed value is the working color formatted, so it is known valid without parsing it again. */
  protected readonly isEmpty = computed(() => {
    const value = this.value();
    return !value || (this.format(this.color()) !== value && !parseColor(value));
  });

  protected readonly presets = computed(() => {
    const alpha = this.zAlpha();
    return this.zPresets().flatMap(value => {
      const parsed = parseColor(value);
      if (!parsed) {
        return [];
      }
      const color = alpha ? parsed : { ...parsed, a: 1 };
      return [{ value, color, css: toCssColor(color), hex: formatColor(color, 'hex', alpha) }];
    });
  });

  /**
   * Compared against each preset's hex, so the active swatch costs one format per change, not one per preset.
   * Alpha counts only with `zAlpha`, like in the presets, so an outside value's alpha does not hide the match.
   */
  protected readonly activeHex = computed(() =>
    this.isEmpty() ? null : formatColor(this.color(), 'hex', this.zAlpha()),
  );

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

    // A control disabled while the panel is open (a form saving, say) closes it rather than leaving it half alive.
    afterRenderEffect(() => {
      if (this.disabled()) {
        untracked(() => {
          this.onPointerUp();
          this.popoverDirective().hide();
        });
      }
    });
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

  /**
   * Commits a color read from outside the drag (text field, preset, eyedropper). Such a gray carries no hue of
   * its own, so the current one is kept. Drags call `commit` directly: they set the hue on purpose.
   */
  protected commitParsed(color: ZardHsva): void {
    this.commit(keepHue(color, this.color()));
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
        this.commitParsed(parsed);
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
    this.dragTarget = element;
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
    this.dragTarget = null;

    const value = this.value();
    if (value !== null && value !== this.dragStartValue) {
      this.zColorCommit.emit(value);
    }
  }

  protected onKeydown(event: KeyboardEvent, channel: ZardColorChannel): void {
    // Alt/Ctrl/Cmd + arrow belong to the browser and the OS (history, word jumps), not to the slider.
    if (this.disabled() || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const next = this.colorForKey(event, channel);
    if (!next) {
      return;
    }

    event.preventDefault();
    this.commit(next);
  }

  protected onTextCommit(event: Event): void {
    const field = event.target as HTMLInputElement;
    // Already showing the current color: nothing was typed. This is also Chrome's `change` right after a
    // handled Enter, which would otherwise re-read the rounded text (an HSL tab turning #123456 into #123354).
    if (field.value === this.inputText()) {
      return;
    }

    const parsed = parseColor(field.value);
    if (parsed) {
      this.commitParsed(parsed);
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
    const channel = this.dragging();
    if (!this.dragTarget || !channel) {
      return;
    }

    const rect = this.dragTarget.getBoundingClientRect();
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
