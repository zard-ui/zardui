import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const SAMPLES = [
  {
    language: 'css',
    title: 'src/styles.css',
    code: `@import "tailwindcss";

:root {
  --radius: 0.625rem;
}`,
  },
  {
    language: 'angular-html',
    title: 'src/app/app.html',
    code: `@if (user(); as user) {
  <p>Hello, {{ user.name }}!</p>
}`,
  },
  {
    language: 'text',
    title: 'notes.txt',
    code: 'A language that is not in the list renders as plain text.',
  },
];

@Component({
  selector: 'z-demo-code-block-languages',
  imports: [ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      @for (sample of samples; track sample.language) {
        <z-code-block>
          <z-code-block-header>
            <z-code-block-title>{{ sample.title }}</z-code-block-title>
          </z-code-block-header>
          <z-code-block-content>
            @for (line of sample.lines(); track $index) {
              <z-code-block-line [zTokens]="line" />
            }
          </z-code-block-content>
        </z-code-block>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockLanguagesComponent {
  protected readonly samples = SAMPLES.map(sample => ({
    ...sample,
    lines: injectHighlightedCode(sample.code, sample.language),
  }));
}
