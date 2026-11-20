import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardEmptyComponent } from '@zard/components/empty';
import { ZardSpinnerComponent } from '@zard/components/spinner';

/**
 * zard's empty only draws an icon by name, so the spinner goes through `zImage` inside the icon tile shadcn's
 * `EmptyMedia variant="icon"` renders; the image wrapper's own margin is dropped so the tile keeps just its own.
 */
@Component({
  selector: 'z-preview-01-syncing-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardEmptyComponent, ZardButtonComponent, ZardSpinnerComponent],
  template: `
    <z-card>
      <z-card-content class="p-0">
        <z-empty
          class="p-4 [&_[data-slot=empty-media]]:mb-0"
          [zImage]="media"
          zTitle="Syncing your accounts"
          zDescription="We're pulling in your latest transactions. This usually takes a few seconds."
          [zActions]="[action]"
        />
        <ng-template #media>
          <div data-slot="empty-icon" data-variant="icon" class="cn-empty-icon">
            <z-spinner />
          </div>
        </ng-template>
        <ng-template #action>
          <button type="button" z-button zType="outline">Cancel</button>
        </ng-template>
      </z-card-content>
    </z-card>
  `,
})
export class Preview01SyncingStateComponent {}
