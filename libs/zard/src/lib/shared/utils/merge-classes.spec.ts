import { mergeClasses } from './merge-classes';

describe('mergeClasses', () => {
  it('lets the last of two conflicting utilities win', () => {
    expect(mergeClasses('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('keeps a leading when a later size only changes the font size', () => {
    expect(mergeClasses('text-sm leading-normal', 'text-xs')).toBe('leading-normal text-xs');
  });

  it('replaces one size with another', () => {
    expect(mergeClasses('text-sm', 'text-xs')).toBe('text-xs');
  });

  it('replaces a size that carries its leading with another size', () => {
    expect(mergeClasses('text-xs/relaxed', 'text-sm')).toBe('text-sm');
  });
});
