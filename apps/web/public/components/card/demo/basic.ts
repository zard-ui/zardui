import { Component } from '@angular/core';

import { ZardCardModule } from '../card.module';

@Component({
  standalone: true,
  imports: [ZardCardModule],
  template: `
    <z-card>
      <z-card-header>
        <z-card-header-title>Card title</z-card-header-title>
        <z-card-header-description>Card description</z-card-header-description>
      </z-card-header>

      <z-card-body> Card content </z-card-body>
    </z-card>
  `,
})
export class ZardDemoCardBasicComponent {}
