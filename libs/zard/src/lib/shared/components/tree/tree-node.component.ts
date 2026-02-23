import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardIconComponent } from '@/shared/components/icon';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardTreeService } from './tree.service';
import type { TreeNode, TreeNodeTemplateContext } from './tree.types';
import {
  treeNodeChildrenVariants,
  treeNodeContentVariants,
  treeNodeToggleVariants,
  treeNodeVariants,
} from './tree.variants';

@Component({
  selector: 'z-tree-node',
  imports: [NgTemplateOutlet, FormsModule, ZardIconComponent, ZardCheckboxComponent],
  template: `
    <div
      class="flex items-center"
      [style.padding-left.px]="level() * 24"
      [attr.data-state]="isExpanded() ? 'open' : 'closed'"
    >
      <!-- Toggle -->
      @if (node().children?.length && !node().leaf) {
        <button
          type="button"
          [class]="toggleClasses()"
          [attr.aria-label]="isExpanded() ? 'Collapse ' + node().label : 'Expand ' + node().label"
          [attr.tabindex]="-1"
          (click)="onToggle($event)"
        >
          <z-icon zType="chevron-right" class="size-4" />
        </button>
      } @else {
        <span class="inline-flex h-4 w-4 shrink-0"></span>
      }

      <!-- Checkbox -->
      @if (checkable()) {
        <span class="mr-0.5 ml-1.5">
          <z-checkbox
            [ngModel]="checkState() === 'checked'"
            [zDisabled]="node().disabled ?? false"
            [attr.aria-checked]="checkState() === 'indeterminate' ? 'mixed' : checkState() === 'checked'"
            (checkChange)="onCheckChange()"
          />
        </span>
      }

      <!-- Content -->
      <div
        [class]="contentClasses()"
        [attr.data-selected]="isSelected() || null"
        [attr.tabindex]="node().disabled ? -1 : 0"
        role="treeitem"
        [attr.aria-selected]="isSelected()"
        (click)="onContentClick()"
        (keydown.enter)="onEnterKey($event)"
      >
        @if (nodeTemplate(); as tmpl) {
          <ng-container [ngTemplateOutlet]="tmpl" [ngTemplateOutletContext]="{ $implicit: node(), level: level() }" />
        } @else {
          @if (node().icon) {
            <z-icon [zType]="$any(node().icon)" class="size-4 shrink-0" />
          }
          <span class="truncate">{{ node().label }}</span>
        }
      </div>
    </div>

    <!-- Children (animated collapse) — skip in flat/virtual-scroll mode -->
    @if (!flat() && node().children?.length && !node().leaf) {
      <div role="group" [class]="childrenClasses()">
        <div class="overflow-hidden">
          @for (child of node().children; track child.key; let i = $index) {
            <z-tree-node
              [node]="child"
              [level]="level() + 1"
              [selectable]="selectable()"
              [checkable]="checkable()"
              [nodeTemplate]="nodeTemplate()"
              role="treeitem"
              [attr.aria-expanded]="child.children?.length ? treeService.isExpanded(child.key) : null"
              [attr.aria-level]="level() + 2"
              [attr.aria-setsize]="node().children!.length"
              [attr.aria-posinset]="i + 1"
              [attr.aria-selected]="selectable() ? treeService.isSelected(child.key) : null"
              [attr.aria-disabled]="child.disabled || null"
              [attr.data-key]="child.key"
            />
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-key]': 'node().key',
  },
  exportAs: 'zTreeNode',
})
export class ZardTreeNodeComponent<T = any> {
  readonly treeService = inject(ZardTreeService);

  readonly node = input.required<TreeNode<T>>();
  readonly level = input<number>(0);
  readonly selectable = input<boolean>(false);
  readonly checkable = input<boolean>(false);
  readonly flat = input<boolean>(false);
  readonly nodeTemplate = input<TemplateRef<TreeNodeTemplateContext<T>> | null>(null);
  readonly class = input<ClassValue>('');

  readonly isExpanded = computed(() => this.treeService.isExpanded(this.node().key));

  readonly isSelected = computed(() => this.treeService.isSelected(this.node().key));

  readonly checkState = computed(() => this.treeService.getCheckState(this.node().key));

  protected readonly hostClasses = computed(() =>
    mergeClasses(treeNodeVariants({ disabled: this.node().disabled ?? false }), this.class()),
  );

  protected readonly toggleClasses = computed(() =>
    mergeClasses(treeNodeToggleVariants({ isExpanded: this.isExpanded() })),
  );

  protected readonly contentClasses = computed(() =>
    mergeClasses(treeNodeContentVariants({ isSelected: this.isSelected() })),
  );

  protected readonly childrenClasses = computed(() =>
    mergeClasses(treeNodeChildrenVariants({ isExpanded: this.isExpanded() })),
  );

  onToggle(event: Event) {
    event.stopPropagation();
    this.treeService.toggle(this.node().key);
  }

  onContentClick() {
    if (this.node().disabled) {
      return;
    }
    this.treeService.notifyNodeClick(this.node());
    if (this.selectable()) {
      this.treeService.select(this.node().key, 'single');
    }
  }

  onEnterKey(event: Event) {
    event.stopPropagation();
    this.onContentClick();
  }

  onCheckChange() {
    if (this.node().disabled) {
      return;
    }
    this.treeService.toggleCheck(this.node());
  }
}
