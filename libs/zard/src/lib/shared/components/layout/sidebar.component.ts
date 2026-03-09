import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  ViewEncapsulation,
  type TemplateRef,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import {
  sidebarGroupLabelVariants,
  sidebarGroupVariants,
  sidebarTriggerVariants,
  sidebarVariants,
} from '@/shared/components/layout/layout.variants';
import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-sidebar',
  imports: [ZardStringTemplateOutletDirective, NgIcon],
  template: `
    <aside [class]="classes()" [style.width.px]="currentWidth()" [attr.data-collapsed]="zCollapsed()">
      <div class="flex-1 overflow-auto">
        <ng-content />
      </div>

      @if (zCollapsible() && !zTrigger()) {
        <div
          [class]="triggerClasses()"
          (click)="toggleCollapsed()"
          (keydown.{enter,space}.prevent)="toggleCollapsed()"
          tabindex="0"
          role="button"
          [attr.aria-label]="zCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          [attr.aria-expanded]="!zCollapsed()"
        >
          <ng-icon [name]="chevronIcon()" class="pointer-events-none size-4! shrink-0" />
        </div>
      }

      @if (zCollapsible() && zTrigger()) {
        <ng-container *zStringTemplateOutlet="zTrigger()" />
      }
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
  exportAs: 'zSidebar',
})
export class SidebarComponent {
  readonly zWidth = input<string | number>(200);
  readonly zCollapsedWidth = input<number>(64);
  readonly zCollapsible = input(false, { transform: booleanAttribute });
  readonly zCollapsed = input(false, { transform: booleanAttribute });
  readonly zReverseArrow = input(false, { transform: booleanAttribute });
  readonly zTrigger = input<TemplateRef<void> | null>(null);
  readonly class = input<ClassValue>('');

  readonly zCollapsedChange = output<boolean>();

  private readonly internalCollapsed = signal(false);

  constructor() {
    effect(() => {
      this.internalCollapsed.set(this.zCollapsed());
    });
  }

  protected readonly currentWidth = computed(() => {
    const collapsed = this.zCollapsed();
    if (collapsed) {
      return this.zCollapsedWidth();
    }

    const width = this.zWidth();
    return typeof width === 'number' ? width : parseInt(width, 10);
  });

  protected readonly chevronIcon = computed((): string => {
    const collapsed = this.zCollapsed();
    const reverse = this.zReverseArrow();
    const icons = ['lucideChevronLeft', 'lucideChevronRight'];

    if (reverse) {
      return collapsed ? icons[0] : icons[1];
    }
    return collapsed ? icons[1] : icons[0];
  });

  protected readonly classes = computed(() => mergeClasses(sidebarVariants(), this.class()));

  protected readonly triggerClasses = computed(() => mergeClasses(sidebarTriggerVariants()));

  toggleCollapsed(): void {
    const newState = !this.zCollapsed();
    this.internalCollapsed.set(newState);
    this.zCollapsedChange.emit(newState);
  }
}

@Component({
  selector: 'z-sidebar-group',
  template: `
    <div [class]="classes()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zSidebarGroup',
})
export class SidebarGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-group-label',
  template: `
    <div [class]="classes()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zSidebarGroupLabel',
})
export class SidebarGroupLabelComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupLabelVariants(), this.class()));
}
