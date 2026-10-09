export { ZardKbdGroupComponent } from './kbd-group.component';
export { ZardKbdComponent } from './kbd.component';

/*
 * The alias, not a relative path: the Angular compiler re-emits these imports from
 * whichever module spreads the array, and it can only do that for a specifier the
 * consumer can resolve too. A relative path here fails with NG3004.
 */
import { ZardKbdGroupComponent } from './kbd-group.component';
import { ZardKbdComponent } from './kbd.component';

/** Every part of the kbd component, for a template that uses more than one. */
export const ZardKbdImports = [ZardKbdComponent, ZardKbdGroupComponent] as const;
