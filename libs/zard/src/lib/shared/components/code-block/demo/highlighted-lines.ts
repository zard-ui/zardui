import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CODE = `export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
  ],
};`;

@Component({
  selector: 'z-demo-code-block-highlighted-lines',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-content zLineNumbers>
        @for (line of lines; track $index) {
          <z-code-block-line [zTokens]="line" [zType]="highlighted.includes($index) ? 'highlighted' : 'default'" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockHighlightedLinesComponent {
  // One token list per line: plain text, no highlighting.
  protected readonly lines = CODE.split('\n').map(line => (line ? [{ content: line }] : []));
  protected readonly highlighted = [2, 3];
}
