import { ChangeDetectionStrategy, Component } from '@angular/core';

import { wcagContrast } from 'culori';

import { BASE_COLORS } from '../../data/base-colors.data';
import { THEME_TOKENS } from '../../data/tokens.data';
import type { ThemeMode } from '../../models/theming.model';

interface PairSample {
  mode: ThemeMode;
  background: string;
  foreground: string;
  /** WCAG contrast ratio between the two, rounded to two decimals. */
  ratio: number;
  /** False when the ratio is below 4.5:1, the AA threshold for body text. */
  passesAA: boolean;
}

interface TokenPair {
  background: string;
  foreground: string;
  samples: PairSample[];
}

/** Pairs worth showing — the ones a component actually renders as surface + text. */
const PREVIEWED_PAIRS = ['primary', 'secondary', 'muted', 'accent', 'destructive', 'card', 'popover', 'sidebar'];

@Component({
  selector: 'z-convention-preview',
  standalone: true,
  templateUrl: './convention-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConventionPreviewComponent {
  /** Values come from the Neutral preset, so the swatch and the ratio always agree. */
  readonly theme = BASE_COLORS[0];

  readonly pairs: TokenPair[] = THEME_TOKENS.filter(
    token => token.pairedWith && PREVIEWED_PAIRS.includes(token.name),
  ).map(token => ({
    background: token.name,
    foreground: token.pairedWith!,
    samples: (['light', 'dark'] as const).map(mode => {
      const background = this.theme[mode][token.name];
      const foreground = this.theme[mode][token.pairedWith!];
      const ratio = Math.round(wcagContrast(background, foreground) * 100) / 100;
      return { mode, background, foreground, ratio, passesAA: ratio >= 4.5 };
    }),
  }));
}
