```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { toast } from 'ngx-sonner';

import { ZardButtonComponent } from '../../button/button.component';

@Component({
  selector: 'zard-demo-toast',
  imports: [ZardButtonComponent],
  standalone: true,
  template: `
    <button z-button zType="outline" (click)="showToast()">Show Toast</button>
  `,
})
export class ZardDemoToastDefaultComponent {
  showToast() {
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      },
    });
  }
}

```