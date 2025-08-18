import { NgModule } from '@angular/core';

import { ZardFormControlComponent, ZardFormFieldComponent, ZardFormLabelComponent, ZardFormMessageComponent } from './form.component';

const FORM_COMPONENTS = [ZardFormFieldComponent, ZardFormLabelComponent, ZardFormControlComponent, ZardFormMessageComponent];

@NgModule({
  imports: [...FORM_COMPONENTS],
  exports: [...FORM_COMPONENTS],
})
export class ZardFormModule {}
