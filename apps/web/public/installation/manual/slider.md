### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">slider.component.ts

```angular-ts showLineNumbers
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  ViewChild,
  ViewEncapsulation,
  numberAttribute,
  booleanAttribute,
  forwardRef,
  AfterViewInit,
  computed,
  linkedSignal,
  SimpleChanges,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { fromEvent, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClassValue } from 'class-variance-authority/dist/types';
import { CommonModule, DOCUMENT } from '@angular/common';

import { sliderOrientationVariants, sliderRangeVariants, sliderThumbVariants, sliderTrackVariants, sliderVariants } from './slider.variants';
import { clamp, roundToStep, convertValueToPercentage } from '../../shared/utils/number';
import { mergeClasses } from '../../shared/utils/utils';

type OnTouchedType = () => void;
type OnChangeType = (value: number) => void;

@Component({
  selector: 'z-slider-track',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  template: `
    <span #track data-slot="slider-track" [attr.data-orientation]="orientation()" [class]="classes()">
      <ng-content></ng-content>
    </span>
  `,
  host: {
    '[class]': '"data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full"',
    '[attr.data-orientation]': 'orientation()',
  },
})
export class ZSliderTrackComponent {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sliderTrackVariants({ zOrientation: this.orientation() }), this.class()));

  @ViewChild('track', { static: true }) private readonly trackEl!: ElementRef<HTMLElement>;

  get nativeElement(): HTMLElement {
    return this.trackEl.nativeElement;
  }
}

@Component({
  selector: 'z-slider-range',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
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
})
export class ZSliderRangeComponent {
  readonly percent = input(0);

  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sliderRangeVariants({ zOrientation: this.orientation() }), this.class()));
}

@Component({
  selector: 'z-slider-thumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
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
  protected readonly orientationClasses = computed(() => mergeClasses(sliderOrientationVariants({ zOrientation: this.orientation() })));

  @ViewChild('thumb', { static: true }) private readonly thumbEl!: ElementRef<HTMLElement>;

  get nativeElement(): HTMLElement {
    return this.thumbEl.nativeElement;
  }
}

@Component({
  selector: 'z-slider',
  exportAs: 'zSlider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ZSliderTrackComponent, ZSliderRangeComponent, ZSliderThumbComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardSliderComponent),
      multi: true,
    },
  ],
  template: `
    <span
      data-slot="slider"
      [attr.data-orientation]="zOrientation()"
      class="flex data-[orientation=horizontal]:items-center data-[orientation=vertical]:justify-center data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full"
    >
      <z-slider-track [orientation]="zOrientation()">
        <z-slider-range [orientation]="zOrientation()" [percent]="percentValue()"></z-slider-range>
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
        (keydown)="handleKeydown($event)"
      ></z-slider-thumb>
    </span>
  `,
  host: {
    '[class]': 'classes()',
    '[attr.data-orientation]': 'zOrientation()',
    '[attr.aria-disabled]': 'disabled() ? true : null',
    '[attr.data-disabled]': 'disabled() ? true : null',
  },
})
export class ZardSliderComponent implements ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy {
  readonly zMin = input(0, { transform: numberAttribute });
  readonly zMax = input(100, { transform: numberAttribute });
  readonly zDefault = input(0, { transform: numberAttribute });
  readonly zValue = input(null, { transform: numberAttribute });
  readonly zStep = input(1, { transform: numberAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });

  readonly zOrientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<ClassValue>('');

  readonly onSlide = output<number>();

  @ViewChild(ZSliderThumbComponent, { static: true }) thumbRef!: ElementRef<HTMLElement>;
  @ViewChild(ZSliderTrackComponent, { static: true }) trackRef!: ElementRef<HTMLElement>;

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  private document = inject(DOCUMENT);

  protected readonly classes = computed(() => mergeClasses(sliderVariants({ orientation: this.zOrientation() }), this.class()));
  protected disabled = linkedSignal(() => this.zDisabled());

  readonly percentValue = signal(50);
  readonly lastEmittedValue = signal(0);

  readonly thumbOffset = signal(0);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouchedType = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: OnChangeType = (value: number) => {};

  private destroy$ = new Subject<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if ('zValue' in changes && !changes['zValue'].firstChange) {
      const value = this.zValue();
      if (value !== this.lastEmittedValue()) {
        this.setInitialValue();
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    const pointerDown$ = fromEvent<PointerEvent>(this.elementRef.nativeElement, 'pointerdown').pipe(
      tap(event => {
        if (this.disabled()) return;

        const target = event.target as HTMLElement;
        const isThumb = this.thumbRef.nativeElement.contains(target);
        const isTrack = this.trackRef.nativeElement.contains(target);

        if (isTrack && !isThumb) {
          const coord = this.zOrientation() === 'vertical' ? event.clientY : event.clientX;
          const clickPercentage = this.calculatePercentage(coord);
          this.updateSliderFromPercentage(clickPercentage);
          this.onTouched();
          requestAnimationFrame(() => {
            this.thumbRef.nativeElement.focus();
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
            takeUntil(this.destroy$),
            map(event => {
              const coord = this.zOrientation() === 'vertical' ? event.clientY : event.clientX;
              return this.calculatePercentage(coord);
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(percentage => {
        if (this.disabled()) return;
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

    if (roundedValue === this.lastEmittedValue()) return;

    this.percentValue.set(convertValueToPercentage(roundedValue, min, max));
    this.lastEmittedValue.set(roundedValue);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  handleKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    const percent = this.percentValue();
    const rawValue = this.zMin() + ((this.zMax() - this.zMin()) * percent) / 100;
    const currentValue = roundToStep(rawValue, this.zMin(), this.zStep());

    let newValue = currentValue;

    switch (event.key) {
      case 'Home':
        newValue = this.zMin();
        break;
      case 'End':
        newValue = this.zMax();
        break;
      case 'ArrowLeft':
        newValue = Math.max(currentValue - this.zStep(), this.zMin());
        break;
      case 'ArrowRight':
        newValue = Math.min(currentValue + this.zStep(), this.zMax());
        break;
      case 'ArrowDown':
        newValue = Math.max(currentValue - this.zStep(), this.zMin());
        break;
      case 'ArrowUp':
        newValue = Math.min(currentValue + this.zStep(), this.zMax());
        break;
      default:
        return;
    }

    this.percentValue.set(convertValueToPercentage(newValue, this.zMin(), this.zMax()));
    this.onSlide.emit(newValue);
    this.lastEmittedValue.set(newValue);
    this.onChange(newValue);
    this.cdr.markForCheck();
    event.preventDefault();
  }

  private updateSliderFromPercentage(percentage: number): void {
    const clamped = clamp(percentage, [0, 1]);
    const rawValue = this.zMin() + (this.zMax() - this.zMin()) * clamped;
    const value = roundToStep(rawValue, this.zMin(), this.zStep());

    if (value !== this.lastEmittedValue()) {
      this.percentValue.set(convertValueToPercentage(value, this.zMin(), this.zMax()));
      this.onSlide.emit(value);
      this.lastEmittedValue.set(value);
      this.onChange(value);
      this.cdr.markForCheck();
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

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">slider.variants.ts

```angular-ts showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const sliderVariants = cva(
  'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
  {
    variants: {
      orientation: {
        horizontal: 'items-center',
        vertical: 'flex-col h-full min-h-44 w-auto',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      disabled: false,
    },
  },
);

export type SliderVariants = VariantProps<typeof sliderVariants>;

export const sliderTrackVariants = cva(
  'flex bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
  {
    variants: {
      zOrientation: {
        horizontal: 'h-1.5 w-full',
        vertical: 'w-1.5 h-full min-h-44',
      },
    },
    defaultVariants: {
      zOrientation: 'horizontal',
    },
  },
);

export type SliderTrackVariants = VariantProps<typeof sliderTrackVariants>;

export const sliderRangeVariants = cva('bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full', {
  variants: {
    zOrientation: {
      horizontal: 'h-full',
      vertical: 'w-full',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type SliderRangeVariants = VariantProps<typeof sliderRangeVariants>;

export const sliderThumbVariants = cva(
  'border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
);

export type SliderThumbVariants = VariantProps<typeof sliderThumbVariants>;

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

export type SliderOrientationVariants = VariantProps<typeof sliderOrientationVariants>;

```

