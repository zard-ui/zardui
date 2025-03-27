import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  input,
  output,
  QueryList,
  signal,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ZardButtonComponent } from '../components';
import { tabButtonVariants, tabContainerVariants, tabNavVariants, ZardTabVariants } from './tabs.variants';

export type zPosition = 'top' | 'bottom' | 'left' | 'right';

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
        <nav [ngClass]="navClasses()">
          @for (tab of tabs(); track $index; let index = $index) {
            <button z-button zType="ghost" (click)="setActiveTab(index)" [ngClass]="buttonClassesSignal()[index]">
              {{ tab.label() }}
            </button>
          }
        </nav>
      }
      <div class="tab-content flex-1">
        @for (tab of tabs(); track $index; let index = $index) {
          @if (activeTabIndex() === index) {
            <ng-container [ngTemplateOutlet]="tab.contentTemplate"></ng-container>
          }
        }
      </div>
      @if (!navBeforeContent()) {
        <nav [ngClass]="navClasses()">
          @for (tab of tabs(); track $index; let index = $index) {
            <button z-button zType="ghost" (click)="setActiveTab(index)" [ngClass]="buttonClassesSignal()[index]">
              {{ tab.label() }}
            </button>
          }
        </nav>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'w-full h-full',
  },
})
export class ZardTabGroupComponent {
  @ContentChildren(ZardTabComponent, { descendants: true })
  private readonly tabComponents!: QueryList<ZardTabComponent>;
  protected readonly tabs = signal<ZardTabComponent[]>([]);
  protected readonly activeTabIndex = signal<number>(0);
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

  constructor() {
    afterNextRender(() => {
      this.updateTabs();
      if (this.tabs().length > 0) {
        this.setActiveTab(0);
      }
    });
  }

  private updateTabs() {
    this.tabs.set(this.tabComponents.toArray());
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

  protected readonly containerClasses = computed(() => tabContainerVariants({ zPosition: this.zTabsPosition() }));

  protected readonly navClasses = computed(() => tabNavVariants({ zPosition: this.zTabsPosition() }));

  protected readonly buttonClassesSignal = computed(() => {
    const activeIndex = this.activeTabIndex();
    const position = this.zActivePosition();
    return this.tabs().map((_, index) => {
      const isActive = activeIndex === index;
      return tabButtonVariants({ zActivePosition: position, isActive });
    });
  });

  public selectTabByIndex(index: number): void {
    if (index >= 0 && index < this.tabs().length) {
      this.setActiveTab(index);
    } else {
      console.warn(`Index ${index} outside the range of available tabs.`);
    }
  }
}
