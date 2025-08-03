import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { DynamicAnchorComponent, Topic } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyDirective } from '@zard/domain/directives/scroll-spy.directive';
import { ScrollSpyItemDirective } from '@zard/domain/directives/scroll-spy-item.directive';
import { CalloutComponent } from '@zard/domain/components/callout/callout.component';
import { ResourceCardComponent, type ResourceLink, type ResourceBadge } from '@zard/domain/components/resource-card/resource-card.component';

@Component({
  selector: 'z-figma',
  templateUrl: './figma.page.html',
  standalone: true,
  imports: [CommonModule, DynamicAnchorComponent, ScrollSpyDirective, ScrollSpyItemDirective, CalloutComponent, ResourceCardComponent],
})
export class FigmaPage implements OnInit {
  private readonly titleService = inject(Title);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly title = 'Figma - zard/ui';

  activeAnchor?: string;

  readonly pageTopics = signal<Topic[]>([{ name: 'introduction' }, { name: 'paid' }, { name: 'free' }, { name: 'future' }]);

  readonly paidResources = [
    {
      title: 'shadcn/ui kit',
      author: 'Matt Wierzbicki',
      description: 'A premium, always up-to-date UI kit for Figma - shadcn/ui compatible and optimized for smooth design-to-dev handoff.',
      badges: [{ text: 'Premium', variant: 'premium' as const }],
      links: [
        { url: 'https://shadcndesign.com', text: 'Visit shadcndesign.com', icon: 'external' as const, type: 'primary' as const },
        { url: 'https://x.com/matsugfx', text: 'matsugfx', icon: 'twitter' as const, type: 'secondary' as const },
      ],
    },
  ];

  readonly freeResources = [
    {
      title: 'shadcn/ui design system',
      author: 'Pietro Schirano',
      description: 'A design companion for shadcn/ui. Each component was painstakingly crafted to perfectly match the code implementation.',
      badges: [{ text: 'Free', variant: 'free' as const }],
      links: [
        { url: 'https://www.figma.com/community/file/1203061493325953101', text: 'Open in Figma Community', icon: 'figma' as const, type: 'primary' as const },
        { url: 'https://twitter.com/skirano', text: 'skirano', icon: 'twitter' as const, type: 'secondary' as const },
      ],
    },
    {
      title: 'Obra shadcn/ui',
      author: 'Obra Studio',
      description: 'Carefully crafted kit designed in the philosophy of shadcn, tracks v4, MIT licensed.',
      badges: [
        { text: 'Free', variant: 'free' as const },
        { text: 'MIT Licensed', variant: 'license' as const },
      ],
      links: [
        { url: 'https://www.figma.com/community/file/1514746685758799870/obra-shadcn-ui', text: 'Open in Figma Community', icon: 'figma' as const, type: 'primary' as const },
        { url: 'https://obra.studio/', text: 'obra.studio', icon: 'external' as const, type: 'secondary' as const },
      ],
    },
  ];

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.titleService.setTitle(this.title);
  }
}
