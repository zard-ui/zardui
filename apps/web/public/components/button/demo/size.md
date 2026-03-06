```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { zardArrowUpIcon } from '@/shared/core/icons-registry';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-size',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <div class="flex flex-col items-center">
      <div class="mb-4 flex gap-2">
        <button z-button zSize="sm">Small</button>
        <button z-button zSize="sm"><ng-icon name="arrow-up" /></button>
      </div>

      <div class="mb-4 flex gap-2">
        <button z-button>Default</button>
        <button z-button><ng-icon name="arrow-up" /></button>
      </div>

      <div class="mb-4 flex gap-2">
        <button z-button zSize="lg">Large</button>
        <button z-button zSize="lg"><ng-icon name="arrow-up" /></button>
      </div>
    </div>
  `,
  viewProviders: [provideIcons({ arrowUp: zardArrowUpIcon })],
})
export class ZardDemoButtonSizeComponent {}

```