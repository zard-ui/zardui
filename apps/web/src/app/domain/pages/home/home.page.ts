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
          @defer (on immediate; hydrate on viewport) {
            <z-cards-wall />
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
