import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileCode } from '@ng-icons/lucide';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CODE = `@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  send(messages: ChatMessage[]) {
    return this.http.post('/api/chat', { messages }, { responseType: 'text' });
  }
}`;

@Component({
  selector: 'z-demo-code-block-typeset',
  imports: [NgIcon, ...ZardCodeBlockImports],
  template: `
    <div class="typeset w-full max-w-md">
      <h3>Stream a response</h3>
      <p>
        Create a service that posts the messages with
        <code>HttpClient</code>
        and returns the response to the component.
      </p>
      <z-code-block>
        <z-code-block-header>
          <z-code-block-title>
            <ng-icon name="lucideFileCode" />
            src/app/chat/chat.service.ts
          </z-code-block-title>
          <z-code-block-actions>
            <z-code-block-copy-button [zValue]="code" />
          </z-code-block-actions>
        </z-code-block-header>
        <z-code-block-content zLineNumbers>
          @for (line of lines(); track $index) {
            <z-code-block-line [zTokens]="line" />
          }
        </z-code-block-content>
      </z-code-block>
      <p>
        The component turns the response into a signal with
        <code>toSignal</code>
        and renders the answer while it is written.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFileCode })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockTypesetComponent {
  protected readonly code = CODE;
  protected readonly lines = injectHighlightedCode(CODE, 'typescript');
}
