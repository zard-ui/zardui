import { Component } from '@angular/core';

import { toast } from 'ngx-sonner';

import { ZardButtonComponent } from '../../button/button.component';

@Component({
  selector: 'zard-demo-toast-success',
  imports: [ZardButtonComponent],
  standalone: true,
  template: `
    <button z-button zType="outline" (click)="showToast()">Show Success Toast</button>
  `,
})
export class ZardDemoToastSuccessComponent {
  showToast() {
    toast.success('Event created successfully', {
      description: 'Your event has been saved and will start soon.',
    });
  }
}
