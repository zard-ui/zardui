import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAudioLines, lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTooltipDirective } from '@/shared/components/tooltip/tooltip';

@Component({
  selector: 'z-demo-button-group-nested',
  imports: [
    ZardButtonGroupComponent,
    ZardButtonComponent,
    ZardInputComponent,
    ...ZardInputGroupImports,
    ZardTooltipDirective,
    NgIcon,
  ],
  template: `
    <z-button-group>
      <z-button-group>
        <button type="button" z-button zType="outline" zSize="icon" aria-label="Add">
          <ng-icon name="lucidePlus" />
        </button>
      </z-button-group>
      <z-button-group>
        <z-input-group>
          <input z-input placeholder="Send a message..." />
          <z-input-group-addon zAlign="inline-end" zTooltip="Voice Mode">
            <ng-icon name="lucideAudioLines" />
          </z-input-group-addon>
        </z-input-group>
      </z-button-group>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucidePlus, lucideAudioLines })],
})
export class ZardDemoButtonGroupNestedComponent {}
