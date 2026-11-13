import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-destructive',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block zType="destructive" class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>Error</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="error" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zWrap>{{ error }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockDestructiveComponent {
  protected readonly error = `ERROR TypeError: Cannot read properties of undefined (reading 'map')
    at MessageListComponent_Template (message-list.component.html:4:22)
    at executeTemplate (core.mjs:12162:9)`;
}
