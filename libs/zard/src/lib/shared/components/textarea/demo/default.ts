import { Component } from '@angular/core';

import { ZardTextareaDirective } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-default',
  imports: [ZardTextareaDirective],
  template: `
    <textarea z-textarea rows="6" placeholder="Type your message here." class="w-72 resize-none"></textarea>
  `,
})
export class ZardDemoTextareaDefaultComponent {}
