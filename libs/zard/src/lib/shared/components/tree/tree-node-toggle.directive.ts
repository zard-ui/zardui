import { computed, Directive, inject, input } from '@angular/core';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardTreeService } from './tree.service';
import { treeNodeToggleVariants } from './tree.variants';

@Directive({
  selector: '[z-tree-node-toggle]',
  host: {
    role: 'button',
    '[class]': 'classes()',
    '[attr.aria-label]': 'isExpanded() ? "Collapse" : "Expand"',
    '[attr.tabindex]': '-1',
    '(click)': 'onClick($event)',
  },
  exportAs: 'zTreeNodeToggle',
})
export class ZardTreeNodeToggleDirective {
  private readonly treeService = inject(ZardTreeService);

  readonly nodeKey = input.required<string>({ alias: 'z-tree-node-toggle' });

  readonly isExpanded = computed(() => this.treeService.isExpanded(this.nodeKey()));

  protected readonly classes = computed(() => mergeClasses(treeNodeToggleVariants({ isExpanded: this.isExpanded() })));

  onClick(event: Event) {
    event.stopPropagation();
    this.treeService.toggle(this.nodeKey());
  }
}
