import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const ESC = String.fromCharCode(27);

const OUTPUT = [
  '$ ng test',
  `${ESC}[32m✓${ESC}[39m src/app/format.spec.ts ${ESC}[2m(4 tests)${ESC}[22m`,
  `${ESC}[32m✓${ESC}[39m src/app/parse.spec.ts ${ESC}[2m(7 tests)${ESC}[22m`,
  `${ESC}[31m✗${ESC}[39m src/app/chat/chat.service.spec.ts ${ESC}[2m(3 tests | 1 failed)${ESC}[22m`,
  '',
  `${ESC}[31mAssertionError: expected 'hello' to be 'hello world'${ESC}[39m`,
  '',
  `Tests  ${ESC}[31m1 failed${ESC}[39m | ${ESC}[32m13 passed${ESC}[39m (14)`,
].join('\n');

// The text to copy has no escape codes.
const PLAIN_OUTPUT = OUTPUT.replace(new RegExp(`${ESC}\\[[0-9;]*m`, 'g'), '');

@Component({
  selector: 'z-demo-code-block-terminal',
  imports: [NgIcon, ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>
          <ng-icon name="lucideTerminal" />
          Terminal
        </z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="plainOutput" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zWrap>
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockTerminalComponent {
  protected readonly plainOutput = PLAIN_OUTPUT;
  protected readonly lines = injectHighlightedCode(OUTPUT, 'ansi');
}
