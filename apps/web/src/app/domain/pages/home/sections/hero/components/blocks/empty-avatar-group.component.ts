import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardAvatarGroupComponent } from '@zard/components/avatar';
import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';

@Component({
  selector: 'z-block-empty-avatar-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardEmptyComponent, ZardAvatarComponent, ZardButtonComponent, NgIcon, ZardAvatarGroupComponent],
  viewProviders: [provideIcons({ lucidePlus })],
  template: `
    <z-empty
      [zImage]="avatarGroup"
      zTitle="No Team Members"
      zDescription="Invite your team to collaborate on this project."
      class="flex-none border"
    >
      <ng-template #avatarGroup>
        <z-avatar-group
          class="*:data-[slot=avatar]:ring-background *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:grayscale"
        >
          <z-avatar zSrc="https://github.com/neopavan.png" zAlt="@neopavan" zSize="md" />
          <z-avatar zSrc="https://github.com/mikij.png" zAlt="@mikij" zSize="md" />
          <z-avatar zSrc="https://github.com/ribeiromatheuss.png" zAlt="@ribeiromatheuss" zSize="md" />
          <z-avatar zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zSize="md" />
          <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@Luizgomess" zSize="md" />
        </z-avatar-group>
      </ng-template>

      <button z-button zSize="sm">
        <ng-icon name="lucidePlus" />
        Invite Members
      </button>
    </z-empty>
  `,
})
export class BlockEmptyAvatarGroupComponent {}
