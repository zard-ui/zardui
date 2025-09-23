import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ZardButtonComponent } from '../button/button.component';
import { ZardSheetComponent } from './sheet.component';
import { ZardSheetService } from './sheet.service';

const components = [CommonModule, ZardButtonComponent, ZardSheetComponent, OverlayModule, PortalModule];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardBreadcrumbModule {}

@NgModule({
  imports: [CommonModule, ZardButtonComponent, ZardSheetComponent, OverlayModule, PortalModule],
  providers: [ZardSheetService],
})
export class ZardSheetModule {}
