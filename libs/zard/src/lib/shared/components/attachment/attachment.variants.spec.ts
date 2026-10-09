import { attachmentVariants, attachmentMediaVariants } from './attachment.variants';

describe('attachment variants', () => {
  it('provides the documented defaults', () => {
    expect(attachmentVariants()).toContain('border-border');
    expect(attachmentVariants()).toContain('gap-3 p-3');
    expect(attachmentVariants()).toContain('flex-row');
    expect(attachmentMediaVariants()).toContain('size-10');
  });

  it.each([
    ['idle', 'border-border'],
    ['uploading', 'bg-muted/50'],
    ['processing', 'bg-muted/50'],
    ['error', 'border-destructive/50 text-destructive'],
    ['done', 'border-border'],
  ] as const)('styles state %s', (zState, expected) => {
    expect(attachmentVariants({ zState })).toContain(expected);
    if (zState !== 'error') {
      expect(attachmentVariants({ zState })).not.toContain('text-destructive');
    }
  });

  it.each([
    ['default', 'gap-3 p-3'],
    ['sm', 'gap-2 p-2.5 text-sm'],
    ['xs', 'gap-1.5 p-2 text-xs'],
  ] as const)('styles size %s', (zSize, expected) => {
    expect(attachmentVariants({ zSize })).toContain(expected);
  });

  it('styles orientation and both media modes', () => {
    expect(attachmentVariants({ zOrientation: 'horizontal' })).toContain('flex-row');
    expect(attachmentVariants({ zOrientation: 'vertical' })).toContain('flex-col items-start');
    expect(attachmentMediaVariants({ zVariant: 'icon' })).toContain('size-10 bg-muted text-muted-foreground');
    expect(attachmentMediaVariants({ zVariant: 'image' })).toContain('size-16');
    expect(attachmentMediaVariants({ zVariant: 'image' })).toContain('[&_img]:object-cover');
  });
});
