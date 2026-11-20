---
title: March 2025 - Initial Release
description: 🎉 Initial release of ZardUI! An Angular component library built with TailwindCSS v4, featuring standalone components, signal-based reactivity, and modern Angular architecture. Core components including Button, Card, Badge, Alert, and Table.
---

# March 2025 - Initial Release

🎉 Initial release of ZardUI! An Angular component library built with TailwindCSS v4, featuring standalone components, signal-based reactivity, and modern Angular architecture. Core components including Button, Card, Badge, Alert, and Table.

## New Components

### [Button](/docs/components/button)

Versatile button component with multiple variants (primary, secondary, outline, ghost), sizes, and loading states.

```
npx zard-cli@latest add button
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-default',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button>Button</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonDefaultComponent {}
```

### [Card](/docs/components/card)

Container component for grouping related content with optional header, footer, and customizable padding.

```
npx zard-cli@latest add card
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-card-preview',
  imports: [ZardCardImports, ZardButtonComponent, ...ZardFieldImports, ZardInputComponent],
  template: `
    <z-card class="w-full md:w-94">
      <z-card-header>
        <z-card-title zTitle="Login to your account" />
        <z-card-description zDescription="Enter your email below to login to your account" />
        <z-card-action>
          <a z-button zType="link" href="#">Sign up</a>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="card-login-email">Email</label>
            <input z-input id="card-login-email" type="email" placeholder="m@example.com" required />
          </div>
          <div z-field>
            <div class="flex items-center">
              <label z-field-label for="card-login-password">Password</label>
              <a href="#" class="ms-auto text-sm underline-offset-4 hover:underline">Forgot your password?</a>
            </div>
            <input z-input id="card-login-password" type="password" required />
          </div>
        </div>
      </z-card-content>
      <z-card-footer class="flex-col gap-2">
        <z-button class="w-full">Login</z-button>
        <z-button zType="outline" class="w-full">Login with Google</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardPreviewComponent {}
```

### [Badge](/docs/components/badge)

Small label component for displaying status, categories, counts, or tags with various color variants.

```
npx zard-cli@latest add badge
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-variants',
  imports: [ZardBadgeComponent],
  template: `
    <div class="flex flex-col items-center gap-2">
      <div class="flex w-full flex-wrap gap-2">
        <z-badge>Badge</z-badge>
        <z-badge zType="secondary">Secondary</z-badge>
        <z-badge zType="destructive">Destructive</z-badge>
        <z-badge zType="outline">Outline</z-badge>
        <z-badge zType="ghost">Ghost</z-badge>
        <z-badge zType="link">Link</z-badge>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBadgeVariantsComponent {}
```

### [Alert](/docs/components/alert)

Notification component for displaying important information to users with different severity levels.

```
npx zard-cli@latest add alert
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideInfo } from '@ng-icons/lucide';

import { ZardAlertComponent } from '@/shared/components/alert/alert.component';

@Component({
  selector: 'z-demo-alert-basic',
  imports: [ZardAlertComponent],
  template: `
    <div class="grid w-full max-w-md items-start gap-4">
      <z-alert
        zIcon="lucideCircleCheck"
        zTitle="Payment successful"
        zDescription="Your payment of $29.99 has been processed. A receipt has been sent to your email address."
      />

      <z-alert
        zIcon="lucideInfo"
        zTitle="New feature available"
        zDescription="We've added dark mode support. You can enable it in your account settings."
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleCheck, lucideInfo })],
})
export class ZardDemoAlertBasicComponent {}
```

### [Table](/docs/components/table)

Data table component with sorting, filtering, pagination, and customizable column rendering.

```
npx zard-cli@latest add table
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTableImports } from '@/shared/components/table/table.imports';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'z-demo-table-simple',
  imports: [ZardTableImports],
  template: `
    <table z-table>
      <caption z-table-caption>A list of registered users.</caption>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head scope="col">Name</th>
          <th z-table-head scope="col">Age</th>
          <th z-table-head scope="col">Address</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (data of listOfData; track data.key) {
          <tr z-table-row>
            <td z-table-cell class="font-medium">{{ data.name }}</td>
            <td z-table-cell>{{ data.age }}</td>
            <td z-table-cell>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full overflow-x-auto',
  },
})
export class ZardDemoTableSimpleComponent {
  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];
}
```
