/** Which part of the design system a token belongs to. */
export type TokenGroup = 'base' | 'surface' | 'form' | 'chart' | 'sidebar';

/** The two color schemes a token can be resolved against. */
export type ThemeMode = 'light' | 'dark';

/** Every CSS variable name a base color defines, without the leading `--`. */
export type TokenName = string;

/** A single documented CSS variable. */
export interface ThemeToken {
  /** CSS custom property name, without the leading `--`. */
  name: TokenName;
  group: TokenGroup;
  /** What the token is for, in one sentence. */
  description: string;
  /** Tailwind utilities this token backs, e.g. `bg-primary`. */
  utilities: string[];
  /** Library components that consume the token today (empty when nothing uses it yet). */
  usedBy: string[];
  /** Token that provides readable text on top of this one, when the pair exists. */
  pairedWith?: TokenName;
}

/** One of the five presets the CLI can write into `src/styles.css`. */
export interface BaseColorTheme {
  id: 'neutral' | 'stone' | 'zinc' | 'gray' | 'slate';
  label: string;
  /** Value of `--radius`, e.g. `0.625rem`. */
  radius: string;
  light: Record<TokenName, string>;
  dark: Record<TokenName, string>;
}

/** One annotated slice of `src/styles.css`, used by the anatomy section. */
export interface AnatomyPart {
  id: string;
  /** The literal CSS line(s) this part refers to. */
  snippet: string;
  title: string;
  /** Why the line exists — not what it does. */
  reason: string;
  /** What breaks when it is missing. */
  breaksWhenMissing: string;
}

/** A derived radius step from the `--radius` scale. */
export interface RadiusStep {
  /** Tailwind utility, e.g. `rounded-md`. */
  utility: string;
  /** The `@theme inline` declaration that defines it. */
  formula: string;
  /** Resolved value when `--radius` is `0.625rem` (10px). */
  resolved: string;
}

/** One entry of the troubleshooting list. */
export interface TroubleshootingEntry {
  id: string;
  symptom: string;
  cause: string;
  fix: string;
}

/** A card in the "Next steps" grid. */
export interface NextStep {
  title: string;
  description: string;
  href: string;
  /** External links open in a new tab. */
  external?: boolean;
}
