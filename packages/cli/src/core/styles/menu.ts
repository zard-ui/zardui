/**
 * The menu look: two markers that belong to no style.
 *
 * shadcn lets a project pick how popup menus look independently of the style —
 * `menuColor` (default | inverted) and `menuAppearance` (solid | translucent) in
 * `components.json`. The surfaces that honour it (dropdown, context menu, select,
 * combobox) carry two markers:
 *
 *   `cn-menu-target`       inverted → `dark` (the surface re-reads the dark tokens); otherwise nothing
 *   `cn-menu-translucent`  translucent → the blur classes below; otherwise nothing
 *
 * They are resolved by the installer from those two settings, whichever style is
 * chosen. The docs resolve them in `menu.css`, switched by `menu-translucent` /
 * `menu-inverted` classes next to the `style-*` class.
 */

export const MENU_TARGET_MARKER = 'cn-menu-target';
export const MENU_TRANSLUCENT_MARKER = 'cn-menu-translucent';

/** The classes a translucent menu surface gets. Kept in step with `menu.css` by a spec. */
export const MENU_TRANSLUCENT_CLASSES =
  'animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!';

export interface MenuOptions {
  menuColor?: 'default' | 'inverted';
  menuAppearance?: 'solid' | 'translucent';
}

/** What the two menu markers stand for under these settings. */
export function menuMarkers(options: MenuOptions = {}): Record<string, string> {
  return {
    [MENU_TARGET_MARKER]: options.menuColor === 'inverted' ? 'dark' : '',
    [MENU_TRANSLUCENT_MARKER]: options.menuAppearance === 'translucent' ? MENU_TRANSLUCENT_CLASSES : '',
  };
}
