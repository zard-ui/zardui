export { ZardCarouselContentComponent } from './carousel-content.component';
export { ZardCarouselItemComponent } from './carousel-item.component';
export { ZardCarouselComponent } from './carousel.component';

import { ZardCarouselContentComponent } from './carousel-content.component';
import { ZardCarouselItemComponent } from './carousel-item.component';
import { ZardCarouselComponent } from './carousel.component';

export const ZardCarouselImports = [
  ZardCarouselComponent,
  ZardCarouselContentComponent,
  ZardCarouselItemComponent,
] as const;
