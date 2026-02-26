import { ViewportScroller } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SeoService } from '@doc/shared/services/seo.service';

import { NewHeroComponent } from './sections/hero/hero.component';

@Component({
  selector: 'z-home',
  standalone: true,
  imports: [RouterModule, NewHeroComponent],
  template: `
    <z-new-hero></z-new-hero>
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
