import { ChangeDetectionStrategy, Component, computed, contentChildren, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { layoutVariants, type ZardLayoutVariants } from '@/shared/components/layout/layout.variants';
import { ZardSidebarComponent } from '@/shared/components/layout/sidebar.component';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-layout',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'layout',
    '[class]': 'classes()',
  },
  exportAs: 'zLayout',
})
export class ZardLayoutComponent {
  readonly class = input<ClassValue>('');
  readonly zDirection = input<ZardLayoutVariants>('auto');

  // Query for direct sidebar children to auto-detect layout direction
  private readonly sidebars = contentChildren(ZardSidebarComponent, { descendants: false });

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
        zDirection: this.detectedDirection(),
      }),
      this.class(),
    ),
  );
}
