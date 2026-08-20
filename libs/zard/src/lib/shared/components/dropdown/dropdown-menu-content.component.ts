import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { dropdownContentVariants } from '@/shared/components/dropdown/dropdown.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-dropdown-menu-content',
  template: `
    <ng-template #contentTemplate>
      <div
        [class]="contentClasses()"
        role="menu"
        data-slot="dropdown-menu-content"
        data-state="open"
        tabindex="-1"
        aria-orientation="vertical"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.display]': '"none"',
  },
  exportAs: 'zDropdownMenuContent',
})
export class ZardDropdownMenuContentComponent {
  /**
   * Where the template is instantiated from when a service — rather than a trigger directive —
   * opens this menu, so `ZardContextMenuService.create()` needs nothing but the menu itself.
   */
  readonly viewContainerRef = inject(ViewContainerRef);

  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('contentTemplate');

  readonly class = input<ClassValue>('');

  protected readonly contentClasses = computed(() => mergeClasses(dropdownContentVariants(), this.class()));
}
