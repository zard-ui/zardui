import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { menuGroupTitleVariants, menuGroupVariants, ZardMenuGroupVariants } from './menu.variants';

@Component({
  selector: 'z-menu-group',
  exportAs: 'zMenuGroup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <li [class]="classes()" role="presentation">
      @if (zTitle()) {
        <div [class]="titleClasses()">{{ zTitle() }}</div>
      }
      <ul role="group">
        <ng-content></ng-content>
      </ul>
    </li>
  `,
  host: {
    '[attr.data-menu-group]': 'true',
  },
})
export class ZardMenuGroupComponent {
  readonly zTitle = input<string>('');
  readonly zLevel = input<number>(1);

  readonly class = input<ClassValue>('');

  private mode = computed(() => 'vertical' as ZardMenuGroupVariants['zMode']);

  protected readonly classes = computed(() =>
    mergeClasses(
      menuGroupVariants({
        zMode: this.mode(),
      }),
      this.class(),
    ),
  );

  protected readonly titleClasses = computed(() =>
    mergeClasses(
      menuGroupTitleVariants({
        zLevel: this.zLevel() as 1 | 2 | 3 | 4,
      }),
    ),
  );
}
