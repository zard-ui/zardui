# A theme per route

Put the override class on a layout component's host. Everything rendered through its
`<router-outlet />` inherits the tokens.

```typescript title="src/app/marketing/marketing.layout.ts" copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-marketing-layout',
  imports: [RouterOutlet],
  // The class carries the token overrides declared in src/styles.css.
  host: { class: 'theme-brand' },
  template: `<router-outlet />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingLayout {}
```

```typescript title="src/app/app.routes.ts" copyButton
import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'marketing',
    loadComponent: () => import('./marketing/marketing.layout').then(m => m.MarketingLayout),
    children: [{ path: '', loadComponent: () => import('./marketing/home.page').then(m => m.HomePage) }],
  },
];
```
