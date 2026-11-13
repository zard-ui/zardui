import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const COMMAND = 'pnpm add @angular/cdk @ng-icons/core @ng-icons/lucide';

@Component({
  selector: 'z-demo-code-block-header',
  imports: [NgIcon, ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>
          <ng-icon name="lucideTerminal" />
          Terminal
        </z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="command" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content>{{ output }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockHeaderComponent {
  protected readonly command = COMMAND;
  protected readonly output = `$ ${COMMAND}
Packages: +9
Progress: resolved 412, reused 403, downloaded 9, added 9, done
Done in 2.8s using pnpm v10.18.0`;
}
