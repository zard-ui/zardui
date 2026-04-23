import { Component } from '@angular/core';

import { ZardKbdGroupComponent } from '@/shared/components/kbd/kbd-group.component';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';

@Component({
  selector: 'z-demo-kbd-default',
  imports: [ZardKbdComponent, ZardKbdGroupComponent],
  template: `
    <div class="flex flex-col items-center justify-center gap-4">
      <z-kbd-group>
        <z-kbd>⌘</z-kbd>
        <z-kbd>⇧</z-kbd>
        <z-kbd>⌥</z-kbd>
        <z-kbd>⌃</z-kbd>
      </z-kbd-group>
      <z-kbd-group>
        <z-kbd>Ctrl</z-kbd>
        <span>+</span>
        <z-kbd>B</z-kbd>
      </z-kbd-group>
    </div>
  `,
})
export class ZardDemoKbdDefaultComponent {}
