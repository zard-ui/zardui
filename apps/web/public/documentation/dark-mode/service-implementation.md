```typescript title="dark-mode.page.ts" expandable="true" copyButton
import { ZardDarkMode } from '@zard/services/dark-mode';

@Component({
  selector: '...',
  template: '',
})
export class DarkModePage {
  protected readonly darkModeService = inject(ZardDarkMode);

  // ...
}
```
