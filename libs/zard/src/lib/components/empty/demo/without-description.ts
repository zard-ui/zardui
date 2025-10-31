import { Component } from '@angular/core';

import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-without-description',
  standalone: true,
  imports: [ZardEmptyComponent],
  template: `<z-empty zDescription="" />`,
})
export class ZardDemoEmptyWithoutDescriptionComponent {}
