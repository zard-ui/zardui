import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarImports } from '@zard/components/avatar/avatar.imports';
import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardCardImports } from '@zard/components/card/card.imports';

/** zard/ui's own top contributors on GitHub, by commits. */
const USERNAMES = [
  'Luizgomess',
  'mikij',
  'srizzon',
  'henriquecustodia',
  'ribeiromatheuss',
  'JustDo1t90',
  'neopavan',
  'annakocot',
  'ewerton336',
  'elderfonseca',
  'Luiz1nn',
  'mihajm',
  'ragul1697',
  'IEdiong',
  'Brenerr',
  'viniciuscigma',
] as const;

@Component({
  selector: 'z-preview-02-contributors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardAvatarImports, ZardBadgeComponent, ZardCardImports],
  host: { class: 'block' },
  template: `
    <z-card class="max-w-sm">
      <z-card-header>
        <ng-template #title>
          Contributors
          <z-badge zType="secondary">36</z-badge>
        </ng-template>
        <z-card-title [zTitle]="title" />
      </z-card-header>
      <z-card-content>
        <div class="flex flex-wrap gap-2">
          @for (username of usernames; track username) {
            <z-avatar
              class="grayscale"
              [zSrc]="'https://github.com/' + username + '.png'"
              [zAlt]="username"
              [zFallback]="username.charAt(0)"
            />
          }
        </div>
      </z-card-content>
      <z-card-footer>
        <a
          href="https://github.com/zard-ui/zardui/graphs/contributors"
          target="_blank"
          rel="noopener"
          class="text-sm underline underline-offset-4"
        >
          + 20 contributors
        </a>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02ContributorsComponent {
  protected readonly usernames = USERNAMES;
}
