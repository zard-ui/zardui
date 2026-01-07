import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  selector: 'z-demo-input-text-area',
  imports: [ZardInputDirective],
  template: `
    <div class="flex w-75 flex-col gap-3">
      <textarea z-input rows="8" cols="12" placeholder="Default"></textarea>
      <textarea zBorderless z-input rows="8" cols="12" placeholder="Borderless"></textarea>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputTextAreaComponent {}
