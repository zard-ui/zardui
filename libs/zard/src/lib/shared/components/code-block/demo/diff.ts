import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import type { ZardCodeBlockLineTypeVariants } from '@/shared/components/code-block/code-block.variants';

const PATCH = ` export class ZardButtonComponent {
-  readonly zType = input('default');
+  readonly zType = input<ZardButtonTypeVariants>('default');
   readonly zSize = input<ZardButtonSizeVariants>('default');
 }`;

@Component({
  selector: 'z-demo-code-block-diff',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>button.component.ts</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="patch" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zLineNumbers>
        @for (line of lines; track $index) {
          <z-code-block-line [zType]="line.type">{{ line.text }}</z-code-block-line>
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockDiffComponent {
  protected readonly patch = PATCH;

  // The `+` / `-` marker is drawn by the line itself, so it is removed from the text.
  protected readonly lines: { text: string; type: ZardCodeBlockLineTypeVariants }[] = PATCH.split('\n').map(line => ({
    text: line.slice(1),
    type: line.startsWith('+') ? 'added' : line.startsWith('-') ? 'removed' : 'default',
  }));
}
