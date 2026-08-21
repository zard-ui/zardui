import { Component } from '@angular/core';

import { ZardAspectRatioComponent } from '../aspect-ratio.component';

@Component({
  selector: 'z-demo-aspect-ratio-image',
  standalone: true,
  imports: [ZardAspectRatioComponent],
  template: `
    <div z-aspect-ratio [zRatio]="16 / 9" class="w-full overflow-hidden rounded-lg md:w-94">
      <img src="/images/placeholder.svg" alt="Cover" class="size-full object-cover" />
    </div>
  `,
})
export class ZardDemoAspectRatioImageComponent {}
