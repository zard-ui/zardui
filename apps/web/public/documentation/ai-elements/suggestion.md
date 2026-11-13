# Suggestion

```bash tab="npm" copyButton
npx zard-cli add button
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add button
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add button
```

```bash tab="bun" copyButton
bunx zard-cli add button
```

## Usage

```angular-ts showLineNumbers copyButton
import { ZardButtonComponent } from '@/shared/components/button/button.component';
```

```angular-html showLineNumbers copyButton
<div class="scroll-fade-x flex [scrollbar-width:none] gap-2 overflow-x-auto overscroll-x-contain">
  @for (suggestion of suggestions; track suggestion) {
    <button type="button" z-button zType="outline" zSize="sm" class="shrink-0" (click)="send(suggestion)">
      {{ suggestion }}
    </button>
  }
</div>
```

## Streaming

```angular-ts showLineNumbers copyButton
protected send(suggestion: string): void {
  this.chat.send({ text: suggestion });
}
```
