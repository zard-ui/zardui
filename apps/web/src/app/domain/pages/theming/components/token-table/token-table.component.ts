import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { BASE_COLORS } from '../../data/base-colors.data';
import { THEME_TOKENS, TOKEN_GROUPS } from '../../data/tokens.data';
import type { BaseColorTheme, ThemeMode, ThemeToken, TokenGroup } from '../../models/theming.model';
import { InlineCodePipe } from '../../pipes/inline-code.pipe';
import { ThemingClipboardService } from '../../services/theming-clipboard.service';

interface TokenRow {
  token: ThemeToken;
  value: string;
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
  private readonly clipboard = inject(ThemingClipboardService);

  /** Base color the values are resolved against. Defaults to the first CLI preset. */
  readonly baseColor = input<BaseColorTheme>(BASE_COLORS[0]);

  protected readonly mode = signal<ThemeMode>('light');
  protected readonly query = signal('');

  readonly lastCopied = this.clipboard.lastCopied;
  readonly totalTokens = THEME_TOKENS.length;

  /** Surface the swatches sit on, so translucent tokens like `--border` stay readable. */
  readonly surface = computed(() => {
    const theme = this.baseColor();
    return this.mode() === 'dark' ? theme.dark['background'] : theme.light['background'];
  });

  readonly sections = computed<TokenSection[]>(() => {
    const theme = this.baseColor();
    const vars = this.mode() === 'dark' ? theme.dark : theme.light;
    const needle = this.query().trim().toLowerCase();

    return TOKEN_GROUPS.map(group => ({
      ...group,
      rows: THEME_TOKENS.filter(token => token.group === group.id && this.matches(token, needle)).map(token => ({
        token,
        value: vars[token.name] ?? theme.light[token.name] ?? '—',
      })),
    })).filter(section => section.rows.length > 0);
  });

  readonly visibleCount = computed(() => this.sections().reduce((total, section) => total + section.rows.length, 0));

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  copy(value: string): void {
    this.clipboard.copy(value);
  }

  private matches(token: ThemeToken, needle: string): boolean {
    if (!needle) return true;

    return (
      token.name.includes(needle) ||
      token.description.toLowerCase().includes(needle) ||
      token.utilities.some(prefix => `${prefix}-${token.name}`.includes(needle)) ||
      token.usedBy.some(component => component.includes(needle))
    );
  }
}
