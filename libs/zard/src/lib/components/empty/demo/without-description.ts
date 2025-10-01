import { Component } from '@angular/core';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  standalone: true,
  imports: [ZardEmptyComponent],
  template: `<z-empty zDescription="" />`,
})
export class ZardDemoEmptyWithoutDescriptionComponent {}
