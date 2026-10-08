import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-input-group-spinner',
  imports: [ZardInputComponent, ZardSpinnerComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <div class="grid w-full min-w-sm gap-4">
      <z-input-group>
        <input z-input id="input-group-spinner-search" placeholder="Searching..." />
        <z-input-group-addon zAlign="inline-end">
          <z-spinner />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input id="input-group-spinner-processing" placeholder="Processing..." />
        <z-input-group-addon>
          <z-spinner />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input id="input-group-spinner-saving" placeholder="Saving changes..." />
        <z-input-group-addon zAlign="inline-end">
          <span z-input-group-text>Saving...</span>
          <z-spinner />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input id="input-group-spinner-refreshing" placeholder="Refreshing data..." />
        <z-input-group-addon>
          <ng-icon name="lucideLoader" class="animate-spin" />
        </z-input-group-addon>
        <z-input-group-addon zAlign="inline-end">
          <span z-input-group-text class="text-muted-foreground">Please wait...</span>
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideLoader })],
})
export class ZardDemoInputGroupSpinnerComponent {}
