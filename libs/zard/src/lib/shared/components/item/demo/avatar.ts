import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardAvatarComponent, ZardAvatarGroupComponent } from '@/shared/components/avatar';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-avatar',
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent, ZardButtonComponent, NgIcon, ...ZardItemImports],
  template: `
    <div class="flex w-full min-w-lg flex-col gap-6">
      <z-item zVariant="outline">
        <z-item-media>
          <z-avatar zSrc="https://github.com/evilrabbit.png" zFallback="ER" class="size-10" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Evil Rabbit</z-item-title>
          <z-item-description>Last seen 5 months ago</z-item-description>
        </z-item-content>
        <z-item-actions>
          <button type="button" z-button zType="outline" zSize="icon-sm" zShape="circle" aria-label="Invite">
            <ng-icon name="lucidePlus" />
          </button>
        </z-item-actions>
      </z-item>

      <z-item zVariant="outline">
        <z-item-media>
          <z-avatar-group>
            <z-avatar zSrc="https://github.com/zard-ui.png" zAlt="@zardui" zFallback="ZU" class="grayscale" />
            <z-avatar zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zFallback="SR" class="grayscale" />
            <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zFallback="LG" class="grayscale" />
          </z-avatar-group>
        </z-item-media>
        <z-item-content>
          <z-item-title>No Team Members</z-item-title>
          <z-item-description>Invite your team to collaborate on this project.</z-item-description>
        </z-item-content>
        <z-item-actions>
          <button type="button" z-button zType="outline" zSize="sm">Invite</button>
        </z-item-actions>
      </z-item>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucidePlus })],
})
export class ZardDemoItemAvatarComponent {}
