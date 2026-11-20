import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardCardImports } from '@zard/components/card';
import { ZardInputComponent } from '@zard/components/input';
import { ZardInputGroupImports } from '@zard/components/input-group';
import { ZardItemImports } from '@zard/components/item';
import { ZardToggleGroupComponent, type ZardToggleGroupItem } from '@zard/components/toggle-group';

const HOLDINGS = [
  { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'ETF', added: 'Jan 2021', shares: '112', value: '$48,230.40' },
  {
    ticker: 'VIG',
    name: 'Vanguard Dividend Appreciation',
    type: 'ETF',
    added: 'Mar 2022',
    shares: '450',
    value: '$26,033.79',
  },
  { ticker: 'AAPL', name: 'Apple Inc.', type: 'Stock', added: 'Nov 2020', shares: '85', value: '$18,488.90' },
  { ticker: 'O', name: 'Realty Income Corp', type: 'REIT', added: 'Jun 2023', shares: '320', value: '$15,136.59' },
] as const;

const FILTERS: ZardToggleGroupItem[] = [
  { value: 'stocks', label: 'Stocks' },
  { value: 'etfs', label: 'ETFs' },
  { value: 'reits', label: 'REITs' },
];

@Component({
  selector: 'z-preview-01-release-catalog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardCardImports,
    ZardInputGroupImports,
    ZardInputComponent,
    ZardToggleGroupComponent,
    ZardItemImports,
    ZardBadgeComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideSearch })],
  template: `
    <z-card>
      <z-card-header>
        <div class="flex items-center justify-between gap-3">
          <z-input-group class="max-w-sm">
            <input z-input placeholder="Search holdings or tickers..." aria-label="Search holdings or tickers" />
            <z-input-group-addon>
              <ng-icon name="lucideSearch" />
            </z-input-group-addon>
          </z-input-group>
          <z-toggle-group zMode="single" zDefaultValue="etfs" zType="outline" [zSpacing]="1" [zItems]="filters" />
        </div>
      </z-card-header>
      <z-card-content>
        <z-item-group>
          @for (holding of holdings; track holding.ticker) {
            <z-item zVariant="muted">
              <z-item-media>
                <div class="flex size-12 items-center justify-center rounded-lg border text-sm font-semibold">
                  {{ holding.ticker }}
                </div>
              </z-item-media>
              <z-item-content>
                <z-item-title>{{ holding.name }}</z-item-title>
                <p z-item-description class="text-xs tracking-wider uppercase">
                  {{ holding.shares }} Shares · {{ holding.added }}
                </p>
              </z-item-content>
              <div class="flex shrink-0 items-center gap-6">
                <z-badge zType="outline">{{ holding.type }}</z-badge>
                <div class="flex flex-col items-end gap-0.5">
                  <span class="text-muted-foreground text-xs tracking-wider uppercase">Value</span>
                  <span class="font-medium tabular-nums">{{ holding.value }}</span>
                </div>
              </div>
            </z-item>
          }
        </z-item-group>
      </z-card-content>
    </z-card>
  `,
})
export class Preview01ReleaseCatalogComponent {
  protected readonly holdings = HOLDINGS;
  protected readonly filters = FILTERS;
}
