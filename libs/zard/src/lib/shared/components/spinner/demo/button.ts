import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-button',
  imports: [ZardButtonComponent, ZardSpinnerComponent],
  template: `
    <div class="flex flex-col items-center gap-4">
      <button type="button" z-button zSize="sm" [zDisabled]="true">
        <z-spinner data-icon="inline-start" />
        Loading...
      </button>
      <button type="button" z-button zType="outline" zSize="sm" [zDisabled]="true">
        <z-spinner data-icon="inline-start" />
        Please wait
      </button>
      <button type="button" z-button zType="secondary" zSize="sm" [zDisabled]="true">
        <z-spinner data-icon="inline-start" />
        Processing
      </button>
    </div>
  `,
})
export class ZardDemoSpinnerButtonComponent {}
