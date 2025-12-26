import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { ZardSheetComponent } from '@/shared/components/sheet/sheet.component';

export const ZardSheetImports = [ZardSheetComponent, OverlayModule, PortalModule] as const;
