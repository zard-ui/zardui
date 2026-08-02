import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-button',
  imports: [ZardTextareaComponent, ZardButtonComponent],
  template: `
    <div class="grid w-72 gap-2">
      <textarea z-textarea placeholder="Type your message here."></textarea>
      <button z-button>Send message</button>
    </div>
  `,
})
export class ZardDemoTextareaButtonComponent {}
