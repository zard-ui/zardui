---
title: Context
description: How much of the context window the conversation has used.
---

# Context

How much of the context window the conversation has used.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '@/shared/components/hover-card/hover-card.component';
import { ZardProgressComponent } from '@/shared/components/progress/progress.component';

const USAGE = {
  input: 8420,
  output: 1260,
  reasoning: 980,
  limit: 128000,
};

/** 12400 -> "12.4k", 128000 -> "128k". */
function formatTokens(value: number): string {
  if (value < 1000) return String(value);
  return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
}

const USED = USAGE.input + USAGE.output + USAGE.reasoning;

@Component({
  selector: 'z-ai-elements-context',
  imports: [ZardButtonComponent, ZardHoverCardComponent, ZardHoverCardDirective, ZardProgressComponent],
  template: `
    <div class="flex justify-center py-12">
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zHoverCard]="details"
        [zOpenDelay]="10"
        [zCloseDelay]="100"
      >
        {{ percent }}% context
      </button>

      <ng-template #details>
        <z-hover-card class="flex w-64 flex-col gap-3 text-sm">
          <div class="flex items-center justify-between gap-3 text-sm">
            <span class="font-medium">Context</span>
            <span class="text-muted-foreground">{{ used }} / {{ limit }}</span>
          </div>
          <z-progress [value]="percent" aria-label="Context used" />
          <div class="flex flex-col gap-1 text-sm">
            @for (row of rows; track row.label) {
              <div class="flex justify-between gap-3">
                <span class="text-muted-foreground">{{ row.label }}</span>
                <span>{{ row.value }}</span>
              </div>
            }
          </div>
        </z-hover-card>
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardAiElementsContextComponent {
  protected readonly percent = Math.round((USED / USAGE.limit) * 100);
  protected readonly used = formatTokens(USED);
  protected readonly limit = formatTokens(USAGE.limit);
  protected readonly rows = [
    { label: 'Input', value: formatTokens(USAGE.input) },
    { label: 'Output', value: formatTokens(USAGE.output) },
    { label: 'Reasoning', value: formatTokens(USAGE.reasoning) },
  ];
}
```

Context shows how much of the model’s context window the conversation has used. It is a [Hover Card](/docs/components/hover-card) with a [Progress](/docs/components/progress) bar.

## Installation

Context is built with [Hover Card](/docs/components/hover-card) and [Progress](/docs/components/progress). Add them with the CLI:

```
npx zard-cli add hover-card progress
```

Then copy the code of the example into your project and adapt it. There is no package to install: the pattern is yours. To install a component by hand, follow the Manual tab on its page.

## Usage

```
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '@/shared/components/hover-card/hover-card.component';
import { ZardProgressComponent } from '@/shared/components/progress/progress.component';
```

```
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

Read the token usage your model reports when a reply finishes, and keep it in a signal. The percentage follows from it.

```
/** The model's context window. Models do not send it, so set it from the model you use. */
const LIMIT = 128_000;

protected readonly usage = signal({ inputTokens: 0, outputTokens: 0 });

protected readonly percent = computed(() => {
  const { inputTokens, outputTokens } = this.usage();
  return Math.round(((inputTokens + outputTokens) / LIMIT) * 100);
});
```

The limit is the model’s context window. Models do not send it, so set it from the model you use.

## API Reference

Context has no API of its own. See the API of the components it is built with:

- [Hover Card](/docs/components/hover-card#api)
- [Progress](/docs/components/progress#api)
