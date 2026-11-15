import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const LOGS = Array.from(
  { length: 40 },
  (_, index) => `[${String(index + 1).padStart(2, '0')}] GET /api/chat 200 in ${12 + ((index * 7) % 40)}ms`,
).join('\n');

@Component({
  selector: 'z-demo-code-block-height',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>Logs</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="logs" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content class="scroll-fade-y max-h-48">{{ logs }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockHeightComponent {
  protected readonly logs = LOGS;
}
