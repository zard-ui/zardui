# Code block snippets

Code fragments shown on the code block docs page: the composition tree and the `codeAfter` blocks.
Each fenced block is exported as `CODE_BLOCK_SNIPPET_<ID>` via the snippet generator.

```text id="composition" copyButton
z-code-block
├── z-code-block-header
│   ├── z-code-block-title
│   └── z-code-block-actions
│       └── z-code-block-copy-button
├── z-code-block-actions (floating, when there is no header)
├── z-code-block-content
│   └── z-code-block-line
└── z-code-block-footer
```

```angular-html id="title-link" copyButton
<z-code-block-header>
  <a href="/files/chat.service.ts">
    <z-code-block-title>src/app/chat/chat.service.ts</z-code-block-title>
  </a>
</z-code-block-header>
```

```angular-html id="wrap-toggle" copyButton
<z-code-block-actions>
  <button
    type="button"
    z-button
    zType="ghost"
    zSize="icon-xs"
    aria-label="Wrap lines"
    [attr.aria-pressed]="wrap()"
    (click)="wrap.set(!wrap())"
  >
    <ng-icon name="lucideWrapText" />
  </button>
  <z-code-block-copy-button [zValue]="output" />
</z-code-block-actions>
<z-code-block-content [zWrap]="wrap()">{{ output }}</z-code-block-content>
```

```angular-html id="show-more" copyButton
<!-- cap() is 'scroll-fade-y max-h-64 overflow-y-hidden' while collapsed. -->
<z-code-block-content id="chat-code" [class]="cap()">{{ code }}</z-code-block-content>
<z-code-block-footer class="justify-center">
  <button
    type="button"
    z-button
    zType="ghost"
    zSize="xs"
    aria-controls="chat-code"
    [attr.aria-expanded]="expanded()"
    (click)="expanded.set(!expanded())"
  >
    {{ expanded() ? 'Show less' : 'Show more' }}
  </button>
</z-code-block-footer>
```

```angular-ts id="highlighting" copyButton
import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';

export class WeatherOutputComponent {
  // Plain lines until Shiki has run, then the highlighted ones.
  protected readonly lines = injectHighlightedCode(this.code, 'json');
}
```

```angular-html id="highlighting-template" copyButton
<z-code-block>
  <z-code-block-content>
    @for (line of lines(); track $index) {
      <z-code-block-line [zTokens]="line" />
    }
  </z-code-block-content>
</z-code-block>
```

```angular-ts id="server-rendering" copyButton
import { Component, input, resource } from '@angular/core';

import { highlightCode } from '@/shared/components/code-block/code-block.highlight';

@Component({
  selector: 'app-server-code',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block>
      <z-code-block-content zLineNumbers>
        @for (line of highlighted.value() ?? []; track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
})
export class ServerCodeComponent {
  readonly code = input.required<string>();

  // A resource holds the server render until the lines are highlighted, so the HTML ships with its colors.
  protected readonly highlighted = resource({
    params: () => this.code(),
    loader: ({ params }) => highlightCode(params, 'typescript'),
  });
}
```
