```typescript title="appearance.page.ts" expandable="true" copyButton
import { ZardAppearance } from '@zard/components/core/services/appearance';

@Component({
  selector: '...',
  template: '',
})
export class AppearancePage {
  protected readonly appearanceService = inject(ZardAppearance);

  // ...
}
```
