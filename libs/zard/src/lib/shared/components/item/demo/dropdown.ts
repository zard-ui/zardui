import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardItemImports } from '@/shared/components/item/item.imports';

interface Person {
  username: string;
  avatar: string;
  email: string;
}

@Component({
  selector: 'z-demo-item-dropdown',
  imports: [ZardAvatarComponent, ZardButtonComponent, NgIcon, ...ZardDropdownImports, ...ZardItemImports],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">
      Select
      <ng-icon name="lucideChevronDown" />
    </button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      @for (person of people; track person.username) {
        <z-dropdown-menu-item>
          <z-item zSize="xs" class="w-full p-2">
            <z-item-media>
              <z-avatar
                [zSrc]="person.avatar"
                [zFallback]="person.username.charAt(0).toUpperCase()"
                class="size-7 grayscale"
              />
            </z-item-media>
            <z-item-content class="gap-0">
              <z-item-title>{{ person.username }}</z-item-title>
              <z-item-description class="leading-none">{{ person.email }}</z-item-description>
            </z-item-content>
          </z-item>
        </z-dropdown-menu-item>
      }
    </z-dropdown-menu-content>
  `,
  viewProviders: [provideIcons({ lucideChevronDown })],
})
export class ZardDemoItemDropdownComponent {
  protected readonly people: Person[] = [
    { username: 'zardui', avatar: 'https://github.com/zard-ui.png', email: 'zardui@example.com' },
    { username: 'srizzon', avatar: 'https://github.com/srizzon.png', email: 'srizzon@example.com' },
    { username: 'luizgomess', avatar: 'https://github.com/Luizgomess.png', email: 'luizgomess@example.com' },
  ];
}
