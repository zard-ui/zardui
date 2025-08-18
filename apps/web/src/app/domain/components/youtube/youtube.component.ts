import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'z-youtube',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-24 px-4">
      <div class="max-w-5xl mx-auto">
        <!-- Header section -->
        <header class="text-center mb-16">
          <div class="animate-in fade-in slide-in-from-bottom-3 duration-700">
            <h2 class="text-3xl sm:text-4xl xl:text-6xl font-bold tracking-tight mb-4">
              Featured on <span class="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">YouTube</span>
            </h2>
            <p class="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">Watch how ZardUI is revolutionizing Angular component development</p>
          </div>
        </header>

        <!-- Masonry Grid Videos -->
        <main class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <div class="relative group break-inside-avoid mb-6">
            <div
              class="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="relative aspect-video overflow-hidden rounded-xl border bg-secondary shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/o4Xjn-EZ1Lo?si=0vkbdH_XEl9VeXWK"
                title="ZardUI - The Angular Component Library YouTube video"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
                loading="lazy"
                class="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>

          <div class="relative group break-inside-avoid mb-6">
            <div
              class="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="relative aspect-video overflow-hidden rounded-xl border bg-secondary shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/v1rEaS_1TN4?si=R-2cMHtEtng4_x7a&amp;start=2695"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
                loading="lazy"
                class="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>

          <div class="relative group break-inside-avoid mb-6">
            <div
              class="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="relative aspect-video overflow-hidden rounded-xl border bg-secondary shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/pHkQ0PhPa4o?si=WohRDnuKqOpwuSPN"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
                loading="lazy"
                class="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>

          <div class="relative group break-inside-avoid mb-6">
            <div
              class="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="relative aspect-video overflow-hidden rounded-xl border bg-secondary shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/6Oy2FaFjeFM?si=DR2gfpqfxGtA5_xU"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
                loading="lazy"
                class="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>

          <div class="relative group break-inside-avoid mb-6">
            <div
              class="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="relative aspect-video overflow-hidden rounded-xl border bg-secondary shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/fIKnUsd1tAA?si=-FmBI2pOvHT-68dh"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
                loading="lazy"
                class="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>

          <div class="relative group break-inside-avoid mb-6">
            <div
              class="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div class="relative aspect-video overflow-hidden rounded-xl border bg-secondary shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/MXGZZQK_thk?si=hGDD0-EaVttJcsQ5"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
                loading="lazy"
                class="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </main>

        <!-- Additional info -->
        <footer class="text-center mt-12">
          <div class="animate-in fade-in slide-in-from-bottom-3 duration-700 delay-500">
            <p class="text-muted-foreground">See ZardUI in action and learn how to get started</p>
          </div>
        </footer>
      </div>
    </section>
  `,
})
export class YoutubeComponent {}
