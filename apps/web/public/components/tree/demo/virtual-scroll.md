```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
})
export class ZardDemoTreeVirtualScrollComponent {
  readonly largeTree: TreeNode[];
  readonly nodeCount: number;

  constructor() {
    this.largeTree = this.generateTree(100, 3);
    this.nodeCount = this.countNodes(this.largeTree);
  }

  private generateTree(breadth: number, depth: number, prefix = '', level = 0): TreeNode[] {
    if (depth === 0) {
      return [];
    }
    return Array.from({ length: breadth }, (_, i) => {
      const key = prefix ? `${prefix}-${i}` : `${i}`;
      const children = depth > 1 ? this.generateTree(Math.min(breadth, 5), depth - 1, key, level + 1) : [];
      return {
        key,
        label: children.length > 0 ? `Folder ${key}` : `File ${key}`,
        icon: children.length > 0 ? 'folder' : ('file' as string | undefined),
        leaf: children.length === 0,
        children: children.length > 0 ? children : undefined,
      };
    });
  }

  private countNodes(nodes: TreeNode[]): number {
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