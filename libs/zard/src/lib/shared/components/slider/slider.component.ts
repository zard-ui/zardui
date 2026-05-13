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
type OnChangeType = (value: number) => void;

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
    '[style.height]': '"inherit"',
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
    <span
      data-slot="slider-range"
      [attr.data-orientation]="orientation()"
      [class]="classes()"
      [style.left]="orientation() === 'horizontal' ? '0' : null"
      [style.right]="orientation() === 'horizontal' ? 100 - percent() + '%' : null"
      [style.bottom]="orientation() === 'vertical' ? '0' : null"
      [style.top]="orientation() === 'vertical' ? 100 - percent() + '%' : null"
    ></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZSliderRangeComponent {
  readonly percent = input(0);

  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sliderRangeVariants(), this.class()));
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
        <z-slider-range [orientation]="zOrientation()" [percent]="percentValue()" />
      </z-slider-track>

      <z-slider-thumb
        tabindex="0"
        [orientation]="zOrientation()"
        [percent]="percentValue()"
        [offset]="thumbOffset()"
        [value]="lastEmittedValue()"
        [min]="zMin()"
        [max]="zMax()"
        [disabled]="disabled()"
        (keydown.{home,end,arrowleft,arrowright,arrowdown,arrowup}.prevent)="handleKeydown($event)"
      />
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
  readonly zDefault = input(0, { transform: numberAttribute });
  readonly zValue = input(null, { transform: numberAttribute });
  readonly zStep = input(1, { transform: numberAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });

  readonly zOrientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');

  readonly zSlideIndexChange = output<number>();

  readonly thumbRef = viewChild.required(ZSliderThumbComponent);
  readonly trackRef = viewChild.required(ZSliderTrackComponent);

  protected readonly classes = computed(() => mergeClasses(sliderVariants(), this.class()));

  protected readonly disabled = linkedSignal(() => this.zDisabled());

  readonly percentValue = signal(50);
  readonly lastEmittedValue = signal(0);

  readonly thumbOffset = signal(0);

  private onTouched: OnTouchedType = noopFn;
  private onChange: OnChangeType = noopFn;

  constructor() {
    toObservable(this.zValue)
      .pipe(
        filter(value => value !== this.lastEmittedValue()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.setInitialValue());
  }

  ngAfterViewInit() {
    const pointerDown$ = fromEvent<PointerEvent>(this.elementRef.nativeElement, 'pointerdown').pipe(
      filter(() => !this.disabled()),
      tap(event => {
        const target = event.target as HTMLElement;
        const isThumb = this.thumbRef().nativeElement.contains(target);
        const isTrack = this.trackRef().nativeElement.contains(target);

        if (isTrack && !isThumb) {
          const coord = this.zOrientation() === 'vertical' ? event.clientY : event.clientX;
          const clickPercentage = this.calculatePercentage(coord);
          this.updateSliderFromPercentage(clickPercentage);
          this.onTouched();
          requestAnimationFrame(() => {
            this.thumbRef().nativeElement.focus();
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
        this.updateSliderFromPercentage(percentage);
        this.onTouched();
      });

    this.setInitialValue();
  }

  writeValue(value: number): void {
    if (value == null) {
      this.setInitialValue();
      return;
    }

    const min = this.zMin();
    const max = this.zMax();
    const step = this.zStep();

    const clampedValue = clamp(value, [min, max]);
    const roundedValue = roundToStep(clampedValue, min, step);

    if (roundedValue === this.lastEmittedValue()) {
      return;
    }

    this.percentValue.set(convertValueToPercentage(roundedValue, min, max));
    this.lastEmittedValue.set(roundedValue);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleKeydown(event: Event): void {
    if (this.disabled()) {
      return;
    }

    const percent = this.percentValue();
    const rawValue = this.zMin() + ((this.zMax() - this.zMin()) * percent) / 100;
    const currentValue = roundToStep(rawValue, this.zMin(), this.zStep());

    let newValue = currentValue;

    const { key } = event as KeyboardEvent;

    switch (key) {
      case 'Home':
        newValue = this.zMin();
        break;
      case 'End':
        newValue = this.zMax();
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(currentValue - this.zStep(), this.zMin());
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(currentValue + this.zStep(), this.zMax());
        break;

      default:
        return;
    }

    if (newValue !== currentValue) {
      this.percentValue.set(convertValueToPercentage(newValue, this.zMin(), this.zMax()));
      this.zSlideIndexChange.emit(newValue);
      this.lastEmittedValue.set(newValue);
      this.onChange(newValue);
    }
  }

  private updateSliderFromPercentage(percentage: number): void {
    const clamped = clamp(percentage, [0, 1]);
    const rawValue = this.zMin() + (this.zMax() - this.zMin()) * clamped;
    const value = roundToStep(rawValue, this.zMin(), this.zStep());

    if (value !== this.lastEmittedValue()) {
      this.percentValue.set(convertValueToPercentage(value, this.zMin(), this.zMax()));
      this.zSlideIndexChange.emit(value);
      this.lastEmittedValue.set(value);
      this.onChange(value);
    }
  }

  private calculatePercentage(clientCoord: number): number {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    if (this.zOrientation() === 'vertical') {
      const relativeY = (clientCoord - rect.top) / rect.height;
      return clamp(1 - relativeY, [0, 1]);
    }
    const relativeX = (clientCoord - rect.left) / rect.width;
    return clamp(relativeX, [0, 1]);
  }

  private setInitialValue(): void {
    const min = this.zMin();
    const max = this.zMax();
    const step = this.zStep();

    const def = clamp(this.zDefault(), [min, max]);
    const raw = this.zValue();
    const value = raw != null && raw >= min && raw <= max ? raw : def;

    const initial = roundToStep(value, min, step);
    this.percentValue.set(convertValueToPercentage(initial, min, max));
    this.lastEmittedValue.set(initial);
    this.thumbOffset.set(0);
  }
}
