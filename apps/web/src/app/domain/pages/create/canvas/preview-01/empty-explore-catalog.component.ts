import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideAudioLines } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardEmptyComponent } from '@zard/components/empty';

/** shadcn puts the media above the header; zard draws it inside, so its margin makes up the header's missing gap. */
@Component({
  selector: 'z-preview-01-empty-explore-catalog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardEmptyComponent, ZardButtonComponent],
  viewProviders: [provideIcons({ lucideAudioLines })],
  template: `
    <z-card>
      <z-card-content>
        <z-empty
          class="p-4 [&_[data-slot=empty-media]]:mb-4"
          zIcon="lucideAudioLines"
          zTitle="Explore Catalog"
          zDescription="Check your ISRC codes, metadata, and visual assets before going live."
          [zActions]="[action]"
        />
        <ng-template #action>
          <button type="button" z-button>View Catalog</button>
        </ng-template>
      </z-card-content>
    </z-card>
  `,
})
export class Preview01EmptyExploreCatalogComponent {}
