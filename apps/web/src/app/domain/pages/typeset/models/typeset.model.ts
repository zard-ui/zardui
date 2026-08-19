/** Which slot a family may fill. Mono is never offered for body or heading text. */
export type TypesetFontType = 'sans' | 'serif' | 'mono';

export interface TypesetFont {
  /** Stable id — it travels in the URL, so renaming one breaks shared links. */
  readonly id: string;
  readonly label: string;
  readonly type: TypesetFontType;
  /** The `font-family` value the preview applies. */
  readonly family: string;
  /** The variable the exported preset writes and reads. */
  readonly cssVariable: string;
  /** The npm package that self-hosts the face. */
  readonly dependency: string;
}

/** The value the Heading picker uses to mean "same face as body". */
export const INHERIT_HEADING = 'inherit';

export interface TypesetChoice<T extends string | number> {
  readonly value: T;
  readonly label: string;
}

export interface TypesetMeasure {
  /** Characters per line, the number the control shows. */
  readonly value: number;
  /** The `max-width` that lands near that count at the default size. */
  readonly width: string;
}

export interface TypesetState {
  readonly body: string;
  readonly heading: string;
  readonly mono: string;
  readonly scale: number;
  readonly leading: number;
  readonly flow: string;
  readonly measure: number;
  readonly item: string;
}

export interface TypesetFixture {
  readonly id: string;
  readonly label: string;
  /** What the fixture is for — shown in the tooltip on its pill. */
  readonly description: string;
  readonly html: string;
}
