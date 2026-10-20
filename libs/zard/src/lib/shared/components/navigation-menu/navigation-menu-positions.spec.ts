import { getNavigationMenuPositions, NAVIGATION_MENU_POSITIONS_MAP } from './navigation-menu-positions';

describe('getNavigationMenuPositions', () => {
  it('returns the map untouched in LTR', () => {
    expect(getNavigationMenuPositions('rightTop', false)).toBe(NAVIGATION_MENU_POSITIONS_MAP['rightTop']);
    expect(getNavigationMenuPositions('leftCenter', false)).toBe(NAVIGATION_MENU_POSITIONS_MAP['leftCenter']);
  });

  it('keeps top and bottom placements on the inline edges in RTL', () => {
    // CDK start/end already follow the overlay direction, so bottomLeft stays aligned to the inline-start edge.
    expect(getNavigationMenuPositions('bottomLeft', true)).toBe(NAVIGATION_MENU_POSITIONS_MAP['bottomLeft']);
    expect(getNavigationMenuPositions('topRight', true)).toBe(NAVIGATION_MENU_POSITIONS_MAP['topRight']);
    expect(getNavigationMenuPositions('bottomCenter', true)).toBe(NAVIGATION_MENU_POSITIONS_MAP['bottomCenter']);
  });

  it('swaps the physical left side to CDK end in RTL and keeps the offset pointing left', () => {
    const [primary, fallback] = getNavigationMenuPositions('leftTop', true);

    expect(primary).toMatchObject({ originX: 'end', overlayX: 'start', offsetX: -8 });
    expect(fallback).toMatchObject({ originX: 'start', overlayX: 'end', offsetX: 8 });
  });

  it('swaps the physical right side to CDK start in RTL and keeps the offset pointing right', () => {
    const [primary, fallback] = getNavigationMenuPositions('rightCenter', true);

    expect(primary).toMatchObject({ originX: 'start', overlayX: 'end', offsetX: 8 });
    expect(fallback).toMatchObject({ originX: 'end', overlayX: 'start', offsetX: -8 });
  });

  it('does not mutate the shared map', () => {
    getNavigationMenuPositions('leftBottom', true);

    expect(NAVIGATION_MENU_POSITIONS_MAP['leftBottom'][0]).toMatchObject({ originX: 'start', overlayX: 'end' });
  });
});
