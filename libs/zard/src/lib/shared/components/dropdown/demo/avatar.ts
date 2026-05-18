import { Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-avatar-demo',
  imports: [ZardDropdownImports, ZardButtonComponent, ZardAvatarComponent],
  template: `
    <button type="button" z-button zType="ghost" class="size-10 rounded-full p-0" z-dropdown [zDropdownMenu]="menu">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="ZA" zAlt="User avatar" />
    </button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-label>
        <div class="flex flex-col space-y-1">
          <p class="text-sm leading-none font-medium">Zard User</p>
          <p class="text-muted-foreground text-xs leading-none">user@zardui.com</p>
        </div>
      </z-dropdown-menu-label>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('Profile')">Profile</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">Billing</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Settings')">Settings</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('Log out')">Log out</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownAvatarDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
