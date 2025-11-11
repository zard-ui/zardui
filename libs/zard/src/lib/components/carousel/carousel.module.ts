import { NgModule } from '@angular/core';

import { ZardCarouselContentComponent } from './carousel-content.component';
import { ZardCarouselItemComponent } from './carousel-item.component';
import { ZardCarouselComponent } from './carousel.component';

const CAROUSEL_COMPONENTS = [ZardCarouselComponent, ZardCarouselContentComponent, ZardCarouselItemComponent];

@NgModule({
  imports: [CAROUSEL_COMPONENTS],
  exports: [CAROUSEL_COMPONENTS],
})
export class ZardCarouselModule {}
