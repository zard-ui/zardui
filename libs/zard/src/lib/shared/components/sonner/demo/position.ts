import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { type ZardSonnerPosition } from '@/shared/components/sonner/sonner.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'zard-demo-sonner-position',
  imports: [ZardButtonComponent],
  template: `
    <div class="flex flex-wrap justify-center gap-2">
      <button type="button" z-button zType="outline" (click)="show('top-left')">Top Left</button>
      <button type="button" z-button zType="outline" (click)="show('top-center')">Top Center</button>
      <button type="button" z-button zType="outline" (click)="show('top-right')">Top Right</button>
      <button type="button" z-button zType="outline" (click)="show('bottom-left')">Bottom Left</button>
      <button type="button" z-button zType="outline" (click)="show('bottom-center')">Bottom Center</button>
      <button type="button" z-button zType="outline" (click)="show('bottom-right')">Bottom Right</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerPositionComponent {
  private readonly sonner = inject(ZardSonnerService);

  show(position: ZardSonnerPosition) {
    this.sonner.show('Event has been created', { position });
  }
}
