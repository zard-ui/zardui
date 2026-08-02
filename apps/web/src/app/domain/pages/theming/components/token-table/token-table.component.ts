import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BASE_COLORS } from '../../data/base-colors.data';
import { THEME_TOKENS, TOKEN_GROUPS } from '../../data/tokens.data';
import type { BaseColorTheme, ThemeToken, TokenGroup } from '../../models/theming.model';
import { InlineCodePipe } from '../../pipes/inline-code.pipe';

interface TokenRow {
  token: ThemeToken;
  light: string;
  dark: string;
}

interface TokenSection {
  id: TokenGroup;
  label: string;
  summary: string;
  rows: TokenRow[];
}

@Component({
  selector: 'z-token-table',
  standalone: true,
  imports: [InlineCodePipe],
  templateUrl: './token-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenTableComponent {
  /** Base color the values are resolved against. Defaults to the first CLI preset. */
  readonly baseColor = input<BaseColorTheme>(BASE_COLORS[0]);

  readonly sections = computed<TokenSection[]>(() => {
    const theme = this.baseColor();

    return TOKEN_GROUPS.map(group => ({
      ...group,
      rows: THEME_TOKENS.filter(token => token.group === group.id).map(token => ({
        token,
        light: theme.light[token.name] ?? '—',
        dark: theme.dark[token.name] ?? theme.light[token.name] ?? '—',
      })),
    })).filter(section => section.rows.length > 0);
  });

  readonly totalTokens = THEME_TOKENS.length;
}
