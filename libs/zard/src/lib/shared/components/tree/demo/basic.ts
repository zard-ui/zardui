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
