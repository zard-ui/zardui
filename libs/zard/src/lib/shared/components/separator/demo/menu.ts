import { Component } from '@angular/core';

import { ZardSeparatorComponent } from '../separator.component';

@Component({
  selector: 'z-demo-separator-menu',
  imports: [ZardSeparatorComponent],
  standalone: true,
  template: `
    <div class="flex items-center gap-2 text-sm md:gap-4">
      <div class="flex flex-col gap-1">
        <span class="font-medium">Settings</span>
        <span class="text-muted-foreground text-xs">Manage preferences</span>
      </div>
      <z-separator zOrientation="vertical" />
      <div class="flex flex-col gap-1">
        <span class="font-medium">Account</span>
        <span class="text-muted-foreground text-xs">Profile & security</span>
      </div>
      <z-separator zOrientation="vertical" class="hidden md:block" />
      <div class="hidden flex-col gap-1 md:flex">
        <span class="font-medium">Help</span>
        <span class="text-muted-foreground text-xs">Support & docs</span>
      </div>
    </div>
  `,
})
export class ZardDemoSeparatorMenuComponent {}
