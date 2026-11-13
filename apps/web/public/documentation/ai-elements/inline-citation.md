# Inline Citation

```bash tab="npm" copyButton
npx zard-cli add hover-card button
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add hover-card button
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add hover-card button
```

```bash tab="bun" copyButton
bunx zard-cli add hover-card button
```

## Usage

```angular-ts showLineNumbers copyButton
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '@/shared/components/hover-card/hover-card.component';
```

```angular-html showLineNumbers copyButton
<button type="button" z-button zType="secondary" zSize="xs" [zHoverCard]="card" [zOpenDelay]="10" [zCloseDelay]="100">
  {{ hostname }}
</button>

<ng-template #card>
  <z-hover-card class="flex w-64 flex-col gap-1">
    <div class="font-medium">{{ title }}</div>
    <a [href]="url" target="_blank" rel="noreferrer">
      {{ hostname }}
      <span class="sr-only">(opens in a new tab)</span>
    </a>
  </z-hover-card>
</ng-template>
```

## Streaming

```angular-ts showLineNumbers copyButton
interface Source {
  url: string;
  title?: string;
}

protected readonly sources = signal<Source[]>([]);

/** `title` is optional: fall back to the hostname of the URL. */
protected label(source: Source): string {
  return source.title ?? new URL(source.url).hostname.replace(/^www\./, '');
}
```
