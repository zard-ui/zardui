import { Component } from '@angular/core';

import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-size',
  imports: [ZardSpinnerComponent],
  template: `
    <div class="flex items-center gap-6">
      <z-spinner class="size-3" />
      <z-spinner class="size-4" />
      <z-spinner class="size-6" />
      <z-spinner class="size-8" />
    </div>
  `,
})
export class ZardDemoSpinnerSizeComponent {}
