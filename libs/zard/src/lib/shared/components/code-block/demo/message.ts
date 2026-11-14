import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

const CODE = `@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  stream(messages: ChatMessage[]) {
    return this.http.post('/api/chat', { messages }, {
      observe: 'events',
      reportProgress: true,
      responseType: 'text',
    });
  }
}`;

@Component({
  selector: 'z-demo-code-block-message',
  imports: [...ZardBubbleImports, ...ZardCodeBlockImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4 text-sm">
      <z-message zAlign="end">
        <z-message-content>
          <z-bubble zAlign="end" zVariant="muted">
            <z-bubble-content>How do I stream a response?</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>
      <z-message>
        <z-message-content class="gap-3">
          <p>Create a service that asks for the progress events:</p>
          <z-code-block>
            <z-code-block-header>
              <z-code-block-title>src/app/chat/chat.service.ts</z-code-block-title>
              <z-code-block-actions>
                <z-code-block-copy-button [zValue]="code" />
              </z-code-block-actions>
            </z-code-block-header>
            <z-code-block-content>
              @for (line of lines(); track $index) {
                <z-code-block-line [zTokens]="line" />
              }
            </z-code-block-content>
          </z-code-block>
          <p>The component reads the partial text from each event.</p>
        </z-message-content>
      </z-message>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockMessageComponent {
  protected readonly code = CODE;
  protected readonly lines = injectHighlightedCode(CODE, 'typescript');
}
