import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCloud } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';

@Component({
  selector: 'z-demo-empty-outline',
  imports: [ZardButtonComponent, ZardEmptyComponent],
  template: `
    <z-empty
      class="border border-dashed"
      zIcon="lucideCloud"
      zTitle="Cloud Storage Empty"
      zDescription="Upload files to your cloud storage to access them anywhere."
      [zActions]="[actionPrimary]"
    >
      <ng-template #actionPrimary>
        <button type="button" z-button zType="outline" zSize="sm">Upload Files</button>
      </ng-template>
    </z-empty>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCloud })],
})
export class ZardDemoEmptyOutlineComponent {}
