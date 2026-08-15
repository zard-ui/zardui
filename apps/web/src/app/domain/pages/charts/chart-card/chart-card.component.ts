import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CopyButtonComponent } from '@highlight/components/copy-button/copy-button.component';

import type { ChartExample } from '../../../config/charts-registry';

@Component({
  selector: 'z-chart-card',
  imports: [NgComponentOutlet, CopyButtonComponent],
  template: `
    @let example = chart();
    <div class="group border-border bg-background relative rounded-xl border p-1">
      <z-copy-button
        [code]="example.codeData.code"
        class="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring absolute top-3 right-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-transparent opacity-60 transition-all duration-200 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
      />
      <ng-container *ngComponentOutlet="example.component" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartCardComponent {
  readonly chart = input.required<ChartExample>();
}
