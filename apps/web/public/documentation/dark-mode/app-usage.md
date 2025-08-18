# Usage in App Component

The service is initialized in the root component of the application to ensure the theme is applied as soon as the application loads.

```typescript
// app.component.ts
import { Component, inject, OnInit } from '@angular/core';
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
```
