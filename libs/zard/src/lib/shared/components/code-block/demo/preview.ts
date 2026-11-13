import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideFileCode, lucideWrapText } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CODE = `import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  send(messages: ChatMessage[]) {
    return this.http.post('/api/chat', { messages }, {
      observe: 'events',
      reportProgress: true,
      responseType: 'text',
    });
  }
}`;

/** The lines that call the API, highlighted in the block. */
const HIGHLIGHTED = [8, 9, 10, 11, 12];

@Component({
  selector: 'z-demo-code-block-preview',
  imports: [NgIcon, ZardButtonComponent, ...ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-lg">
      <z-code-block-header>
        <z-code-block-title>
          <ng-icon name="lucideFileCode" />
          src/app/chat/chat.service.ts
        </z-code-block-title>
        <z-code-block-actions>
          <button
            type="button"
            z-button
            zType="ghost"
            zSize="icon-xs"
            aria-label="Wrap lines"
            class="aria-pressed:text-foreground"
            [attr.aria-pressed]="wrap()"
            (click)="wrap.set(!wrap())"
          >
            <ng-icon name="lucideWrapText" />
          </button>
          <button type="button" z-button zType="ghost" zSize="icon-xs" aria-label="Download" (click)="download()">
            <ng-icon name="lucideDownload" />
          </button>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zLineNumbers [zWrap]="wrap()">
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" [zType]="highlighted.includes($index) ? 'highlighted' : 'default'" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideDownload, lucideFileCode, lucideWrapText })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockPreviewComponent {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly code = CODE;
  protected readonly highlighted = HIGHLIGHTED;
  protected readonly wrap = signal(false);
  protected readonly lines = injectHighlightedCode(CODE, 'typescript');

  protected download(): void {
    if (!this.isBrowser) {
      return;
    }

    const url = URL.createObjectURL(new Blob([CODE], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chat.service.ts';
    link.click();
    URL.revokeObjectURL(url);
  }
}
