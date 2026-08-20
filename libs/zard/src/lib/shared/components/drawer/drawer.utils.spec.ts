import {
  closingDirection,
  isVerticalPlacement,
  nearestSnapIndex,
  resolveSnapPoint,
  resolveSnapPoints,
  rubberband,
} from './drawer.utils';

describe('drawer utils', () => {
  describe('resolveSnapPoint', () => {
    it('reads a number up to 1 as a fraction of the viewport', () => {
      expect(resolveSnapPoint(0.5, 800)).toBe(400);
      expect(resolveSnapPoint(1, 800)).toBe(800);
    });

    it('reads a number above 1 as pixels', () => {
      expect(resolveSnapPoint(320, 800)).toBe(320);
    });

    it('keeps the unit of a string', () => {
      expect(resolveSnapPoint('320px', 800)).toBe(320);
      expect(resolveSnapPoint('20rem', 800, 16)).toBe(320);
      expect(resolveSnapPoint('50%', 800)).toBe(400);
      expect(resolveSnapPoint('25vh', 800)).toBe(200);
    });

    it('falls back to 0 for something unparseable', () => {
      expect(resolveSnapPoint('auto', 800)).toBe(0);
    });

    it('keeps the author order so an index maps back to the input', () => {
      expect(resolveSnapPoints(['20rem', 0.5, 1], 800, 16)).toEqual([320, 400, 800]);
    });
  });

  describe('nearestSnapIndex', () => {
    it('picks the closest point', () => {
      expect(nearestSnapIndex(330, [320, 400, 800])).toBe(0);
      expect(nearestSnapIndex(390, [320, 400, 800])).toBe(1);
      expect(nearestSnapIndex(10_000, [320, 400, 800])).toBe(2);
    });

    it('returns -1 without points', () => {
      expect(nearestSnapIndex(100, [])).toBe(-1);
    });
  });

  describe('closingDirection', () => {
    it('points away from the edge the drawer is anchored to', () => {
      expect(closingDirection('bottom')).toBe(1);
      expect(closingDirection('right')).toBe(1);
      expect(closingDirection('top')).toBe(-1);
      expect(closingDirection('left')).toBe(-1);
    });
  });

  describe('rubberband', () => {
    it('resists more the further it is pulled', () => {
      const short = rubberband(50, 800);
      const long = rubberband(400, 800);

      expect(short).toBeLessThan(50);
      expect(long).toBeLessThan(400);
      expect(long / 400).toBeLessThan(short / 50);
    });

    it('is 0 without a dimension to resist against', () => {
      expect(rubberband(100, 0)).toBe(0);
    });
  });

  it('knows which placements drag along Y', () => {
    expect(isVerticalPlacement('bottom')).toBe(true);
    expect(isVerticalPlacement('top')).toBe(true);
    expect(isVerticalPlacement('left')).toBe(false);
    expect(isVerticalPlacement('right')).toBe(false);
  });
});
