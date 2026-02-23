```angular-ts showLineNumbers copyButton
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

  readonly permissions: TreeNode[] = [
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

  onCheckChange(nodes: TreeNode[]) {
    const labels = nodes.filter(n => n.leaf).map(n => n.label);
    this.checkedLabels = labels.length ? labels.join(', ') : 'None';
  }
}

```