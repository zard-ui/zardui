import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-wrap',
  imports: [ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      <z-code-block>
        <z-code-block-content>{{ output }}</z-code-block-content>
      </z-code-block>
      <z-code-block>
        <z-code-block-content zWrap>{{ output }}</z-code-block-content>
      </z-code-block>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockWrapComponent {
  protected readonly output =
    'NG0201: No provider found for `HttpClient`. Source: Standalone[ChatComponent]. Path: ChatService -> HttpClient. Add provideHttpClient() to the providers of your application config and try again.';
}
