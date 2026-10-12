import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';

import { ExampleImports } from './example.component';

/** shadcn/ui's `breadcrumb-example`, in zard. */
@Component({
  selector: 'z-breadcrumb-example',
  imports: [ExampleImports, ZardBreadcrumbImports, ZardButtonComponent, ZardDropdownImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic" zClass="items-center justify-center">
        <z-breadcrumb>
          <z-breadcrumb-item>
            <a z-breadcrumb-link href="#">Home</a>
          </z-breadcrumb-item>
          <z-breadcrumb-separator />
          <z-breadcrumb-item>
            <a z-breadcrumb-link href="#">Components</a>
          </z-breadcrumb-item>
          <z-breadcrumb-separator />
          <z-breadcrumb-item>
            <span z-breadcrumb-page>Breadcrumb</span>
          </z-breadcrumb-item>
        </z-breadcrumb>
      </z-example>

      <z-example zTitle="With Dropdown" zClass="items-center justify-center">
        <z-breadcrumb>
          <z-breadcrumb-item>
            <a z-breadcrumb-link href="#">Home</a>
          </z-breadcrumb-item>
          <z-breadcrumb-separator />
          <z-breadcrumb-item>
            <button type="button" z-button zSize="icon-sm" zType="ghost" z-dropdown [zDropdownMenu]="menu">
              <z-breadcrumb-ellipsis zLabel="" />
              <span class="sr-only">Toggle menu</span>
            </button>
            <z-dropdown-menu-content #menu="zDropdownMenuContent" zAlign="start">
              <z-dropdown-menu-item>Documentation</z-dropdown-menu-item>
              <z-dropdown-menu-item>Themes</z-dropdown-menu-item>
              <z-dropdown-menu-item>GitHub</z-dropdown-menu-item>
            </z-dropdown-menu-content>
          </z-breadcrumb-item>
          <z-breadcrumb-separator />
          <z-breadcrumb-item>
            <a z-breadcrumb-link href="#">Components</a>
          </z-breadcrumb-item>
          <z-breadcrumb-separator />
          <z-breadcrumb-item>
            <span z-breadcrumb-page>Breadcrumb</span>
          </z-breadcrumb-item>
        </z-breadcrumb>
      </z-example>

      <z-example zTitle="With Link" zClass="items-center justify-center">
        <z-breadcrumb>
          <z-breadcrumb-item>
            <a z-breadcrumb-link href="#">Home</a>
          </z-breadcrumb-item>
          <z-breadcrumb-separator />
          <z-breadcrumb-item>
            <z-breadcrumb-ellipsis />
          </z-breadcrumb-item>
          <z-breadcrumb-separator />
          <z-breadcrumb-item>
            <a z-breadcrumb-link href="#">Components</a>
          </z-breadcrumb-item>
          <z-breadcrumb-separator />
          <z-breadcrumb-item>
            <span z-breadcrumb-page>Breadcrumb</span>
          </z-breadcrumb-item>
        </z-breadcrumb>
      </z-example>
    </z-example-wrapper>
  `,
})
export class BreadcrumbExampleComponent {}
