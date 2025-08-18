import { Component, signal } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  standalone: true,
  imports: [ZardSliderComponent],
  template: `
    <div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
      <z-slider [class]="'w-[60%]'" zDefault="50" />
    </div>
  `,
})
export class ZardDemoSliderComponent {}
