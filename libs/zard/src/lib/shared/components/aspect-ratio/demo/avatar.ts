import { Component } from '@angular/core';

import { ZardAvatarComponent } from '../../avatar';
import { ZardAspectRatioComponent } from '../aspect-ratio.component';

@Component({
  selector: 'z-demo-aspect-ratio-avatar',
  standalone: true,
  imports: [ZardAspectRatioComponent, ZardAvatarComponent],
  template: `
    <z-aspect-ratio class="w-36 overflow-hidden rounded-full border">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="ZA" class="size-full" />
    </z-aspect-ratio>
  `,
})
export class ZardDemoAspectRatioAvatarComponent {}
