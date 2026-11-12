import { ChangeDetectionStrategy, Component, resource } from '@angular/core';

import { highlightCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CODE = `import { Component, input } from '@angular/core';

@Component({
  selector: 'app-greeting',
  template: \`<p>Hello, {{ name() }}!</p>\`,
})
export class GreetingComponent {
  readonly name = input('world');
}`;

@Component({
  selector: 'z-demo-code-block-highlighting',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>greeting.component.ts</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zLineNumbers>
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockHighlightingComponent {
  protected readonly code = CODE;

  // Shiki is loaded on demand. A resource also holds the server render until the code is highlighted.
  private readonly highlighted = resource({ loader: () => highlightCode(CODE, 'typescript') });

  // Plain lines are shown until the highlighted ones arrive.
  protected lines() {
    return this.highlighted.value() ?? CODE.split('\n').map(line => (line ? [{ content: line }] : []));
  }
}
