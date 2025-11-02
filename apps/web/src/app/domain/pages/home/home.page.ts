import { ViewportScroller } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BenefitsComponent } from '@zard/domain/components/benefits/benefits.component';
import { HeroComponent } from '@zard/domain/components/hero/hero.component';
import { ShowcaseComponent } from '@zard/domain/components/showcase/showcase.component';
import { YoutubeComponent } from '@zard/domain/components/youtube/youtube.component';
import { SeoService } from '@zard/shared/services/seo.service';

@Component({
  selector: 'z-home',
  standalone: true,
  imports: [RouterModule, HeroComponent, ShowcaseComponent, BenefitsComponent, YoutubeComponent],
  template: `
    <z-hero></z-hero>
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
