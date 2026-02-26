import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardAvatarGroupComponent } from '@zard/components/avatar';
import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';

@Component({
  selector: 'z-block-empty-avatar-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardEmptyComponent, ZardAvatarComponent, ZardButtonComponent, ZardIconComponent, ZardAvatarGroupComponent],
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
          <z-avatar zSrc="https://github.com/mikij.png" zAlt="@mikij" />
          <z-avatar zSrc="https://github.com/ribeiromatheuss.png" zAlt="@ribeiromatheuss" />
          <z-avatar zSrc="https://github.com/srizzon.png" zAlt="@srizzon" />
          <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@Luizgomess" />
        </z-avatar-group>
      </ng-template>

      <button z-button zSize="sm">
        <z-icon zType="plus" />
        Invite Members
      </button>
    </z-empty>
  `,
})
export class BlockEmptyAvatarGroupComponent {}
