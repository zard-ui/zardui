import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAspectRatioComponent } from '../aspect-ratio.component';

@Component({
  selector: 'z-demo-aspect-ratio-preview',
  imports: [ZardAspectRatioComponent, NgOptimizedImage],
  template: `
    <z-aspect-ratio [zRatio]="16 / 9" class="bg-muted w-full max-w-sm rounded-lg">
      <img
        ngSrc="https://avatar.vercel.sh/shadcn1"
        alt="Photo"
        fill
        priority
        class="rounded-lg object-cover grayscale dark:brightness-20"
      />
    </z-aspect-ratio>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoAspectRatioPreviewComponent {}
