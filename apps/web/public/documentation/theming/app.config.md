# Application config

The `provideZard()` provider registration. The import path follows the `core` alias in
`components.json` (default `@/shared/core`) — see `packages/cli/src/commands/init/update-angular-config.ts`.

```typescript title="src/app/app.config.ts" copyButton expandable="true"
import { ApplicationConfig } from '@angular/core';

import { provideZard } from '@/shared/core/provider/providezard';

export const appConfig: ApplicationConfig = {
  providers: [provideZard()],
};
```
