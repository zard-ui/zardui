```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { toast } from 'ngx-sonner';

import { ZardButtonComponent } from '../../button/button.component';

@Component({
  selector: 'z-demo-toast-loading',
  standalone: true,
  imports: [ZardButtonComponent],
  template: ` <button z-button zType="outline" (click)="showToast()">Show Loading Toast</button> `,
})
export class ZardDemoToastLoadingComponent {
  showToast() {
    const promise = () => new Promise(resolve => setTimeout(() => resolve({ name: 'Sonner' }), 2000));

    toast.promise(promise, {
      loading: 'Loading...',
      success: (data: any) => {
        return `${data.name} has been created`;
      },
      error: 'Error',
    });
  }
}

```
