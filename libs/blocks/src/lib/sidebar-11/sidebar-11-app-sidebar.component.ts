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
    { file: 'core/services/hello.service.ts', state: 'U' },
    { file: 'app/app.component.ts', state: 'M' },
  ];

  protected readonly tree: readonly TreeNode[] = [
    folder('app', [
      folder('core', [folder('services', [file('hello.service.ts')])]),
      file('app.component.ts'),
      file('app.config.ts'),
      folder('blog', [file('blog.page.ts')]),
    ]),
    folder('components', [
      folder('ui', [file('button.component.ts'), file('card.component.ts')]),
      file('header.component.ts'),
      file('footer.component.ts'),
    ]),
    folder('lib', [file('util.ts')]),
    folder('public', [file('favicon.ico'), file('angular.svg')]),
    file('.editorconfig'),
    file('.gitignore'),
    file('angular.json'),
    file('tsconfig.json'),
    file('package.json'),
    file('README.md'),
  ];

  protected isOpenByDefault(node: TreeNode): boolean {
    return node.name === 'components' || node.name === 'ui';
  }
}
