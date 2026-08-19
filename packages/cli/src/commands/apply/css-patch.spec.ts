import { CssPatchError, patchThemeCss, tokensFrom } from '@cli/commands/apply/css-patch.js';

/**
 * O CSS de um projeto que já rodou: os tokens que o `init` escreveu, e em volta
 * deles tudo o que a pessoa acrescentou desde então. É esse "em volta" que o
 * `apply` não pode tocar — se ele sumir, a troca de uma cor custou o CSS de
 * alguém.
 */
const LIVED_IN_CSS = `@layer ng-icon, theme, base, components, utilities;
@import 'tailwindcss';
@import './app/shared/core/css/tailwind';
@plugin "tailwindcss-animate";

@import url('https://fonts.example/inter.css');

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --brand-gradient: linear-gradient(90deg, #ff0080, #7928ca);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --brand-gradient: linear-gradient(90deg, #ff8ac0, #b98af0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
}

.marketing-hero {
  background: var(--brand-gradient);
  padding-block: 6rem;
}
`;

const light = new Map([
  ['--radius', '1rem'],
  ['--background', 'oklch(1 0 0)'],
  ['--foreground', 'oklch(0.129 0.042 264.695)'],
  ['--primary', 'oklch(0.55 0.214 259.815)'],
]);

const dark = new Map([
  ['--background', 'oklch(0.129 0.042 264.695)'],
  ['--foreground', 'oklch(0.984 0.003 247.858)'],
  ['--primary', 'oklch(0.7 0.158 259.815)'],
]);

describe('patchThemeCss', () => {
  it('replaces the tokens it knows', () => {
    const { css } = patchThemeCss(LIVED_IN_CSS, { light, dark });

    expect(css).toContain('--primary: oklch(0.55 0.214 259.815);');
    expect(css).toContain('--radius: 1rem;');
    expect(css).toContain('--primary: oklch(0.7 0.158 259.815);');
  });

  /** A razão de o patch existir. */
  it('leaves everything else exactly as it was', () => {
    const { css } = patchThemeCss(LIVED_IN_CSS, { light, dark });

    expect(css).toContain("@import url('https://fonts.example/inter.css');");
    expect(css).toContain('--brand-gradient: linear-gradient(90deg, #ff0080, #7928ca);');
    expect(css).toContain('--brand-gradient: linear-gradient(90deg, #ff8ac0, #b98af0);');
    expect(css).toContain('.marketing-hero {');
    expect(css).toContain('padding-block: 6rem;');
    expect(css).toContain('@plugin "tailwindcss-animate";');
  });

  it('says which blocks it touched', () => {
    expect(patchThemeCss(LIVED_IN_CSS, { light, dark }).changed).toEqual([':root', '.dark']);
  });

  it('changes nothing when the tokens already match', () => {
    const { css, changed } = patchThemeCss(LIVED_IN_CSS, {
      light: new Map([['--primary', 'oklch(0.205 0 0)']]),
      dark: new Map([['--primary', 'oklch(0.922 0 0)']]),
    });

    expect(css).toBe(LIVED_IN_CSS);
    expect(changed).toEqual([]);
  });

  /**
   * Um tema que ganha uma variável nova precisa chegar a quem já tem o projeto
   * montado, sem exigir um `init` por cima do que já existe.
   */
  it('adds a token the file did not have yet, next to the others', () => {
    const { css } = patchThemeCss(LIVED_IN_CSS, {
      light: new Map([['--sidebar-ring', 'oklch(0.708 0 0)']]),
      dark: new Map(),
    });

    expect(css).toContain('  --sidebar-ring: oklch(0.708 0 0);');
    expect(css).toContain('  --brand-gradient: linear-gradient(90deg, #ff0080, #7928ca);');
  });

  /**
   * Contar chaves em vez de casar um regex: `@layer base { * { … } }` fecha uma
   * chave interna antes da do bloco, e um `[^}]*` pararia ali.
   */
  it('is not fooled by nested blocks after :root', () => {
    const nested = `:root {\n  --primary: oklch(0.2 0 0);\n}\n\n.dark {\n  --primary: oklch(0.9 0 0);\n}\n\n@layer base {\n  * {\n    @apply border-border;\n  }\n}\n`;

    const { css } = patchThemeCss(nested, {
      light: new Map([['--primary', 'red']]),
      dark: new Map([['--primary', 'blue']]),
    });

    expect(css).toContain('--primary: red;');
    expect(css).toContain('--primary: blue;');
    expect(css).toContain('@apply border-border;');
  });

  it('refuses a stylesheet with no :root, instead of guessing where to write', () => {
    expect(() => patchThemeCss('body { color: red; }', { light, dark })).toThrow(CssPatchError);
    expect(() => patchThemeCss('body { color: red; }', { light, dark })).toThrow(/:root/);
  });

  it('refuses a stylesheet with no .dark block', () => {
    expect(() => patchThemeCss(':root {\n  --primary: red;\n}\n', { light, dark })).toThrow(/\.dark/);
  });

  it('leaves the file untouched when it refuses', () => {
    const before = 'body { color: red; }';

    expect(() => patchThemeCss(before, { light, dark })).toThrow();
    expect(before).toBe('body { color: red; }');
  });
});

describe('tokensFrom', () => {
  it('reads the declarations of a rendered block', () => {
    const tokens = tokensFrom(':root {\n  --radius: 1rem;\n  --primary: oklch(0.5 0.2 264);\n}');

    expect(tokens.get('--radius')).toBe('1rem');
    expect(tokens.get('--primary')).toBe('oklch(0.5 0.2 264)');
  });

  it('ignores anything that is not a custom property', () => {
    expect(tokensFrom(':root {\n  color: red;\n  --primary: blue;\n}').size).toBe(1);
  });
});
