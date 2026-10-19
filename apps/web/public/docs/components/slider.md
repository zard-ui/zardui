---
title: Slider
description: An input where the user selects a value from within a given range.
---

# Slider

An input where the user selects a value from within a given range.

## Installation

### CLI

```bash
npx zard-cli@latest add slider
```

### Manual

```angular-ts
import { Directionality } from '@angular/cdk/bidi';
import {
  type AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  forwardRef,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  output,
  signal,
  viewChild,
  viewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';
import { filter, fromEvent, map, switchMap, takeUntil, tap } from 'rxjs';

import { mergeClasses } from '@/shared/utils/merge-classes';
import { noopFn } from '@/shared/utils/noop';
import { clamp, convertValueToPercentage, roundToStep } from '@/shared/utils/number';

import {
  sliderOrientationVariants,
  sliderRangeVariants,
  sliderThumbVariants,
  sliderTrackVariants,
  sliderVariants,
} from './slider.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: number[]) => void;

@Component({
  selector: 'z-slider-track',
  template: `
    <span #track data-slot="slider-track" [attr.data-orientation]="orientation()" [class]="classes()">
      <ng-content />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.width]': '"inherit"',
    '[style.height]': '"100%"',
    '[attr.data-orientation]': 'orientation()',
  },
  exportAs: 'zSliderTrack',
})
export class ZardSliderTrackComponent {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sliderTrackVariants(), 'flex', this.class()));

  private readonly trackEl = viewChild.required<ElementRef<HTMLElement>>('track');

  get nativeElement(): HTMLElement {
    return this.trackEl().nativeElement;
  }
}

@Component({
  selector: 'z-slider-range',
  template: `
    @for (seg of segments(); track $index) {
      <span
        data-slot="slider-range"
        [attr.data-orientation]="orientation()"
        [class]="classes()"
        [style.left]="seg.left"
        [style.right]="seg.right"
        [style.bottom]="seg.bottom"
        [style.top]="seg.top"
      ></span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zSliderRange',
})
export class ZardSliderRangeComponent {
  readonly percent = input<number[]>([0]);

  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sliderRangeVariants(), this.class()));

  private readonly directionality = inject(Directionality, { optional: true });

  protected readonly segments = computed(() => {
    const p = this.percent();
    const isHorizontal = this.orientation() === 'horizontal';
    const isRtl = (this.directionality?.valueSignal() ?? 'ltr') === 'rtl';

    // `start` is the inset from the inline-start edge, `end` from the inline-end edge
    // (left/right in LTR, right/left in RTL), so the filled range grows from the reading start.
    const make = (start: string, end: string) => {
      if (!isHorizontal) {
        return { left: null, right: null, bottom: start, top: end };
      }
      return isRtl
        ? { left: end, right: start, bottom: null, top: null }
        : { left: start, right: end, bottom: null, top: null };
    };

    if (p.length === 0) {
      return [make('0', '100%')];
    }

    if (p.length === 1) {
      return [make('0', 100 - p[0] + '%')];
    }

    const segs: ReturnType<typeof make>[] = [];
    for (let i = 0; i < p.length - 1; i++) {
      segs.push(make(p[i] + '%', 100 - p[i + 1] + '%'));
    }
    return segs;
  });
}

@Component({
  selector: 'z-slider-thumb',
  template: `
    <span
      #thumb
      data-slot="slider-thumb"
      [attr.role]="'slider'"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="max()"
      [attr.aria-valuenow]="value()"
      [attr.aria-disabled]="disabled() ? true : null"
      [class]="classes()"
      tabindex="0"
    ></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'orientationClasses()',
    '[style.left]': 'orientation() === "horizontal" && !isRtl() ? position() : null',
    '[style.right]': 'orientation() === "horizontal" && isRtl() ? position() : null',
    '[style.bottom]': 'orientation() === "vertical" ? position() : null',
  },
  exportAs: 'zSliderThumb',
})
export class ZardSliderThumbComponent {
  readonly value = input(0);
  readonly min = input(0);
  readonly max = input(100);
  readonly disabled = input(false);
  readonly percent = input(0);
  readonly offset = input(0);

  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sliderThumbVariants(), this.class()));

  private readonly directionality = inject(Directionality, { optional: true });

  protected readonly isRtl = computed(() => (this.directionality?.valueSignal() ?? 'ltr') === 'rtl');

  protected readonly position = computed(() => `calc(${this.percent()}% + ${this.offset()}px)`);

  protected readonly orientationClasses = computed(() =>
    mergeClasses(sliderOrientationVariants({ zOrientation: this.orientation() })),
  );

  private readonly thumbEl = viewChild.required<ElementRef<HTMLElement>>('thumb');

  get nativeElement(): HTMLElement {
    return this.thumbEl().nativeElement;
  }
}

@Component({
  selector: 'z-slider',
  imports: [ZardSliderTrackComponent, ZardSliderRangeComponent, ZardSliderThumbComponent],
  template: `
    <span
      data-slot="slider"
      [attr.data-disabled]="disabled()"
      [attr.data-orientation]="zOrientation()"
      [class]="classes()"
    >
      <z-slider-track [orientation]="zOrientation()">
        <z-slider-range [orientation]="zOrientation()" [percent]="percentages()" />
      </z-slider-track>

      @for (value of values(); track $index) {
        <z-slider-thumb
          [orientation]="zOrientation()"
          [percent]="percentages()[$index]"
          [offset]="thumbOffset()"
          [value]="value"
          [min]="zMin()"
          [max]="zMax()"
          [disabled]="disabled()"
          (keydown.{home,end,arrowleft,arrowright,arrowdown,arrowup}.prevent)="handleKeydown($event, $index)"
        />
      }
    </span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardSliderComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.data-orientation]': 'zOrientation()',
    '[attr.aria-disabled]': 'disabled() ? true : null',
    '[attr.data-disabled]': 'disabled() ? true : null',
  },
  exportAs: 'zSlider',
})
export class ZardSliderComponent implements ControlValueAccessor, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly directionality = inject(Directionality, { optional: true });

  readonly zMin = input(0, { transform: numberAttribute });
  readonly zMax = input(100, { transform: numberAttribute });
  readonly zDefault = input<number[]>([0]);
  readonly zValue = input<number[]>([]);
  readonly zStep = input(1, { transform: numberAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });

  readonly zOrientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');

  readonly zSlideIndexChange = output<number[]>();

  readonly thumbRefs = viewChildren(ZardSliderThumbComponent);
  readonly trackRef = viewChild.required(ZardSliderTrackComponent);

  protected readonly classes = computed(() => mergeClasses(sliderVariants(), this.class()));

  protected readonly disabled = linkedSignal(() => this.zDisabled());
  readonly activeThumbIndex = signal(0);
  readonly values = linkedSignal(() => {
    const v = this.zValue();
    if (Array.isArray(v) && v.length) {
      return v;
    }
    const d = this.zDefault();
    if (Array.isArray(d) && d.length) {
      return d;
    }
    return this.getMinMax();
  });

  protected readonly percentages = computed(() => {
    if (this.zMax() > 1) {
      return this.values();
    }
    const [min, max] = [this.zMin(), this.zMax()];
    return this.values().map(v => convertValueToPercentage(v, min, max));
  });

  readonly lastEmittedValue = signal<number[]>([]);
  readonly thumbOffset = signal(0);

  private onTouched: OnTouchedType = noopFn;
  private onChange: OnChangeType = noopFn;

  constructor() {
    toObservable(this.zValue)
      .pipe(
        filter(values => values.toString() !== this.lastEmittedValue().toString()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.setInitialValue());
  }

  ngAfterViewInit() {
    const pointerDown$ = fromEvent<PointerEvent>(this.elementRef.nativeElement, 'pointerdown').pipe(
      filter(() => !this.disabled()),
      tap(event => {
        const target = event.target as HTMLElement;
        const thumbs = this.thumbRefs();

        const clickedIndex = thumbs.findIndex(t => t.nativeElement.contains(target));
        if (clickedIndex !== -1) {
          this.activeThumbIndex.set(clickedIndex);
          return;
        }

        const isTrack = this.trackRef().nativeElement.contains(target);
        if (isTrack) {
          const coord = this.zOrientation() === 'vertical' ? event.clientY : event.clientX;
          const clickPercentage = this.calculatePercentage(coord);
          let clickValue: number;
          if (this.zMax() <= 1) {
            const [userMin, userMax] = [this.zMin(), this.zMax()];
            clickValue = userMin + (userMax - userMin) * clickPercentage;
          } else {
            clickValue = clamp(clickPercentage * 100, this.getMinMax());
          }

          const currentValues = this.values();
          const closestIndex = currentValues.reduce(
            (prev, curr, i) => (Math.abs(curr - clickValue) < Math.abs(currentValues[prev] - clickValue) ? i : prev),
            0,
          );

          this.activeThumbIndex.set(closestIndex);
          this.updateThumbFromPercentage(clickPercentage, closestIndex);
          this.onTouched();
          requestAnimationFrame(() => {
            thumbs[closestIndex]?.nativeElement.focus();
          });
        }
      }),
    );

    const pointerMove$ = fromEvent<PointerEvent>(this.document, 'pointermove');
    const pointerUp$ = fromEvent<PointerEvent>(this.document, 'pointerup');

    pointerDown$
      .pipe(
        switchMap(() =>
          pointerMove$.pipe(
            takeUntil(pointerUp$),
            map(event => {
              const coord = this.zOrientation() === 'vertical' ? event.clientY : event.clientX;
              return this.calculatePercentage(coord);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(percentage => {
        this.updateThumbFromPercentage(percentage, this.activeThumbIndex());
        this.onTouched();
      });

    this.setInitialValue();
  }

  writeValue(value: number | number[]): void {
    if (value == null) {
      this.setInitialValue();
      return;
    }

    const [min, max] = this.getMinMax();
    const step = this.zStep();

    const values = Array.isArray(value)
      ? value.map(v => roundToStep(clamp(v, [min, max]), min, step))
      : [roundToStep(clamp(value, [min, max]), min, step)];

    if (values.toString() === this.lastEmittedValue().toString()) {
      return;
    }

    this.lastEmittedValue.set(values);
    this.values.set(values);
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleKeydown(event: Event, thumbIndex: number): void {
    if (this.disabled()) {
      return;
    }

    const [min, max] = this.getMinMax();
    const currentValues = [...this.values()];
    const currentValue = currentValues[thumbIndex];
    let newValue = currentValue;

    const { key } = event as KeyboardEvent;

    switch (key) {
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      case 'ArrowLeft':
      case 'ArrowRight': {
        // horizontal keys follow the reading direction: in RTL the value grows towards the left
        const towardsEnd = (key === 'ArrowRight') !== this.isRtl();
        newValue = towardsEnd ? Math.min(currentValue + this.zStep(), max) : Math.max(currentValue - this.zStep(), min);
        break;
      }
      case 'ArrowDown':
        newValue = Math.max(currentValue - this.zStep(), min);
        break;
      case 'ArrowUp':
        newValue = Math.min(currentValue + this.zStep(), max);
        break;
      default:
        return;
    }

    if (currentValues.length > 1) {
      if (thumbIndex > 0) {
        newValue = Math.max(newValue, currentValues[thumbIndex - 1]);
      }
      if (thumbIndex < currentValues.length - 1) {
        newValue = Math.min(newValue, currentValues[thumbIndex + 1]);
      }
    }

    if (newValue !== currentValue) {
      currentValues[thumbIndex] = newValue;
      this.zSlideIndexChange.emit(currentValues);
      this.lastEmittedValue.set(currentValues);
      this.values.set(currentValues);
      this.onChange(currentValues);
    }
  }

  private updateThumbFromPercentage(percentage: number, thumbIndex: number): void {
    const [min, max] = this.getMinMax();
    let value: number;

    if (this.zMax() <= 1) {
      const [userMin, userMax] = [this.zMin(), this.zMax()];
      value = roundToStep(userMin + (userMax - userMin) * clamp(percentage, [0, 1]), userMin, this.zStep());
      value = clamp(value, [min, max]);
    } else {
      value = roundToStep(clamp(percentage * 100, [min, max]), min, this.zStep());
    }

    const currentValues = [...this.values()];

    if (currentValues.length > 1) {
      if (thumbIndex > 0) {
        value = Math.max(value, currentValues[thumbIndex - 1]);
      }
      if (thumbIndex < currentValues.length - 1) {
        value = Math.min(value, currentValues[thumbIndex + 1]);
      }
    }

    currentValues[thumbIndex] = value;

    if (currentValues.toString() !== this.lastEmittedValue().toString()) {
      this.zSlideIndexChange.emit(currentValues);
      this.lastEmittedValue.set(currentValues);
      this.values.set(currentValues);
      this.onChange(currentValues);
    }
  }

  private calculatePercentage(clientCoord: number): number {
    const rect = this.trackRef().nativeElement.getBoundingClientRect();
    if (this.zOrientation() === 'vertical') {
      const relativeY = (clientCoord - rect.top) / rect.height;
      return clamp(1 - relativeY, [0, 1]);
    }
    const relativeX = this.isRtl() ? (rect.right - clientCoord) / rect.width : (clientCoord - rect.left) / rect.width;
    return clamp(relativeX, [0, 1]);
  }

  private isRtl(): boolean {
    return this.directionality?.value === 'rtl';
  }

  private setInitialValue(): void {
    const [min, max] = this.getMinMax();
    const step = this.zStep();

    const rawValues = this.zValue();
    const defaults = this.zDefault();

    const count = Math.max(rawValues.length, defaults.length, 1);
    const values: number[] = [];

    for (let i = 0; i < count; i++) {
      const def = clamp(defaults[i] ?? min, [min, max]);
      const raw = rawValues[i];
      const value = raw !== undefined && raw >= min && raw <= max ? raw : def;
      values.push(roundToStep(value, min, step));
    }

    this.lastEmittedValue.set(values);
    this.values.set(values);
    this.thumbOffset.set(0);
  }

  private getMinMax(): [number, number] {
    return [Math.max(this.zMin(), 0), Math.min(this.zMax(), 100)];
  }
}
```

```angular-ts
import { cva } from 'class-variance-authority';

export const sliderVariants = cva(
  'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col',
);

export const sliderTrackVariants = cva(
  'bg-muted relative grow overflow-hidden rounded-full data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1',
);

export const sliderRangeVariants = cva('bg-primary absolute select-none data-horizontal:h-full data-vertical:w-full');

export const sliderThumbVariants = cva(
  'relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50',
);

export const sliderOrientationVariants = cva('absolute', {
  variants: {
    zOrientation: {
      horizontal: 'translate-x-[-50%] rtl:translate-x-[50%]',
      vertical: 'translate-y-[50%]',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});
```

```angular-ts
export * from './slider.component';
export * from './slider.imports';
export * from './slider.variants';
```

```angular-ts
/*
 * The alias, not a relative path: the Angular compiler re-emits these imports from
 * whichever module spreads the array, and it can only do that for a specifier the
 * consumer can resolve too. A relative path here fails with NG3004.
 */
import {
  ZardSliderComponent,
  ZardSliderRangeComponent,
  ZardSliderThumbComponent,
  ZardSliderTrackComponent,
} from '@/shared/components/slider/slider.component';

/** Every part of the slider component, for a template that uses more than one. */
export const ZardSliderImports = [
  ZardSliderComponent,
  ZardSliderTrackComponent,
  ZardSliderRangeComponent,
  ZardSliderThumbComponent,
] as const;
```

## Usage

```angular-ts
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';
```

```angular-html
<z-slider [zDefault]="50" [zMax]="100" [zStep]="1"></z-slider>
```

## Examples

### Range

Bind `[zDefault]` (or `[zValue]`) to a two-value array — `[lower, upper]` — for a range slider with two independently draggable thumbs.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-range',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="[25, 50]" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSliderRangeComponent {}
```

### Multiple Thumbs

Bind `[zDefault]` (or `[zValue]`) to an array with three or more values to render one thumb per entry.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-multiple',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center justify-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="[10, 20, 70]" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSliderMultipleComponent {}
```

### Vertical

Set `[zOrientation]="vertical"` for a vertical slider.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-vertical',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex h-50 w-full items-center justify-center">
      <div class="flex h-full w-20 justify-center gap-6">
        <z-slider [zDefault]="[50]" zOrientation="vertical" />
        <z-slider [zDefault]="[25]" zOrientation="vertical" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSliderVerticalComponent {}
```

### Controlled

Bind `[zValue]` and listen for `(zSlideIndexChange)` to drive the slider value from a signal.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-controlled',
  imports: [ZardSliderComponent, ...ZardFieldImports],
  template: `
    <div class="flex min-h-50 w-full flex-col items-center justify-center gap-2 p-10">
      <div class="mx-auto flex w-full max-w-xs justify-between">
        <label z-field-label for="slider-demo-temperature">Temperature</label>
        <span class="text-muted-foreground text-sm">{{ value().join(', ') }}</span>
      </div>
      <z-slider
        id="slider-demo-temperature"
        class="mx-auto w-full max-w-xs"
        zMin="0"
        zMax="1"
        zStep="0.1"
        [zValue]="value()"
        (zSlideIndexChange)="onSlide($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSliderControlledComponent {
  readonly value = signal([0.3, 0.7]);

  onSlide(value: number[]) {
    this.value.set(value.map(v => Math.round(v * 10) / 10));
  }
}
```

### Disabled

Use the `zDisabled` input to disable slider interaction.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-disabled',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="[50]" zDisabled />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSliderDisabledComponent {}
```

### Rtl

To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl).

```angular-ts
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSliderComponent } from '@/shared/components/slider/slider.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ volume: string; range: string }> = {
  en: {
    dir: 'ltr',
    values: {
      volume: 'Volume',
      range: 'Price range',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      volume: 'مستوى الصوت',
      range: 'نطاق السعر',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      volume: 'עוצמת קול',
      range: 'טווח מחירים',
    },
  },
};

@Component({
  selector: 'z-demo-slider-rtl',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex w-full max-w-xs flex-col gap-6">
      <div class="flex flex-col gap-3">
        <span class="text-sm font-medium">{{ i18n.t().volume }}</span>
        <z-slider [zDefault]="[75]" />
      </div>
      <div class="flex flex-col gap-3">
        <span class="text-sm font-medium">{{ i18n.t().range }}</span>
        <z-slider [zDefault]="[20, 60]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSliderRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
```

## API Reference

### z-slider

A flexible and accessible component that allows users to select a numeric value from within a configurable range using pointer or keyboard interaction. The value is always an array of numbers, one entry per thumb: a single-element array renders one thumb, two elements render a range (see the `range` example), and three or more render that many independent thumbs (see the `multiple-thumbs` example) — values must be provided in ascending order. Implements Angular’s `ControlValueAccessor`, so `formControlName` and `[(ngModel)]` also work. In RTL (CDK `Directionality`) the range fills from the right, ArrowRight decreases and ArrowLeft increases the value, and dragging follows the pointer.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[zMin]` | Minimum selectable value | `number` | `0` |
| `[zMax]` | Maximum selectable value. When zMax <= 1, values are automatically normalized to a 0-100% visual scale | `number` | `100` |
| `[zDefault]` | Uncontrolled initial value, read once. One number per thumb, ascending: [value] for a single thumb, [lower, upper] for a range, or more entries for additional thumbs. Ignored once [zValue] is bound | `number[]` | `[0]` |
| `[zValue]` | Controlled value — pair with (zSlideIndexChange) to own the value from the parent. Same shape as [zDefault]: one number per thumb, ascending | `number[]` | `[]` |
| `[zStep]` | Step increment for the value | `number` | `1` |
| `[zDisabled]` | Disables slider interaction | `boolean` | `false` |
| `[zOrientation]` | Slider orientation | `horizontal \| vertical` | `'horizontal'` |
| `(zSlideIndexChange)` | Emitted when a thumb value changes. Always emits the full array of current values | `EventEmitter<number[]>` | `-` |

---

[Open in browser](https://zardui.com/docs/components/slider)
