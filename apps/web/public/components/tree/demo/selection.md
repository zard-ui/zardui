```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
})
export class ZardDemoTreeSelectionComponent {
  selectedLabel = 'None';

  readonly categories: TreeNode[] = [
    {
      key: 'electronics',
      label: 'Electronics',
      icon: 'monitor',
      children: [
        {
          key: 'phones',
          label: 'Phones',
          icon: 'smartphone',
          children: [
            { key: 'iphone', label: 'iPhone', leaf: true },
            { key: 'samsung', label: 'Samsung Galaxy', leaf: true },
            { key: 'pixel', label: 'Google Pixel', leaf: true },
          ],
        },
        {
          key: 'laptops',
          label: 'Laptops',
          icon: 'laptop',
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
      icon: 'shirt',
      children: [
        { key: 'mens', label: "Men's", leaf: true },
        { key: 'womens', label: "Women's", leaf: true },
      ],
    },
  ];

  onSelect(nodes: TreeNode[]) {
    this.selectedLabel = nodes.map(n => n.label).join(', ') || 'None';
  }

  onNodeClick(node: TreeNode) {
    console.log('Clicked:', node.label);
  }
}

```