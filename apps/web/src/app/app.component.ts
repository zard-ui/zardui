import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}
