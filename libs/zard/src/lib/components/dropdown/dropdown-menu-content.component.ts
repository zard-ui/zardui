import { ClassValue } from 'class-variance-authority/dist/types';

import { Component, computed, input, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { dropdownContentVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu-content',
  exportAs: 'zDropdownMenuContent',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #contentTemplate>
      <div [class]="contentClasses()" role="menu" tabindex="-1" [attr.aria-orientation]="'vertical'">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
})
export class ZardDropdownMenuContentComponent {
  @ViewChild('contentTemplate', { static: true }) contentTemplate!: TemplateRef<unknown>;

  readonly class = input<ClassValue>('');

  protected readonly contentClasses = computed(() => mergeClasses(dropdownContentVariants(), this.class()));
}
