# Chat

```bash tab="npm" copyButton
npx zard-cli add message-scroller message bubble input-group
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add message-scroller message bubble input-group
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add message-scroller message bubble input-group
```

```bash tab="bun" copyButton
bunx zard-cli add message-scroller message bubble input-group
```

## Usage

```angular-ts showLineNumbers copyButton
import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
```

```angular-html showLineNumbers copyButton
<z-message-scroller zAutoScroll [zBusy]="busy()">
  @for (message of messages(); track message.id) {
    <z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'">
      <z-message zAlign="end">
        <z-message-content>
          <z-bubble zAlign="end" zVariant="muted">
            <z-bubble-content>{{ message.text }}</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>
    </z-message-scroller-item>
  }
  <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
</z-message-scroller>
```
