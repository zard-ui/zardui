import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCornerDownLeft } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';

@Component({
  selector: 'z-demo-kbd-button',
  imports: [NgIcon, ZardKbdComponent, ZardButtonComponent],
  template: `
    <div class="flex flex-col items-center justify-center gap-4">
      <button type="submit" z-button zType="outline">
        Accept
        <z-kbd>
          <ng-icon name="lucideCornerDownLeft" strokeWidth="3" />
        </z-kbd>
      </button>
    </div>
  `,
  viewProviders: [provideIcons({ lucideCornerDownLeft })],
})
export class ZardDemoKbdButtonComponent {}
