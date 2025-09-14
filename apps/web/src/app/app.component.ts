import { Component, inject, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DarkModeService } from './shared/services/darkmode.service';

@Component({
  imports: [RouterModule],
  selector: 'z-root',
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent implements OnInit {
  private readonly darkmodeService = inject(DarkModeService);

  ngOnInit(): void {
    this.darkmodeService.initTheme();
  }
}
