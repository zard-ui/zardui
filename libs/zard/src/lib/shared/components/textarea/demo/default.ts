import { Component } from '@angular/core';

import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-default',
  imports: [ZardTextareaComponent],
  template: `
    <textarea z-textarea placeholder="Type your message here." class="w-72"></textarea>
  `,
})
export class ZardDemoTextareaDefaultComponent {}
