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

        <!-- Video section -->
        <main class="animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300">
          <div class="relative group">
            <!-- Decorative elements -->
            <div
              class="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"
            ></div>

            <!-- Video container -->
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
