import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'z-demo-sonner-promise',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="showPromise()">Create Event</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerPromiseComponent {
  private readonly sonner = inject(ZardSonnerService);

  showPromise() {
    this.sonner.promise<{ name: string }>(
      () => new Promise(resolve => setTimeout(() => resolve({ name: 'Event' }), 2000)),
      {
        loading: 'Loading...',
        success: data => `${data.name} has been created`,
        error: 'Error',
      },
    );
  }
}
