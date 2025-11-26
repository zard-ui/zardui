import { Component } from '@angular/core';

import { ZardLoaderComponent } from '../loader.component';

@Component({
  selector: 'z-demo-loader-size',
  imports: [ZardLoaderComponent],
  standalone: true,
  template: `
    <z-loader zSize="sm" />
    <z-loader zSize="default" />
    <z-loader zSize="lg" />
  `,
})
export class ZardDemoLoaderSizeComponent {}
