import { Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@docs/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@docs/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@docs/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@docs/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@docs/domain/directives/scroll-spy.directive';
import { SeoService } from '@docs/shared/services/seo.service';

interface BlockPreview {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  components: number;
  files: number;
}

interface BlockCategory {
  name: string;
  blocks: BlockPreview[];
}

@Component({
  selector: 'z-block-instructions',
  standalone: true,
  imports: [DocContentComponent, DocHeadingComponent, ScrollSpyDirective, ScrollSpyItemDirective],
  templateUrl: './block-instructions.page.html',
})
export class BlocksInstructionPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'featured', label: 'Featured', type: 'custom' },
      { id: 'all-blocks', label: 'All Blocks', type: 'custom' },
      { id: 'usage', label: 'How to Use', type: 'custom' },
      { id: 'contributing', label: 'Contributing', type: 'custom' },
    ],
  };

  // Mock data - replace with real data from BlocksService
  readonly availableBlocksCount = 1;
  readonly categoriesCount = 1;

  readonly featuredBlocks: BlockPreview[] = [
    {
      id: 'authentication-01',
      title: 'Authentication 01',
      description:
        'A beautiful authentication page with form validation, social login options, and forgot password functionality. Built with Angular Reactive Forms and ZardUI components.',
      category: 'Authentication',
      image: '/blocks/authentication-01/light.png',
      components: 8,
      files: 2,
    },
  ];

  readonly blocksByCategory: BlockCategory[] = [
    {
      name: 'Authentication',
      blocks: [
        {
          id: 'authentication-01',
          title: 'Authentication 01',
          description: 'Modern login page with form validation and social login',
          category: 'Authentication',
          image: '/blocks/authentication-01/light.png',
          components: 8,
          files: 2,
        },
      ],
    },
    {
      name: 'Dashboard',
      blocks: [],
    },
    {
      name: 'E-commerce',
      blocks: [],
    },
  ];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Blocks',
      'Beautifully designed blocks that you can copy and paste into your apps. Built with Angular and TailwindCSS. Open Source.',
      '/docs/blocks',
      'og-blocks.jpg',
    );
  }
}
