import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShield } from '@ng-icons/lucide';

import { ZardEmptyComponent } from '@zard/components/empty/empty.component';

@Component({
  selector: 'z-authentication-example-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardEmptyComponent, NgIcon],
  viewProviders: [provideIcons({ lucideShield })],
  template: `
    <z-empty
      zTitle="Authentication Example"
      zDescription="This example is coming soon. Stay tuned!"
      class="min-h-96 border border-dashed"
    >
      <ng-template #zImage>
        <div class="bg-muted text-foreground mb-2 flex size-12 items-center justify-center rounded-lg">
          <ng-icon name="lucideShield" class="size-6" />
        </div>
      </ng-template>
    </z-empty>
  `,
})
export class AuthenticationExamplePage {}
