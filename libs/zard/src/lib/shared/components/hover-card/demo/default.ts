import { Component } from '@angular/core';

import { ZardHoverCardComponent } from '../hover-card.component';

@Component({
  selector: 'z-demo-hover-card-default',
  imports: [ZardHoverCardComponent],
  template: `
    <z-hover-card>Hover Card</z-hover-card>
  `,
})
export class ZardDemoHoverCardDefaultComponent {}
