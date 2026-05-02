import { Component } from '@angular/core';

import { ZardTextareaDirective } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-borderless',
  imports: [ZardTextareaDirective],
  template: `
    <textarea z-textarea zBorderless rows="6" placeholder="Borderless textarea" class="w-72 resize-none"></textarea>
  `,
})
export class ZardDemoTextareaBorderlessComponent {}
