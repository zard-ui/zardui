```angular-ts title="src/app/arabic-section.component.ts" showLineNumbers {1,9,11}
import { Dir } from '@angular/cdk/bidi';
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'app-arabic-section',
  imports: [Dir, ZardPopoverImports, ZardButtonComponent],
  template: `
    <section dir="rtl" lang="ar">
      <button z-button zPopover [zContent]="content">فتح</button>

      <ng-template #content>
        <z-popover>مرحبا بالعالم</z-popover>
      </ng-template>
    </section>
  `,
})
export class ArabicSectionComponent {}
```
