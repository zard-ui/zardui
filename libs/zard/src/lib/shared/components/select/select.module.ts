import { NgModule } from '@angular/core';

import { ZardSelectItemComponent } from './select-item.component';
import { ZardSelectComponent } from './select.component';

const components = [ZardSelectComponent, ZardSelectItemComponent];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardSelectModule {}
