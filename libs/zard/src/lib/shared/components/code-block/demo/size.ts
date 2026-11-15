import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-size',
  imports: [NgIcon, ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      @for (size of sizes; track size) {
        <z-code-block [zSize]="size">
          <z-code-block-header>
            <z-code-block-title>
              <ng-icon name="lucideTerminal" />
              Terminal
            </z-code-block-title>
            <z-code-block-actions>
              <z-code-block-copy-button [zValue]="output" />
            </z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content zWrap>{{ output }}</z-code-block-content>
        </z-code-block>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockSizeComponent {
  protected readonly sizes = ['default', 'sm'] as const;

  protected readonly output = `$ pnpm add @angular/cdk @ng-icons/core @ng-icons/lucide
Progress: resolved 412, reused 403, downloaded 9, added 9, done
Done in 2.8s using pnpm v10.18.0`;
}
