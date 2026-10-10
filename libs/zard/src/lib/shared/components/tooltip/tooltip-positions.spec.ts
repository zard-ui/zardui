import { getTooltipPosition, TOOLTIP_POSITIONS_MAP } from './tooltip-positions';

describe('getTooltipPosition', () => {
  it('keeps the shared map untouched', () => {
    const before = JSON.stringify(TOOLTIP_POSITIONS_MAP);

    getTooltipPosition('left', 12, true);
    getTooltipPosition('top', 12, false);

    expect(JSON.stringify(TOOLTIP_POSITIONS_MAP)).toBe(before);
  });

  it('puts left on CDK start and pushes away to the left in LTR', () => {
    expect(getTooltipPosition('left', 6, false)).toEqual(
      expect.objectContaining({ originX: 'start', overlayX: 'end', offsetX: -6 }),
    );
  });

  it('puts right on CDK end and pushes away to the right in LTR', () => {
    expect(getTooltipPosition('right', 6, false)).toEqual(
      expect.objectContaining({ originX: 'end', overlayX: 'start', offsetX: 6 }),
    );
  });

  it('keeps left on the physical left in RTL: CDK end, offset still negative', () => {
    expect(getTooltipPosition('left', 6, true)).toEqual(
      expect.objectContaining({ originX: 'end', overlayX: 'start', offsetX: -6 }),
    );
  });

  it('keeps right on the physical right in RTL: CDK start, offset still positive', () => {
    expect(getTooltipPosition('right', 6, true)).toEqual(
      expect.objectContaining({ originX: 'start', overlayX: 'end', offsetX: 6 }),
    );
  });

  it('does not depend on direction for top and bottom', () => {
    expect(getTooltipPosition('top', 4, true)).toEqual(getTooltipPosition('top', 4, false));
    expect(getTooltipPosition('bottom', 4, true).offsetY).toBe(4);
  });
});
