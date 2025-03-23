import { Component } from '@angular/core';

import { ZardAlertModule } from '../alert.module';

@Component({
  standalone: true,
  imports: [ZardAlertModule],
  template: `
    @for (type of alertTypeTypes; track type) {
      @for (appearance of alertAppearanceTypes; track appearance) {
        <z-alert [zAppearance]="appearance" [zType]="type">
          <z-alert-title class="capitalize">{{ appearance }} {{ type }} alert!</z-alert-title>
          <z-alert-description>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda, sint.</z-alert-description>
        </z-alert>
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
  alertAppearanceTypes: Array<'outline' | 'soft' | 'fill' | null | undefined> = ['outline', 'soft', 'fill'];
  alertTypeTypes: Array<'info' | 'success' | 'warning' | 'error' | 'default' | null | undefined> = ['default', 'info', 'success', 'warning', 'error'];
}
