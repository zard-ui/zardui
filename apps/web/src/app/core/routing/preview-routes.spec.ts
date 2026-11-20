import { isPreviewUrl } from './preview-routes';

describe('isPreviewUrl', () => {
  it.each(['/create/preview/preview-01', '/blocks/preview/login-01', '/typeset/preview'])(
    '%s is a bare document',
    url => {
      expect(isPreviewUrl(url)).toBe(true);
    },
  );

  it.each(['/create', '/docs/components/button', '/blocks'])('%s is a page of the site', url => {
    expect(isPreviewUrl(url)).toBe(false);
  });
});
