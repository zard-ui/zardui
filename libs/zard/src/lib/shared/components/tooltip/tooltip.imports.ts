export { ZardTooltipComponent, ZardTooltipDirective } from './tooltip';

import { OverlayModule } from '@angular/cdk/overlay';

import { ZardTooltipComponent, ZardTooltipDirective } from './tooltip';

export const ZardTooltipImports = [ZardTooltipComponent, ZardTooltipDirective, OverlayModule] as const;
