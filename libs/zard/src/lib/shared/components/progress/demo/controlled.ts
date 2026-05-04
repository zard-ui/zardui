import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardProgressComponent } from '@/shared/components/progress/progress.component';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';

@Component({
  selector: 'z-demo-progress-controlled',
  imports: [ZardProgressComponent, ZardSliderComponent],
  template: `
    <div class="flex w-full min-w-sm flex-col gap-4">
      <z-progress [value]="value()" />
      <z-slider [zDefault]="value()" zMin="0" zMax="100" zStep="1" (zSlideIndexChange)="value.set($event)" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoProgressControlledComponent {
  protected readonly value = signal(50);
}
