import type { BaseColorTheme, ThemeMode, TokenName } from '../models/theming.model';

/** Builds the `--key: value` declaration list a scoped preview container needs. */
export function toScopedStyles(theme: BaseColorTheme, mode: ThemeMode): string {
  const vars = mode === 'dark' ? theme.dark : theme.light;
  const declarations = Object.entries(vars).map(([key, value]) => `--${key}: ${value}`);
  return [`--radius: ${theme.radius}`, ...declarations].join('; ');
}

/** Resolves a single token for a base color in a given mode. Dark falls back to light. */
export function resolveToken(theme: BaseColorTheme, mode: ThemeMode, name: TokenName): string {
  return (mode === 'dark' ? theme.dark[name] : theme.light[name]) ?? theme.light[name] ?? '';
}

/** Renders the `:root` and `.dark` blocks for a base color, ready to paste into `src/styles.css`. */
export function toCssVariables(theme: BaseColorTheme): string {
  const block = (vars: Record<TokenName, string>, radius?: string) =>
    [...(radius ? [`  --radius: ${radius};`] : []), ...Object.entries(vars).map(([k, v]) => `  --${k}: ${v};`)].join(
      '\n',
    );

  return `:root {\n${block(theme.light, theme.radius)}\n}\n\n.dark {\n${block(theme.dark)}\n}\n`;
}
