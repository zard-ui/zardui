import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-basic',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-content>{{ output }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockBasicComponent {
  protected readonly output = `$ ng build
Initial chunk files   | Names         |  Raw size | Estimated transfer size
main-HJ2K4QXZ.js      | main          | 208.31 kB |                56.24 kB
styles-5INURTSO.css   | styles        |  14.07 kB |                 3.18 kB

                      | Initial total | 222.38 kB |                59.42 kB

Application bundle generation complete. [4.218 seconds]`;
}
