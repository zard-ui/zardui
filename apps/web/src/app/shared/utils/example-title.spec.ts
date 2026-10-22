import { exampleTitle } from './example-title';

describe('exampleTitle', () => {
  it('title-cases each word of a demo name', () => {
    expect(exampleTitle('with-icon')).toBe('With Icon');
    expect(exampleTitle('default')).toBe('Default');
  });

  it('keeps acronyms in capitals', () => {
    expect(exampleTitle('rtl')).toBe('RTL');
    expect(exampleTitle('api-controls')).toBe('API Controls');
  });
});
