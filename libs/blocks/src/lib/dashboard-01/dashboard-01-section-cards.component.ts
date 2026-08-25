import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingDown, lucideTrendingUp } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardCardImports } from '@zard/components/card/card.imports';

interface SectionCard {
  readonly description: string;
  readonly value: string;
  readonly badge: string;
  readonly trend: 'up' | 'down';
  readonly headline: string;
  readonly caption: string;
}

@Component({
  selector: 'lib-dashboard-01-section-cards',
  standalone: true,
  imports: [...ZardCardImports, ZardBadgeComponent, NgIcon],
  viewProviders: [provideIcons({ lucideTrendingDown, lucideTrendingUp })],
  templateUrl: './dashboard-01-section-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Dashboard01SectionCardsComponent {
  // This is sample data.
  protected readonly cards: readonly SectionCard[] = [
    {
      description: 'Total Revenue',
      value: '$1,250.00',
      badge: '+12.5%',
      trend: 'up',
      headline: 'Trending up this month',
      caption: 'Visitors for the last 6 months',
    },
    {
      description: 'New Customers',
      value: '1,234',
      badge: '-20%',
      trend: 'down',
      headline: 'Down 20% this period',
      caption: 'Acquisition needs attention',
    },
    {
      description: 'Active Accounts',
      value: '45,678',
      badge: '+12.5%',
      trend: 'up',
      headline: 'Strong user retention',
      caption: 'Engagement exceed targets',
    },
    {
      description: 'Growth Rate',
      value: '4.5%',
      badge: '+4.5%',
      trend: 'up',
      headline: 'Steady performance increase',
      caption: 'Meets growth projections',
    },
  ];

  protected trendIcon(trend: 'up' | 'down'): string {
    return trend === 'up' ? 'lucideTrendingUp' : 'lucideTrendingDown';
  }
}
