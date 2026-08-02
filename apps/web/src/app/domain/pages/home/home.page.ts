import { ViewportScroller } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SeoService } from '@doc/shared/services/seo.service';

import { HeroExamplesGridComponent } from './components/hero-examples-grid.component';
import { HeroHeaderComponent } from './components/hero-header.component';

@Component({
  selector: 'z-home',
  imports: [RouterModule, HeroHeaderComponent, HeroExamplesGridComponent],
  template: `
    <main class="flex flex-1 flex-col">
      <div class="flex flex-1 flex-col">
        <z-hero-header />
        <z-hero-examples-grid />
      </div>
    </main>
  `,
})
export class HomePage implements OnInit {
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.seoService.setHomeSeo();
  }
}
