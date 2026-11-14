import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFileText } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

const QUESTION = 'Which Angular version does this app use?';
const PATH = 'package.json';
const PACKAGE_JSON = `{
  "name": "acme-chat",
  "private": true,
  "dependencies": {
    "@angular/core": "^22.1.0",
    "@angular/router": "^22.1.0",
    "rxjs": "^7.8.0"
  }
}`;
const ANSWER = 'It uses Angular 22.1 with RxJS 7.8.';

@Component({
  selector: 'z-ai-elements-tool-sheet',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ...ZardBubbleImports,
    ...ZardCodeBlockImports,
    ...ZardMessageImports,
    ...ZardSheetImports,
    ...ZardTraceImports,
  ],
  template: `
    <div class="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      @if (sent()) {
        <z-message zAlign="end">
          <z-message-content>
            <z-bubble zAlign="end" zVariant="muted">
              <z-bubble-content>{{ question }}</z-bubble-content>
            </z-bubble>
          </z-message-content>
        </z-message>

        <z-message>
          <z-message-content class="gap-4">
            <z-trace>
              @if (read()) {
                <!-- Long output goes in a sheet: the line is the button that opens it. -->
                <button type="button" (click)="open.set(true)">
                  <z-trace-line>
                    <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                    <z-trace-title>Read {{ path }}</z-trace-title>
                    <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
                  </z-trace-line>
                </button>
              } @else {
                <z-trace-line zStatus="running">
                  <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                  <z-trace-title>Reading {{ path }}</z-trace-title>
                </z-trace-line>
              }
            </z-trace>

            @if (answer()) {
              <p>{{ answer() }}</p>
            }
          </z-message-content>
        </z-message>
      }

      @if (!busy()) {
        <button type="button" z-button zType="outline" zSize="sm" class="mt-auto self-start" (click)="next()">
          {{ sent() ? 'Reset' : 'Send message' }}
        </button>
      }
    </div>

    <z-sheet [(zVisible)]="open">
      <z-sheet-header>
        <z-sheet-title class="font-mono">{{ path }}</z-sheet-title>
        <z-sheet-description>{{ lineCount }} lines</z-sheet-description>
      </z-sheet-header>
      <z-code-block class="mx-6 mb-6 w-auto">
        <z-code-block-content zLineNumbers>{{ content }}</z-code-block-content>
      </z-code-block>
    </z-sheet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFileText })],
  host: { class: 'contents' },
})
export class ZardAiElementsToolSheetComponent {
  protected readonly question = QUESTION;
  protected readonly path = PATH;
  protected readonly content = PACKAGE_JSON;
  protected readonly lineCount = PACKAGE_JSON.split('\n').length;

  protected readonly sent = signal(false);
  protected readonly read = signal(false);
  protected readonly answer = signal('');
  protected readonly busy = signal(false);
  protected readonly open = signal(false);

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  protected next(): void {
    if (this.sent()) {
      this.run++;
      this.sent.set(false);
      this.read.set(false);
      this.answer.set('');
    } else {
      void this.send();
    }
  }

  private async send(): Promise<void> {
    const run = ++this.run;
    this.sent.set(true);
    this.busy.set(true);

    if (!(await this.wait(900, run))) return;
    this.read.set(true);

    let shown = '';
    for (const word of ANSWER.split(/(?<=\s)/)) {
      if (!(await this.wait(20, run))) return;
      shown += word;
      this.answer.set(shown);
    }
    this.busy.set(false);
  }

  private wait(ms: number, run: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(run === this.run), ms));
  }
}
