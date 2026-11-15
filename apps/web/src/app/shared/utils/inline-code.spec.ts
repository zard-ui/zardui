import { inlineCode } from './inline-code';

describe('inlineCode', () => {
  it('turns backtick spans into code elements', () => {
    expect(inlineCode('Set `zValue` or `zMultiple`.')).toBe('Set <code>zValue</code> or <code>zMultiple</code>.');
  });

  it('escapes HTML inside and outside the code spans', () => {
    expect(inlineCode('a <b> & `<i>`')).toBe('a &lt;b&gt; &amp; <code>&lt;i&gt;</code>');
  });

  it('leaves a lone backtick as text', () => {
    expect(inlineCode('one ` tick')).toBe('one ` tick');
  });
});
