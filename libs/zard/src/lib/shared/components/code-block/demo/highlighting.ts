import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CODE = `{
  "location": "San Francisco",
  "temperature": 18,
  "unit": "celsius",
  "conditions": ["fog", "wind"]
}`;

@Component({
  selector: 'z-demo-code-block-highlighting',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>getWeather output</z-code-block-title>
      </z-code-block-header>
      <z-code-block-content>
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockHighlightingComponent {
  protected readonly lines = injectHighlightedCode(CODE, 'json');
}
