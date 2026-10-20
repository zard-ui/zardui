```angular-ts title="src/app/my-overlay.directive.ts" showLineNumbers {1,6,9}
import { Directionality } from '@angular/cdk/bidi';
import { Directive, inject } from '@angular/core';

@Directive({ selector: '[appMyOverlay]' })
export class MyOverlayDirective {
  private readonly directionality = inject(Directionality, { optional: true });

  open(): void {
    const direction = this.directionality?.value ?? 'ltr';
    // overlay.create({ positionStrategy, direction, ... })
  }
}
```
