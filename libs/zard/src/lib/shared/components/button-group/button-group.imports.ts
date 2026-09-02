/*
 * The alias, not a relative path: the Angular compiler re-emits these imports from
 * whichever module spreads the array, and it can only do that for a specifier the
 * consumer can resolve too. A relative path here fails with NG3004.
 */
import {
  ZardButtonGroupComponent,
  ZardButtonGroupDividerComponent,
  ZardButtonGroupTextDirective,
} from '@/shared/components/button-group/button-group.component';

/** Every part of the button-group component, for a template that uses more than one. */
export const ZardButtonGroupImports = [
  ZardButtonGroupComponent,
  ZardButtonGroupDividerComponent,
  ZardButtonGroupTextDirective,
] as const;
