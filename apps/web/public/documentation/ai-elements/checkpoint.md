# Checkpoint

```bash tab="npm" copyButton
npx zard-cli add marker button
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add marker button
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add marker button
```

```bash tab="bun" copyButton
bunx zard-cli add marker button
```

## Usage

```angular-ts showLineNumbers copyButton
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
```

```angular-html showLineNumbers copyButton
<z-marker zVariant="separator">
  <z-marker-content class="inline-flex items-center gap-2">
    {{ label }}
    <button type="button" z-button zType="outline" zSize="xs" (click)="restore()">Restore</button>
  </z-marker-content>
</z-marker>
```

## Streaming

```angular-ts showLineNumbers copyButton
/** Keeps the turn with the checkpoint and drops every message after it. */
protected restore(messageId: string): void {
  const index = this.messages().findIndex(message => message.id === messageId);
  this.messages.update(messages => messages.slice(0, index + 1));
}
```
