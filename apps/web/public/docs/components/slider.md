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
import { DOCUMENT } from '@angular/common';
import {
  type AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
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

import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';
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
})
export class ZSliderTrackComponent {
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
})
export class ZSliderRangeComponent {
  readonly percent = input<number[]>([0]);

  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sliderRangeVariants(), this.class()));

  protected readonly segments = computed(() => {
    const p = this.percent();
    const isHorizontal = this.orientation() === 'horizontal';

    const make = (left: string, right: string) =>
      isHorizontal ? { left, right, bottom: null, top: null } : { left: null, right: null, bottom: left, top: right };

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
    '[style.left]': 'orientation() === "horizontal" ? "calc(" + percent() + "% + " + offset() + "px)" : null',
    '[style.bottom]': 'orientation() === "vertical" ? "calc(" + percent() + "% + " + offset() + "px)" : null',
  },
})
export class ZSliderThumbComponent {
  readonly value = input(0);
  readonly min = input(0);
  readonly max = input(100);
  readonly disabled = input(false);
  readonly percent = input(0);
  readonly offset = input(0);

  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sliderThumbVariants(), this.class()));

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
  imports: [ZSliderTrackComponent, ZSliderRangeComponent, ZSliderThumbComponent],
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

  readonly zMin = input(0, { transform: numberAttribute });
  readonly zMax = input(100, { transform: numberAttribute });
  readonly zDefault = input<number[]>([0]);
  readonly zValue = input<number[]>([]);
  readonly zStep = input(1, { transform: numberAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });

  readonly zOrientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');

  readonly zSlideIndexChange = output<number[]>();

  readonly thumbRefs = viewChildren(ZSliderThumbComponent);
  readonly trackRef = viewChild.required(ZSliderTrackComponent);

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
      case 'ArrowDown':
        newValue = Math.max(currentValue - this.zStep(), min);
        break;
      case 'ArrowRight':
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
    const relativeX = (clientCoord - rect.left) / rect.width;
    return clamp(relativeX, [0, 1]);
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
      horizontal: 'translate-x-[-50%]',
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
export * from './slider.variants';
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

Use an array with two values for a range slider.

```angular-ts
import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-range',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="[25, 50]" />
    </div>
  `,
})
export class ZardDemoSliderRangeComponent {}
```

### Multiple Thumbs

Use an array with multiple values for multiple thumbs.

```angular-ts
import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-multiple',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center justify-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="[10, 20, 70]" />
    </div>
  `,
})
export class ZardDemoSliderMultipleComponent {}
```

### Vertical

Use zOrientation="vertical" for a vertical slider.

```angular-ts
import { Component } from '@angular/core';

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
})
export class ZardDemoSliderVerticalComponent {}
```

### Controlled

```angular-ts
import { Component, signal } from '@angular/core';

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
})
export class ZardDemoSliderControlledComponent {
  readonly value = signal([0.3, 0.7]);

  onSlide(value: number[]) {
    this.value.set(value.map(v => Math.round(v * 10) / 10));
  }
}
```

### Disabled

Use zDisabled prop to disable the slider.

```angular-ts
import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-disabled',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="[50]" zDisabled />
    </div>
  `,
})
export class ZardDemoSliderDisabledComponent {}
```

## API Reference

### [z-slider]

A flexible and accessible component that allows users to select a numeric value from within a configurable range using pointer or keyboard interaction. Supports single value or range (two thumbs) by passing an array with two values.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[zMin]` | Minimum selectable value | `number` | `0` |
| `[zMax]` | Maximum selectable value. When zMax <= 1, values are automatically normalized to a 0-100% visual scale | `number` | `100` |
| `[zDefault]` | Default value(s) when zValue is absent. Single thumb: [value]. Range: [lower, upper] | `number[]` | `[0]` |
| `[zValue]` | Controlled value input. Single thumb: [value]. Range: [lower, upper] | `number[]` | `[]` |
| `[zStep]` | Step increment for the value | `number` | `1` |
| `[zDisabled]` | Disables slider interaction | `boolean` | `false` |
| `[zOrientation]` | Slider orientation | `horizontal \| vertical` | `'horizontal'` |
| `(zSlideIndexChange)` | Emitted when a thumb value changes. Always emits the full array of current values | `number[]` | `-` |

---

[Open in browser](https://zardui.com/docs/components/slider)
