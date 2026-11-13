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
      <button type="button" z-button zType="outline" zSize="sm" [zHoverCard]="details" [zOpenDelay]="10" [zCloseDelay]="100">
        {{ percent }}% context
      </button>

      <ng-template #details>
        <z-hover-card class="flex w-64 flex-col gap-3">
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
