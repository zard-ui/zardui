import { NgModule } from '@angular/core';
import { ZardCardComponent, ZardCardBodyComponent, ZardCardHeaderComponent, ZardCardHeaderTitleComponent, ZardCardHeaderDescriptionComponent } from './card.component';

const components = [ZardCardComponent, ZardCardBodyComponent, ZardCardHeaderComponent, ZardCardHeaderTitleComponent, ZardCardHeaderDescriptionComponent];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardCardModule {}
