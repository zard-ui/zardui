import { Component } from '@angular/core';

import { toast } from 'ngx-sonner';

import { ZardButtonComponent } from '../../button/button.component';

@Component({
  selector: 'z-demo-toast-loading',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="showToast()">Show Loading Toast</button>
  `,
})
export class ZardDemoToastLoadingComponent {
  showToast() {
    const promise = () => new Promise<{ name: string }>(resolve => setTimeout(() => resolve({ name: 'Sonner' }), 2000));

    toast.promise(promise, {
      loading: 'Loading...',
      success: data => `${data.name} has been created`,
      error: 'Error',
    });
  }
}
