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
