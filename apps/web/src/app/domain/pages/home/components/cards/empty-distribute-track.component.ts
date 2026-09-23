import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';

@Component({
  selector: 'z-card-empty-distribute-track',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardEmptyComponent, ZardButtonComponent],
  viewProviders: [provideIcons({ lucidePlus })],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-content>
        <z-empty
          class="p-4 [&_[data-slot=empty-media]]:mb-4"
          zIcon="lucidePlus"
          zTitle="Distribute Track"
          zDescription="Upload your first master to start reaching listeners on Spotify, Apple Music, and more."
        >
          <button type="button" z-button>Create Release</button>
        </z-empty>
      </z-card-content>
    </z-card>
  `,
})
export class CardEmptyDistributeTrackComponent {}
