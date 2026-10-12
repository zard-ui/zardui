import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

import { ExampleImports } from './example.component';

/** shadcn/ui's `textarea-example`, in zard. */
@Component({
  selector: 'z-textarea-example',
  imports: [ExampleImports, ZardFieldImports, ZardTextareaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <textarea z-textarea placeholder="Type your message here."></textarea>
      </z-example>

      <z-example zTitle="Invalid">
        <textarea z-textarea placeholder="Type your message here." aria-invalid="true"></textarea>
      </z-example>

      <z-example zTitle="With Label">
        <div z-field>
          <label z-field-label for="textarea-demo-message">Message</label>
          <textarea z-textarea id="textarea-demo-message" placeholder="Type your message here." rows="6"></textarea>
        </div>
      </z-example>

      <z-example zTitle="With Description">
        <div z-field>
          <label z-field-label for="textarea-demo-message-2">Message</label>
          <textarea z-textarea id="textarea-demo-message-2" placeholder="Type your message here." rows="6"></textarea>
          <p z-field-description>Type your message and press enter to send.</p>
        </div>
      </z-example>

      <z-example zTitle="Disabled">
        <div z-field>
          <label z-field-label for="textarea-demo-disabled">Message</label>
          <textarea z-textarea id="textarea-demo-disabled" placeholder="Type your message here." disabled></textarea>
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class TextareaExampleComponent {}
