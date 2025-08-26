import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, OnInit, computed, contentChildren, inject, input, signal, viewChild } from '@angular/core';
import EmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

import { carouselVariants, carouselContentVariants, carouselViewportVariants, type CarouselVariants } from './carousel.variants';

@Component({
  selector: 'z-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  host: { '[class]': 'classes()' },
  template: `
    <div class="w-full">
      <div #emblaNode [class]="contentClasses()">
        <div #emblaContainer [class]="viewportClasses()">
          <ng-content></ng-content>
        </div>
      </div>

      @if (showNavigation()) {
        <div class="flex justify-center gap-4 mt-4 mb-8">
          <button
            (click)="scrollToPrev()"
            [disabled]="!canScrollPrev()"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 border border-border"
            aria-label="Previous slide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            (click)="scrollToNext()"
            [disabled]="!canScrollNext()"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 border border-border"
            aria-label="Next slide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      }

      <!-- Dots indicator -->
      @if (showDots()) {
        <div class="flex justify-center gap-2 mt-4">
          @for (_ of dotsArray(); track _; let i = $index) {
            <button
              (click)="scrollToSlide(i)"
              [class]="'w-2 h-2 rounded-full transition-all duration-200 border-0 p-0 ' + (currentSlide() === i ? 'bg-primary' : 'bg-muted-foreground/30')"
              [attr.aria-label]="'Go to slide ' + (i + 1)"
            ></button>
          }
        </div>
      }
    </div>
  `,
})
export class ZardCarouselComponent implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private emblaApi: EmblaCarouselType | undefined;

  // Inputs
  readonly orientation = input<CarouselVariants['orientation']>('horizontal');
  readonly itemsPerView = input<number>(3.2); // 3.2 items per view for infinite feel
  readonly showNavigation = input<boolean>(true);
  readonly showDots = input<boolean>(true);
  readonly autoplay = input<boolean>(false);
  readonly autoplayInterval = input<number>(3000);
  readonly infinite = input<boolean>(true);
  readonly class = input<string>('');

  // ViewChild references
  readonly emblaNode = viewChild<ElementRef<HTMLElement>>('emblaNode');
  readonly emblaContainer = viewChild<ElementRef<HTMLElement>>('emblaContainer');

  // Content children (carousel items)
  readonly carouselItems = contentChildren(ZardCarouselItemComponent);

  // State
  readonly currentSlide = signal(0);
  readonly slidesCount = computed(() => this.carouselItems().length);
  readonly visibleSlidesCount = computed(() => Math.ceil(this.slidesCount() - this.itemsPerView() + 1));
  readonly itemWidth = computed(() => 100 / this.itemsPerView());

  // Embla options
  readonly emblaOptions = computed(
    (): EmblaOptionsType => ({
      loop: this.infinite(),
      axis: this.orientation() === 'vertical' ? 'y' : 'x',
      slidesToScroll: 1,
      containScroll: 'trimSnaps',
      dragFree: false,
      skipSnaps: false,
    }),
  );

  // Navigation state
  readonly canScrollPrev = signal(false);
  readonly canScrollNext = signal(false);

  // Dots array for indicators
  readonly dotsArray = computed(() => {
    return Array(this.visibleSlidesCount()).fill(0);
  });

  // Classes
  readonly classes = computed(() =>
    twMerge(
      clsx(
        carouselVariants({
          orientation: this.orientation(),
        }),
        this.class(),
      ),
    ),
  );

  readonly contentClasses = computed(() =>
    carouselContentVariants({
      orientation: this.orientation(),
    }),
  );

  readonly viewportClasses = computed(() =>
    carouselViewportVariants({
      orientation: this.orientation(),
    }),
  );

  ngOnInit(): void {
    // Setup destroy cleanup
    this.destroyRef.onDestroy(() => {
      if (this.emblaApi) {
        this.emblaApi.destroy();
      }
    });
  }

  ngAfterViewInit(): void {
    const emblaNode = this.emblaNode()?.nativeElement;
    if (!emblaNode) return;

    const plugins = [];

    // Add autoplay plugin if enabled
    if (this.autoplay()) {
      plugins.push(Autoplay({ delay: this.autoplayInterval(), stopOnInteraction: false }));
    }

    // Initialize Embla
    this.emblaApi = EmblaCarousel(emblaNode, this.emblaOptions(), plugins);

    // Update current slide and navigation state on events
    const updateState = () => {
      if (!this.emblaApi) return;
      this.currentSlide.set(this.emblaApi.selectedScrollSnap());
      this.canScrollPrev.set(this.emblaApi.canScrollPrev());
      this.canScrollNext.set(this.emblaApi.canScrollNext());
    };

    this.emblaApi.on('select', updateState);
    this.emblaApi.on('init', updateState);

    // Initial state update
    updateState();
  }

  scrollToPrev(): void {
    this.emblaApi?.scrollPrev();
  }

  scrollToNext(): void {
    this.emblaApi?.scrollNext();
  }

  scrollToSlide(index: number): void {
    this.emblaApi?.scrollTo(index);
  }
}

@Component({
  selector: 'z-carousel-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<ng-content></ng-content>`,
})
export class ZardCarouselItemComponent {
  readonly class = input<string>('');

  readonly classes = computed(() => twMerge(clsx('min-w-0 shrink-0 grow-0 embla__slide', this.class())));
}
