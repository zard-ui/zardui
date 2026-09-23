/*
 * The alias, not a relative path: the Angular compiler re-emits these imports from
 * whichever module spreads the array, and it can only do that for a specifier the
 * consumer can resolve too. A relative path here fails with NG3004.
 */
import {
  ZardSliderComponent,
  ZardSliderRangeComponent,
  ZardSliderThumbComponent,
  ZardSliderTrackComponent,
} from '@/shared/components/slider/slider.component';

/** Every part of the slider component, for a template that uses more than one. */
export const ZardSliderImports = [
  ZardSliderComponent,
  ZardSliderTrackComponent,
  ZardSliderRangeComponent,
  ZardSliderThumbComponent,
] as const;
