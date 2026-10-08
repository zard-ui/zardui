import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAspectRatioComponent } from '../aspect-ratio.component';

@Component({
  selector: 'z-demo-aspect-ratio-rtl',
  imports: [ZardAspectRatioComponent, NgOptimizedImage],
  template: `
    <figure class="w-full max-w-sm" dir="rtl">
      <z-aspect-ratio [zRatio]="16 / 9" class="bg-muted rounded-lg">
        <img
          ngSrc="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          class="rounded-lg object-cover grayscale dark:brightness-20"
        />
      </z-aspect-ratio>
      <figcaption class="text-muted-foreground mt-2 text-center text-sm">منظر طبيعي جميل</figcaption>
    </figure>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoAspectRatioRtlComponent {}
