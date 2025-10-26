import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, ViewEncapsulation } from '@angular/core';
import type { ClassValue } from 'clsx';

import { buttonVariants, ZardButtonVariants } from './button.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardIconComponent } from '../icon/icon.component';

@Component({
  selector: 'z-button, button[z-button], a[z-button]',
  exportAs: 'zButton',
  standalone: true,
  imports: [ZardIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (zLoading()) {
      <z-icon zType="loader-circle" class="animate-spin" />
    }
    <ng-content></ng-content>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardButtonComponent {
  readonly zType = input<ZardButtonVariants['zType']>('default');
  readonly zSize = input<ZardButtonVariants['zSize']>('default');
  readonly zShape = input<ZardButtonVariants['zShape']>('default');

  readonly class = input<ClassValue>('');

  readonly zFull = input(false, { transform });
  readonly zLoading = input(false, { transform });

  protected readonly classes = computed(() =>
    mergeClasses(
      buttonVariants({
        zType: this.zType(),
        zSize: this.zSize(),
        zShape: this.zShape(),
        zFull: this.zFull(),
        zLoading: this.zLoading(),
      }),
      this.class(),
    ),
  );
}
