import { Component } from '@angular/core';

import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-size',
  imports: [ZardSpinnerComponent],
  template: `
    <z-spinner zSize="sm" />
    <z-spinner zSize="default" />
    <z-spinner zSize="lg" />
  `,
})
export class ZardDemoSpinnerSizeComponent {}
