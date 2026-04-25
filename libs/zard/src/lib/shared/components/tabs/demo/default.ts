import { Component } from '@angular/core';

import { ZardCardComponent } from '@/shared/components/card/card.component';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-default',
  imports: [ZardTabComponent, ZardTabGroupComponent, ZardCardComponent],
  standalone: true,
  template: `
    <z-tab-group class="w-[400px]">
      <z-tab label="Overview">
        <z-card
          zTitle="Overview"
          zDescription="View your key metrics and recent project activity. Track progress across all your active projects."
        >
          <p class="text-muted-foreground text-sm">You have 12 active projects and 3 pending tasks.</p>
        </z-card>
      </z-tab>
      <z-tab label="Analytics">
        <z-card
          zTitle="Analytics"
          zDescription="Track performance and user engagement metrics. Monitor trends and identify growth opportunities."
        >
          <p class="text-muted-foreground text-sm">Page views are up 25% compared to last month.</p>
        </z-card>
      </z-tab>
      <z-tab label="Reports">
        <z-card
          zTitle="Reports"
          zDescription="Generate and download your detailed reports. Export data in multiple formats for analysis."
        >
          <p class="text-muted-foreground text-sm">You have 5 reports ready and available to export.</p>
        </z-card>
      </z-tab>
      <z-tab label="Settings">
        <z-card
          zTitle="Settings"
          zDescription="Manage your account preferences and options. Customize your experience to fit your needs."
        >
          <p class="text-muted-foreground text-sm">Configure notifications, security, and themes.</p>
        </z-card>
      </z-tab>
    </z-tab-group>
  `,
})
export class ZardDemoTabsDefaultComponent {}
