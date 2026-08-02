import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { InlineCodePipe } from './inline-code.pipe';

describe('InlineCodePipe', () => {
  let pipe: InlineCodePipe;
  let sanitizer: DomSanitizer;

  const render = (value: string) => sanitizer.sanitize(1 /* SecurityContext.HTML */, pipe.transform(value)) ?? '';

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [InlineCodePipe] });
    pipe = TestBed.inject(InlineCodePipe);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('wraps backticked spans in a code element', () => {
    expect(render('use `bg-primary` here')).toContain('<code');
    expect(render('use `bg-primary` here')).toContain('bg-primary');
  });

  it('leaves text without backticks untouched', () => {
    expect(render('no code here')).toBe('no code here');
  });

  it('escapes HTML before adding markup', () => {
    const output = render('an <ng-icon> element');

    expect(output).not.toContain('<ng-icon>');
    expect(output).toContain('&lt;ng-icon&gt;');
  });

  it('escapes HTML inside a code span too', () => {
    const output = render('`<script>alert(1)</script>`');

    expect(output).not.toContain('<script>');
    expect(output).toContain('&lt;script&gt;');
  });

  it('handles several code spans in one string', () => {
    const output = render('`:root` and `.dark`');

    expect(output.match(/<code/g)).toHaveLength(2);
  });
});
