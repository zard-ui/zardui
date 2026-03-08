```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardIconRegistry } from '@/shared/core/icons-registry';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-size',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <div class="flex flex-col items-center">
      <div class="mb-4 flex gap-2">
        <button type="button" z-button zSize="sm">Small</button>
        <button type="button" z-button zSize="sm"><ng-icon name="arrow-up" /></button>
      </div>

      <div class="mb-4 flex gap-2">
        <button type="button" z-button>Default</button>
        <button type="button" z-button><ng-icon name="arrow-up" /></button>
      </div>

      <div class="mb-4 flex gap-2">
        <button type="button" z-button zSize="lg">Large</button>
        <button type="button" z-button zSize="lg"><ng-icon name="arrow-up" /></button>
      </div>
    </div>
  `,
  viewProviders: [provideIcons({ arrowUp: ZardIconRegistry['arrow-up'] })],
})
export class ZardDemoButtonSizeComponent {}

```