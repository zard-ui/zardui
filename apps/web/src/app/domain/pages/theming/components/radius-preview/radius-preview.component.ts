import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DEFAULT_RADIUS, RADIUS_STEPS } from '../../data/radius.data';

@Component({
  selector: 'z-radius-preview',
  standalone: true,
  templateUrl: './radius-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadiusPreviewComponent {
  readonly steps = RADIUS_STEPS;
  readonly defaultRadius = DEFAULT_RADIUS;
}
