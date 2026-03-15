import { Component, ChangeDetectionStrategy } from '@angular/core';

import { HeroExamplesGridComponent } from './components/hero-examples-grid.component';
import { HeroHeaderComponent } from './components/hero-header.component';
import { HeroNavTabsComponent } from './components/hero-nav-tabs.component';

@Component({
  selector: 'z-new-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroHeaderComponent, HeroNavTabsComponent, HeroExamplesGridComponent],
  template: `
    <main class="flex flex-1 flex-col">
      <div class="flex flex-1 flex-col">
        <z-hero-header />
        <z-hero-nav-tabs />
        <z-hero-examples-grid />
      </div>
    </main>
  `,
})
export class NewHeroComponent {}
