import { Component } from '@angular/core';

import { ZardLoaderComponent } from '@ngzard/ui/loader';

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
