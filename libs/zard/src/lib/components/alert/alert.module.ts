import { NgModule } from '@angular/core';

import { ZardAlertComponent, ZardAlertDescriptionComponent, ZardAlertIconComponent, ZardAlertTitleComponent } from './alert.component';

const components = [ZardAlertComponent, ZardAlertIconComponent, ZardAlertTitleComponent, ZardAlertDescriptionComponent];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardAlertModule {}
