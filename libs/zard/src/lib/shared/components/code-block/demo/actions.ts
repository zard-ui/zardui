import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideTerminal, lucideWrapText } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const OUTPUT = `$ ng lint
src/app/chat/message-list.component.ts
  18:22  error    Unsafe call of an \`any\` typed value. Add a type to messages before calling map  @typescript-eslint/no-unsafe-call
  42:7   warning  Prefer signal inputs over @Input() decorators so the template reacts to changes  @angular-eslint/prefer-signals

✖ 2 problems (1 error, 1 warning)`;

@Component({
  selector: 'z-demo-code-block-actions',
  imports: [NgIcon, ZardButtonComponent, ...ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>
          <ng-icon name="lucideTerminal" />
          Terminal
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
          <z-code-block-copy-button [zValue]="output" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content [zWrap]="wrap()">{{ output }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideDownload, lucideTerminal, lucideWrapText })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockActionsComponent {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly output = OUTPUT;
  protected readonly wrap = signal(true);

  protected download(): void {
    if (!this.isBrowser) {
      return;
    }

    const url = URL.createObjectURL(new Blob([OUTPUT], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lint.log';
    link.click();
    URL.revokeObjectURL(url);
  }
}
