import { toast } from 'ngx-sonner';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';

@Component({
  selector: 'zard-demo-toast-position',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent],
  template: `
    <div class="flex flex-wrap gap-2">
      <z-button zType="outline" (click)="showToast('top-left')"> Top Left </z-button>

      <z-button zType="outline" (click)="showToast('top-center')"> Top Center </z-button>

      <z-button zType="outline" (click)="showToast('top-right')"> Top Right </z-button>

      <z-button zType="outline" (click)="showToast('bottom-left')"> Bottom Left </z-button>

      <z-button zType="outline" (click)="showToast('bottom-center')"> Bottom Center </z-button>

      <z-button zType="outline" (click)="showToast('bottom-right')"> Bottom Right </z-button>
    </div>
  `,
})
export class ZardDemoToastPositionComponent {
  currentPosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' = 'bottom-right';

  showToast(position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right') {
    this.currentPosition = position;

    toast(`Toast at ${position.replace('-', ' ')}`, {
      action: {
        label: 'Close',
        onClick: () => console.log('Toast closed'),
      },
      position: position,
    });
  }
}
