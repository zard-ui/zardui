---
title: April 2025 - Input and the CLI
description: Form foundations and CLI launch! New Input and Form components with validation support. Official CLI tool released for easy project initialization and component installation. The Form component has since been discontinued — use Field instead, which covers the same ground and is what the form guides are built on.
---

# April 2025 - Input and the CLI

Form foundations and CLI launch! New Input and Form components with validation support. Official CLI tool released for easy project initialization and component installation. The Form component has since been discontinued — use Field instead, which covers the same ground and is what the form guides are built on.

## New Components

### [Input](/docs/components/input)

Text input field component with multiple variants, sizes, and built-in validation state indicators.

```
npx zard-cli@latest add input
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-preview',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="input-demo-api-key">API Key</label>
      <input z-input id="input-demo-api-key" type="password" placeholder="sk-..." />
      <p z-field-description>Your API key is encrypted and stored securely.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputPreviewComponent {}
```
