import { Component } from '@angular/core';

import { ZardCardComponent } from '../card.component';

@Component({
  standalone: true,
  imports: [ZardCardComponent],
  template: ` <z-card zTitle="Card title" zDescription="Card description"> Card content </z-card> `,
})
export class ZardDemoCardDefaultComponent {}
