import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  output,
  signal,
  type TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import { twMerge } from 'tailwind-merge';

import {
  tabButtonVariants,
  tabContainerVariants,
  tabNavVariants,
  type ZardTabVariants,
} from '@/shared/components/tabs/tabs.variants';

@Component({
  selector: 'z-tab',
  imports: [],
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardTabComponent {
  readonly label = input.required<string>();
  readonly zIcon = input<string | undefined>(undefined);
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('content');
}

@Component({
  selector: 'z-tab-group',
  imports: [NgTemplateOutlet, NgIcon],
  template: `
    <nav
      [class]="navClasses()"
      role="tablist"
      [attr.aria-orientation]="zOrientation()"
      [attr.data-variant]="zVariant()"
    >
      @for (tab of tabs(); track $index; let index = $index) {
        <button
          type="button"
          role="tab"
          [attr.id]="'tab-' + index"
          [attr.aria-selected]="activeTabIndex() === index"
          [attr.data-active]="activeTabIndex() === index ? '' : null"
          [attr.tabindex]="activeTabIndex() === index ? 0 : -1"
          [attr.aria-controls]="'tabpanel-' + index"
          [disabled]="zDisabled() || tab.zDisabled()"
          (click)="setActiveTab(index)"
          [class]="buttonClasses()"
        >
          @if (tab.zIcon()) {
            <ng-icon [name]="tab.zIcon()!" />
          }
          {{ tab.label() }}
        </button>
      }
    </nav>

    <div class="flex-1">
      @for (tab of tabs(); track $index; let index = $index) {
        <div
          role="tabpanel"
          [attr.id]="'tabpanel-' + index"
          [attr.aria-labelledby]="'tab-' + index"
          [attr.tabindex]="0"
          [hidden]="activeTabIndex() !== index"
          class="focus-visible:ring-primary/50 outline-none focus-visible:ring-2"
        >
          <ng-container [ngTemplateOutlet]="tab.contentTemplate()" />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'containerClasses()',
    '[attr.data-orientation]': 'zOrientation()',
  },
})
export class ZardTabGroupComponent {
  private readonly tabComponents = contentChildren(ZardTabComponent, { descendants: true });

  protected readonly tabs = computed(() => this.tabComponents());
  protected readonly activeTabIndex = signal<number>(0);

  protected readonly zTabChange = output<{
    index: number;
    label: string;
    tab: ZardTabComponent;
  }>();

  protected readonly zDeselect = output<{
    index: number;
    label: string;
    tab: ZardTabComponent;
  }>();

  readonly zVariant = input<ZardTabVariants['zVariant']>('default');
  readonly zOrientation = input<ZardTabVariants['zOrientation']>('horizontal');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<string>('');

  protected setActiveTab(index: number) {
    const currentTab = this.tabs()[this.activeTabIndex()];
    if (index !== this.activeTabIndex() && currentTab) {
      this.zDeselect.emit({
        index: this.activeTabIndex(),
        label: currentTab.label(),
        tab: currentTab,
      });
    }

    this.activeTabIndex.set(index);
    const activeTabComponent = this.tabs()[index];
    if (activeTabComponent) {
      this.zTabChange.emit({
        index,
        label: activeTabComponent.label(),
        tab: activeTabComponent,
      });
    }
  }

  protected readonly containerClasses = computed(() =>
    twMerge(tabContainerVariants({ zOrientation: this.zOrientation() }), this.class()),
  );

  protected readonly navClasses = computed(() => tabNavVariants({ zVariant: this.zVariant() }));

  protected readonly buttonClasses = computed(() => tabButtonVariants());

  selectTabByIndex(index: number): void {
    if (index >= 0 && index < this.tabs().length) {
      this.setActiveTab(index);
    } else {
      console.warn(`Index ${index} outside the range of available tabs.`);
    }
  }
}
