import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCreditCard } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardEmptyComponent } from '@zard/components/empty';

/** shadcn puts the media above the header; zard draws it inside, so its margin makes up the header's missing gap. */
@Component({
  selector: 'z-preview-01-empty-connect-bank',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardEmptyComponent, ZardButtonComponent],
  viewProviders: [provideIcons({ lucideCreditCard })],
  template: `
    <z-card>
      <z-card-content>
        <z-empty
          class="p-4 [&_[data-slot=empty-media]]:mb-4"
          zIcon="lucideCreditCard"
          zTitle="Connect Bank"
          zDescription="Link your payout method to receive monthly royalty distributions automatically."
          [zActions]="[action]"
        />
        <ng-template #action>
          <button type="button" z-button>Set Up Payouts</button>
        </ng-template>
      </z-card-content>
    </z-card>
  `,
})
export class Preview01EmptyConnectBankComponent {}
