import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  inject,
  input,
  numberAttribute,
  output,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardTreeNodeComponent } from './tree-node.component';
import { ZardTreeService } from './tree.service';
import type { FlatTreeNode, TreeNode, TreeNodeTemplateContext } from './tree.types';
import { treeVariants } from './tree.variants';

@Component({
  selector: 'z-tree',
  imports: [ZardTreeNodeComponent, CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf],
  template: `
    @if (zVirtualScroll()) {
      <cdk-virtual-scroll-viewport [itemSize]="zVirtualItemSize()" class="h-full w-full">
        <z-tree-node
          *cdkVirtualFor="let flatNode of flattenedNodes(); trackBy: trackByKey"
          [node]="flatNode.node"
          [level]="flatNode.level"
          [flat]="true"
          [selectable]="zSelectable()"
          [checkable]="zCheckable()"
          [nodeTemplate]="customNodeTemplate() ?? null"
          role="treeitem"
          [attr.aria-expanded]="flatNode.expandable ? treeService.isExpanded(flatNode.node.key) : null"
          [attr.aria-level]="flatNode.level + 1"
          [attr.aria-selected]="zSelectable() ? treeService.isSelected(flatNode.node.key) : null"
          [attr.aria-disabled]="flatNode.node.disabled || null"
          [attr.data-key]="flatNode.node.key"
        />
      </cdk-virtual-scroll-viewport>
    } @else {
      @for (node of zData(); track node.key; let i = $index) {
        <z-tree-node
          [node]="node"
          [level]="0"
          [selectable]="zSelectable()"
          [checkable]="zCheckable()"
          [nodeTemplate]="customNodeTemplate() ?? null"
          role="treeitem"
          [attr.aria-expanded]="node.children?.length ? treeService.isExpanded(node.key) : null"
          [attr.aria-level]="1"
          [attr.aria-setsize]="zData().length"
          [attr.aria-posinset]="i + 1"
          [attr.aria-selected]="zSelectable() ? treeService.isSelected(node.key) : null"
          [attr.aria-disabled]="node.disabled || null"
          [attr.data-key]="node.key"
        />
      }
    }
  `,
  providers: [ZardTreeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'tree',
    '[class]': 'classes()',
    '(keydown)': 'onKeydown($event)',
  },
  exportAs: 'zTree',
})
export class ZardTreeComponent<T = any> {
  readonly treeService = inject(ZardTreeService<T>);
  private readonly elementRef = inject(ElementRef);

  readonly class = input<ClassValue>('');
  readonly zData = input<TreeNode<T>[]>([]);
  readonly zSelectable = input(false, { transform: booleanAttribute });
  readonly zCheckable = input(false, { transform: booleanAttribute });
  readonly zExpandAll = input(false, { transform: booleanAttribute });
  readonly zVirtualScroll = input(false, { transform: booleanAttribute });
  readonly zVirtualItemSize = input(32, { transform: numberAttribute });

  readonly zNodeClick = output<TreeNode<T>>();
  readonly zNodeExpand = output<TreeNode<T>>();
  readonly zNodeCollapse = output<TreeNode<T>>();
  readonly zSelectionChange = output<TreeNode<T>[]>();
  readonly zCheckChange = output<TreeNode<T>[]>();

  readonly customNodeTemplate = contentChild<TemplateRef<TreeNodeTemplateContext<T>>>('nodeTemplate');

  protected readonly classes = computed(() => mergeClasses(treeVariants(), this.class()));

  protected readonly flattenedNodes = computed(() => this.treeService.flattenedNodes());

  private focusedIndex = 0;

  constructor() {
    // Sync data to service
    effect(() => {
      this.treeService.setData(this.zData());
    });

    // Expand all on init if requested
    effect(() => {
      if (this.zExpandAll()) {
        this.treeService.expandAll();
      }
    });

    // Emit selection changes
    effect(() => {
      const keys = this.treeService.selectedKeys();
      if (keys.size > 0) {
        this.zSelectionChange.emit(this.treeService.getSelectedNodes());
      }
    });

    // Emit check changes
    effect(() => {
      const keys = this.treeService.checkedKeys();
      if (keys.size > 0) {
        this.zCheckChange.emit(this.treeService.getCheckedNodes());
      }
    });
  }

  trackByKey(_index: number, item: FlatTreeNode<T>): string {
    return item.node.key;
  }

  onKeydown(event: KeyboardEvent) {
    const nodes = this.treeService.flattenedNodes();
    if (!nodes.length) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveFocus(Math.min(this.focusedIndex + 1, nodes.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveFocus(Math.max(this.focusedIndex - 1, 0));
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.expandFocusedNode();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.collapseFocusedNode();
        break;
      case 'Home':
        event.preventDefault();
        this.moveFocus(0);
        break;
      case 'End':
        event.preventDefault();
        this.moveFocus(nodes.length - 1);
        break;
      case 'Enter':
        event.preventDefault();
        this.activateFocusedNode();
        break;
      case ' ':
        event.preventDefault();
        this.checkFocusedNode();
        break;
    }
  }

  // --- Keyboard helpers ---

  private getFocusedNode(): FlatTreeNode<T> | undefined {
    return this.treeService.flattenedNodes()[this.focusedIndex];
  }

  private moveFocus(index: number) {
    this.focusedIndex = index;
    const node = this.getFocusedNode();
    if (node) {
      this.focusDomNode(node.node.key);
    }
  }

  private expandFocusedNode() {
    const current = this.getFocusedNode();
    if (current?.expandable && !this.treeService.isExpanded(current.node.key)) {
      this.treeService.expand(current.node.key);
      this.zNodeExpand.emit(current.node);
    }
  }

  private collapseFocusedNode() {
    const current = this.getFocusedNode();
    if (current && this.treeService.isExpanded(current.node.key)) {
      this.treeService.collapse(current.node.key);
      this.zNodeCollapse.emit(current.node);
    }
  }

  private activateFocusedNode() {
    const current = this.getFocusedNode();
    if (current && !current.node.disabled) {
      this.zNodeClick.emit(current.node);
      if (this.zSelectable()) {
        this.treeService.select(current.node.key, 'single');
      }
    }
  }

  private checkFocusedNode() {
    const current = this.getFocusedNode();
    if (current && !current.node.disabled && this.zCheckable()) {
      this.treeService.toggleCheck(current.node);
    }
  }

  private focusDomNode(key: string) {
    const el = (this.elementRef.nativeElement as HTMLElement).querySelector<HTMLElement>(`[data-key="${key}"]`);
    el?.focus();
  }
}
