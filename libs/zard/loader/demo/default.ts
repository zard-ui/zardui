import { Component } from '@angular/core';

import { ZardLoaderComponent } from '@ngzard/ui/loader';

@Component({
  selector: 'z-demo-loader-default',
  imports: [ZardLoaderComponent],
  standalone: true,
  template: `
    <z-loader />
  `,
})
export class ZardDemoLoaderDefaultComponent {}
