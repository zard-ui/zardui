import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardKbdComponent } from '@zard/components/kbd/kbd.component';

@Component({
  selector: 'z-preview-02-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardCardImports,
    ZardEmptyComponent,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardKbdComponent,
  ],
  viewProviders: [provideIcons({ lucideSearch })],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-content>
        <z-empty
          class="h-72"
          zTitle="404 - Not Found"
          zDescription="The page you're looking for doesn't exist. Try searching for what you need below."
          [zActions]="[search, home]"
        />
        <ng-template #search>
          <z-input-group class="w-3/4">
            <input z-input placeholder="Try searching for pages..." aria-label="Search pages" />
            <z-input-group-addon>
              <ng-icon name="lucideSearch" />
            </z-input-group-addon>
            <z-input-group-addon zAlign="inline-end">
              <z-kbd>/</z-kbd>
            </z-input-group-addon>
          </z-input-group>
        </ng-template>
        <ng-template #home>
          <button type="button" z-button zType="link">Go to homepage</button>
        </ng-template>
      </z-card-content>
    </z-card>
  `,
})
export class Preview02NotFoundComponent {}
