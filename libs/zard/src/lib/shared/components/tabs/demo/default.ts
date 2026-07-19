import { Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-default',
  imports: [ZardTabComponent, ZardTabGroupComponent, ZardCardImports],
  template: `
    <z-tab-group class="w-[400px]">
      <z-tab label="Overview">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Overview" />
            <z-card-description
              zDescription="View your key metrics and recent project activity. Track progress across all your active projects."
            />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">You have 12 active projects and 3 pending tasks.</p>
        </z-card>
      </z-tab>
      <z-tab label="Analytics">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Analytics" />
            <z-card-description
              zDescription="Track performance and user engagement metrics. Monitor trends and identify growth opportunities."
            />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">Page views are up 25% compared to last month.</p>
        </z-card>
      </z-tab>
      <z-tab label="Reports">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Reports" />
            <z-card-description
              zDescription="Generate and download your detailed reports. Export data in multiple formats for analysis."
            />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">You have 5 reports ready and available to export.</p>
        </z-card>
      </z-tab>
      <z-tab label="Settings">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Settings" />
            <z-card-description
              zDescription="Manage your account preferences and options. Customize your experience to fit your needs."
            />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">Configure notifications, security, and themes.</p>
        </z-card>
      </z-tab>
    </z-tab-group>
  `,
})
export class ZardDemoTabsDefaultComponent {}
