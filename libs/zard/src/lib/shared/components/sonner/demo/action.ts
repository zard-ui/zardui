import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'z-demo-sonner-action',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="show()">Message sent</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerActionComponent {
  private readonly sonner = inject(ZardSonnerService);

  show() {
    this.sonner.show('Message sent', {
      description: 'Your message was delivered to the channel.',
      action: {
        label: 'Undo',
        onClick: () => this.sonner.show('Message recalled'),
      },
    });
  }
}
