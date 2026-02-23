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
