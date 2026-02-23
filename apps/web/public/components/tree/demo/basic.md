```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTreeImports } from '@/shared/components/tree/tree.imports';
import type { TreeNode } from '@/shared/components/tree/tree.types';

@Component({
  selector: 'z-demo-tree-basic',
  imports: [ZardTreeImports],
  template: `
    <z-tree [zData]="fileSystem" class="w-full max-w-sm" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTreeBasicComponent {
  readonly fileSystem: TreeNode[] = [
    {
      key: 'src',
      label: 'src',
      icon: 'folder',
      children: [
        {
          key: 'app',
          label: 'app',
          icon: 'folder',
          children: [
            { key: 'app.component.ts', label: 'app.component.ts', icon: 'file', leaf: true },
            { key: 'app.component.html', label: 'app.component.html', icon: 'file', leaf: true },
            { key: 'app.module.ts', label: 'app.module.ts', icon: 'file', leaf: true },
          ],
        },
        {
          key: 'assets',
          label: 'assets',
          icon: 'folder',
          children: [{ key: 'logo.svg', label: 'logo.svg', icon: 'file', leaf: true }],
        },
        { key: 'main.ts', label: 'main.ts', icon: 'file', leaf: true },
        { key: 'index.html', label: 'index.html', icon: 'file', leaf: true },
      ],
    },
    {
      key: 'package.json',
      label: 'package.json',
      icon: 'file',
      leaf: true,
    },
    {
      key: 'tsconfig.json',
      label: 'tsconfig.json',
      icon: 'file',
      leaf: true,
    },
    {
      key: 'README.md',
      label: 'README.md',
      icon: 'file',
      leaf: true,
    },
  ];
}

```