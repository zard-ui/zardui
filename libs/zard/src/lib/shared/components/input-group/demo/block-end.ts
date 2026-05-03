import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-input-group-block-end',
  imports: [ZardInputComponent, ZardTextareaComponent, ...ZardInputGroupImports, ...ZardFieldImports],
  template: `
    <div z-field-group class="min-w-sm">
      <div z-field>
        <label z-field-label for="block-end-input">Input</label>
        <z-input-group class="h-auto">
          <input z-input id="block-end-input" placeholder="Enter amount" />
          <z-input-group-addon zAlign="block-end">
            <span z-input-group-text>USD</span>
          </z-input-group-addon>
        </z-input-group>
        <p z-field-description>Footer positioned below the input.</p>
      </div>
      <div z-field>
        <label z-field-label for="block-end-textarea">Textarea</label>
        <z-input-group>
          <textarea z-textarea id="block-end-textarea" placeholder="Write a comment..."></textarea>
          <z-input-group-addon zAlign="block-end">
            <span z-input-group-text>0/280</span>
            <button z-input-group-button zVariant="default" zSize="sm" class="ml-auto">Post</button>
          </z-input-group-addon>
        </z-input-group>
        <p z-field-description>Footer positioned below the textarea.</p>
      </div>
    </div>
  `,
})
export class ZardDemoInputGroupBlockEndComponent {}
