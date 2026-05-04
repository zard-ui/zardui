import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-spinner-input-group',
  imports: [ZardInputComponent, ZardTextareaComponent, ZardSpinnerComponent, NgIcon, ...ZardInputGroupImports],
  viewProviders: [provideIcons({ lucideArrowUp })],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      <z-input-group>
        <input z-input placeholder="Send a message..." disabled />
        <z-input-group-addon zAlign="inline-end">
          <z-spinner />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <textarea z-textarea placeholder="Send a message..." disabled></textarea>
        <z-input-group-addon zAlign="block-end">
          <z-spinner />
          Validating...
          <button z-input-group-button zVariant="default" zSize="icon-xs" class="ml-auto">
            <ng-icon name="lucideArrowUp" />
            <span class="sr-only">Send</span>
          </button>
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
})
export class ZardDemoSpinnerInputGroupComponent {}
