import { Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAudioLines, lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTooltipDirective } from '@/shared/components/tooltip/tooltip';

@Component({
  selector: 'z-demo-button-group-input-group',
  imports: [
    ZardButtonGroupComponent,
    ZardButtonComponent,
    ZardInputComponent,
    ...ZardInputGroupImports,
    ZardTooltipDirective,
    NgIcon,
  ],
  template: `
    <z-button-group class="[--radius:9999rem]">
      <z-button-group>
        <button type="button" z-button zType="outline" zSize="icon" aria-label="Add">
          <ng-icon name="lucidePlus" />
        </button>
      </z-button-group>
      <z-button-group>
        <z-input-group>
          <input
            z-input
            [placeholder]="voiceEnabled() ? 'Record and send audio...' : 'Send a message...'"
            [disabled]="voiceEnabled()"
          />
          <z-input-group-addon zAlign="inline-end">
            <button
              z-input-group-button
              zTooltip="Voice Mode"
              aria-label="Voice Mode"
              [attr.aria-pressed]="voiceEnabled()"
              [attr.data-active]="voiceEnabled() ? '' : null"
              class="data-[active]:bg-orange-100 data-[active]:text-orange-700 dark:data-[active]:bg-orange-800 dark:data-[active]:text-orange-100"
              (click)="toggleVoice()"
            >
              <ng-icon name="lucideAudioLines" />
            </button>
          </z-input-group-addon>
        </z-input-group>
      </z-button-group>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucidePlus, lucideAudioLines })],
})
export class ZardDemoButtonGroupInputGroupComponent {
  protected readonly voiceEnabled = signal(false);

  protected toggleVoice(): void {
    this.voiceEnabled.update(value => !value);
  }
}
