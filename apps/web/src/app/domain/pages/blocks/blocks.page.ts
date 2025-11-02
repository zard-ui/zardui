import { ViewportScroller } from '@angular/common';
import { Component, DestroyRef, inject, signal, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ZardBreadcrumbModule } from '@zard/components/sheet/sheet.module';
import { CategoryTabsComponent, type CategoryTab } from '@zard/shared/components/category-tabs/category-tabs.component';
import { DarkModeService } from '@zard/shared/services/darkmode.service';
import { SeoService } from '@zard/shared/services/seo.service';

import { BlockContainerComponent, type Block } from '../../components/block-container/block-container.component';
import { BlocksService, type BlockCategory } from '../../services/blocks.service';

@Component({
  selector: 'z-blocks',
  standalone: true,
  imports: [BlockContainerComponent, RouterLink, ZardBreadcrumbModule, CategoryTabsComponent],
  templateUrl: './blocks.page.html',
})
export class BlocksPage implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly route = inject(ActivatedRoute);
  private readonly blocksService = inject(BlocksService);
  private readonly darkModeService = inject(DarkModeService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly blocks = signal<Block[]>([]);
  protected readonly currentCategory = signal<BlockCategory>('featured');

  protected readonly categoryTabs: CategoryTab[] = [
    { label: 'Featured', route: '/blocks' },
    { label: 'Sidebar', route: '/blocks/sidebar' },
    { label: 'Login', route: '/blocks/login' },
    { label: 'Signup', route: '/blocks/signup' },
    { label: 'OTP', route: '/blocks/otp' },
    { label: 'Calendar', route: '/blocks/calendar' },
  ];

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.loadBlocks();

    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const category = (params['category'] || 'featured') as BlockCategory;
      this.currentCategory.set(category);
      this.loadBlocks();
    });

    this.seoService.setDocsSeo(
      'Building Blocks for the Web',
      'Clean, modern building blocks. Copy and paste into your apps. Works with all Angular ecosystems. Open Source. Free forever.',
      '/blocks',
      'og-blockspage.jpg',
    );
  }

  protected getBlocksByCategory(category: BlockCategory): Block[] {
    return this.blocksService.getBlocksByCategory(category);
  }

  private loadBlocks(): void {
    const category = this.currentCategory();
    const blocks = this.blocksService.getBlocksByCategory(category);
    this.blocks.set(blocks);
  }

  protected getCurrentBlockImage(block: Block): string {
    if (!block.image) return '';
    const theme = this.darkModeService.theme();
    return theme === 'dark' ? block.image.dark : block.image.light;
  }
}
