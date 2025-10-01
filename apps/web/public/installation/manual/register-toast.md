```angular-ts title="app.component.ts'" copyButton showLineNumbers
import { Component } from '@angular/core';
import { ZardToastComponent } from '@zard/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ZardToastComponent],
  template: `
    <router-outlet></router-outlet>
    <z-toaster />
  `,
})
export class AppComponent {}
```
