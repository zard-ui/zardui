# Context

```bash tab="npm" copyButton
npx zard-cli add hover-card progress
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add hover-card progress
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add hover-card progress
```

```bash tab="bun" copyButton
bunx zard-cli add hover-card progress
```

## Usage

```angular-ts showLineNumbers copyButton
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '@/shared/components/hover-card/hover-card.component';
import { ZardProgressComponent } from '@/shared/components/progress/progress.component';
```

```angular-html showLineNumbers copyButton
<button type="button" z-button zType="outline" zSize="sm" [zHoverCard]="details" [zOpenDelay]="10" [zCloseDelay]="100">
  {{ percent }}% context
</button>

<ng-template #details>
  <z-hover-card class="flex w-64 flex-col gap-3 text-sm">
    <div class="flex items-center justify-between gap-3 text-sm">
      <span class="font-medium">Context</span>
      <span class="text-muted-foreground">{{ used }} / {{ limit }}</span>
    </div>
    <z-progress [value]="percent" aria-label="Context used" />
  </z-hover-card>
</ng-template>
```

## Streaming

```angular-ts showLineNumbers copyButton
/** The model's context window. Models do not send it, so set it from the model you use. */
const LIMIT = 128_000;

protected readonly usage = signal({ inputTokens: 0, outputTokens: 0 });

protected readonly percent = computed(() => {
  const { inputTokens, outputTokens } = this.usage();
  return Math.round(((inputTokens + outputTokens) / LIMIT) * 100);
});
```
