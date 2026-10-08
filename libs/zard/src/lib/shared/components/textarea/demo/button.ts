import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-button',
  imports: [ZardTextareaComponent, ZardButtonComponent],
  template: `
    <div class="grid w-72 gap-2">
      <textarea
        z-textarea
        id="textarea-button-message"
        placeholder="Type your message here."
        [(value)]="message"
      ></textarea>
      <button type="button" z-button [zDisabled]="!message().trim()" (click)="send()">Send message</button>
      @if (sentMessage()) {
        <p class="text-muted-foreground text-sm" aria-live="polite">Sent: "{{ sentMessage() }}"</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTextareaButtonComponent {
  protected readonly message = signal('');
  protected readonly sentMessage = signal('');

  protected send(): void {
    this.sentMessage.set(this.message());
    this.message.set('');
  }
}
