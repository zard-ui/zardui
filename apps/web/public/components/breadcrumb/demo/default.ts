import { Component } from '@angular/core';
import { ZardBreadcrumbModule } from '../breadcrumb.module';

@Component({
  standalone: true,
  imports: [ZardBreadcrumbModule],
  template: `
    <z-breadcrumb>
      <z-breadcrumb-item>Home</z-breadcrumb-item>
      <z-breadcrumb-item>User</z-breadcrumb-item>
      <z-breadcrumb-item>Profile</z-breadcrumb-item>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbComponent {}
