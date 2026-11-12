import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-variants',
  imports: [ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      <z-code-block zType="destructive">
        <z-code-block-header>
          <z-code-block-title>Error</z-code-block-title>
          <z-code-block-actions>
            <z-code-block-copy-button [zValue]="error" />
          </z-code-block-actions>
        </z-code-block-header>
        <z-code-block-content zWrap>{{ error }}</z-code-block-content>
      </z-code-block>

      <z-code-block zSize="sm">
        <z-code-block-header>
          <z-code-block-title>Output</z-code-block-title>
          <z-code-block-actions>
            <z-code-block-copy-button [zValue]="output" />
          </z-code-block-actions>
        </z-code-block-header>
        <z-code-block-content zWrap>{{ output }}</z-code-block-content>
      </z-code-block>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockVariantsComponent {
  protected readonly error = `TypeError: Cannot read properties of undefined (reading 'name')
    at GreetingComponent.ngOnInit (greeting.component.ts:12:30)`;

  protected readonly output = `Compiled successfully in 1.2s
12 modules transformed.`;
}
