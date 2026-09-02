/*
 * The alias, not a relative path: the Angular compiler re-emits these imports from
 * whichever module spreads the array, and it can only do that for a specifier the
 * consumer can resolve too. A relative path here fails with NG3004.
 */
import { ZardAvatarGroupComponent } from '@/shared/components/avatar/avatar-group.component';
import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

/** Every part of the avatar component, for a template that uses more than one. */
export const ZardAvatarImports = [ZardAvatarComponent, ZardAvatarGroupComponent] as const;
