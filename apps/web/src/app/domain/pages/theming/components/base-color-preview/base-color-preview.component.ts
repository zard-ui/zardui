import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { ZardAccordionImports } from '@zard/components/accordion/accordion.imports';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';

import { BASE_COLORS } from '../../data/base-colors.data';
import type { BaseColorTheme, ThemeMode } from '../../models/theming.model';
import { ThemingClipboardService } from '../../services/theming-clipboard.service';
import { toCssVariables, toScopedStyles } from '../../utils/theme-css.util';

/** Tokens shown as swatches — the ones a reader recognises at a glance. */
const PREVIEW_TOKENS = [
  'background',
  'foreground',
  'primary',
  'secondary',
  'muted',
  'accent',
  'destructive',
  'border',
] as const;

@Component({
  selector: 'z-base-color-preview',
  imports: [
    RouterLink,
    CodeBlockComponent,
    ZardAccordionImports,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardCardImports,
    ZardInputComponent,
  ],
  templateUrl: './base-color-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseColorPreviewComponent {
  private readonly clipboard = inject(ThemingClipboardService);

  /** Full `src/styles.css` block per base color, keyed by theme id. */
  readonly codeBlocks = input<Record<string, CodeBlockData>>({});

  readonly themes = BASE_COLORS;

  private readonly selectedId = signal<BaseColorTheme['id']>(BASE_COLORS[0].id);
  protected readonly mode = signal<ThemeMode>('light');

  readonly selected = computed(() => this.themes.find(theme => theme.id === this.selectedId()) ?? this.themes[0]);
  readonly scopedStyles = computed(() => toScopedStyles(this.selected(), this.mode()));
  readonly isDark = computed(() => this.mode() === 'dark');
  readonly activeBlock = computed<CodeBlockData | undefined>(() => this.codeBlocks()[this.selectedId()]);

  readonly swatches = computed(() => {
    const theme = this.selected();
    const vars = this.isDark() ? theme.dark : theme.light;
    return PREVIEW_TOKENS.map(name => ({ name, value: vars[name] ?? theme.light[name] }));
  });

  select(id: BaseColorTheme['id']): void {
    this.selectedId.set(id);
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  /** Copies the `:root` and `.dark` blocks — the part that actually changes between base colors. */
  copyVariables(): void {
    const theme = this.selected();
    this.clipboard.copy(toCssVariables(theme), `${theme.label} CSS variables`);
  }

  copySwatch(value: string): void {
    this.clipboard.copy(value);
  }

  /** Small square shown inside each theme button, so the choice reads visually. */
  buttonSwatch(theme: BaseColorTheme): string {
    return theme.light['primary'];
  }
}
