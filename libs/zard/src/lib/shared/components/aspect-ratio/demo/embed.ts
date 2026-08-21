import { Component } from '@angular/core';

import { ZardAspectRatioComponent } from '../aspect-ratio.component';

@Component({
  selector: 'z-demo-aspect-ratio-embed',
  standalone: true,
  imports: [ZardAspectRatioComponent],
  template: `
    <z-aspect-ratio zRatio="4 / 3" class="w-[420px] overflow-hidden rounded-md border">
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="Video embed"
        class="size-full"
        allowfullscreen
      ></iframe>
    </z-aspect-ratio>
  `,
})
export class ZardDemoAspectRatioEmbedComponent {}
