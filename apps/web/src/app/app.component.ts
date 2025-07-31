import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'z-root',
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {}
