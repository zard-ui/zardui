import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideFileCode } from '@ng-icons/lucide';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-input-group-block-start',
  imports: [ZardInputComponent, ZardTextareaComponent, NgIcon, ...ZardInputGroupImports, ...ZardFieldImports],
  template: `
    <div z-field-group class="min-w-sm">
      <div z-field>
        <label z-field-label for="block-start-input">Input</label>
        <z-input-group class="h-auto">
          <input z-input id="block-start-input" placeholder="Enter your name" />
          <z-input-group-addon zAlign="block-start">
            <span z-input-group-text>Full Name</span>
          </z-input-group-addon>
        </z-input-group>
        <p z-field-description>Header positioned above the input.</p>
      </div>
      <div z-field>
        <label z-field-label for="block-start-textarea">Textarea</label>
        <z-input-group>
          <textarea
            z-textarea
            id="block-start-textarea"
            placeholder="console.log('Hello, world!');"
            class="font-mono text-sm"
          ></textarea>
          <z-input-group-addon zAlign="block-start">
            <ng-icon name="lucideFileCode" class="text-muted-foreground" />
            <span z-input-group-text class="font-mono">script.js</span>
            <button type="button" z-input-group-button zSize="icon-xs" class="ml-auto">
              <ng-icon name="lucideCopy" />
              <span class="sr-only">Copy</span>
            </button>
          </z-input-group-addon>
        </z-input-group>
        <p z-field-description>Header positioned above the textarea.</p>
      </div>
    </div>
  `,
  viewProviders: [provideIcons({ lucideCopy, lucideFileCode })],
})
export class ZardDemoInputGroupBlockStartComponent {}
