import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, contentChildren, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { layoutVariants, LayoutVariants } from './layout.variants';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'z-layout',
  exportAs: 'zLayout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  template: `<ng-content></ng-content>`,
})
export class LayoutComponent {
  readonly class = input<ClassValue>('');
  readonly zDirection = input<LayoutVariants['zDirection']>('auto');

  // Query for direct sidebar children to auto-detect layout direction
  private readonly sidebars = contentChildren(SidebarComponent, { descendants: false });

  private readonly detectedDirection = computed(() => {
    if (this.zDirection() !== 'auto') {
      return this.zDirection();
    }

    // Auto-detection: Check if there are any sidebar children
    const hasSidebar = this.sidebars().length > 0;
    return hasSidebar ? 'horizontal' : 'vertical';
  });

  protected readonly classes = computed(() =>
    mergeClasses(
      layoutVariants({
        zDirection: this.detectedDirection() as LayoutVariants['zDirection'],
      }),
      this.class(),
    ),
  );
}
