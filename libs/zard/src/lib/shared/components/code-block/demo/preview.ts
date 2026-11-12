import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-preview',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>greeting.component.ts</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content>{{ code }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockPreviewComponent {
  protected readonly code = `@Component({
  selector: 'app-greeting',
  template: \`<p>Hello, {{ name() }}!</p>\`,
})
export class GreetingComponent {
  readonly name = input('world');
}`;
}
