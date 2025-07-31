### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">tabs.component.ts

```angular-ts showLineNumbers
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  ElementRef,
  input,
  output,
  QueryList,
  signal,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { combineLatest, interval, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';

import { tabButtonVariants, tabContainerVariants, tabNavVariants, ZardTabVariants } from './tabs.variants';
import { ZardButtonComponent } from '../components';

export type zPosition = 'top' | 'bottom' | 'left' | 'right';
export type zAlign = 'center' | 'start' | 'end';

@Component({
  selector: 'z-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class ZardTabComponent {
  label = input.required<string>();
  @ViewChild('content', { static: true }) contentTemplate!: TemplateRef<unknown>;
}

@Component({
  selector: 'z-tab-group',
  standalone: true,
  imports: [CommonModule, ZardButtonComponent],
  template: `
    <div class="tab-group" [ngClass]="containerClasses()">
      @if (navBeforeContent()) {
        <div [class]="navGridClasses()">
          @if (showArrow()) {
            @if (zTabsPosition() === 'top' || zTabsPosition() === 'bottom') {
              <button class="scroll-btn scroll-left pr-4 cursor-pointer" [class]="zTabsPosition() === 'top' ? 'mb-4' : 'mt-4'" (click)="scrollNav('left')">
                <i class="icon-chevron-left"></i>
              </button>
            } @else {
              <button class="scroll-btn scroll-up pb-4 cursor-pointer" [class]="zTabsPosition() === 'left' ? 'mr-4' : 'ml-4'" (click)="scrollNav('up')">
                <i class="icon-chevron-up"></i>
              </button>
            }
          }

          <nav [ngClass]="navClasses()" #tabNav>
            @for (tab of tabs(); track $index; let index = $index) {
              <button z-button zType="ghost" (click)="setActiveTab(index)" [ngClass]="buttonClassesSignal()[index]">
                {{ tab.label() }}
              </button>
            }
          </nav>

          @if (showArrow()) {
            @if (zTabsPosition() === 'top' || zTabsPosition() === 'bottom') {
              <button class="scroll-btn scroll-right pl-4 cursor-pointer" [class]="zTabsPosition() === 'top' ? 'mb-4' : 'mt-4'" (click)="scrollNav('right')">
                <i class="icon-chevron-right"></i>
              </button>
            } @else {
              <button class="scroll-btn scroll-down pt-4 cursor-pointer" [class]="zTabsPosition() === 'left' ? 'mr-4' : 'ml-4'" (click)="scrollNav('down')">
                <i class="icon-chevron-down"></i>
              </button>
            }
          }
        </div>
      }

      <div class="tab-content flex-1">
        @for (tab of tabs(); track $index; let index = $index) {
          @if (activeTabIndex() === index) {
            <ng-container [ngTemplateOutlet]="tab.contentTemplate"></ng-container>
          }
        }
      </div>

      @if (!navBeforeContent()) {
        <div [class]="navGridClasses()">
          @if (showArrow()) {
            @if (zTabsPosition() === 'top' || zTabsPosition() === 'bottom') {
              <button class="scroll-btn scroll-left pr-4 cursor-pointer" [class]="zTabsPosition() === 'top' ? 'mb-4' : 'mt-4'" (click)="scrollNav('left')">
                <i class="icon-chevron-left"></i>
              </button>
            } @else {
              <button class="scroll-btn scroll-up pb-4 cursor-pointer" [class]="zTabsPosition() === 'left' ? 'mr-4' : 'ml-4'" (click)="scrollNav('up')">
                <i class="icon-chevron-up"></i>
              </button>
            }
          }

          <nav [ngClass]="navClasses()" #tabNav>
            @for (tab of tabs(); track $index; let index = $index) {
              <button z-button zType="ghost" (click)="setActiveTab(index)" [ngClass]="buttonClassesSignal()[index]">
                {{ tab.label() }}
              </button>
            }
          </nav>

          @if (showArrow()) {
            @if (zTabsPosition() === 'top' || zTabsPosition() === 'bottom') {
              <button class="scroll-btn scroll-right pl-4 cursor-pointer" [class]="zTabsPosition() === 'top' ? 'mb-4' : 'mt-4'" (click)="scrollNav('right')">
                <i class="icon-chevron-right"></i>
              </button>
            } @else {
              <button class="scroll-btn scroll-down pt-4 cursor-pointer" [class]="zTabsPosition() === 'left' ? 'mr-4' : 'ml-4'" (click)="scrollNav('down')">
                <i class="icon-chevron-down"></i>
              </button>
            }
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .nav-tab-scroll {
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
        &::-webkit-scrollbar-thumb {
          background-color: rgba(209, 209, 209, 0.2);
          border-radius: 2px;
        }
        &::-webkit-scrollbar {
          height: 4px;
          width: 4px;
        }
        &::-webkit-scrollbar-button {
          display: none;
        }
      }
    `,
  ],
})
export class ZardTabGroupComponent {
  @ContentChildren(ZardTabComponent, { descendants: true })
  private readonly tabComponents!: QueryList<ZardTabComponent>;
  @ViewChild('tabNav', { static: false }) private readonly tabsContainer!: ElementRef;

  protected readonly tabs = signal<ZardTabComponent[]>([]);
  protected readonly activeTabIndex = signal<number>(0);
  protected readonly hasScrollSignal = signal<boolean>(false);

  protected readonly showArrow = computed(() => {
    const _tabs = this.tabs();
    const _position = this.zTabsPosition();
    const scrollStatus = this.hasScrollSignal();
    return scrollStatus;
  });

  protected readonly zOnTabChange = output<{
    index: number;
    label: string;
    tab: ZardTabComponent;
  }>();
  protected readonly zDeselect = output<{
    index: number;
    label: string;
    tab: ZardTabComponent;
  }>();

  public readonly zTabsPosition = input<ZardTabVariants['zPosition']>('top');
  public readonly zActivePosition = input<ZardTabVariants['zActivePosition']>('bottom');
  public readonly zShowArrow = input(true);
  public readonly zScrollAmount = input(100);
  public readonly zAlignTabs = input<zAlign>('start');

  constructor() {
    afterNextRender(() => {
      this.updateTabs();
      if (this.tabs().length > 0) {
        this.setActiveTab(0);
      }

      combineLatest([interval(100).pipe(startWith(0))]).subscribe(() => {
        this.hasScrollSignal.set(this.hasScroll());
      });
    });
  }

  private updateTabs() {
    this.tabs.set(this.tabComponents.toArray());
  }

  private hasScroll(): boolean {
    if (this.tabsContainer && this.tabsContainer.nativeElement && this.zShowArrow()) {
      const navElement: HTMLElement = this.tabsContainer.nativeElement;
      return navElement.scrollWidth > navElement.clientWidth || navElement.scrollHeight > navElement.clientHeight;
    }
    return false;
  }

  protected setActiveTab(index: number) {
    const currentTab = this.tabs()[this.activeTabIndex()];
    if (index !== this.activeTabIndex()) {
      this.zDeselect.emit({
        index: this.activeTabIndex(),
        label: currentTab.label(),
        tab: currentTab,
      });
    }

    this.activeTabIndex.set(index);
    const activeTabComponent = this.tabs()[index];
    if (activeTabComponent) {
      this.zOnTabChange.emit({
        index,
        label: activeTabComponent.label(),
        tab: activeTabComponent,
      });
    }
  }

  protected readonly navBeforeContent = computed(() => {
    const position = this.zTabsPosition();
    return position === 'top' || position === 'left';
  });

  protected readonly isHorizontal = computed(() => {
    const position = this.zTabsPosition();
    return position === 'top' || position === 'bottom';
  });

  protected readonly navGridClasses = computed(() => {
    const position = this.zTabsPosition();
    const hasArrows = this.showArrow();
    return position === 'left' || position === 'right' ? `grid${hasArrows ? ' grid-rows-[25px_1fr_25px]' : ''}` : `grid${hasArrows ? ' grid-cols-[25px_1fr_25px]' : ''}`;
  });

  protected readonly containerClasses = computed(() => tabContainerVariants({ zPosition: this.zTabsPosition() }));

  protected readonly navClasses = computed(() => tabNavVariants({ zPosition: this.zTabsPosition(), zAlignTabs: this.showArrow() ? 'start' : this.zAlignTabs() }));

  protected readonly buttonClassesSignal = computed(() => {
    const activeIndex = this.activeTabIndex();
    const position = this.zActivePosition();
    return this.tabs().map((_, index) => {
      const isActive = activeIndex === index;
      return tabButtonVariants({ zActivePosition: position, isActive });
    });
  });

  protected scrollNav(direction: 'left' | 'right' | 'up' | 'down') {
    const container = this.tabsContainer.nativeElement;
    const scrollAmount = this.zScrollAmount();
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else if (direction === 'right') {
      container.scrollLeft += scrollAmount;
    } else if (direction === 'up') {
      container.scrollTop -= scrollAmount;
    } else if (direction === 'down') {
      container.scrollTop += scrollAmount;
    }
  }

  public selectTabByIndex(index: number): void {
    if (index >= 0 && index < this.tabs().length) {
      this.setActiveTab(index);
    } else {
      console.warn(`Index ${index} outside the range of available tabs.`);
    }
  }
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">tabs.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

import { zAlign } from './tabs.component';

export const tabContainerVariants = cva('flex w-full h-full', {
  variants: {
    zPosition: {
      top: 'flex-col',
      bottom: 'flex-col',
      left: 'flex-row',
      right: 'flex-row',
    },
  },
  defaultVariants: {
    zPosition: 'top',
  },
});

export const tabNavVariants = cva('flex gap-4 overflow-auto scroll nav-tab-scroll', {
  variants: {
    zPosition: {
      top: 'flex-row border-b mb-4 w-full',
      bottom: 'flex-row border-t mt-4 w-full',
      left: 'flex-col border-r mr-4 h-full min-h-0',
      right: 'flex-col border-l ml-4 h-full min-h-0',
    },
    zAlignTabs: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    },
  },
  defaultVariants: {
    zPosition: 'top',
    zAlignTabs: 'start',
  },
});

export const tabButtonVariants = cva('hover:bg-transparent rounded-none flex-shrink-0', {
  variants: {
    zActivePosition: {
      top: '',
      bottom: '',
      left: '',
      right: '',
    },
    isActive: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      zActivePosition: 'top',
      isActive: true,
      class: 'border-t-2 border-t-primary',
    },
    {
      zActivePosition: 'bottom',
      isActive: true,
      class: 'border-b-2 border-b-primary',
    },
    {
      zActivePosition: 'left',
      isActive: true,
      class: 'border-l-2 border-l-primary',
    },
    {
      zActivePosition: 'right',
      isActive: true,
      class: 'border-r-2 border-r-primary',
    },
  ],
  defaultVariants: {
    zActivePosition: 'bottom',
    isActive: false,
  },
});

export type ZardTabVariants = VariantProps<typeof tabContainerVariants> & VariantProps<typeof tabNavVariants> & VariantProps<typeof tabButtonVariants> & { zAlignTabs: zAlign };

```

