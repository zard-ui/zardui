import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  runInInjectionContext,
  signal,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { tabButtonVariants, tabContainerVariants, tabNavVariants, ZardTabVariants } from './tabs.variants';
import { ZardButtonComponent } from '../button/button.component';

export type zPosition = 'top' | 'bottom' | 'left' | 'right';
export type zAlign = 'center' | 'start' | 'end';

@Component({
  selector: 'z-tab',
  standalone: true,
  imports: [],
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class ZardTabComponent {
  label = input.required<string>();
  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('content');
}

@Component({
  selector: 'z-tab-group',
  standalone: true,
  imports: [CommonModule, ZardButtonComponent],
  host: { '[class]': 'containerClasses()' },
  template: `
    <div class="tab-group">
      @let horizontal = isHorizontal();

      @if (navBeforeContent()) {
        <div [class]="navGridClasses()">
          @if (showArrow()) {
            @if (horizontal) {
              <button class="scroll-btn scroll-left pr-4 cursor-pointer" [class]="zTabsPosition() === 'top' ? 'mb-4' : 'mt-4'" (click)="scrollNav('left')">
                <i class="icon-chevron-left"></i>
              </button>
            } @else {
              <button class="scroll-btn scroll-up pb-4 cursor-pointer" [class]="zTabsPosition() === 'left' ? 'mr-4' : 'ml-4'" (click)="scrollNav('up')">
                <i class="icon-chevron-up"></i>
              </button>
            }
          }

          <nav [ngClass]="navClasses()" #tabNav role="tablist">
            @for (tab of tabs(); track $index; let index = $index) {
              <button
                z-button
                zType="ghost"
                role="tab"
                [attr.aria-selected]="activeTabIndex() === index"
                [attr.tabindex]="activeTabIndex() === index ? 0 : -1"
                (click)="setActiveTab(index)"
                [ngClass]="buttonClassesSignal()[index]"
              >
                {{ tab.label() }}
              </button>
            }
          </nav>

          @if (showArrow()) {
            @if (horizontal) {
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
            <ng-container [ngTemplateOutlet]="tab.contentTemplate()"></ng-container>
          }
        }
      </div>

      @if (!navBeforeContent()) {
        <div [class]="navGridClasses()">
          @if (showArrow()) {
            @if (horizontal) {
              <button class="scroll-btn scroll-left pr-4 cursor-pointer" [class]="zTabsPosition() === 'top' ? 'mb-4' : 'mt-4'" (click)="scrollNav('left')">
                <i class="icon-chevron-left"></i>
              </button>
            } @else {
              <button class="scroll-btn scroll-up pb-4 cursor-pointer" [class]="zTabsPosition() === 'left' ? 'mr-4' : 'ml-4'" (click)="scrollNav('up')">
                <i class="icon-chevron-up"></i>
              </button>
            }
          }

          <nav [ngClass]="navClasses()" #tabNav role="tablist">
            @for (tab of tabs(); track $index; let index = $index) {
              <button
                z-button
                zType="ghost"
                role="tab"
                [attr.aria-selected]="activeTabIndex() === index"
                [attr.tabindex]="activeTabIndex() === index ? 0 : -1"
                (click)="setActiveTab(index)"
                [ngClass]="buttonClassesSignal()[index]"
              >
                {{ tab.label() }}
              </button>
            }
          </nav>

          @if (showArrow()) {
            @if (horizontal) {
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
export class ZardTabGroupComponent implements AfterViewInit {
  private readonly tabComponents = contentChildren(ZardTabComponent, { descendants: true });
  private readonly tabsContainer = viewChild.required<ElementRef>('tabNav');
  private readonly injector = inject(Injector);

  protected readonly tabs = computed(() => this.tabComponents());
  protected readonly activeTabIndex = signal<number>(0);
  protected readonly scrollPresent = signal<boolean>(false);

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

  protected readonly showArrow = computed(() => this.zShowArrow() && this.scrollPresent());

  ngAfterViewInit(): void {
    // default tab selection
    if (this.tabs().length) {
      this.setActiveTab(0);
    }

    runInInjectionContext(this.injector, () => {
      // Can't use effect over signal as it runs before child query result has value
      toObservable(this.zShowArrow)
        .pipe(takeUntilDestroyed(inject(DestroyRef)))
        .subscribe(() => {
          // small optimization, don't set signal if value hasn't changed
          if (this.hasScroll() !== this.scrollPresent()) {
            this.scrollPresent.set(this.hasScroll());
          }
        });
    });
  }

  private hasScroll(): boolean {
    const navElement: HTMLElement = this.tabsContainer().nativeElement;
    if (this.zShowArrow()) {
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

  protected readonly navGridClasses = computed(() =>
    this.isHorizontal() ? `grid${this.showArrow() ? ' grid-cols-[25px_1fr_25px]' : ''}` : `grid${this.showArrow() ? ' grid-rows-[25px_1fr_25px]' : ''}`,
  );

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
    const container = this.tabsContainer().nativeElement;
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
