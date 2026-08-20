import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';

interface Person {
  username: string;
  avatar: string;
  email: string;
}

@Component({
  selector: 'z-demo-item-group',
  imports: [ZardAvatarComponent, ZardButtonComponent, NgIcon, ...ZardItemImports],
  template: `
    <z-item-group class="min-w-sm">
      @for (person of people; track person.username) {
        <z-item zVariant="outline">
          <z-item-media>
            <z-avatar [zSrc]="person.avatar" [zFallback]="person.username.charAt(0).toUpperCase()" class="grayscale" />
          </z-item-media>
          <z-item-content class="gap-1">
            <z-item-title>{{ person.username }}</z-item-title>
            <z-item-description>{{ person.email }}</z-item-description>
          </z-item-content>
          <z-item-actions>
            <button type="button" z-button zType="ghost" zSize="icon-sm" zShape="circle">
              <ng-icon name="lucidePlus" />
            </button>
          </z-item-actions>
        </z-item>
      }
    </z-item-group>
  `,
  viewProviders: [provideIcons({ lucidePlus })],
})
export class ZardDemoItemGroupComponent {
  protected readonly people: Person[] = [
    { username: 'zardui', avatar: 'https://github.com/zard-ui.png', email: 'zardui@example.com' },
    { username: 'srizzon', avatar: 'https://github.com/srizzon.png', email: 'srizzon@example.com' },
    { username: 'luizgomess', avatar: 'https://github.com/Luizgomess.png', email: 'luizgomess@example.com' },
  ];
}
