---
title: July 2025 - Tabs, Accordion and Tooltip
description: Major release of navigation and content organization components. New Tabs for multi-view interfaces, Accordion for collapsible content, and Tooltip for contextual information. Theming system improvements with new color palettes.
---

# July 2025 - Tabs, Accordion and Tooltip

Major release of navigation and content organization components. New Tabs for multi-view interfaces, Accordion for collapsible content, and Tooltip for contextual information. Theming system improvements with new color palettes.

## New Components

### [Tabs](/docs/components/tabs)

Tabbed interface component for organizing content into separate views with smooth transitions and keyboard navigation.

```
npx zard-cli@latest add tabs
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-preview',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTabsPreviewComponent {}
```

### [Accordion](/docs/components/accordion)

Collapsible content panels for organizing information in a compact space with expand/collapse animations.

```
npx zard-cli@latest add accordion
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';

@Component({
  selector: 'z-demo-accordion-basic',
  imports: [ZardAccordionImports],
  template: `
    <div z-accordion zDefaultValue="item-1" zType="single" class="max-w-sm">
      <z-accordion-item zValue="item-1" zTitle="How do I reset my password?">
        Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your
        password. The link will expire in 24 hours.
      </z-accordion-item>

      <z-accordion-item zValue="item-2" zTitle="Can I change my subscription plan?">
        Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in
        your next billing cycle.
      </z-accordion-item>

      <z-accordion-item zValue="item-3" zTitle="What payment methods do you accept?">
        We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our
        payment partners.
      </z-accordion-item>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAccordionBasicComponent {}
```

### [Tooltip](/docs/components/tooltip)

Contextual information overlay displayed on hover with customizable positioning and delay settings.

```
npx zard-cli@latest add tooltip
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-tooltip-preview',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <button type="button" z-button zType="outline" zTooltip="Tooltip content">Hover</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTooltipPreviewComponent {}
```
