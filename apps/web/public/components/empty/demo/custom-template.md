```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  standalone: true,
  imports: [ZardEmptyComponent],
  template: `
    <z-empty [zImage]="customEmpty"></z-empty>

    <ng-template #customEmpty>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 80" class="w-full h-auto" fill="none">
        <g transform="scale(3, 3)">
          <path class="fill-blue-300" d="M43.396 12.098L33.825.906a2.434 2.434 0 0 0-1.837-.86h-20.58c-.706 0-1.377.324-1.837.86L0 12.098v6.144h43.396v-6.144z" />
          <path class="fill-blue-200" d="M40.684 18.468L32.307 8.72a2.136 2.136 0 0 0-1.622-.725H12.711c-.617 0-1.22.256-1.622.725l-8.377 9.748v5.354h37.972v-5.354z" />
          <path
            class="fill-blue-100"
            d="M43.396 25.283c0 .853-.384 1.62-.99 2.134l-.123.1a2.758 2.758 0 0 1-1.67.56H2.784c-.342 0-.669-.062-.971-.176l-.15-.06A2.802 2.802 0 0 1 0 25.282V12.165h10.529c1.163 0 2.1.957 2.1 2.118v.015c0 1.162.948 2.099 2.111 2.099h13.916a2.113 2.113 0 0 0 2.111-2.107c0-1.166.938-2.125 2.1-2.125h10.53z"
          />
        </g>
      </svg>
    </ng-template>
  `,
})
export class ZardDemoEmptyCustomTemplateComponent {}

```