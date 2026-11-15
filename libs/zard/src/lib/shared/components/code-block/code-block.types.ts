/**
 * One piece of a highlighted line.
 *
 * `style` carries Shiki's CSS custom properties (`--shiki-light`, `--shiki-dark`, ...). The line component renders it
 * through Angular's style binding, so nothing here is ever parsed as HTML.
 */
export interface ZardCodeBlockToken {
  readonly content: string;
  readonly style?: Readonly<Record<string, string>>;
}

/** The tokens of one line, as returned by `highlightCode()` and consumed by `z-code-block-line` through `[zTokens]`. */
export type ZardCodeBlockLineTokens = readonly ZardCodeBlockToken[];
