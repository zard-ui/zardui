# Message

```bash tab="npm" copyButton
npx zard-cli add message bubble tooltip code-block
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add message bubble tooltip code-block
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add message bubble tooltip code-block
```

```bash tab="bun" copyButton
bunx zard-cli add message bubble tooltip code-block
```

## Usage

```angular-ts showLineNumbers copyButton
import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
```

```angular-html showLineNumbers copyButton
<z-message zAlign="end">
  <z-message-content>
    <z-bubble zAlign="end" zVariant="muted">
      <z-bubble-content>How do I add a settings dialog?</z-bubble-content>
    </z-bubble>
  </z-message-content>
</z-message>
<z-message>
  <z-message-content class="gap-2">
    <p>Install Dialog, then open it from the gear button.</p>
    <z-message-footer>
      <button type="button" z-button zType="ghost" zSize="icon-sm" aria-label="Copy" zTooltip="Copy">
        <ng-icon name="lucideCopy" />
      </button>
    </z-message-footer>
  </z-message-content>
</z-message>
```

## Streaming

```angular-html showLineNumbers copyButton
@for (message of messages(); track message.id) {
  @if (message.role === 'user') {
    <z-message zAlign="end">
      <z-message-content>
        <z-bubble zAlign="end" zVariant="muted">
          <z-bubble-content>{{ message.text }}</z-bubble-content>
        </z-bubble>
      </z-message-content>
    </z-message>
  } @else {
    <z-message>
      <z-message-content class="gap-2">
        <div [innerHTML]="message.html"></div>
        <z-message-footer>
          <button type="button" z-button zType="ghost" zSize="icon-sm" aria-label="Retry" (click)="retry(message.id)">
            <ng-icon name="lucideRefreshCcw" />
          </button>
        </z-message-footer>
      </z-message-content>
    </z-message>
  }
}
```
