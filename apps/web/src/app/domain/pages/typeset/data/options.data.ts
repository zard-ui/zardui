import { INHERIT_HEADING, type TypesetChoice, type TypesetMeasure } from '../models/typeset.model';

/** Base body size, in px. Everything else in the preset derives from it. */
export const SCALE_CHOICES: readonly TypesetChoice<number>[] = [
  { value: 14, label: '14px' },
  { value: 15, label: '15px' },
  { value: 16, label: '16px' },
  { value: 18, label: '18px' },
];

export const LEADING_CHOICES: readonly TypesetChoice<number>[] = [
  { value: 1.6, label: 'Tight (1.6)' },
  { value: 1.75, label: 'Regular (1.75)' },
  { value: 1.9, label: 'Loose (1.9)' },
];

export const FLOW_CHOICES: readonly TypesetChoice<string>[] = [
  { value: '1em', label: 'Compact (1em)' },
  { value: '1.25em', label: 'Regular (1.25em)' },
  { value: '2em', label: 'Airy (2em)' },
];

/**
 * The measure lives on the wrapper, not in the stylesheet.
 *
 * Typeset sets no `max-width` on purpose — the layout owns the line length.
 * The builder shows the control anyway, because a preview with no measure is a
 * preview of a rhythm nobody would ship.
 */
export const MEASURE_CHOICES: readonly TypesetMeasure[] = [
  { value: 60, width: '28em' },
  { value: 70, width: '33em' },
  { value: 80, width: '37em' },
  { value: 90, width: '42em' },
];

export const DEFAULT_STATE = {
  body: 'geist',
  heading: INHERIT_HEADING,
  mono: 'geist-mono',
  scale: 15,
  leading: 1.75,
  flow: '1.25em',
  measure: 80,
  item: 'docs',
} as const;
