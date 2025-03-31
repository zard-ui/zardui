import { Component } from '@angular/core';

import { ZardAlertComponent } from '../alert.component';

@Component({
  standalone: true,
  imports: [ZardAlertComponent],
  template: `
    @for (type of alertTypeTypes; track type) {
      @for (appearance of alertAppearanceTypes; track appearance) {
        <z-alert
          class="capitalize"
          zTitle="{{ appearance }} {{ type }} alert!"
          zDescription="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint."
          [zAppearance]="appearance"
          [zType]="type"
        />
      }
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
    `,
  ],
})
export class ZardDemoAlertAppearanceComponent {
  alertAppearanceTypes: Array<'outline' | 'soft' | 'fill'> = ['outline', 'soft', 'fill'];
  alertTypeTypes: Array<'info' | 'success' | 'warning' | 'error' | 'default'> = ['default', 'info', 'success', 'warning', 'error'];
}
