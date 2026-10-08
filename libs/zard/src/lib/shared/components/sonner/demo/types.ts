import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'z-demo-sonner-types',
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
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerTypesComponent {
  protected readonly sonner = inject(ZardSonnerService);
}
