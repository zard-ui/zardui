import { ChangeDetectionStrategy, Component, resource } from '@angular/core';

import { highlightCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const ESC = String.fromCharCode(27);

const OUTPUT = [
  `${ESC}[1m$ npm test${ESC}[0m`,
  '',
  `${ESC}[32m PASS ${ESC}[0m libs/zard/button.component.spec.ts`,
  `${ESC}[32m PASS ${ESC}[0m libs/zard/card.component.spec.ts`,
  `${ESC}[31m FAIL ${ESC}[0m libs/zard/dialog.component.spec.ts`,
  `  ${ESC}[31m●${ESC}[0m opens and closes`,
  '',
  `${ESC}[1mTests:${ESC}[0m  ${ESC}[31m1 failed${ESC}[0m, ${ESC}[32m24 passed${ESC}[0m, 25 total`,
].join('\n');

// The text to copy has no escape codes.
const PLAIN_OUTPUT = OUTPUT.replace(new RegExp(`${ESC}\\[[0-9;]*m`, 'g'), '');

@Component({
  selector: 'z-demo-code-block-terminal',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>Terminal</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="copyValue" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content>
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockTerminalComponent {
  protected readonly copyValue = PLAIN_OUTPUT;

  private readonly highlighted = resource({ loader: () => highlightCode(OUTPUT, 'ansi') });

  // Without the highlighter the escape codes are removed, so the output stays readable.
  protected lines() {
    return this.highlighted.value() ?? PLAIN_OUTPUT.split('\n').map(line => (line ? [{ content: line }] : []));
  }
}
