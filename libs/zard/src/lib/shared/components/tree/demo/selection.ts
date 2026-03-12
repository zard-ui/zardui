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
