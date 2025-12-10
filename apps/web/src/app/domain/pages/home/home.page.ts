import { ViewportScroller } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BenefitsComponent } from '@doc/domain/components/benefits/benefits.component';
import { ShowcaseComponent } from '@doc/domain/components/showcase/showcase.component';
import { YoutubeComponent } from '@doc/domain/components/youtube/youtube.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { NewHeroComponent } from './sections/hero/hero.component';

@Component({
  selector: 'z-home',
  standalone: true,
  imports: [RouterModule, NewHeroComponent, ShowcaseComponent, BenefitsComponent, YoutubeComponent],
  template: `
    <z-new-hero></z-new-hero>
    <z-showcase></z-showcase>
    <z-benefits></z-benefits>
    <z-youtube></z-youtube>
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
