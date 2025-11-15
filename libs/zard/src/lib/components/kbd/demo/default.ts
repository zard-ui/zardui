import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardKbdComponent } from '../kbd.component';

@Component({
  selector: 'z-demo-kbd-default',
  imports: [ZardKbdComponent, ZardButtonComponent],
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center gap-4">
      <div class="flex items-center gap-2">
        <z-kbd>Esc</z-kbd>
        <z-kbd>⌘</z-kbd>
        <z-kbd>Ctrl</z-kbd>
      </div>

      <button type="submit" z-button zType="outline">Submit <z-kbd class="ml-2">Enter</z-kbd></button>
    </div>
  `,
})
export class ZardDemoKbdDefaultComponent {}
