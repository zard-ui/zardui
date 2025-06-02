import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  QueryList,
  signal,
  ViewChild,
  ViewEncapsulation,
  output,
  computed,
  Inject,
} from '@angular/core';
import type { EmblaCarouselType, EmblaEventType, EmblaPluginType } from 'embla-carousel';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

import { ZardCarouselContentComponent } from './carousel-content.component';
import { carouselVariants } from './carousel.variants';
import { ZardButtonComponent } from '../components';

// Types
export interface CarouselOptions {
  loop?: boolean;
  align?: 'start' | 'center' | 'end';
  axis?: 'x' | 'y';
  dragFree?: boolean;
  dragThreshold?: number;
  inViewThreshold?: number;
  skipSnaps?: boolean;
  containScroll?: 'trimSnaps' | 'keepSnaps'; // Remove string vazia
  direction?: 'ltr' | 'rtl';
  slidesToScroll?: number;
  watchDrag?: boolean;
  watchResize?: boolean;
  watchSlides?: boolean;
}

export interface CarouselApi {
  canScrollNext: () => boolean;
  canScrollPrev: () => boolean;
  scrollNext: () => void;
  scrollPrev: () => void;
  selectedIndex: number;
  scrollTo: (index: number, immediate?: boolean) => void;
  slidesInView: () => number[];
  slidesNotInView: () => number[];
  inView: (index: number) => boolean;
  scrollProgress: () => number;
  scrollSnapList: () => number[];
  slideNodes: () => HTMLElement[];
  slideCount: () => number;
  addEventListener: (event: EmblaEventType, callback: () => void) => void;
  removeEventListener: (event: EmblaEventType, callback: () => void) => void;
  reInit: (options?: CarouselOptions, plugins?: EmblaPluginType[]) => void;
  destroy: () => void;
}

@Component({
  selector: 'z-carousel',
  standalone: true,
  imports: [CommonModule, ZardButtonComponent],
  template: `
    <div class="relative" [ngClass]="carouselClasses()" role="region" aria-roledescription="carousel" tabindex="0" #carousel>
      <ng-content></ng-content>

      @if (zShowControls()) {
        <button
          z-button
          zType="outline"
          class="absolute h-8 w-8 rounded-full"
          [class.opacity-50]="!canScrollPrev()"
          [class.cursor-default]="!canScrollPrev()"
          [disabled]="!canScrollPrev()"
          (click)="scrollPrev()"
          [ngClass]="isPrevControlClass()"
          aria-label="Previous slide"
        >
          <i class="icon-chevron-left h-4 w-4"></i>
        </button>
        <button
          z-button
          zType="outline"
          class="absolute h-8 w-8 rounded-full"
          [class.opacity-50]="!canScrollNext()"
          [class.cursor-default]="!canScrollNext()"
          [disabled]="!canScrollNext()"
          (click)="scrollNext()"
          [ngClass]="isNextControlClass()"
          aria-label="Next slide"
        >
          <i class="icon-chevron-right h-4 w-4"></i>
        </button>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardCarouselComponent {
  private readonly destroyRef = inject(DestroyRef);
  private emblaApi: EmblaCarouselType | null = null;

  @ViewChild('carousel', { static: true }) carouselRef!: ElementRef<HTMLElement>;
  @ContentChildren(ZardCarouselContentComponent) contentComponents!: QueryList<ZardCarouselContentComponent>;

  // Public signals and outputs
  public readonly zOptions = input<CarouselOptions>({});
  public readonly zPlugins = input<EmblaPluginType[]>([]);
  public readonly zOrientation = input<'horizontal' | 'vertical'>('horizontal');
  public readonly zShowControls = input<boolean>(true);
  public readonly zOnInit = output<CarouselApi>();
  public readonly zOnSelect = output<{ selectedIndex: number; scrollProgress: number; scrollSnapList: number[] }>();

  // State signals
  protected readonly selectedIndex = signal<number>(0);
  protected readonly canScrollPrev = signal<boolean>(false);
  protected readonly canScrollNext = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.initEmblaCarousel();
        this.setupKeyboardNavigation();
      }
    });
  }

  private async initEmblaCarousel() {
    if (!this.contentComponents?.first?.carouselContentRef) {
      return;
    }

    try {
      // Dynamic import of Embla Carousel for SSR support
      const EmblaCarousel = (await import('embla-carousel')).default;

      const rootNode = this.contentComponents.first.carouselContentRef.nativeElement;
      const options = {
        ...this.zOptions(),
        axis: (this.zOrientation() === 'horizontal' ? 'x' : 'y') as 'x' | 'y',
      };

      // Use plugins if provided
      const plugins = this.zPlugins();

      // Initialize Embla following module documentation
      this.emblaApi = EmblaCarousel(rootNode, options, plugins.length > 0 ? plugins : undefined);

      // Setup events
      this.emblaApi.on('select', () => {
        const selectedIndex = this.emblaApi?.selectedScrollSnap?.() ?? 0;
        this.selectedIndex.set(selectedIndex);
        this.updateScrollButtons();
        this.zOnSelect.emit({
          selectedIndex: this.selectedIndex(),
          scrollProgress: this.emblaApi?.scrollProgress?.() ?? 0,
          scrollSnapList: this.emblaApi?.scrollSnapList?.() ?? [],
        });
      });

      // Additional events as per official documentation
      this.emblaApi.on('init', () => {
        this.updateScrollButtons();
        this.zOnInit.emit(this.getApi());
      });

      this.emblaApi.on('reInit', () => {
        this.updateScrollButtons();
      });

      this.emblaApi.on('destroy', () => {
        // Cleanup when carousel is destroyed
      });
    } catch (err) {
      console.error('Error initializing Embla Carousel:', err);
    }
  }

  private updateScrollButtons() {
    if (this.emblaApi) {
      this.canScrollPrev.set(this.emblaApi.canScrollPrev());
      this.canScrollNext.set(this.emblaApi.canScrollNext());
    }
  }

  private setupKeyboardNavigation() {
    if (!this.carouselRef) return;

    fromEvent<KeyboardEvent>(this.carouselRef.nativeElement, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          this.scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          this.scrollNext();
        }
      });
  }

  public scrollPrev() {
    if (this.emblaApi && this.canScrollPrev()) {
      this.emblaApi.scrollPrev();
    }
  }

  public scrollNext() {
    if (this.emblaApi && this.canScrollNext()) {
      this.emblaApi.scrollNext();
    }
  }

  public scrollTo(index: number) {
    if (this.emblaApi) {
      this.emblaApi.scrollTo(index);
    }
  }

  private getApi(): CarouselApi {
    const api = this.emblaApi;
    return {
      canScrollNext: () => api?.canScrollNext?.() || false,
      canScrollPrev: () => api?.canScrollPrev?.() || false,
      scrollNext: () => api?.scrollNext?.(),
      scrollPrev: () => api?.scrollPrev?.(),
      selectedIndex: api?.selectedScrollSnap?.() ?? 0,
      scrollTo: (index: number, immediate?: boolean) => api?.scrollTo?.(index, immediate),
      slidesInView: () => api?.slidesInView?.() || [],
      slidesNotInView: () => api?.slidesNotInView?.() || [],
      inView: (index: number) => api?.slidesInView?.()?.includes(index) || false,
      scrollProgress: () => api?.scrollProgress?.() || 0,
      scrollSnapList: () => api?.scrollSnapList?.() || [],
      slideNodes: () => api?.slideNodes?.() || [],
      slideCount: () => api?.slideNodes?.()?.length || 0,
      addEventListener: (event: EmblaEventType, callback: () => void) => {
        if (api && typeof api.on === 'function') {
          api.on(event, callback);
        }
      },
      removeEventListener: (event: EmblaEventType, callback: () => void) => {
        if (api && typeof api.off === 'function') {
          api.off(event, callback);
        }
      },
      reInit: (options?: CarouselOptions, plugins?: EmblaPluginType[]) => {
        if (api && typeof api.reInit === 'function') {
          const opts = options ? { ...options, axis: options.axis || (this.zOrientation() === 'horizontal' ? 'x' : 'y') } : undefined;
          api.reInit(opts, plugins);
        }
      },
      destroy: () => {
        if (api && typeof api.destroy === 'function') {
          api.destroy();
        }
      },
    };
  }

  protected readonly carouselClasses = computed(() => carouselVariants({ zOrientation: this.zOrientation() }));

  protected readonly isPrevControlClass = computed(() => {
    return this.zOrientation() === 'horizontal' ? 'left-2 top-1/2 -translate-y-1/2' : 'top-2 left-1/2 -translate-x-1/2 rotate-90';
  });

  protected readonly isNextControlClass = computed(() => {
    return this.zOrientation() === 'horizontal' ? 'right-2 top-1/2 -translate-y-1/2' : 'bottom-2 left-1/2 -translate-x-1/2 rotate-90';
  });
}
