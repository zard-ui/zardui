import { Component } from '@angular/core';

import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-default',
  imports: [ZardSpinnerComponent],
  template: `
    <z-spinner />
  `,
})
export class ZardDemoSpinnerDefaultComponent {}
