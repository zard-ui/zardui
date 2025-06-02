import { ChangeDetectionStrategy, Component, ContentChild, OnDestroy, TemplateRef, ViewEncapsulation, computed, effect, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZardCarouselContentComponent } from './carousel-content.component';
import { ZardCarouselItemComponent } from './carousel-item.component';
import { ZardCarouselComponent } from './carousel.component';
import type { CarouselApi } from './carousel.component';

@Component({
  selector: 'z-carousel-indicators',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-2 justify-center mt-4" [class.flex-col]="zOrientation() === 'vertical'">
      @for (_ of slideCountArray(); track $index) {
        <button
          class="w-2 h-2 rounded-full transition-all"
          [class.bg-primary]="selectedIndex() === $index"
          [class.bg-muted]="selectedIndex() !== $index"
          [class.w-4]="selectedIndex() === $index"
          (click)="selectSlide($index)"
          [attr.aria-label]="'Navigate to slide ' + ($index + 1)"
        ></button>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardCarouselIndicatorsComponent {
  public readonly zOrientation = input<'horizontal' | 'vertical'>('horizontal');
  private readonly carouselApi = signal<CarouselApi | null>(null);

  protected readonly selectedIndex = signal<number>(0);
  protected readonly slideCount = signal<number>(0);

  // Helper computed for @for loop
  protected readonly slideCountArray = computed(() => Array.from({ length: this.slideCount() }, (_, i) => i));

  constructor() {
    effect(() => {
      const api = this.carouselApi();
      if (api) {
        this.selectedIndex.set(api.selectedIndex);
        this.slideCount.set(api.slideCount());

        api.addEventListener('select', () => {
          const currentApi = this.carouselApi();
          if (currentApi) {
            this.selectedIndex.set(currentApi.selectedIndex);
          }
        });
      }
    });
  }

  public setApi(api: CarouselApi) {
    this.carouselApi.set(api);
    // Update initial values
    this.selectedIndex.set(api.selectedIndex);
    this.slideCount.set(api.slideCount());
  }

  protected selectSlide(index: number) {
    const api = this.carouselApi();
    if (api) {
      api.scrollTo(index);
    }
  }
}

@Component({
  selector: 'z-carousel-thumbs',
  standalone: true,
  imports: [CommonModule, ZardCarouselComponent, ZardCarouselContentComponent, ZardCarouselItemComponent],
  template: `
    <z-carousel [zOptions]="thumbsOptions" [zShowControls]="false" class="mt-4" (zOnInit)="thumbsInit($event)">
      <z-carousel-content>
        @for (_ of slideCountArray(); track $index) {
          <z-carousel-item class="basis-1/5 cursor-pointer">
            <div
              class="h-20 flex items-center justify-center rounded-md transition-all"
              [class.border-2]="selectedIndex() === $index"
              [class.border-primary]="selectedIndex() === $index"
              [class.opacity-60]="selectedIndex() !== $index"
              (click)="selectMainSlide($index)"
              (keydown)="onThumbKeydown($event, $index)"
              tabindex="0"
              role="button"
              [attr.aria-label]="'Navigate to slide ' + ($index + 1)"
            >
              <ng-container *ngTemplateOutlet="zItemTemplate; context: { $implicit: $index }"></ng-container>
            </div>
          </z-carousel-item>
        }
      </z-carousel-content>
    </z-carousel>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardCarouselThumbsComponent implements OnDestroy {
  @ContentChild('thumbTemplate') zItemTemplate: TemplateRef<{ $implicit: number }> | null = null;

  private readonly mainCarouselApi = signal<CarouselApi | null>(null);
  private thumbsCarouselApi: CarouselApi | null = null;
  private onThumbClick = false;
  private mainCarouselSubscription: (() => void) | null = null;

  // Specific options for thumbnail carousel
  protected readonly thumbsOptions = {
    containScroll: 'keepSnaps' as const,
    dragFree: true,
    watchDrag: false, // Important for thumbnails
  };

  protected readonly selectedIndex = signal<number>(0);
  protected readonly slideCount = signal<number>(0);

  // Helper computed for @for loop
  protected readonly slideCountArray = computed(() => Array.from({ length: this.slideCount() }, (_, i) => i));

  constructor() {
    effect(() => {
      const api = this.mainCarouselApi();
      if (api) {
        this.selectedIndex.set(api.selectedIndex);
        this.slideCount.set(api.slideCount());

        // Configure synchronization as per documentation
        if (this.mainCarouselSubscription) {
          api.removeEventListener('select', this.mainCarouselSubscription);
        }

        this.mainCarouselSubscription = () => {
          const currentApi = this.mainCarouselApi();
          if (!this.onThumbClick && currentApi) {
            this.selectedIndex.set(currentApi.selectedIndex);
            // Scroll thumbnail when main slide changes
            if (this.thumbsCarouselApi) {
              this.thumbsCarouselApi.scrollTo(currentApi.selectedIndex);
            }
          }
          this.onThumbClick = false;
        };

        api.addEventListener('select', this.mainCarouselSubscription);
      }
    });
  }

  ngOnDestroy() {
    const api = this.mainCarouselApi();
    if (api && this.mainCarouselSubscription) {
      api.removeEventListener('select', this.mainCarouselSubscription);
    }
  }

  public setMainApi(api: CarouselApi) {
    this.mainCarouselApi.set(api);
    // Update initial values
    this.selectedIndex.set(api.selectedIndex);
    this.slideCount.set(api.slideCount());
  }

  protected thumbsInit(api: CarouselApi) {
    this.thumbsCarouselApi = api;
  }

  protected selectMainSlide(index: number) {
    const api = this.mainCarouselApi();
    if (api) {
      this.onThumbClick = true; // Prevents callback loops
      api.scrollTo(index);
    }
  }

  protected onThumbKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectMainSlide(index);
    }
  }
}
