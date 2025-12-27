import { Component, ChangeDetectionStrategy } from '@angular/core';

import { HeroColumn1Component } from './hero-column-1.component';
import { HeroColumn2Component } from './hero-column-2.component';
import { HeroColumn3Component } from './hero-column-3.component';
import { HeroColumn4Component } from './hero-column-4.component';

@Component({
  selector: 'z-hero-default-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroColumn1Component, HeroColumn2Component, HeroColumn3Component, HeroColumn4Component],
  template: `
    <div
      class="theme-container mx-auto grid gap-8 py-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-8"
    >
      <z-hero-column-1 />
      <z-hero-column-2 />
      <z-hero-column-3 />
      <z-hero-column-4 />
    </div>
  `,
})
export class HeroDefaultContentComponent {}
