import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarImports } from '@zard/components/avatar/avatar.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';

const MEMBERS = [
  { src: 'https://github.com/shadcn.png', alt: '@shadcn', fallback: 'CN' },
  { src: 'https://github.com/maxleiter.png', alt: '@maxleiter', fallback: 'LR' },
  { src: 'https://github.com/evilrabbit.png', alt: '@evilrabbit', fallback: 'ER' },
] as const;

@Component({
  selector: 'z-preview-02-no-team-members',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardAvatarImports, ZardButtonComponent, ZardCardImports, ZardEmptyComponent],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-content>
        <z-empty
          class="h-56 border"
          [zImage]="avatars"
          zTitle="No Team Members"
          zDescription="Invite your team to collaborate on this project."
          [zActions]="[invite]"
        />
        <ng-template #avatars>
          <z-avatar-group class="grayscale">
            @for (member of members; track member.alt) {
              <z-avatar zSize="lg" [zSrc]="member.src" [zAlt]="member.alt" [zFallback]="member.fallback" />
            }
          </z-avatar-group>
        </ng-template>
        <ng-template #invite>
          <button type="button" z-button zSize="sm">Invite Members</button>
        </ng-template>
      </z-card-content>
    </z-card>
  `,
})
export class Preview02NoTeamMembersComponent {
  protected readonly members = MEMBERS;
}
