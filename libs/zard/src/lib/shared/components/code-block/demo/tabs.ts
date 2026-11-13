import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardTabComponent, ZardTabGroupComponent } from '@/shared/components/tabs/tabs.component';

const FILES = [
  {
    title: 'src/app/chat/chat.service.ts',
    language: 'typescript',
    code: `@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  send(messages: ChatMessage[]) {
    return this.http.post('/api/chat', { messages }, { responseType: 'text' });
  }
}`,
  },
  {
    title: 'src/app/chat/chat.component.ts',
    language: 'angular-ts',
    code: `@Component({
  selector: 'app-chat',
  template: \`<app-message-list [messages]="chat.messages()" />\`,
})
export class ChatComponent {
  protected readonly chat = inject(ChatService);
}`,
  },
  {
    title: 'proxy.conf.json',
    language: 'json',
    code: `{
  "/api": { "target": "http://localhost:3000", "secure": false }
}`,
  },
];

@Component({
  selector: 'z-demo-code-block-tabs',
  imports: [ZardTabComponent, ZardTabGroupComponent, ...ZardCodeBlockImports],
  template: `
    <z-tab-group class="w-full max-w-md">
      @for (file of files; track file.title) {
        <z-tab [label]="file.title.split('/').at(-1)!">
          <z-code-block>
            <z-code-block-header>
              <z-code-block-title>{{ file.title }}</z-code-block-title>
              <z-code-block-actions>
                <z-code-block-copy-button [zValue]="file.code" />
              </z-code-block-actions>
            </z-code-block-header>
            <z-code-block-content zLineNumbers>
              @for (line of file.lines(); track $index) {
                <z-code-block-line [zTokens]="line" />
              }
            </z-code-block-content>
          </z-code-block>
        </z-tab>
      }
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockTabsComponent {
  protected readonly files = FILES.map(file => ({ ...file, lines: injectHighlightedCode(file.code, file.language) }));
}
