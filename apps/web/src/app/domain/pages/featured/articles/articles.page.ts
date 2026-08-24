import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight } from '@ng-icons/lucide';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';

import { FEATURED_ARTICLES, type FeaturedArticle, type FeaturedArticleLanguage } from '../data/featured-articles';

interface ArticleCard extends FeaturedArticle {
  /** Whether the remote cover failed to load and the card must render the placeholder instead. */
  coverFailed: boolean;
}

interface ArticleGroup {
  id: string;
  label: string;
  articles: ArticleCard[];
}

const LANGUAGE_GROUPS: ReadonlyArray<{ id: string; label: string; language: FeaturedArticleLanguage }> = [
  { id: 'portuguese', label: 'Portuguese 🇧🇷', language: 'pt-BR' },
  { id: 'english', label: 'English', language: 'en' },
];

@Component({
  selector: 'z-articles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './articles.page.html',
  imports: [
    DatePipe,
    DocContentComponent,
    DocHeadingComponent,
    NgIcon,
    ZardAlertComponent,
    ZardBadgeComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
  ],
  viewProviders: [provideIcons({ lucideArrowUpRight })],
})
export class ArticlesPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  /**
   * Seeded synchronously, unlike the YouTube page: the anchor list is derived from this data, and
   * filling it in after the first render leaves the server-rendered anchors and the client out of
   * sync — the hydrated `@for` ends up moving the language anchor past `Contribute`. The list still
   * stays out of the initial bundle because the whole route is lazy-loaded.
   */
  private readonly articles = signal<readonly FeaturedArticle[]>(FEATURED_ARTICLES);
  /** IDs whose cover could not be fetched (CDN down, hotlink blocked, article unpublished). */
  private readonly degradedCovers = signal<ReadonlySet<string>>(new Set<string>());

  protected readonly groups = computed<ArticleGroup[]>(() => {
    const articles = this.articles();
    const degraded = this.degradedCovers();

    return LANGUAGE_GROUPS.map(group => ({
      id: group.id,
      label: group.label,
      articles: articles
        .filter(article => article.language === group.language)
        // Copy before sorting: the source array is readonly and must never be mutated.
        .slice()
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .map(article => ({ ...article, coverFailed: degraded.has(article.id) })),
    })).filter(group => group.articles.length > 0);
  });

  /** Derived from the rendered groups so an empty language never leaves a dangling anchor. */
  protected readonly navigationConfig = computed<NavigationConfig>(() => ({
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      ...this.groups().map(group => ({ id: group.id, label: group.label, type: 'custom' as const })),
      { id: 'contribute', label: 'Contribute', type: 'custom' },
    ],
  }));

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Articles',
      'Blog posts, tutorials and write-ups the community published about Zard UI, gathered in one place.',
      '/docs/featured/articles',
      'og-featured-articles.jpg',
    );
  }

  /** Covers are hotlinked from the publisher's CDN, so a broken URL must degrade to the placeholder. */
  protected onCoverError(id: string): void {
    this.degradedCovers.update(current => (current.has(id) ? current : new Set(current).add(id)));
  }
}
