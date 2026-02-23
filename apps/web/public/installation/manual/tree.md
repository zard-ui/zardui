

```angular-ts title="tree.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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

```



```angular-ts title="tree.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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
  'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm transition-transform duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from '@/shared/components/tree/tree.component';
export * from '@/shared/components/tree/tree-node.component';
export * from '@/shared/components/tree/tree-node-toggle.directive';
export * from '@/shared/components/tree/tree-node-content.component';
export * from '@/shared/components/tree/tree.service';
export * from '@/shared/components/tree/tree.types';
export * from '@/shared/components/tree/tree.variants';
export * from '@/shared/components/tree/tree.imports';

```



```angular-ts title="tree-node-content.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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



```angular-ts title="tree-node-toggle.directive.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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



```angular-ts title="tree-node.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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
        <span class="inline-flex h-6 w-6 shrink-0"></span>
      }

      <!-- Checkbox -->
      @if (checkable()) {
        <z-checkbox
          class="mr-1"
          [ngModel]="checkState() === 'checked'"
          [zDisabled]="node().disabled ?? false"
          [attr.aria-checked]="checkState() === 'indeterminate' ? 'mixed' : checkState() === 'checked'"
          (checkChange)="onCheckChange()"
        />
      }

      <!-- Content -->
      <div
        [class]="contentClasses()"
        [attr.data-selected]="isSelected() || null"
        [attr.tabindex]="node().disabled ? -1 : 0"
        role="treeitem"
        [attr.aria-selected]="isSelected()"
        (click)="onContentClick()"
        (keydown.enter)="onContentClick()"
      >
        @if (nodeTemplate(); as tmpl) {
          <ng-container [ngTemplateOutlet]="tmpl" [ngTemplateOutletContext]="{ $implicit: node(), level: level() }" />
        } @else {
          @if (node().icon) {
            <z-icon [zType]="$any(node().icon)" class="mr-1.5 size-4 shrink-0" />
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



```angular-ts title="tree.imports.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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



```angular-ts title="tree.service.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { computed, Injectable, signal } from '@angular/core';

import type { FlatTreeNode, TreeCheckState, TreeNode } from './tree.types';

@Injectable()
export class ZardTreeService<T = any> {
  readonly expandedKeys = signal<Set<string>>(new Set());
  readonly selectedKeys = signal<Set<string>>(new Set());
  readonly checkedKeys = signal<Set<string>>(new Set());
  readonly indeterminateKeys = signal<Set<string>>(new Set());

  private readonly dataSignal = signal<TreeNode<T>[]>([]);

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



```angular-ts title="tree.types.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export interface TreeNode<T = any> {
  key: string;
  label: string;
  data?: T;
  icon?: string;
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

export interface FlatTreeNode<T = any> {
  node: TreeNode<T>;
  level: number;
  expandable: boolean;
  index: number;
}

```

