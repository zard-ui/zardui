import { NgModule } from '@angular/core';

import { ZardFormControlComponent } from './form-control.component';
import { ZardFormFieldComponent } from './form-field.component';
import { ZardFormLabelComponent } from './form-label.component';
import { ZardFormMessageComponent } from './form-message.component';

const FORM_COMPONENTS = [ZardFormFieldComponent, ZardFormLabelComponent, ZardFormControlComponent, ZardFormMessageComponent];

@NgModule({
  imports: [...FORM_COMPONENTS],
  exports: [...FORM_COMPONENTS],
})
export class ZardFormModule {}
