import { Component, computed, inject, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArrowRight, ExternalLink, FolderOpen, Github, LucideAngularModule } from 'lucide-angular';

import type { Block } from '@doc/domain/components/block-container/block-container.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { BlocksService, type BlockCategory as ServiceBlockCategory } from '@doc/domain/services/blocks.service';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardButtonComponent } from '@zard/components/button/button.component';

interface BlockPreview {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  files: number;
}

@Component({
  selector: 'z-block-instructions',
  standalone: true,
  imports: [RouterLink, ZardButtonComponent, DocContentComponent, DocHeadingComponent, ScrollSpyDirective, ScrollSpyItemDirective, LucideAngularModule],
  templateUrl: './block-instructions.page.html',
})
export class BlocksInstructionPage implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly blocksService = inject(BlocksService);
  activeAnchor?: string;

  readonly GithubIcon = Github;
  readonly ArrowRightIcon = ArrowRight;
  readonly ExternalLinkIcon = ExternalLink;
  readonly FolderOpenIcon = FolderOpen;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'featured', label: 'Featured', type: 'custom' },
      { id: 'all-blocks', label: 'All Blocks', type: 'custom' },
      { id: 'usage', label: 'How to Use', type: 'custom' },
      { id: 'contributing', label: 'Contributing', type: 'custom' },
    ],
  };

  readonly availableBlocksCount = computed(() => {
    const allBlocks = this.blocksService.getAllBlocks();
    const uniqueBlocks = new Set(allBlocks.map(block => block.id));
    return uniqueBlocks.size;
  });
  readonly categoriesCount = 5;

  readonly featuredBlocks = computed(() => this.transformBlocks(this.blocksService.getBlocksByCategory('featured')));

  readonly blocksByCategory = computed(() => {
    const categories: ServiceBlockCategory[] = ['featured', 'sidebar', 'login', 'signup', 'otp', 'calendar'];
    return categories.map(category => ({
      name: this.getCategoryDisplayName(category),
      blocks: this.transformBlocks(this.blocksService.getBlocksByCategory(category)),
    }));
  });

  private transformBlocks(blocks: Block[]): BlockPreview[] {
    return blocks.map(block => ({
      id: block.id,
      title: block.title,
      description: block.description,
      category: block.category || '',
      image: block.image?.light || '',
      files: block.files.length,
    }));
  }

  private getCategoryDisplayName(category: ServiceBlockCategory): string {
    const displayNames: Record<ServiceBlockCategory, string> = {
      featured: 'Featured',
      sidebar: 'Sidebar',
      login: 'Login',
      signup: 'Signup',
      otp: 'OTP',
      calendar: 'Calendar',
    };
    return displayNames[category];
  }

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Blocks',
      'Beautifully designed blocks that you can copy and paste into your apps. Built with Angular and TailwindCSS. Open Source.',
      '/doc/blocks',
      'og-blocks.jpg',
    );
  }
}
