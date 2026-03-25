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
