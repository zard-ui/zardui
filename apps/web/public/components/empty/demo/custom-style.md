```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  standalone: true,
  imports: [ZardEmptyComponent],
  template: `
    <z-empty
      [zImageStyle]="{
        borderRadius: '12px',
        backgroundColor: '#fdfdfd',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        padding: '16px',
      }"
    />
  `,
})
export class ZardDemoEmptyCustomStyleComponent {}

```