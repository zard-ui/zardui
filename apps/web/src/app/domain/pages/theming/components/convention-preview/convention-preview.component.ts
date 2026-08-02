import { ChangeDetectionStrategy, Component } from '@angular/core';

import { THEME_TOKENS } from '../../data/tokens.data';

interface TokenPair {
  background: string;
  foreground: string;
  /** Tailwind classes that render the pair for real, rather than describing it. */
  classes: string;
}

/** Tailwind cannot generate these from a variable, so the pairs are spelled out. */
const PAIR_CLASSES: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  muted: 'bg-muted text-muted-foreground',
  accent: 'bg-accent text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  card: 'bg-card text-card-foreground border-border border',
  popover: 'bg-popover text-popover-foreground border-border border',
  sidebar: 'bg-sidebar text-sidebar-foreground border-border border',
};

@Component({
  selector: 'z-convention-preview',
  standalone: true,
  templateUrl: './convention-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConventionPreviewComponent {
  readonly pairs: TokenPair[] = THEME_TOKENS.filter(token => token.pairedWith && PAIR_CLASSES[token.name]).map(
    token => ({
      background: token.name,
      foreground: token.pairedWith!,
      classes: PAIR_CLASSES[token.name],
    }),
  );
}
