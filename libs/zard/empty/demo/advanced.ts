import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarGroupComponent, ZardAvatarComponent } from '@ngzard/ui/avatar';
import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardIconComponent } from '@ngzard/ui/icon';

import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-advanced-customization',
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent, ZardButtonComponent, ZardIconComponent, ZardEmptyComponent],
  standalone: true,
  template: `
    <z-empty
      [zImage]="customImage"
      [zTitle]="customTitle"
      zDescription="Invite your team to collaborate on this project."
      [zActions]="[actionInvite]"
    />

    <ng-template #customImage>
      <z-avatar-group>
        <z-avatar zSrc="https://github.com/srizzon.png" zSize="md" class="grayscale" />
        <z-avatar zSrc="https://github.com/Luizgomess.png" zSize="md" class="grayscale" />
        <z-avatar zSrc="https://github.com/ribeiromatheuss.png" zSize="md" class="grayscale" />
        <z-avatar zSrc="https://github.com/mikij.png" zSize="md" class="grayscale" />
      </z-avatar-group>
    </ng-template>

    <ng-template #customTitle>
      <span>
        No Team
        <strong>members</strong>
      </span>
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
export class ZardDemoEmptyAdvancedComponent {}
