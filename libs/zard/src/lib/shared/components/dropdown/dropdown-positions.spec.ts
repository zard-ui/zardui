import { buildDropdownPositions } from './dropdown-positions';

describe('buildDropdownPositions', () => {
  describe('alignOffset', () => {
    it('adds no horizontal shift by default', () => {
      expect(buildDropdownPositions('bottom', 'start', 4)[0]).toEqual({
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: 4,
      });
    });

    it('shifts a bottom menu along the aligned edge', () => {
      expect(buildDropdownPositions('bottom', 'start', 8, false, -4)[0]).toMatchObject({ offsetY: 8, offsetX: -4 });
    });

    it('keeps the shift on every fallback position', () => {
      const positions = buildDropdownPositions('bottom', 'start', 8, false, -4);

      expect(positions.length).toBeGreaterThan(1);
      expect(positions.every(position => position.offsetX !== undefined)).toBe(true);
    });

    it('mirrors the physical shift in RTL, where start is the right edge', () => {
      expect(buildDropdownPositions('bottom', 'start', 8, true, -4)[0]).toMatchObject({ offsetX: 4 });
    });

    it('measures the shift from the aligned edge, so it flips for end', () => {
      expect(buildDropdownPositions('bottom', 'end', 8, false, -4)[0]).toMatchObject({ offsetX: 4 });
    });

    it('shifts a side menu vertically', () => {
      expect(buildDropdownPositions('right', 'start', 4, false, 6)[0]).toMatchObject({ offsetX: 4, offsetY: 6 });
      expect(buildDropdownPositions('right', 'end', 4, false, 6)[0]).toMatchObject({ offsetY: -6 });
    });
  });
});
