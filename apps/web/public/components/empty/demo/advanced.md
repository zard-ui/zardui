```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { zardPlusIcon } from '../../../core/icons-registry';
import { ZardAvatarGroupComponent } from '../../avatar/avatar-group.component';
import { ZardAvatarComponent } from '../../avatar/avatar.component';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-advanced-customization',
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent, ZardButtonComponent, NgIcon, ZardEmptyComponent],
  viewProviders: [provideIcons({ plus: zardPlusIcon })],
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
      <button type="button" z-button zSize="sm">
        <ng-icon name="plus" />
        Invite Members
      </button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoEmptyAdvancedComponent {}

```