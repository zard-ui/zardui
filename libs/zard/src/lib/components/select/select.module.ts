import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZardSelectComponent } from './select.component';
import { SelectOptionComponent } from './select-option/select-option.component';
import { ZardSelectTriggerDirective } from './select-trigger.directive';
import { ZardSelectOptionDirective } from './select-option/select-option.directive';

@NgModule({
  imports: [ZardSelectComponent, SelectOptionComponent, CommonModule, ZardSelectTriggerDirective, ZardSelectOptionDirective],
  exports: [ZardSelectComponent, SelectOptionComponent, ZardSelectTriggerDirective, ZardSelectOptionDirective],
})
export class ZardSelectModule {}
