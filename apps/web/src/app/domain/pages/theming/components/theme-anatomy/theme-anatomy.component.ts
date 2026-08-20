import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ANATOMY_PARTS } from '../../data/anatomy.data';
import { InlineCodePipe } from '../../pipes/inline-code.pipe';

@Component({
  selector: 'z-theme-anatomy',
  imports: [InlineCodePipe],
  templateUrl: './theme-anatomy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeAnatomyComponent {
  readonly parts = ANATOMY_PARTS;
}
