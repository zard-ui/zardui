import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';

import { DEFAULT_RADIUS, RADIUS_PRESETS, RADIUS_STEPS } from '../../data/radius.data';
import { ThemingClipboardService } from '../../services/theming-clipboard.service';

@Component({
  selector: 'z-radius-preview',
  standalone: true,
  imports: [ZardButtonComponent, ZardCardImports],
  templateUrl: './radius-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadiusPreviewComponent {
  private readonly clipboard = inject(ThemingClipboardService);

  readonly steps = RADIUS_STEPS;
  readonly presets = RADIUS_PRESETS;
  readonly defaultRadius = DEFAULT_RADIUS;

  protected readonly radius = signal<string>(DEFAULT_RADIUS);

  /** Applied to the preview container, so the derived scale recomputes in the browser. */
  readonly scopedStyles = computed(() => `--radius: ${this.radius()}`);

  setRadius(value: string): void {
    this.radius.set(value);
  }

  copyRadius(): void {
    this.clipboard.copy(`--radius: ${this.radius()};`);
  }
}
