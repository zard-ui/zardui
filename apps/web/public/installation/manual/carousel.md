

```angular-ts title="carousel.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, input, signal, ViewEncapsulation, output, computed, viewChild } from '@angular/core';

import { type ClassValue } from 'clsx';
import type { EmblaCarouselType, EmblaEventType, EmblaPluginType, EmblaOptionsType } from 'embla-carousel';
import { EmblaCarouselDirective } from 'embla-carousel-angular';

import { carouselNextButtonVariants, carouselPreviousButtonVariants, carouselVariants } from './carousel.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { ZardButtonComponent } from '../button/button.component';
import { ZardIconComponent } from '../icon/icon.component';

@Component({
  selector: 'z-carousel',
  imports: [EmblaCarouselDirective, ZardButtonComponent, ZardIconComponent],
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
        <ng-content></ng-content>

        @if (zShowControls()) {
          <button z-button zType="outline" [class]="prevBtnClasses()" [disabled]="!canScrollPrev()" (click)="slidePrevious()" aria-label="Previous slide">
            <z-icon zType="chevron-left" class="size-4" />
          </button>
          <button z-button zType="outline" [class]="nextBtnClasses()" [disabled]="!canScrollNext()" (click)="slideNext()" aria-label="Next slide">
            <z-icon zType="chevron-right" class="size-4" />
          </button>
        }
      </div>
    </div>
  `,
  host: { '(keydown)': 'handleKeyDown($event)' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardCarouselComponent {
  protected readonly emblaRef = viewChild(EmblaCarouselDirective);

  // Public signals and outputs
  readonly class = input<ClassValue>('');
  readonly zOptions = input<EmblaOptionsType>({ loop: false });
  readonly zPlugins = input<EmblaPluginType[]>([]);
  readonly zOrientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly zShowControls = input<boolean>(true);
  readonly zInited = output<EmblaCarouselType>();
  readonly zSelected = output<void>();

  // State signals
  protected readonly selectedIndex = signal<number>(0);
  protected readonly canScrollPrev = signal<boolean>(false);
  protected readonly canScrollNext = signal<boolean>(false);
  protected readonly scrollSnaps = signal<number[]>([]);
  protected readonly subscribeToEvents: EmblaEventType[] = ['init', 'select', 'reInit'];
  protected readonly options = computed(() => ({ ...this.zOptions(), axis: this.zOrientation() === 'horizontal' ? 'x' : 'y' }) as EmblaOptionsType);

  #index = -1;

  onEmblaChange(type: EmblaEventType, emblaApi: EmblaCarouselType): void {
    if (type === 'init') {
      this.scrollSnaps.set(emblaApi.scrollSnapList());
      this.checkNavigation(emblaApi);
      this.zInited.emit(emblaApi);
    }

    if (type === 'select' && emblaApi.selectedScrollSnap() !== this.#index) {
      this.checkNavigation(emblaApi);
      this.zSelected.emit();
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.slidePrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.slideNext();
        break;
    }
  }

  protected slidePrevious(): void {
    const emblaRef = this.emblaRef();
    if (emblaRef) {
      emblaRef.scrollPrev();
    }
  }

  protected slideNext(): void {
    const emblaRef = this.emblaRef();
    if (emblaRef) {
      emblaRef.scrollNext();
    }
  }

  private checkNavigation(emblaApi: EmblaCarouselType): void {
    this.#index = emblaApi.selectedScrollSnap();
    this.selectedIndex.set(emblaApi.selectedScrollSnap());
    this.canScrollPrev.set(emblaApi.canScrollPrev());
    this.canScrollNext.set(emblaApi.canScrollNext());
  }

  protected readonly classes = computed(() => mergeClasses(carouselVariants({ zOrientation: this.zOrientation() }), this.class()));
  protected readonly prevBtnClasses = computed(() => mergeClasses(carouselPreviousButtonVariants({ zOrientation: this.zOrientation() })));
  protected readonly nextBtnClasses = computed(() => mergeClasses(carouselNextButtonVariants({ zOrientation: this.zOrientation() })));
}

```



```angular-ts title="carousel.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const carouselVariants = cva('overflow-hidden', {
  variants: {
    zOrientation: {
      horizontal: '',
      vertical: 'h-full',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselContentVariants = cva('flex', {
  variants: {
    zOrientation: {
      horizontal: '-ml-4 mr-0.5',
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
      vertical: 'pt-4.5',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselPreviousButtonVariants = cva('absolute size-8 rounded-full', {
  variants: {
    zOrientation: {
      horizontal: 'top-1/2 -left-12.5 -translate-y-1/2',
      vertical: '-top-12 left-1/2 -translate-x-1/2 rotate-90',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselNextButtonVariants = cva('absolute size-8 rounded-full', {
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

export type ZardCarouselVariants = VariantProps<typeof carouselVariants>;
export type ZardCarouselContentVariants = VariantProps<typeof carouselContentVariants>;
export type ZardCarouselItemVariants = VariantProps<typeof carouselItemVariants>;
export type ZardCarouselPreviousButtonVariants = VariantProps<typeof carouselPreviousButtonVariants>;
export type ZardCarouselNextButtonVariants = VariantProps<typeof carouselNextButtonVariants>;

```



```angular-ts title="carousel-content.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';

import { type ClassValue } from 'clsx';

import { ZardCarouselComponent } from './carousel.component';
import { carouselContentVariants } from './carousel.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-carousel-content',
  imports: [],
  template: ` <ng-content></ng-content> `,
  host: {
    '[class]': 'classes()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardCarouselContentComponent {
  readonly #parent = inject(ZardCarouselComponent);
  readonly #orientation = computed<'horizontal' | 'vertical'>(() => this.#parent.zOrientation());
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(carouselContentVariants({ zOrientation: this.#orientation() }), this.class()));
}

```



```angular-ts title="carousel-item.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';

import { type ClassValue } from 'clsx';

import { ZardCarouselComponent } from './carousel.component';
import { carouselItemVariants } from './carousel.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-carousel-item',
  imports: [],
  template: ` <ng-content></ng-content> `,
  host: {
    '[class]': 'classes()',
    role: 'group',
    'aria-roledescription': 'slide',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardCarouselItemComponent {
  readonly #parent = inject(ZardCarouselComponent);

  readonly #orientation = computed<'horizontal' | 'vertical'>(() => this.#parent.zOrientation());
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(carouselItemVariants({ zOrientation: this.#orientation() }), this.class()));
}

```



```angular-ts title="carousel-plugins.service.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { Injectable } from '@angular/core';

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
  ) {
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



```angular-ts title="carousel.module.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { NgModule } from '@angular/core';

import { ZardCarouselContentComponent } from './carousel-content.component';
import { ZardCarouselItemComponent } from './carousel-item.component';
import { ZardCarouselComponent } from './carousel.component';

const CAROUSEL_COMPONENTS = [ZardCarouselComponent, ZardCarouselContentComponent, ZardCarouselItemComponent];

@NgModule({
  imports: [CAROUSEL_COMPONENTS],
  exports: [CAROUSEL_COMPONENTS],
})
export class ZardCarouselModule {}

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
// Main carousel components
export * from './carousel.component';
export * from './carousel-content.component';
export * from './carousel-item.component';

// Extensions (indicators and thumbnails)
// export * from './carousel-extensions.component';

// Plugin service
// export * from './carousel-plugins.service';

// Variants and types
export * from './carousel.variants';

```

