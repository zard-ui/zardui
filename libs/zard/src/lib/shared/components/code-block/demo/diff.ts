import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import type { ZardCodeBlockLineTypeVariants } from '@/shared/components/code-block/code-block.variants';

const PATCH = ` @Component({
   selector: 'app-greeting',
-  template: '<p>Hello, {{ name() }}</p>',
+  template: \`<p class="text-muted-foreground text-sm">
+    Hello, {{ name() }}!
+  </p>\`,
 })`;

function lineType(line: string): ZardCodeBlockLineTypeVariants {
  if (line.startsWith('+')) {
    return 'added';
  }

  if (line.startsWith('-')) {
    return 'removed';
  }

  return 'default';
}

@Component({
  selector: 'z-demo-code-block-diff',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>src/app/greeting/greeting.component.ts</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="patch" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content>
        @for (line of lines; track $index) {
          <z-code-block-line [zType]="line.type">{{ line.text }}</z-code-block-line>
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockDiffComponent {
  protected readonly patch = PATCH;

  // The first character of a diff row is the marker (+, - or a space); the line component draws it instead.
  protected readonly lines = PATCH.split('\n').map(line => ({ type: lineType(line), text: line.slice(1) }));
}
