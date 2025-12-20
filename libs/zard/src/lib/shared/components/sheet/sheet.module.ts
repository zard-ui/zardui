import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ZardSheetComponent } from './sheet.component';
import { ZardSheetService } from './sheet.service';
import { ZardButtonComponent } from '../button/button.component';

@NgModule({
  imports: [CommonModule, ZardButtonComponent, ZardSheetComponent, OverlayModule, PortalModule],
  providers: [ZardSheetService],
})
export class ZardSheetModule {}
