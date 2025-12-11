import { Component } from '@angular/core';

import { ZardDemoCarouselDefaultComponent } from '@zard/components/carousel/demo/default';
import { ZardDemoKbdDefaultComponent } from '@zard/components/kbd/demo/default';

import {
  type ChangelogEntryComponent,
  type ChangelogEntryMeta,
  type ChangelogExample,
} from '../changelog-entry.interface';

@Component({
  selector: 'z-changelog-november-2025',
  standalone: true,
  template: ``,
})
export class November2025Component implements ChangelogEntryComponent {
  readonly meta: ChangelogEntryMeta = {
    month: 'November 2025',
    year: 2025,
    monthNumber: 11,
    date: new Date(2025, 10, 1),
    id: '11-2025',
  };

  readonly overview =
    'Major updates this month with new interactive components including Carousel, Button Group, Input Group, and Kbd components. Enhanced user experience with better form controls and keyboard navigation support.';

  readonly examples: ChangelogExample[] = [
    {
      name: 'default',
      description:
        'A slideshow component for cycling through elements with support for mouse drag, touch swipe, and automatic playback.',
      component: ZardDemoCarouselDefaultComponent,
      componentName: 'carousel',
    },
    {
      name: 'default',
      description: 'Display keyboard keys and shortcuts in a visually consistent way.',
      component: ZardDemoKbdDefaultComponent,
      componentName: 'kbd',
    },
  ];
}
