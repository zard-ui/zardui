import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import { SeoService } from '@doc/shared/services/seo.service';

import { ZardDarkMode } from '@zard/services/dark-mode';

import { CardsWallComponent } from './components/cards-wall.component';
import { HeroHeaderComponent } from './components/hero-header.component';

@Component({
  selector: 'z-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroHeaderComponent, CardsWallComponent],
  template: `
    <main class="flex flex-1 flex-col">
      <z-hero-header />

      <div class="w-full flex-1 overflow-hidden">
        <section class="-mx-4 w-[140vw] overflow-hidden md:hidden">
          <img
            [src]="darkMode.themeMode() === 'dark' ? '/images/home-dark.webp' : '/images/home-light.webp'"
            width="2560"
            height="2764"
            alt="A wall of zard/ui components"
            class="block h-auto w-full"
            fetchpriority="high"
          />
        </section>

        <section class="hidden md:block">
          <!-- Both triggers watch the viewport: the server-rendered wall hydrates
               when it scrolls into view, and on a client-side navigation it is
               only built once its placeholder is seen — which, below md, never
               happens, because the section is not displayed. -->
          @defer (on viewport; hydrate on viewport) {
            <z-cards-wall />
          } @placeholder {
            <div class="h-svh" aria-hidden="true"></div>
          }
        </section>
      </div>
    </main>
  `,
})
export class HomePage implements OnInit {
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly seoService = inject(SeoService);
  protected readonly darkMode = inject(ZardDarkMode);

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.seoService.setHomeSeo();
  }
}
