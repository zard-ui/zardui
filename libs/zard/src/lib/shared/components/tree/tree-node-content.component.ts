import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardTreeService } from './tree.service';
import { treeNodeContentVariants } from './tree.variants';

@Component({
  selector: 'z-tree-node-content',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zTreeNodeContent',
})
export class ZardTreeNodeContentComponent {
  private readonly treeService = inject(ZardTreeService);

  readonly class = input<ClassValue>('');
  readonly nodeKey = input.required<string>();

  readonly isSelected = computed(() => this.treeService.isSelected(this.nodeKey()));

  protected readonly classes = computed(() =>
    mergeClasses(treeNodeContentVariants({ isSelected: this.isSelected() }), this.class()),
  );
}
