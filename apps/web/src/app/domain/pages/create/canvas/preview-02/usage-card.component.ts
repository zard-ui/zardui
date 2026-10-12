import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardItemImports } from '@zard/components/item/item.imports';

const CIRCUMFERENCE = 2 * Math.PI * 42.5;

const ITEMS = [
  { name: 'Edge Requests', value: '$1.83K', percentage: 67.34 },
  { name: 'Fast Data Transfer', percentage: 52.18, value: '$952.51' },
  { name: 'Monitoring data points', percentage: 89.42, value: '$901.20' },
  { name: 'Web Analytics Events', percentage: 45.67, value: '$603.71' },
  { name: 'ISR Writes', percentage: 26.23, value: '524.52K / 2M' },
  { name: 'Function Duration', percentage: 5.11, value: '5.11 GB Hrs / 1K GB Hrs' },
].map(item => {
  const percentage = Math.min(Math.max(item.percentage, 0), 100);
  return { ...item, dash: `${(percentage / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}` };
});

@Component({
  selector: 'z-preview-02-usage-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardItemImports],
  host: { class: 'block' },
  template: `
    <z-card class="w-full max-w-sm gap-4">
      <z-card-header>
        <z-card-title zTitle="5 days remaining in cycle" class="px-1 text-sm" />
      </z-card-header>
      <z-card-content>
        <div z-item-group class="gap-0">
          @for (item of items; track item.name) {
            <a
              z-item
              zSize="xs"
              href="#"
              class="px-0 group-hover/item-group:bg-transparent"
              (click)="$event.preventDefault()"
            >
              <div z-item-media zVariant="icon" class="text-primary">
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="16"
                  width="16"
                  stroke-width="2"
                  viewBox="0 0 100 100"
                  class="-rotate-90"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="42.5"
                    stroke-width="12"
                    stroke-dashoffset="0"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="opacity-20"
                    stroke="currentColor"
                    [style.stroke-dasharray]="fullDash"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42.5"
                    stroke-width="12"
                    stroke-dashoffset="0"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke="currentColor"
                    class="transition-all duration-300"
                    [style.stroke-dasharray]="item.dash"
                  />
                </svg>
              </div>
              <div z-item-content class="inline-block truncate">
                <div z-item-title class="inline">{{ item.name }}</div>
              </div>
              <div z-item-actions>
                <span class="text-muted-foreground font-mono text-xs font-medium tabular-nums">{{ item.value }}</span>
              </div>
            </a>
          }
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class Preview02UsageCardComponent {
  protected readonly items = ITEMS;
  protected readonly fullDash = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
}
