import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'z-examples-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `
    <div class="container-wrapper">
      <div class="container py-6">
        <router-outlet />
      </div>
    </div>
  `,
})
export class ExamplesPage {}
