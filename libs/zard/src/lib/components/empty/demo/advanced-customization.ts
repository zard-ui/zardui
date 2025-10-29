import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarGroupComponent } from '../../avatar/avatar-group.component';
import { ZardAvatarComponent } from '../../avatar/avatar.component';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-advanced-customization',
  standalone: true,
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent, ZardButtonComponent, ZardEmptyComponent],
  template: `
    <z-empty [zImage]="customImage" [zTitle]="customTitle" zDescription="Invite your team to get started" [zActions]="[actionInvite]"> </z-empty>

    <ng-template #customImage>
      <z-avatar-group>
        <z-avatar zSrc="images/team.png" class="dark:bg-transparent dark:invert-75" />
      </z-avatar-group>
    </ng-template>

    <ng-template #customTitle>
      <span>No team <strong>members</strong> yet</span>
    </ng-template>

    <ng-template #actionInvite>
      <button z-button zSize="lg">Invite Team</button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoEmptyAdvancedCustomizationComponent {}
