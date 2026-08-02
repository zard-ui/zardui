---
title: Tree
description: A hierarchical tree view for displaying nested data structures with expand/collapse, selection, and checkboxes.
---

# Tree

A hierarchical tree view for displaying nested data structures with expand/collapse, selection, and checkboxes.

## Installation

### CLI

```bash
npx zard-cli@latest add tree
```

### Manual

```angular-ts
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
      <cdk-virtual-scroll-viewport [itemSize]="zVirtualItemSize()" class="size-full">
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
export class ZardTreeComponent<T> {
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

    // Emit node click from tree-node interactions
    effect(() => {
      const clicked = this.treeService.clickedNode();
      if (clicked) {
        this.zNodeClick.emit(clicked.node);
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
      this.treeService.notifyNodeClick(current.node);
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
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const treeVariants = cva('flex flex-col text-sm', {
  variants: {},
  defaultVariants: {},
});

export const treeNodeVariants = cva('flex flex-col', {
  variants: {
    disabled: {
      true: 'opacity-50 pointer-events-none',
      false: '',
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

export const treeNodeToggleVariants = cva(
  'inline-flex size-4 shrink-0 items-center justify-center rounded-sm transition-transform duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      isExpanded: {
        true: 'rotate-90',
        false: 'rotate-0',
      },
    },
    defaultVariants: {
      isExpanded: false,
    },
  },
);

export const treeNodeContentVariants = cva(
  'flex flex-1 items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer select-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      isSelected: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
    },
    defaultVariants: {
      isSelected: false,
    },
  },
);

export const treeNodeChildrenVariants = cva('grid transition-all duration-200 ease-in-out', {
  variants: {
    isExpanded: {
      true: 'grid-rows-[1fr]',
      false: 'grid-rows-[0fr]',
    },
  },
  defaultVariants: {
    isExpanded: false,
  },
});

export type ZardTreeVariants = VariantProps<typeof treeVariants>;
export type ZardTreeNodeVariants = VariantProps<typeof treeNodeVariants>;
export type ZardTreeNodeToggleVariants = VariantProps<typeof treeNodeToggleVariants>;
export type ZardTreeNodeContentVariants = VariantProps<typeof treeNodeContentVariants>;
export type ZardTreeNodeChildrenVariants = VariantProps<typeof treeNodeChildrenVariants>;
```

```angular-ts
export * from '@/shared/components/tree/tree.component';
export * from '@/shared/components/tree/tree-node.component';
export * from '@/shared/components/tree/tree-node-toggle.directive';
export * from '@/shared/components/tree/tree-node-content.component';
export * from '@/shared/components/tree/tree.service';
export * from '@/shared/components/tree/tree.types';
export * from '@/shared/components/tree/tree.variants';
export * from '@/shared/components/tree/tree.imports';
```

```angular-ts
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
```

```angular-ts
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
```

```angular-ts
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

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
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
  imports: [NgTemplateOutlet, FormsModule, NgIcon, ZardCheckboxComponent],
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
          <ng-icon name="lucideChevronRight" class="size-4!" />
        </button>
      } @else {
        <span class="inline-flex size-4 shrink-0"></span>
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
        (keydown.enter.stop)="onContentClick()"
      >
        @if (nodeTemplate(); as tmpl) {
          <ng-container [ngTemplateOutlet]="tmpl" [ngTemplateOutletContext]="{ $implicit: node(), level: level() }" />
        } @else {
          @if (node().icon) {
            <ng-icon [name]="node().icon" class="size-4! shrink-0" />
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
  viewProviders: [
    provideIcons({
      lucideChevronRight,
    }),
  ],
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-key]': 'node().key',
  },
  exportAs: 'zTreeNode',
})
export class ZardTreeNodeComponent<T> {
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

  onCheckChange() {
    if (this.node().disabled) {
      return;
    }
    this.treeService.toggleCheck(this.node());
  }
}
```

```angular-ts
import { ZardTreeNodeContentComponent } from '@/shared/components/tree/tree-node-content.component';
import { ZardTreeNodeToggleDirective } from '@/shared/components/tree/tree-node-toggle.directive';
import { ZardTreeNodeComponent } from '@/shared/components/tree/tree-node.component';
import { ZardTreeComponent } from '@/shared/components/tree/tree.component';

export const ZardTreeImports = [
  ZardTreeComponent,
  ZardTreeNodeComponent,
  ZardTreeNodeToggleDirective,
  ZardTreeNodeContentComponent,
] as const;
```

```angular-ts
import { computed, Injectable, signal } from '@angular/core';

import type { FlatTreeNode, TreeCheckState, TreeNode } from './tree.types';

@Injectable()
export class ZardTreeService<T = any> {
  readonly expandedKeys = signal<Set<string>>(new Set());
  readonly selectedKeys = signal<Set<string>>(new Set());
  readonly checkedKeys = signal<Set<string>>(new Set());
  readonly indeterminateKeys = signal<Set<string>>(new Set());

  private readonly dataSignal = signal<TreeNode<T>[]>([]);

  // Click notification from tree-node → tree component (to emit zNodeClick output)
  private _clickId = 0;
  readonly clickedNode = signal<{ node: TreeNode<T>; _id: number } | null>(null);

  notifyNodeClick(node: TreeNode<T>) {
    this.clickedNode.set({ node, _id: ++this._clickId });
  }

  readonly flattenedNodes = computed(() => {
    const result: FlatTreeNode<T>[] = [];
    let index = 0;
    const flatten = (nodes: TreeNode<T>[], level: number) => {
      for (const node of nodes) {
        const expandable = !node.leaf && !!node.children?.length;
        result.push({ node, level, expandable, index: index++ });
        if (expandable && this.expandedKeys().has(node.key)) {
          flatten(node.children!, level + 1);
        }
      }
    };
    flatten(this.dataSignal(), 0);
    return result;
  });

  setData(data: TreeNode<T>[]) {
    this.dataSignal.set(data);
  }

  // --- Expand / Collapse ---

  isExpanded(key: string): boolean {
    return this.expandedKeys().has(key);
  }

  toggle(key: string) {
    if (this.isExpanded(key)) {
      this.collapse(key);
    } else {
      this.expand(key);
    }
  }

  expand(key: string) {
    this.expandedKeys.update(keys => {
      const next = new Set(keys);
      next.add(key);
      return next;
    });
  }

  collapse(key: string) {
    this.expandedKeys.update(keys => {
      const next = new Set(keys);
      next.delete(key);
      return next;
    });
  }

  expandAll() {
    const allKeys = new Set<string>();
    const collect = (nodes: TreeNode<T>[]) => {
      for (const node of nodes) {
        if (!node.leaf && node.children?.length) {
          allKeys.add(node.key);
          collect(node.children);
        }
      }
    };
    collect(this.dataSignal());
    this.expandedKeys.set(allKeys);
  }

  collapseAll() {
    this.expandedKeys.set(new Set());
  }

  // --- Selection ---

  isSelected(key: string): boolean {
    return this.selectedKeys().has(key);
  }

  select(key: string, mode: 'single' | 'multiple') {
    if (mode === 'single') {
      this.selectedKeys.set(new Set([key]));
    } else {
      this.selectedKeys.update(keys => {
        const next = new Set(keys);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    }
  }

  deselect(key: string) {
    this.selectedKeys.update(keys => {
      const next = new Set(keys);
      next.delete(key);
      return next;
    });
  }

  getSelectedNodes(): TreeNode<T>[] {
    const selected: TreeNode<T>[] = [];
    const collect = (nodes: TreeNode<T>[]) => {
      for (const node of nodes) {
        if (this.selectedKeys().has(node.key)) {
          selected.push(node);
        }
        if (node.children?.length) {
          collect(node.children);
        }
      }
    };
    collect(this.dataSignal());
    return selected;
  }

  // --- Checkbox with propagation ---

  getCheckState(key: string): TreeCheckState {
    if (this.checkedKeys().has(key)) {
      return 'checked';
    }
    if (this.indeterminateKeys().has(key)) {
      return 'indeterminate';
    }
    return 'unchecked';
  }

  toggleCheck(node: TreeNode<T>) {
    const isChecked = this.checkedKeys().has(node.key);
    if (isChecked) {
      this.uncheckNode(node);
    } else {
      this.checkNode(node);
    }
    this.updateAncestors(this.dataSignal());
  }

  private checkNode(node: TreeNode<T>) {
    this.checkedKeys.update(keys => {
      const next = new Set(keys);
      next.add(node.key);
      return next;
    });
    this.indeterminateKeys.update(keys => {
      const next = new Set(keys);
      next.delete(node.key);
      return next;
    });
    if (node.children?.length) {
      for (const child of node.children) {
        if (!child.disabled) {
          this.checkNode(child);
        }
      }
    }
  }

  private uncheckNode(node: TreeNode<T>) {
    this.checkedKeys.update(keys => {
      const next = new Set(keys);
      next.delete(node.key);
      return next;
    });
    this.indeterminateKeys.update(keys => {
      const next = new Set(keys);
      next.delete(node.key);
      return next;
    });
    if (node.children?.length) {
      for (const child of node.children) {
        if (!child.disabled) {
          this.uncheckNode(child);
        }
      }
    }
  }

  private updateAncestors(nodes: TreeNode<T>[]) {
    const checked = this.checkedKeys();
    const nextIndeterminate = new Set<string>();

    const computeState = (node: TreeNode<T>): 'checked' | 'unchecked' | 'indeterminate' => {
      if (!node.children?.length) {
        return checked.has(node.key) ? 'checked' : 'unchecked';
      }

      const childStates = node.children.filter(c => !c.disabled).map(c => computeState(c));

      const allChecked = childStates.length > 0 && childStates.every(s => s === 'checked');
      const someChecked = childStates.some(s => s === 'checked' || s === 'indeterminate');

      if (allChecked) {
        this.checkedKeys.update(keys => {
          const next = new Set(keys);
          next.add(node.key);
          return next;
        });
        return 'checked';
      } else if (someChecked) {
        this.checkedKeys.update(keys => {
          const next = new Set(keys);
          next.delete(node.key);
          return next;
        });
        nextIndeterminate.add(node.key);
        return 'indeterminate';
      } else {
        this.checkedKeys.update(keys => {
          const next = new Set(keys);
          next.delete(node.key);
          return next;
        });
        return 'unchecked';
      }
    };

    for (const node of nodes) {
      computeState(node);
    }

    this.indeterminateKeys.set(nextIndeterminate);
  }

  getCheckedNodes(): TreeNode<T>[] {
    const result: TreeNode<T>[] = [];
    const collect = (nodes: TreeNode<T>[]) => {
      for (const node of nodes) {
        if (this.checkedKeys().has(node.key)) {
          result.push(node);
        }
        if (node.children?.length) {
          collect(node.children);
        }
      }
    };
    collect(this.dataSignal());
    return result;
  }

  // --- Helpers ---

  findNode(key: string, nodes?: TreeNode<T>[]): TreeNode<T> | null {
    for (const node of nodes ?? this.dataSignal()) {
      if (node.key === key) {
        return node;
      }
      if (node.children?.length) {
        const found = this.findNode(key, node.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
}
```

```angular-ts
import type { IconName } from '@ng-icons/core';

export interface TreeNode<T> {
  key: string;
  label: string;
  data?: T;
  icon?: IconName;
  children?: TreeNode<T>[];
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean;
  disabled?: boolean;
  leaf?: boolean;
}

export interface TreeNodeTemplateContext<T = unknown> {
  $implicit: TreeNode<T>;
  level: number;
}

export type TreeCheckState = 'checked' | 'unchecked' | 'indeterminate';

export interface FlatTreeNode<T> {
  node: TreeNode<T>;
  level: number;
  expandable: boolean;
  index: number;
}
```

## Usage

```angular-ts
import { ZardTreeImports } from '@/shared/components/tree/tree.imports';
```

```angular-html
<z-tree [data]="treeData"></z-tree>
```

## Examples

### Basic

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideFile, lucideFolder } from '@ng-icons/lucide';

import { ZardTreeImports } from '@/shared/components/tree/tree.imports';
import type { TreeNode } from '@/shared/components/tree/tree.types';

@Component({
  selector: 'z-demo-tree-basic',
  imports: [ZardTreeImports],
  template: `
    <z-tree [zData]="fileSystem" class="w-full max-w-sm" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFolder, lucideFile })],
})
export class ZardDemoTreeBasicComponent {
  readonly fileSystem: TreeNode<unknown>[] = [
    {
      key: 'src',
      label: 'src',
      icon: 'lucideFolder',
      children: [
        {
          key: 'app',
          label: 'app',
          icon: 'lucideFolder',
          children: [
            { key: 'app.component.ts', label: 'app.component.ts', icon: 'lucideFile', leaf: true },
            { key: 'app.component.html', label: 'app.component.html', icon: 'lucideFile', leaf: true },
            { key: 'app.module.ts', label: 'app.module.ts', icon: 'lucideFile', leaf: true },
          ],
        },
        {
          key: 'assets',
          label: 'assets',
          icon: 'lucideFolder',
          children: [{ key: 'logo.svg', label: 'logo.svg', icon: 'lucideFile', leaf: true }],
        },
        { key: 'main.ts', label: 'main.ts', icon: 'lucideFile', leaf: true },
        { key: 'index.html', label: 'index.html', icon: 'lucideFile', leaf: true },
      ],
    },
    {
      key: 'package.json',
      label: 'package.json',
      icon: 'lucideFile',
      leaf: true,
    },
    {
      key: 'tsconfig.json',
      label: 'tsconfig.json',
      icon: 'lucideFile',
      leaf: true,
    },
    {
      key: 'README.md',
      label: 'README.md',
      icon: 'lucideFile',
      leaf: true,
    },
  ];
}
```

### Checkable

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTreeImports } from '@/shared/components/tree/tree.imports';
import type { TreeNode } from '@/shared/components/tree/tree.types';

@Component({
  selector: 'z-demo-tree-checkable',
  imports: [ZardTreeImports],
  template: `
    <z-tree [zData]="permissions" zCheckable (zCheckChange)="onCheckChange($event)" class="w-full max-w-sm" />
    <p class="text-muted-foreground mt-4 text-sm">Checked: {{ checkedLabels }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTreeCheckableComponent {
  checkedLabels = 'None';

  readonly permissions: TreeNode<unknown>[] = [
    {
      key: 'admin',
      label: 'Administration',
      children: [
        {
          key: 'users',
          label: 'User Management',
          children: [
            { key: 'users-create', label: 'Create Users', leaf: true },
            { key: 'users-edit', label: 'Edit Users', leaf: true },
            { key: 'users-delete', label: 'Delete Users', leaf: true },
          ],
        },
        {
          key: 'roles',
          label: 'Role Management',
          children: [
            { key: 'roles-create', label: 'Create Roles', leaf: true },
            { key: 'roles-edit', label: 'Edit Roles', leaf: true },
          ],
        },
      ],
    },
    {
      key: 'content',
      label: 'Content',
      children: [
        { key: 'content-view', label: 'View Content', leaf: true },
        { key: 'content-edit', label: 'Edit Content', leaf: true },
        { key: 'content-publish', label: 'Publish Content', leaf: true },
      ],
    },
  ];

  onCheckChange(nodes: TreeNode<unknown>[]) {
    const labels = nodes.filter(n => n.leaf).map(n => n.label);
    this.checkedLabels = labels.length ? labels.join(', ') : 'None';
  }
}
```

### Selection

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideMonitor, lucideSmartphone, lucideTablet, lucideTag } from '@ng-icons/lucide';

import { ZardTreeImports } from '@/shared/components/tree/tree.imports';
import type { TreeNode } from '@/shared/components/tree/tree.types';

@Component({
  selector: 'z-demo-tree-selection',
  imports: [ZardTreeImports],
  template: `
    <z-tree
      [zData]="categories"
      zSelectable
      (zSelectionChange)="onSelect($event)"
      (zNodeClick)="onNodeClick($event)"
      class="w-full max-w-sm"
    />
    <p class="text-muted-foreground mt-4 text-sm">Selected: {{ selectedLabel }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideMonitor,
      lucideSmartphone,
      lucideTablet,
      lucideTag,
    }),
  ],
})
export class ZardDemoTreeSelectionComponent {
  selectedLabel = 'None';

  readonly categories: TreeNode<unknown>[] = [
    {
      key: 'electronics',
      label: 'Electronics',
      icon: 'lucideMonitor',
      children: [
        {
          key: 'phones',
          label: 'Phones',
          icon: 'lucideSmartphone',
          children: [
            { key: 'iphone', label: 'iPhone', leaf: true },
            { key: 'samsung', label: 'Samsung Galaxy', leaf: true },
            { key: 'pixel', label: 'Google Pixel', leaf: true },
          ],
        },
        {
          key: 'laptops',
          label: 'Laptops',
          icon: 'lucideTablet',
          children: [
            { key: 'macbook', label: 'MacBook Pro', leaf: true },
            { key: 'thinkpad', label: 'ThinkPad', leaf: true },
          ],
        },
      ],
    },
    {
      key: 'clothing',
      label: 'Clothing',
      icon: 'lucideTag',
      children: [
        { key: 'mens', label: "Men's", leaf: true },
        { key: 'womens', label: "Women's", leaf: true },
      ],
    },
  ];

  onSelect(nodes: TreeNode<unknown>[]) {
    this.selectedLabel = nodes.map(n => n.label).join(', ') || 'None';
  }

  onNodeClick(_node: TreeNode<unknown>) {
    // Handle node click
  }
}
```

### Virtual Scroll

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideFile, lucideFolder } from '@ng-icons/lucide';

import { ZardTreeImports } from '@/shared/components/tree/tree.imports';
import type { TreeNode } from '@/shared/components/tree/tree.types';

@Component({
  selector: 'z-demo-tree-virtual-scroll',
  imports: [ZardTreeImports],
  template: `
    <z-tree
      [zData]="largeTree"
      zVirtualScroll
      [zVirtualItemSize]="32"
      zExpandAll
      class="h-[400px] w-full max-w-md rounded-md border"
    />
    <p class="text-muted-foreground mt-4 text-sm">{{ nodeCount }} total nodes with virtual scrolling</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ folder: lucideFolder, file: lucideFile })],
})
export class ZardDemoTreeVirtualScrollComponent {
  readonly largeTree: TreeNode<unknown>[];
  readonly nodeCount: number;

  constructor() {
    this.largeTree = this.generateTree(100, 3);
    this.nodeCount = this.countNodes(this.largeTree);
  }

  private generateTree(breadth: number, depth: number, prefix = '', level = 0): TreeNode<unknown>[] {
    if (depth === 0) {
      return [];
    }
    return Array.from({ length: breadth }, (_, i) => {
      const key = prefix ? `${prefix}-${i}` : `${i}`;
      const children = depth > 1 ? this.generateTree(Math.min(breadth, 5), depth - 1, key, level + 1) : [];
      return {
        key,
        label: children.length > 0 ? `Folder ${key}` : `File ${key}`,
        icon: children.length > 0 ? 'lucideFolder' : 'lucideFile',
        leaf: children.length === 0,
        children: children.length > 0 ? children : undefined,
      };
    });
  }

  private countNodes(nodes: TreeNode<unknown>[]): number {
    let count = 0;
    for (const node of nodes) {
      count++;
      if (node.children) {
        count += this.countNodes(node.children);
      }
    }
    return count;
  }
}
```

## API Reference

### z-tree

The root container for a hierarchical tree view.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[zData]` | Tree data source | `TreeNode<T>[]` | `[]` |
| `[zSelectable]` | Enable node selection on click | `boolean` | `false` |
| `[zCheckable]` | Enable checkbox selection with propagation | `boolean` | `false` |
| `[zExpandAll]` | Expand all nodes initially | `boolean` | `false` |
| `[zVirtualScroll]` | Enable virtual scrolling for large trees | `boolean` | `false` |
| `[zVirtualItemSize]` | Virtual scroll item height in pixels | `number` | `32` |
| `(zNodeClick)` | Node clicked | `TreeNode<T>` | `-` |
| `(zNodeExpand)` | Node expanded | `TreeNode<T>` | `-` |
| `(zNodeCollapse)` | Node collapsed | `TreeNode<T>` | `-` |
| `(zSelectionChange)` | Selection changed | `TreeNode<T>[]` | `-` |
| `(zCheckChange)` | Checked nodes changed | `TreeNode<T>[]` | `-` |

---

[Open in browser](https://zardui.com/docs/components/tree)
