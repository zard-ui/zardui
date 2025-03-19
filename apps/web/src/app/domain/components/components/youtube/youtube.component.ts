import { Component } from '@angular/core';

@Component({
  selector: 'z-youtube',
  standalone: true,
  template: `
    <section class="min-h-screen max-w-4xl mx-auto mt-24">
      <header>
        <h1 class="text-center text-3xl xl:text-6xl font-semibold mb-8">Featured on YouTube</h1>
      </header>

      <main class="grid grid-cols-1 gap-6 w-full">
        <section class="relative h-full overflow-hidden rounded-xl border bg-secondary shadow-sm">
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/o4Xjn-EZ1Lo?si=0vkbdH_XEl9VeXWK"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </section>
      </main>
    </section>
  `,
})
export class YoutubeComponent {}
