import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  ViewEncapsulation,
  output,
  computed,
  viewChild,
} from '@angular/core';

import { type ClassValue } from 'clsx';
import type { EmblaCarouselType, EmblaEventType, EmblaPluginType, EmblaOptionsType } from 'embla-carousel';
import { EmblaCarouselDirective } from 'embla-carousel-angular';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { mergeClasses } from '@ngzard/ui/core';
import { ZardIconComponent } from '@ngzard/ui/icon';

import {
  carouselNextButtonVariants,
  carouselPreviousButtonVariants,
  carouselVariants,
  type ZardCarouselControlsVariants,
  type ZardCarouselOrientationVariants,
} from './carousel.variants';

@Component({
  selector: 'z-carousel',
  imports: [CommonModule, EmblaCarouselDirective, ZardButtonComponent, ZardIconComponent],
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
          <ng-container *ngTemplateOutlet="buttonControls" />
        } @else if (controls === 'dot') {
          <ng-container *ngTemplateOutlet="dotControls" />
        }
      </div>
    </div>

    <ng-template #buttonControls>
      <button
        type="button"
        z-button
        zType="outline"
        [class]="prevBtnClasses()"
        [disabled]="!canScrollPrev()"
        (click)="slidePrevious()"
        aria-label="Previous slide"
      >
        <z-icon zType="chevron-left" class="size-4" />
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        [class]="nextBtnClasses()"
        [disabled]="!canScrollNext()"
        (click)="slideNext()"
        aria-label="Next slide"
      >
        <z-icon zType="chevron-right" class="size-4" />
      </button>
    </ng-template>

    <ng-template #dotControls>
      <div class="mt-2 flex justify-center gap-1">
        @for (dot of dots(); track index; let index = $index) {
          <span
            [class]="index === selectedIndex() ? 'cursor-default' : 'cursor-pointer'"
            role="button"
            tabindex="0"
            (click)="goTo(index)"
          >
            <z-icon
              zType="circle-small"
              [zStrokeWidth]="1"
              class="block size-3"
              [class]="index === selectedIndex() ? 'fill-primary stroke-primary' : 'fill-border stroke-border'"
            />
          </span>
        }
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '(keydown)': 'handleKeyDown($event)' },
})
export class ZardCarouselComponent {
  protected readonly emblaRef = viewChild(EmblaCarouselDirective);

  // Public signals and outputs
  readonly class = input<ClassValue>('');
  readonly zOptions = input<EmblaOptionsType>({ loop: false });
  readonly zPlugins = input<EmblaPluginType[]>([]);
  readonly zOrientation = input<ZardCarouselOrientationVariants>('horizontal');
  readonly zControls = input<ZardCarouselControlsVariants>('button');
  readonly zInited = output<EmblaCarouselType>();
  readonly zSelected = output<void>();

  // State signals
  protected readonly selectedIndex = signal<number>(0);
  protected readonly canScrollPrev = signal<boolean>(false);
  protected readonly canScrollNext = signal<boolean>(false);
  protected readonly scrollSnaps = signal<number[]>([]);
  protected readonly subscribeToEvents: EmblaEventType[] = ['init', 'select', 'reInit'];
  protected readonly options = computed(
    () => ({ ...this.zOptions(), axis: this.zOrientation() === 'horizontal' ? 'x' : 'y' }) as EmblaOptionsType,
  );

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

  protected goTo(index: number): void {
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
