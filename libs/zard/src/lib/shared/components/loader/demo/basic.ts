import { Component } from '@angular/core';

import { ZardLoaderComponent } from '../loader.component';

@Component({
  selector: 'z-demo-loader-basic',
  imports: [ZardLoaderComponent],
  standalone: true,
  template: `
    <z-loader />
  `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
    }
  `,
})
export class ZardDemoLoaderBasicComponent {}
