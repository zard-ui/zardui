import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardImports } from '@/shared/components/card/card.imports';

@Component({
  selector: 'z-demo-card-size',
  imports: [ZardCardImports, ZardButtonComponent, NgIcon],
  template: `
    <z-card zSize="sm" class="mx-auto w-full max-w-xs">
      <z-card-header>
        <z-card-title [zTitle]="featureName" />
        <z-card-description zDescription="Weekly snapshots. No more manual exports." />
      </z-card-header>
      <z-card-content>
        <ul class="grid gap-2 py-2 text-sm">
          <li class="flex gap-2">
            <ng-icon name="lucideChevronRight" class="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <span>Choose a schedule (daily, or weekly).</span>
          </li>
          <li class="flex gap-2">
            <ng-icon name="lucideChevronRight" class="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <span>Send to channels or specific teammates.</span>
          </li>
          <li class="flex gap-2">
            <ng-icon name="lucideChevronRight" class="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <span>Include charts, tables, and key metrics.</span>
          </li>
        </ul>
      </z-card-content>
      <z-card-footer class="flex-col gap-2">
        <z-button zSize="sm" class="w-full">Set up scheduled reports</z-button>
        <z-button zType="outline" zSize="sm" class="w-full">See what's new</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight })],
})
export class ZardDemoCardSizeComponent {
  readonly featureName = 'Scheduled reports';
}
