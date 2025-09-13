import { Component } from '@angular/core';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  standalone: true,
  imports: [ZardEmptyComponent],
  template: `
    <z-empty zSize="small" zDescription="small" />
    <z-empty zDescription="default" />
  `,
})
export class ZardDemoEmptySizeComponent {}
