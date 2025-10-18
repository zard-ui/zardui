import { ShowcaseComponent } from '@zard/domain/components/showcase/showcase.component';
import { BenefitsComponent } from '@zard/domain/components/benefits/benefits.component';
import { YoutubeComponent } from '@zard/domain/components/youtube/youtube.component';
import { HeroComponent } from '@zard/domain/components/hero/hero.component';
import { SeoService } from '@zard/shared/services/seo.service';
import { Component, inject, type OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
