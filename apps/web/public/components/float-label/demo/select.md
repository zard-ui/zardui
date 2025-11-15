```angular-ts showLineNumbers copyButton
import { ZardSelectItemComponent } from '@zard/components/select/select-item.component';
import { ZardSelectComponent } from '@zard/components/select/select.component';
import { ZardFormLabelComponent } from '@zard/components/form/form.component';
import { Component } from '@angular/core';

import { ZardFloatLabelComponent } from '../float.label.component';


@Component({
  selector: 'z-demo-float-label-select',
  imports: [
    ZardFloatLabelComponent,
    ZardFormLabelComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
  ],
  template: `
    <z-float-label>
      <z-select value="react" class="w-[200px]" zSize="lg">
        <z-select-item zValue="angular">Angular</z-select-item>
        <z-select-item zValue="react">React</z-select-item>
        <z-select-item zValue="vue">Vue</z-select-item>
      </z-select>
      <label z-form-label>Framework</label>
    </z-float-label>
  `,
})
export class ZardDemoFloatLabelSelectComponent { }
```