import { computed, inject, type Signal } from '@angular/core';

import { PreviewDesignContext } from '../../lib/preview-design.context';

/** shadcn squares the bars off for the lyra and sera styles; every other style rounds their top corners. */
export function injectRoundedBars(): Signal<boolean> {
  const context = inject(PreviewDesignContext);
  return computed(() => !['lyra', 'sera'].includes(context.design().style));
}
