# Application config

The `provideZard()` provider registration.

```css title="src/app/app.config.ts" copyButton expandable="true"
import { ApplicationConfig } from '@angular/core';

import { provideZard } from '@/shared/components/core/provider/providezard';

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideZard(),
  ]
};
```
