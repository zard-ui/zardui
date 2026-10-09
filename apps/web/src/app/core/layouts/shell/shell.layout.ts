import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'z-shell',
  template: `
    <main class="flex flex-col">
      <router-outlet></router-outlet>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule],
})
export class ShellLayout {}
