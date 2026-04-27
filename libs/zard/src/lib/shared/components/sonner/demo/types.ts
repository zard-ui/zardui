import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'zard-demo-sonner-types',
  imports: [ZardButtonComponent],
  template: `
    <div class="flex flex-wrap gap-2">
      <button type="button" z-button zType="outline" (click)="sonner.show('Event has been created')">Default</button>
      <button type="button" z-button zType="outline" (click)="sonner.success('Event has been created')">Success</button>
      <button
        type="button"
        z-button
        zType="outline"
        (click)="sonner.info('Be at the area 10 minutes before the event time')"
      >
        Info
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        (click)="sonner.warning('Event start time cannot be earlier than 8am')"
      >
        Warning
      </button>
      <button type="button" z-button zType="outline" (click)="sonner.error('Event has not been created')">Error</button>
      <button type="button" z-button zType="outline" (click)="showPromise()">Promise</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerTypesComponent {
  protected readonly sonner = inject(ZardSonnerService);

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
