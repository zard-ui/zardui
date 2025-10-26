import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

interface YoutubeVideo {
  id: string;
  title: string;
  timestamp?: number;
}

@Component({
  selector: 'z-youtube',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-24 px-4">
      <div class="max-w-5xl mx-auto">
        <header class="text-center mb-16">
          <div class="animate-in fade-in slide-in-from-bottom-3 duration-700">
            <h2 class="text-3xl sm:text-4xl xl:text-6xl font-bold tracking-tight mb-4">
              Featured on <span class="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">YouTube</span>
            </h2>
            <p class="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">Watch how ZardUI is revolutionizing Angular component development</p>
          </div>
        </header>

        <main class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          @for (video of videos; track video.id) {
            <a [href]="getVideoUrl(video)" target="_blank" rel="noopener noreferrer" class="relative group break-inside-avoid mb-6 block cursor-pointer">
              <div
                class="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"
              ></div>

              <div class="relative aspect-video overflow-hidden rounded-xl border bg-secondary shadow-2xl">
                <img [ngSrc]="getThumbnailUrl(video.id)" [alt]="video.title" fill priority class="object-cover transition-transform duration-300 group-hover:scale-105" />

                <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500"
                  >
                    <svg class="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          }
        </main>

        <footer class="text-center mt-12">
          <div class="animate-in fade-in slide-in-from-bottom-3 duration-700 delay-500">
            <p class="text-muted-foreground">See ZardUI in action and learn how to get started</p>
          </div>
        </footer>
      </div>
    </section>
  `,
})
export class YoutubeComponent {
  readonly videos: YoutubeVideo[] = [
    {
      id: 'o4Xjn-EZ1Lo',
      title: 'ZardUI - The Angular Component Library',
    },
    {
      id: 'v1rEaS_1TN4',
      title: 'ZardUI Tutorial - Getting Started',
      timestamp: 2695,
    },
    {
      id: 'pHkQ0PhPa4o',
      title: 'Building Modern UIs with ZardUI',
    },
    {
      id: '6Oy2FaFjeFM',
      title: 'ZardUI Components Showcase',
    },
    {
      id: 'fIKnUsd1tAA',
      title: 'Advanced ZardUI Features',
    },
    {
      id: 'MXGZZQK_thk',
      title: 'ZardUI Best Practices',
    },
    {
      id: 'zKUhEOdW7Zw',
      title: 'ZardUI Video',
    },
    {
      id: '6IPD80ms-K0',
      title: 'ZardUI Video',
    },
  ];

  getThumbnailUrl(videoId: string): string {
    return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  }

  getVideoUrl(video: YoutubeVideo): string {
    const baseUrl = `https://www.youtube.com/watch?v=${video.id}`;
    return video.timestamp ? `${baseUrl}&t=${video.timestamp}s` : baseUrl;
  }
}
