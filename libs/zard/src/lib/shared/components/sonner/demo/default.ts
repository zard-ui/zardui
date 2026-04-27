import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'zard-demo-sonner-default',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="show()">Show Toast</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerDefaultComponent {
  private readonly sonner = inject(ZardSonnerService);

  show() {
    this.sonner.show('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      },
    });
  }
}
