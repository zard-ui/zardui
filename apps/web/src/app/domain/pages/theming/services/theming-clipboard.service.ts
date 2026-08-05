import { Clipboard } from '@angular/cdk/clipboard';
import { inject, Injectable, signal } from '@angular/core';

import { toast } from 'ngx-sonner';

/**
 * Copy-to-clipboard for the theming page, mirroring the pattern in
 * `domain/components/color-card/color-card.component.ts`.
 *
 * Tracks the last copied value so a row can show a "copied" state without each component
 * keeping its own timer.
 */
@Injectable()
export class ThemingClipboardService {
  private readonly clipboard = inject(Clipboard);

  private readonly _lastCopied = signal<string | null>(null);
  readonly lastCopied = this._lastCopied.asReadonly();

  /** Copies `value`; `label` is what the toast shows when the value is long. */
  copy(value: string, label = value): void {
    if (this.clipboard.copy(value)) {
      this._lastCopied.set(value);
      toast.success(`Copied ${label} to clipboard.`);
      return;
    }

    toast.error('Failed to copy to clipboard');
  }
}
