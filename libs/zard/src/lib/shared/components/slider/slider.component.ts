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
