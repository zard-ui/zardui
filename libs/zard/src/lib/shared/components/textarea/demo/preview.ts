import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-preview',
  imports: [ZardTextareaComponent],
  template: `
    <textarea z-textarea id="textarea-preview" placeholder="Type your message here." class="w-72"></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTextareaPreviewComponent {}
