import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'z-shell',
  template: `
    <main class="flex flex-col">
      <router-outlet></router-outlet>
    </main>
  `,
  standalone: true,
  imports: [RouterModule],
})
export class ShellLayout {}
