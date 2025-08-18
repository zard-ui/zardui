import { ShowcaseComponent } from '@zard/domain/components/showcase/showcase.component';
import { BenefitsComponent } from '@zard/domain/components/benefits/benefits.component';
import { YoutubeComponent } from '@zard/domain/components/youtube/youtube.component';
import { HeroComponent } from '@zard/domain/components/hero/hero.component';
import { RouterModule } from '@angular/router';
import { Component, inject, type OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ViewportScroller } from '@angular/common';

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
  private readonly titleService = inject(Title);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly title = 'Zard UI - The @shadcn/ui Alternative for Angular';

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.titleService.setTitle(this.title);
  }
}
