import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSeparatorComponent } from '../separator.component';

@Component({
  selector: 'z-demo-separator-vertical',
  imports: [ZardSeparatorComponent],
  template: `
    <div class="flex h-5 items-center gap-4 text-sm">
      <div>Blog</div>
      <z-separator zOrientation="vertical" />
      <div>Docs</div>
      <z-separator zOrientation="vertical" />
      <div>Source</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSeparatorVerticalComponent {}
