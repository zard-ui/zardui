import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';

import type { FeaturedVideo, FeaturedVideoLanguage } from '../data/featured-videos';

interface VideoCard {
  id: string;
  title: string;
  author?: string;
  url: string;
  thumbnail: string;
}

interface VideoGroup {
  id: string;
  label: string;
  videos: VideoCard[];
}

const LANGUAGE_GROUPS: ReadonlyArray<{ id: string; label: string; language: FeaturedVideoLanguage }> = [
  { id: 'portuguese', label: 'Portuguese 🇧🇷', language: 'pt-BR' },
  { id: 'english', label: 'English', language: 'en' },
];

@Component({
  selector: 'z-youtube',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './youtube.page.html',
  imports: [DocContentComponent, DocHeadingComponent, ZardAlertComponent, ScrollSpyDirective, ScrollSpyItemDirective],
})
export class YoutubePage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  private readonly videos = signal<readonly FeaturedVideo[]>([]);
  /** IDs whose `maxresdefault` thumbnail is missing, so the card falls back to `hqdefault`. */
  private readonly degradedThumbnails = signal<ReadonlySet<string>>(new Set<string>());

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'portuguese', label: 'Portuguese 🇧🇷', type: 'custom' },
      { id: 'english', label: 'English', type: 'custom' },
      { id: 'contribute', label: 'Contribute', type: 'custom' },
    ],
  };

  protected readonly groups = computed<VideoGroup[]>(() => {
    const videos = this.videos();
    const degraded = this.degradedThumbnails();

    return LANGUAGE_GROUPS.map(group => ({
      id: group.id,
      label: group.label,
      videos: videos.filter(video => video.language === group.language).map(video => this.toCard(video, degraded)),
    })).filter(group => group.videos.length > 0);
  });

  async ngOnInit(): Promise<void> {
    this.seoService.setDocsSeo(
      'YouTube',
      'Talks, live streams and tutorials recorded by the community about Zard UI, all gathered in one place.',
      '/docs/featured/youtube',
      'og-featured-youtube.jpg',
    );

    // Loaded on demand so the video list never reaches the initial bundle.
    const { FEATURED_VIDEOS } = await import('../data/featured-videos');
    this.videos.set(FEATURED_VIDEOS);
  }

  /** `maxresdefault` does not exist for every upload — retry the always-available `hqdefault`. */
  protected onThumbnailError(id: string): void {
    this.markDegraded(id);
  }

  /**
   * A missing `maxresdefault` is not always a 404: YouTube also answers with a 120x90 grey
   * placeholder, and the decoded width is the only way to tell that case apart.
   */
  protected onThumbnailLoad(id: string, event: Event): void {
    const image = event.target as HTMLImageElement;

    if (image.naturalWidth > 0 && image.naturalWidth <= 120) {
      this.markDegraded(id);
    }
  }

  private markDegraded(id: string): void {
    this.degradedThumbnails.update(current => (current.has(id) ? current : new Set(current).add(id)));
  }

  private toCard(video: FeaturedVideo, degraded: ReadonlySet<string>): VideoCard {
    const quality = degraded.has(video.id) ? 'hqdefault' : 'maxresdefault';
    const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;

    return {
      id: video.id,
      title: video.title,
      author: video.author,
      url: video.timestamp ? `${watchUrl}&t=${video.timestamp}s` : watchUrl,
      thumbnail: `https://i.ytimg.com/vi/${video.id}/${quality}.jpg`,
    };
  }
}
