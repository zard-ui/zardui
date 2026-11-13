import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-floating-actions',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-actions>
        <z-code-block-copy-button [zValue]="output" />
      </z-code-block-actions>
      <z-code-block-content>{{ output }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockFloatingActionsComponent {
  protected readonly output = `$ pnpm add @angular/cdk @ng-icons/core @ng-icons/lucide
Progress: resolved 412, reused 403, downloaded 9, added 9, done
dependencies:
+ @angular/cdk 21.0.2
+ @ng-icons/core 32.2.0
+ @ng-icons/lucide 32.2.0
Done in 2.8s using pnpm v10.18.0`;
}
