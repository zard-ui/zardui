import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-height',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>package.json</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zLineNumbers class="scroll-fade-y max-h-48">{{ code }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockHeightComponent {
  protected readonly code = `{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "@angular/core": "^21.2.0",
    "@angular/common": "^21.2.0",
    "@ng-icons/core": "^34.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.4.0"
  }
}`;
}
