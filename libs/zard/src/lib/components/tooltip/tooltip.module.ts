import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ZardTooltipComponent } from './tooltip.component';
import { ZardTooltipDirective } from './tooltip.directive';

@NgModule({
  imports: [CommonModule, OverlayModule, ZardTooltipComponent, ZardTooltipDirective],
  exports: [ZardTooltipComponent, ZardTooltipDirective],
})
export class ZardTooltipModule {}
