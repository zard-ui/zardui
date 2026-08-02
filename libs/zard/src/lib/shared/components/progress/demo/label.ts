import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardProgressComponent } from '@/shared/components/progress/progress.component';

@Component({
  selector: 'z-demo-progress-label',
  imports: [ZardProgressComponent, ...ZardFieldImports],
  template: `
    <z-field class="w-full min-w-sm">
      <z-field-label for="progress-upload">
        <span>Upload progress</span>
        <span class="ml-auto">66%</span>
      </z-field-label>
      <z-progress id="progress-upload" [value]="66" />
    </z-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoProgressLabelComponent {}
