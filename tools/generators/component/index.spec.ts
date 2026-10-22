import { findLiteralClose } from './index';

describe('findLiteralClose', () => {
  it('ignores apostrophes and brackets in line comments', () => {
    const content = `[
      {
        dependencies: [
          // The wrapper re-exported the package's types in v21 ]
          'dependency',
        ],
      },
    ]`;

    expect(findLiteralClose(content, 0, '[', ']')).toBe(content.length - 1);
  });

  it('ignores quotes and brackets in block comments', () => {
    const content = `{
      /* A comment's unmatched delimiters: } ] */
      value: ['item'],
    }`;

    expect(findLiteralClose(content, 0, '{', '}')).toBe(content.length - 1);
  });

  it('does not end an escaped string early', () => {
    const content = String.raw`['an escaped quote: \' and bracket: ]']`;

    expect(findLiteralClose(content, 0, '[', ']')).toBe(content.length - 1);
  });

  it('closes a string after an even number of backslashes', () => {
    const content = String.raw`['two backslashes: \\', 'bracket: ]']`;

    expect(findLiteralClose(content, 0, '[', ']')).toBe(content.length - 1);
  });
});
