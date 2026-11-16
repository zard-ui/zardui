import { attachmentVariants, attachmentMediaVariants } from './attachment.variants';

describe('attachment variants', () => {
  it('provides the documented defaults', () => {
    const classes = attachmentVariants().split(' ');
    expect(classes).toEqual(expect.arrayContaining(['border', 'bg-card', 'gap-2', 'text-sm', 'items-center']));
    expect(attachmentMediaVariants().split(' ')).toEqual(expect.arrayContaining(['w-10', 'aspect-square', 'bg-muted']));
  });

  it.each([
    ['idle', 'data-[state=idle]:border-dashed'],
    ['error', 'data-[state=error]:border-destructive/30'],
  ] as const)('styles state %s through data-state', (zState, expected) => {
    expect(attachmentVariants({ zState }).split(' ')).toContain(expected);
  });

  it.each([
    ['default', 'gap-2 text-sm'],
    ['sm', 'gap-2.5 text-xs'],
    ['xs', 'gap-1.5 text-xs rounded-lg'],
  ] as const)('styles size %s', (zSize, expected) => {
    // Token by token: the style sheet sets them, and its order is not the contract.
    expect(attachmentVariants({ zSize }).split(' ')).toEqual(expect.arrayContaining(expected.split(' ')));
  });

  it('styles orientation and both media modes', () => {
    expect(attachmentVariants({ zOrientation: 'horizontal' }).split(' ')).toContain('items-center');
    expect(attachmentVariants({ zOrientation: 'vertical' }).split(' ')).toContain('flex-col');
    expect(attachmentMediaVariants({ zVariant: 'icon' }).split(' ')).toEqual(
      expect.arrayContaining(['w-10', 'bg-muted', 'text-foreground']),
    );
    expect(attachmentMediaVariants({ zVariant: 'image' }).split(' ')).toEqual(
      expect.arrayContaining(['opacity-60', '*:[img]:object-cover']),
    );
  });
});
