```css title="src/app/app.config.ts" expandable="true" copyButton
import { ApplicationConfig } from '@angular/core';

import { provideZard } from '@shared/components/core/provider/providezard';

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideZard(),
  ]
};
```
