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
