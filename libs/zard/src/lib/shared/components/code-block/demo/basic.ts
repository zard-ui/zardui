import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-basic',
  imports: [ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      <z-code-block>
        <z-code-block-content>npx zard-cli@latest add button</z-code-block-content>
      </z-code-block>

      <z-code-block>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="command" />
        </z-code-block-actions>
        <z-code-block-content>{{ command }}</z-code-block-content>
      </z-code-block>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockBasicComponent {
  protected readonly command = 'npx zard-cli@latest add button';
}
