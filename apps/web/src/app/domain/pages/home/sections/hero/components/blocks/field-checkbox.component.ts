import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';

@Component({
  selector: 'z-block-field-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCheckboxComponent],
  template: `
    <z-checkbox>I agree to the terms and conditions</z-checkbox>
  `,
})
export class BlockFieldCheckboxComponent {}
