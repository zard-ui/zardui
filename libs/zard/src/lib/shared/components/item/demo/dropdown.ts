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
    { username: 'shadcn', avatar: 'https://github.com/shadcn.png', email: 'shadcn@vercel.com' },
    { username: 'maxleiter', avatar: 'https://github.com/maxleiter.png', email: 'maxleiter@vercel.com' },
    { username: 'evilrabbit', avatar: 'https://github.com/evilrabbit.png', email: 'evilrabbit@vercel.com' },
  ];
}
