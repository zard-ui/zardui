import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
    <section class="px-4 py-24">
      <div class="mx-auto max-w-5xl">
        <header class="mb-16 text-center">
          <div class="animate-in fade-in slide-in-from-bottom-3 duration-700">
            <h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl xl:text-6xl">
              Featured on
              <span class="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">YouTube</span>
            </h2>
            <p class="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl">
              Watch how ZardUI is revolutionizing Angular component development
            </p>
          </div>
        </header>

        <main class="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3">
          @for (video of videos; track video.id; let idx = $index) {
            <a
              [href]="getVideoUrl(video)"
              target="_blank"
              rel="noopener noreferrer"
              class="group relative mb-6 block cursor-pointer break-inside-avoid"
            >
              <div
                class="absolute -inset-4 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-75 blur-xl transition-opacity duration-300 group-hover:opacity-100"
              ></div>

              <div class="bg-secondary relative aspect-video overflow-hidden rounded-xl border shadow-2xl">
                <img
                  [ngSrc]="getThumbnailUrl(video.id)"
                  [alt]="video.title"
                  fill
                  [priority]="idx < 3"
                  class="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div
                  class="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                ></div>

                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500"
                  >
                    <svg class="ml-0.5 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          }
        </main>

        <footer class="mt-12 text-center">
          <div class="animate-in fade-in slide-in-from-bottom-3 delay-500 duration-700">
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
