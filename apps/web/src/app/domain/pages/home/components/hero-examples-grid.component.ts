import { Component, ChangeDetectionStrategy } from '@angular/core';

import {
  BlockEmptyAvatarGroupComponent,
  BlockSpinnerBadgesComponent,
  BlockInputGroupChatComponent,
  BlockFieldSliderComponent,
  BlockInputGroupStackComponent,
} from './blocks';
import { HeroDefaultContentComponent } from './hero-default-content.component';

@Component({
  selector: 'z-hero-examples-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockEmptyAvatarGroupComponent,
    BlockSpinnerBadgesComponent,
    BlockInputGroupChatComponent,
    BlockFieldSliderComponent,
    BlockInputGroupStackComponent,
    HeroDefaultContentComponent,
  ],
  template: `
    <div class="container-wrapper flex-1 pb-6">
      <div class="container overflow-hidden">
        <section class="flex flex-col gap-6 *:w-full *:max-w-full md:hidden">
          <z-block-empty-avatar-group />
          <z-block-spinner-badges />
          <z-block-input-group-chat />
          <z-block-field-slider />
          <z-block-input-group-stack />
        </section>
        <section #sec class="theme-container hidden md:block">
          <z-hero-default-content />
        </section>
      </div>
    </div>
  `,
})
export class HeroExamplesGridComponent {}
