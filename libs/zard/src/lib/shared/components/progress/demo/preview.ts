import { afterNextRender, ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardProgressComponent } from '@/shared/components/progress/progress.component';

@Component({
  selector: 'z-demo-progress-preview',
  imports: [ZardProgressComponent],
  template: `
    <z-progress class="w-60" [value]="value()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoProgressPreviewComponent {
  protected readonly value = signal(13);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => this.value.set(66), 500);
    });
  }
}
