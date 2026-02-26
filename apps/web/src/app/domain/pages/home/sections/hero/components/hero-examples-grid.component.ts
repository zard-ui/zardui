import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  BlockEmptyAvatarGroupComponent,
  BlockSpinnerBadgesComponent,
  BlockInputGroupChatComponent,
  BlockFieldSliderComponent,
  BlockInputGroupStackComponent,
} from './blocks';

@Component({
  selector: 'z-hero-examples-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    BlockEmptyAvatarGroupComponent,
    BlockSpinnerBadgesComponent,
    BlockInputGroupChatComponent,
    BlockFieldSliderComponent,
    BlockInputGroupStackComponent,
  ],
  template: `
    <div class="container-wrapper section-soft flex-1 pb-6">
      <div class="container overflow-hidden">
        <!-- Mobile: Column 2 blocks -->
        <section class="flex flex-col gap-6 *:w-full *:max-w-full md:hidden">
          <z-block-empty-avatar-group />
          <z-block-spinner-badges />
          <z-block-input-group-chat />
          <z-block-field-slider />
          <z-block-input-group-stack />
        </section>

        <!-- Desktop Content (from router) -->
        <section class="theme-container hidden md:block">
          <router-outlet />
        </section>
      </div>
    </div>
  `,
})
export class HeroExamplesGridComponent {}
