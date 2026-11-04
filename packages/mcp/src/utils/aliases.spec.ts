import { componentsAliasedAs } from './aliases';

describe('aliases', () => {
  it('resolves typography to the typeset stylesheet', () => {
    expect(componentsAliasedAs('typography')).toEqual(['typeset']);
    expect(componentsAliasedAs('prose')).toEqual(['typeset']);
  });
});
