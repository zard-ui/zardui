import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-line-numbers',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-content zLineNumbers>{{ code }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockLineNumbersComponent {
  protected readonly code = `{
  "name": "chat",
  "private": true,
  "scripts": {
    "start": "ng serve",
    "build": "ng build"
  }
}`;
}
