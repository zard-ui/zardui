import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';

import { DEFAULT_RADIUS, RADIUS_PRESETS, RADIUS_STEPS } from '../../data/radius.data';
import { ThemingClipboardService } from '../../services/theming-clipboard.service';

/** The browser default, used while prerendering where there is no root to measure. */
const DEFAULT_PX_PER_REM = 16;

/** `6` → `6px`, `4.8` → `4.8px`. Trailing zeros would read as false precision. */
function formatPx(value: number): string {
  return `${Number(value.toFixed(2))}px`;
}

@Component({
  selector: 'z-radius-preview',
  imports: [ZardButtonComponent],
  templateUrl: './radius-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadiusPreviewComponent {
  private readonly clipboard = inject(ThemingClipboardService);
  private readonly document = inject(DOCUMENT);

  /**
   * What one `rem` is worth on this page. `rem` follows the root font size, which
   * the reader can change in the browser settings, so a fixed 16 would label the
   * swatches with sizes they are not drawn at.
   */
  private readonly pxPerRem = signal(DEFAULT_PX_PER_REM);

  readonly presets = RADIUS_PRESETS;

  protected readonly radius = signal<string>(DEFAULT_RADIUS);

  /** Applied to the preview container, so the derived scale recomputes in the browser. */
  readonly scopedStyles = computed(() => `--radius: ${this.radius()}`);

  private readonly radiusPx = computed(() => {
    const value = this.radius();
    const amount = Number.parseFloat(value);

    return value.endsWith('rem') ? amount * this.pxPerRem() : amount;
  });

  /**
   * The four steps resolved against the selected `--radius`.
   *
   * The values used to be frozen at the default, so picking another preset moved
   * the swatches while the numbers kept describing a radius nobody was looking at.
   * `max(0, …)` matches the browser: a negative border-radius clamps to zero.
   */
  readonly steps = computed(() =>
    RADIUS_STEPS.map(step => ({ ...step, resolved: formatPx(Math.max(0, this.radiusPx() + step.offset)) })),
  );

  constructor() {
    afterNextRender(() => {
      const rootFontSize = Number.parseFloat(getComputedStyle(this.document.documentElement).fontSize);
      if (rootFontSize > 0) this.pxPerRem.set(rootFontSize);
    });
  }

  setRadius(value: string): void {
    this.radius.set(value);
  }

  copyRadius(): void {
    this.clipboard.copy(`--radius: ${this.radius()};`);
  }
}
