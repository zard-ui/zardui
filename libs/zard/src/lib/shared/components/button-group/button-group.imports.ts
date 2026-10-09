export {
  ZardButtonGroupComponent,
  ZardButtonGroupSeparatorComponent,
  ZardButtonGroupTextDirective,
} from './button-group.component';

/*
 * The alias, not a relative path: the Angular compiler re-emits these imports from
 * whichever module spreads the array, and it can only do that for a specifier the
 * consumer can resolve too. A relative path here fails with NG3004.
 */
import {
  ZardButtonGroupComponent,
  ZardButtonGroupSeparatorComponent,
  ZardButtonGroupTextDirective,
} from './button-group.component';

/** Every part of the button-group component, for a template that uses more than one. */
export const ZardButtonGroupImports = [
  ZardButtonGroupComponent,
  ZardButtonGroupSeparatorComponent,
  ZardButtonGroupTextDirective,
] as const;
