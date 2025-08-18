import { toast } from 'ngx-sonner';

import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';

@Component({
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <div class="flex gap-2 flex-wrap">
      <button z-button zType="outline" (click)="showWithAction()">With Action</button>
      <button z-button zType="outline" (click)="showCustomDuration()">Custom Duration</button>
    </div>
  `,
})
export class ZardDemoToastAdvancedComponent {
  showWithAction() {
    toast('Event created', {
      description: 'Your event has been saved successfully.',
      action: {
        label: 'View',
        onClick: () => console.log('View clicked'),
      },
    });
  }

  showCustomDuration() {
    toast('This toast lasts 8 seconds', {
      description: 'Custom duration example.',
      duration: 8000,
    });
  }
}
