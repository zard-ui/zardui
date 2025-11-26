import { Component } from '@angular/core';

import { toast } from 'ngx-sonner';

import { ZardButtonComponent } from '@ngzard/ui/button';

@Component({
  selector: 'z-demo-toast-advanced',
  imports: [ZardButtonComponent],
  standalone: true,
  template: `
    <div class="flex flex-wrap gap-2">
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
