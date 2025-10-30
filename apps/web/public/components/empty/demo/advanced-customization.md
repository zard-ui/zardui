```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarGroupComponent } from '../../avatar/avatar-group.component';
import { ZardAvatarComponent } from '../../avatar/avatar.component';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardIconComponent } from '../../icon/icon.component';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-advanced-customization',
  standalone: true,
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent, ZardButtonComponent, ZardIconComponent, ZardEmptyComponent],
  template: `
    <z-empty [zImage]="customImage" [zTitle]="customTitle" zDescription="Invite your team to get started" [zActions]="[actionInvite]"> </z-empty>

    <ng-template #customImage>
      <z-avatar-group>
        <z-avatar zSrc="https://github.com/srizzon.png" zSize="md" class="grayscale" />
        <z-avatar zSrc="https://github.com/Luizgomess.png" zSize="md" class="grayscale" />
        <z-avatar zSrc="https://github.com/ribeiromatheuss.png" zSize="md" class="grayscale" />
        <z-avatar zSrc="https://github.com/mikij.png" zSize="md" class="grayscale" />
      </z-avatar-group>
    </ng-template>

    <ng-template #customTitle>
      <span>No Team <strong>members</strong></span>
    </ng-template>

    <ng-template #actionInvite>
      <button z-button zSize="sm">
        <i z-icon zType="plus"></i>
        Invite Members
      </button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoEmptyAdvancedCustomizationComponent {}

```