import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFile, lucideFolder } from '@ng-icons/lucide';

import { ZardCollapsibleImports } from '@zard/components/collapsible/collapsible.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

interface Change {
  readonly file: string;
  readonly state: string;
}

/** shadcn models the tree as nested arrays; a typed node keeps the recursive template readable. */
interface TreeNode {
  readonly name: string;
  readonly children?: readonly TreeNode[];
}

const file = (name: string): TreeNode => ({ name });
const folder = (name: string, children: readonly TreeNode[]): TreeNode => ({ name, children });

@Component({
  selector: 'lib-sidebar-11-app-sidebar',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardCollapsibleImports, NgTemplateOutlet, NgIcon],
  viewProviders: [provideIcons({ lucideChevronRight, lucideFile, lucideFolder })],
  templateUrl: './sidebar-11-app-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar11AppSidebarComponent {
  // This is sample data.
  protected readonly changes: readonly Change[] = [
    { file: 'README.md', state: 'M' },
    { file: 'api/hello/route.ts', state: 'U' },
    { file: 'app/layout.tsx', state: 'M' },
  ];

  protected readonly tree: readonly TreeNode[] = [
    folder('app', [
      folder('api', [folder('hello', [file('route.ts')])]),
      file('page.tsx'),
      file('layout.tsx'),
      folder('blog', [file('page.tsx')]),
    ]),
    folder('components', [
      folder('ui', [file('button.tsx'), file('card.tsx')]),
      file('header.tsx'),
      file('footer.tsx'),
    ]),
    folder('lib', [file('util.ts')]),
    folder('public', [file('favicon.ico'), file('vercel.svg')]),
    file('.eslintrc.json'),
    file('.gitignore'),
    file('next.config.js'),
    file('tailwind.config.js'),
    file('package.json'),
    file('README.md'),
  ];

  protected isOpenByDefault(node: TreeNode): boolean {
    return node.name === 'components' || node.name === 'ui';
  }
}
