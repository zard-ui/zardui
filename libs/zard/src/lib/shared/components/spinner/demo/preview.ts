import { Component } from '@angular/core';

import { ZardItemImports } from '@/shared/components/item/item.imports';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-preview',
  imports: [ZardSpinnerComponent, ...ZardItemImports],
  template: `
    <div class="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
      <z-item zVariant="muted">
        <z-item-media>
          <z-spinner />
        </z-item-media>
        <z-item-content>
          <z-item-title class="line-clamp-1">Processing payment...</z-item-title>
        </z-item-content>
        <z-item-content class="flex-none justify-end">
          <span class="text-sm tabular-nums">$100.00</span>
        </z-item-content>
      </z-item>
    </div>
  `,
})
export class ZardDemoSpinnerPreviewComponent {}
