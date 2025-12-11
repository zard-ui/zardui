import { Component } from '@angular/core';

import { ZardDemoAccordionBasicComponent } from '@zard/components/accordion/demo/basic';
import { ZardDemoTabsDefaultComponent } from '@zard/components/tabs/demo/default';
import { ZardDemoTooltipHoverComponent } from '@zard/components/tooltip/demo/hover';

import {
  type ChangelogEntryComponent,
  type ChangelogEntryMeta,
  type ChangelogExample,
} from '../changelog-entry.interface';

@Component({
  selector: 'z-changelog-july-2025',
  standalone: true,
  template: ``,
})
export class July2025Component implements ChangelogEntryComponent {
  readonly meta: ChangelogEntryMeta = {
    month: 'July 2025',
    year: 2025,
    monthNumber: 7,
    date: new Date(2025, 6, 1),
    id: '07-2025',
  };

  readonly overview =
    'Major release of navigation and content organization components. New Tabs for multi-view interfaces, Accordion for collapsible content, and Tooltip for contextual information. Theming system improvements with new color palettes.';

  readonly examples: ChangelogExample[] = [
    {
      name: 'default',
      description:
        'Tabbed interface component for organizing content into separate views with smooth transitions and keyboard navigation.',
      component: ZardDemoTabsDefaultComponent,
      componentName: 'tabs',
    },
    {
      name: 'basic',
      description:
        'Collapsible content panels for organizing information in a compact space with expand/collapse animations.',
      component: ZardDemoAccordionBasicComponent,
      componentName: 'accordion',
    },
    {
      name: 'hover',
      description:
        'Contextual information overlay displayed on hover with customizable positioning and delay settings.',
      component: ZardDemoTooltipHoverComponent,
      componentName: 'tooltip',
    },
  ];
}
