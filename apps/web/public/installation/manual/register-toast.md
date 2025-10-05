```angular-ts title="app.component.ts'" copyButton showLineNumbers
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZardToastComponent } from '@shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ZardToastComponent],
  template: `
    <router-outlet></router-outlet>
    <z-toaster />
  `,
})
export class AppComponent {}
```
