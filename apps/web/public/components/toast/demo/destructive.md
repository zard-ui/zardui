```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { toast } from 'ngx-sonner';

import { ZardButtonComponent } from '../../button/button.component';

@Component({
  selector: 'zard-demo-toast-destructive',
  imports: [ZardButtonComponent],
  standalone: true,
  template: ` <button z-button zType="outline" (click)="showToast()">Show Error Toast</button> `,
})
export class ZardDemoToastDestructiveComponent {
  showToast() {
    toast.error('Something went wrong', {
      description: 'There was a problem with your request.',
    });
  }
}

```