import { Component } from '@angular/core';

import { ZardCardComponent } from '../card.component';

@Component({
  standalone: true,
  imports: [ZardCardComponent],
  template: ` <z-card zTitle="Create project" zDescription="Deploy your new project in one-click."> Body content </z-card> `,
})
export class ZardDemoCardBasicComponent {}
