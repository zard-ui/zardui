---
title: Carousel
description: A carousel with motion and swipe built using Embla.
---

# Carousel

A carousel with motion and swipe built using Embla.

## About

The carousel is built using the Embla Carousel library.

[Embla Carousel](https://www.embla-carousel.com/)

## Installation

### CLI

```bash
npx zard-cli@latest add carousel
```

### Manual

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  ViewEncapsulation,
  output,
  computed,
  viewChild,
  type InputSignal,
  type Signal,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight, lucideCircleSmall } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';
import type { EmblaCarouselType, EmblaEventType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
import { EmblaCarouselDirective } from 'embla-carousel-angular';

import { ZardButtonComponent } from '@/shared/components/button';
import {
  carouselNextButtonVariants,
  carouselPreviousButtonVariants,
  carouselVariants,
  type ZardCarouselControlsVariants,
  type ZardCarouselOrientationVariants,
} from '@/shared/components/carousel/carousel.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-carousel',
  imports: [EmblaCarouselDirective, ZardButtonComponent, NgIcon],
  template: `
    <div class="relative">
      <div
        emblaCarousel
        #emblaRef="emblaCarousel"
        [class]="classes()"
        [options]="options()"
        [plugins]="zPlugins()"
        [subscribeToEvents]="subscribeToEvents"
        (emblaChange)="onEmblaChange($event, emblaRef.emblaApi!)"
        aria-roledescription="carousel"
        role="region"
        tabindex="0"
      >
        <ng-content />

        @let controls = zControls();
        @if (controls === 'button') {
          <button
            type="button"
            z-button
            zType="outline"
            [class]="prevBtnClasses()"
            [zDisabled]="!canScrollPrev()"
            (click)="slidePrevious()"
            aria-label="Previous slide"
          >
            <ng-icon name="lucideChevronLeft" class="size-4!" />
          </button>
          <button
            type="button"
            z-button
            zType="outline"
            [class]="nextBtnClasses()"
            [zDisabled]="!canScrollNext()"
            (click)="slideNext()"
            aria-label="Next slide"
          >
            <ng-icon name="lucideChevronRight" class="size-4!" />
          </button>
        } @else if (controls === 'dot') {
          <div class="mt-2 flex justify-center gap-1">
            @for (dot of dots(); track $index) {
              <button
                type="button"
                [class]="
                  'block size-4 border-0 bg-transparent p-0 ' +
                  ($index === selectedIndex() ? 'cursor-default' : 'cursor-pointer')
                "
                (click)="goTo($index)"
                [attr.aria-current]="$index === selectedIndex() ? 'true' : null"
                [aria-label]="'Go to slide ' + ($index + 1)"
              >
                <ng-icon
                  name="lucideCircleSmall"
                  [strokeWidth]="0"
                  [class]="$index === selectedIndex() ? '[&_svg]:fill-primary' : '[&_svg]:fill-border'"
                />
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronRight,
      lucideCircleSmall,
    }),
  ],
  host: {
    '(keydown.arrowleft.prevent)': 'slidePrevious()',
    '(keydown.arrowright.prevent)': 'slideNext()',
  },
})
export class ZardCarouselComponent {
  protected readonly emblaRef = viewChild(EmblaCarouselDirective);

  readonly class = input<ClassValue>('');
  readonly zOptions: InputSignal<EmblaOptionsType> = input<EmblaOptionsType>({ loop: false });
  readonly zPlugins: InputSignal<EmblaPluginType[]> = input<EmblaPluginType[]>([]);
  readonly zOrientation = input<ZardCarouselOrientationVariants>('horizontal');
  readonly zControls = input<ZardCarouselControlsVariants>('button');
  readonly zInited = output<EmblaCarouselType>();
  readonly zSelected = output<void>();

  protected readonly selectedIndex = signal<number>(0);
  protected readonly canScrollPrev = signal<boolean>(false);
  protected readonly canScrollNext = signal<boolean>(false);
  protected readonly scrollSnaps = signal<number[]>([]);
  protected readonly subscribeToEvents: EmblaEventType[] = ['init', 'select', 'reInit'];
  protected readonly options: Signal<EmblaOptionsType> = computed(() => ({
    ...this.zOptions(),
    axis: this.zOrientation() === 'horizontal' ? 'x' : 'y',
  }));

  protected readonly dots = computed(() => new Array<string>(this.scrollSnaps().length).fill('.'));

  #index = -1;

  onEmblaChange(type: EmblaEventType, emblaApi: EmblaCarouselType): void {
    if (type === 'init' || type === 'reInit') {
      this.scrollSnaps.set(emblaApi.scrollSnapList());
      this.checkNavigation(emblaApi);
      if (type === 'init') {
        this.zInited.emit(emblaApi);
      }
      return;
    }

    if (type === 'select' && emblaApi.selectedScrollSnap() !== this.#index) {
      this.checkNavigation(emblaApi);
      this.zSelected.emit();
    }
  }

  slidePrevious(): void {
    const emblaRef = this.emblaRef();
    if (emblaRef) {
      emblaRef.scrollPrev();
    }
  }

  slideNext(): void {
    const emblaRef = this.emblaRef();
    if (emblaRef) {
      emblaRef.scrollNext();
    }
  }

  goTo(index: number): void {
    const emblaRef = this.emblaRef();
    if (emblaRef) {
      emblaRef.scrollTo(index);
    }
  }

  private checkNavigation(emblaApi: EmblaCarouselType): void {
    this.#index = emblaApi.selectedScrollSnap();
    this.selectedIndex.set(emblaApi.selectedScrollSnap());
    this.canScrollPrev.set(emblaApi.canScrollPrev());
    this.canScrollNext.set(emblaApi.canScrollNext());
  }

  protected readonly classes = computed(() =>
    mergeClasses(carouselVariants({ zOrientation: this.zOrientation() }), this.class()),
  );

  protected readonly prevBtnClasses = computed(() =>
    mergeClasses(carouselPreviousButtonVariants({ zOrientation: this.zOrientation() })),
  );

  protected readonly nextBtnClasses = computed(() =>
    mergeClasses(carouselNextButtonVariants({ zOrientation: this.zOrientation() })),
  );
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const carouselVariants = cva('overflow-hidden', {
  variants: {
    zOrientation: {
      horizontal: '',
      vertical: 'h-full',
    },
    zControls: {
      none: '',
      button: '',
      dot: '',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselContentVariants = cva('flex', {
  variants: {
    zOrientation: {
      horizontal: '-ml-4',
      vertical: '-mt-4 flex-col',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselItemVariants = cva('min-w-0 shrink-0 grow-0 basis-full', {
  variants: {
    zOrientation: {
      horizontal: 'pl-4',
      vertical: 'pt-4',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselPreviousButtonVariants = cva('absolute size-8 touch-manipulation rounded-full px-0', {
  variants: {
    zOrientation: {
      horizontal: 'top-1/2 -left-12 -translate-y-1/2',
      vertical: '-top-12 left-1/2 -translate-x-1/2 rotate-90',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselNextButtonVariants = cva('absolute size-8 touch-manipulation rounded-full px-0', {
  variants: {
    zOrientation: {
      horizontal: 'top-1/2 -right-12 -translate-y-1/2',
      vertical: '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardCarouselOrientationVariants = NonNullable<VariantProps<typeof carouselVariants>['zOrientation']>;
export type ZardCarouselControlsVariants = NonNullable<VariantProps<typeof carouselVariants>['zControls']>;
```

```angular-ts
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';

import { type ClassValue } from 'clsx';

import { ZardCarouselComponent } from '@/shared/components/carousel/carousel.component';
import { carouselContentVariants } from '@/shared/components/carousel/carousel.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-carousel-content',
  imports: [],
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardCarouselContentComponent {
  readonly #parent = inject(ZardCarouselComponent);
  readonly #orientation = computed<'horizontal' | 'vertical'>(() => this.#parent.zOrientation());
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() =>
    mergeClasses(carouselContentVariants({ zOrientation: this.#orientation() }), this.class()),
  );
}
```

```angular-ts
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';

import { type ClassValue } from 'clsx';

import { ZardCarouselComponent } from '@/shared/components/carousel/carousel.component';
import { carouselItemVariants } from '@/shared/components/carousel/carousel.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-carousel-item',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    role: 'group',
    'aria-roledescription': 'slide',
  },
})
export class ZardCarouselItemComponent {
  readonly #parent = inject(ZardCarouselComponent);

  readonly #orientation = computed<'horizontal' | 'vertical'>(() => this.#parent.zOrientation());
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() =>
    mergeClasses(carouselItemVariants({ zOrientation: this.#orientation() }), this.class()),
  );
}
```

```angular-ts
import { Injectable } from '@angular/core';

// Do pacote base, não do wrapper Angular: ele re-exportava esses tipos na v21 e
// parou na v22. Por isso `embla-carousel` é dependência declarada do componente.
import type { EmblaPluginType } from 'embla-carousel';

/**
 * Service to create and manage Embla Carousel plugins
 */
@Injectable({
  providedIn: 'root',
})
export class ZardCarouselPluginsService {
  /**
   * Creates an autoplay plugin for the carousel
   */
  async createAutoplayPlugin(
    options: {
      delay?: number; // ms
      jump?: boolean;
      stopOnInteraction?: boolean;
      stopOnMouseEnter?: boolean;
      playOnInit?: boolean;
      rootNode?: (emblaRoot: HTMLElement) => HTMLElement | null;
    } = {},
  ) {
    try {
      const AutoplayModule = await import('embla-carousel-autoplay');
      const Autoplay = AutoplayModule.default;
      return Autoplay(options);
    } catch (err) {
      console.error('Error loading Autoplay plugin:', err);
      throw new Error('Make sure embla-carousel-autoplay is installed.');
    }
  }

  /**
   * Helper method to create autoplay plugin with HTMLElement
   * Converts HTMLElement to the function format expected by Embla
   */
  async createAutoplayPluginWithElement(
    options: {
      delay?: number;
      jump?: boolean;
      stopOnInteraction?: boolean;
      stopOnMouseEnter?: boolean;
      playOnInit?: boolean;
      rootElement?: HTMLElement;
    } = {},
  ) {
    const { rootElement, ...restOptions } = options;
    const autoplayOptions = {
      ...restOptions,
      ...(rootElement && {
        rootNode: () => rootElement,
      }),
    };

    return this.createAutoplayPlugin(autoplayOptions);
  }

  /**
   * Creates a class names plugin for the carousel
   */
  async createClassNamesPlugin(
    options: {
      selected?: string;
      dragging?: string;
      draggable?: string;
    } = {},
  ): Promise<EmblaPluginType> {
    try {
      const ClassNamesModule = await import('embla-carousel-class-names');
      const ClassNames = ClassNamesModule.default;
      return ClassNames(options);
    } catch (err) {
      console.error('Error loading ClassNames plugin:', err);
      throw new Error('Make sure embla-carousel-class-names is installed.');
    }
  }

  /**
   * Creates a wheel gestures plugin for the carousel
   */
  async createWheelGesturesPlugin(
    options: {
      wheelDraggingClass?: string;
      forceWheelAxis?: 'x' | 'y';
      target?: Element;
    } = {},
  ) {
    try {
      const { WheelGesturesPlugin } = await import('embla-carousel-wheel-gestures');
      return WheelGesturesPlugin(options);
    } catch (err) {
      console.error('Error loading WheelGestures plugin:', err);
      throw new Error('Make sure embla-carousel-wheel-gestures is installed.');
    }
  }
}
```

```angular-ts
import { ZardCarouselContentComponent } from '@/shared/components/carousel/carousel-content.component';
import { ZardCarouselItemComponent } from '@/shared/components/carousel/carousel-item.component';
import { ZardCarouselComponent } from '@/shared/components/carousel/carousel.component';

export const ZardCarouselImports = [
  ZardCarouselComponent,
  ZardCarouselContentComponent,
  ZardCarouselItemComponent,
] as const;
```

```angular-ts
export * from '@/shared/components/carousel/carousel.component';
export * from '@/shared/components/carousel/carousel-content.component';
export * from '@/shared/components/carousel/carousel-item.component';
export * from '@/shared/components/carousel/carousel-plugins.service';
export * from '@/shared/components/carousel/carousel.variants';
export * from '@/shared/components/carousel/carousel.imports';
```

## Usage

```angular-ts
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';
```

```angular-html
<z-carousel>
  <z-carousel-content>
    <z-carousel-item>Slide 1</z-carousel-item>
    <z-carousel-item>Slide 2</z-carousel-item>
    <z-carousel-item>Slide 3</z-carousel-item>
  </z-carousel-content>
</z-carousel>
```

## Examples

### Sizes

To set the size of the items, you can use the `basis` utility class on the `<z-carousel-item />`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';

@Component({
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <div class="w-full max-w-[12rem] sm:max-w-xs md:max-w-sm">
      <z-carousel [zOptions]="{ align: 'start' }">
        <z-carousel-content>
          @for (slide of slides; track slide) {
            <z-carousel-item class="basis-1/2 lg:basis-1/3">
              <div class="p-1">
                <z-card>
                  <z-card-content class="flex aspect-square items-center justify-center p-6">
                    <span class="text-3xl font-semibold">{{ slide }}</span>
                  </z-card-content>
                </z-card>
              </div>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCarouselSizeComponent {
  protected slides = ['1', '2', '3', '4', '5'];
}
```

```angular-html
<!-- 33% of the carousel width. -->
<z-carousel>
  <z-carousel-content>
    <z-carousel-item class="basis-1/3">...</z-carousel-item>
    <z-carousel-item class="basis-1/3">...</z-carousel-item>
    <z-carousel-item class="basis-1/3">...</z-carousel-item>
  </z-carousel-content>
</z-carousel>
```

```angular-html
<!-- 50% on small screens and 33% on larger screens. -->
<z-carousel>
  <z-carousel-content>
    <z-carousel-item class="md:basis-1/2 lg:basis-1/3">...</z-carousel-item>
    <z-carousel-item class="md:basis-1/2 lg:basis-1/3">...</z-carousel-item>
    <z-carousel-item class="md:basis-1/2 lg:basis-1/3">...</z-carousel-item>
  </z-carousel-content>
</z-carousel>
```

### Spacing

To set the spacing between the items, we use a `pl-[VALUE]` utility on the `<z-carousel-item />` and a negative `-ml-[VALUE]` on the `<z-carousel-content />`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';

@Component({
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <div class="w-full max-w-[12rem] sm:max-w-xs md:max-w-sm">
      <z-carousel>
        <z-carousel-content class="-ml-1">
          @for (slide of slides; track slide) {
            <z-carousel-item class="basis-1/2 pl-1 lg:basis-1/3">
              <div class="p-1">
                <z-card>
                  <z-card-content class="flex aspect-square items-center justify-center p-6">
                    <span class="text-2xl font-semibold">{{ slide }}</span>
                  </z-card-content>
                </z-card>
              </div>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCarouselSpacingComponent {
  protected slides = ['1', '2', '3', '4', '5'];
}
```

```angular-html
<z-carousel>
  <z-carousel-content class="-ml-4">
    <z-carousel-item class="pl-4">...</z-carousel-item>
    <z-carousel-item class="pl-4">...</z-carousel-item>
    <z-carousel-item class="pl-4">...</z-carousel-item>
  </z-carousel-content>
</z-carousel>
```

```angular-html
<z-carousel>
  <z-carousel-content class="-ml-2 md:-ml-4">
    <z-carousel-item class="pl-2 md:pl-4">...</z-carousel-item>
    <z-carousel-item class="pl-2 md:pl-4">...</z-carousel-item>
    <z-carousel-item class="pl-2 md:pl-4">...</z-carousel-item>
  </z-carousel-content>
</z-carousel>
```

### Orientation

Use the `zOrientation` input to set the orientation of the carousel.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';

@Component({
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <div class="w-full min-w-xs">
      <z-carousel [zOptions]="{ align: 'start' }" zOrientation="vertical">
        <z-carousel-content class="-mt-1 h-[270px]">
          @for (slide of slides; track slide) {
            <z-carousel-item class="basis-1/2 pt-1">
              <div class="p-1">
                <z-card>
                  <z-card-content class="flex items-center justify-center p-6">
                    <span class="text-3xl font-semibold">{{ slide }}</span>
                  </z-card-content>
                </z-card>
              </div>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCarouselOrientationComponent {
  protected slides = ['1', '2', '3', '4', '5'];
}
```

```angular-html
<z-carousel zOrientation="vertical | horizontal">
  <z-carousel-content>
    <z-carousel-item>...</z-carousel-item>
    <z-carousel-item>...</z-carousel-item>
    <z-carousel-item>...</z-carousel-item>
  </z-carousel-content>
</z-carousel>
```

## API Reference

### z-carousel

A carousel component with slide controls and swipe gesture support.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zOptions]` | Embla Carousel configuration options | `EmblaOptionsType` | `{loop: false}` |
| `[zPlugins]` | Embla Carousel plugins | `EmblaPluginType[]` | `[]` |
| `[zOrientation]` | Carousel orientation | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `[zControls]` | Navigation type buttons | `'button' \| 'dot' \| 'none'` | `'button'` |
| `(zInited)` | Emits Embla API when carousel is initialized | `EmblaCarouselType` | `-` |
| `(zSelected)` | Emitted when a slide is selected | `void` | `-` |

### z-carousel-content

The content container for the carousel.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-carousel-item

An individual carousel item.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/carousel)
