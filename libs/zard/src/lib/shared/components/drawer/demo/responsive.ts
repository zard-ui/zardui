import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDialogService } from '@/shared/components/dialog';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import { ZardInputComponent } from '@/shared/components/input';

import { injectIsMobile } from './is-mobile';

@Component({
  selector: 'zard-demo-drawer-profile-form',
  imports: [ZardButtonComponent, ZardInputComponent],
  template: `
    <form class="grid items-start gap-6" (submit)="$event.preventDefault()">
      <div class="grid gap-3">
        <label for="drawer-demo-email" class="text-sm leading-none font-medium select-none">Email</label>
        <input z-input id="drawer-demo-email" type="email" value="shadcn@example.com" />
      </div>

      <div class="grid gap-3">
        <label for="drawer-demo-username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="drawer-demo-username" value="@shadcn" />
      </div>

      <button type="submit" z-button>Save changes</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerProfileFormComponent {}

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports, ZardDemoDrawerProfileFormComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Edit Profile</button>

    <z-drawer [(zVisible)]="visible">
      <z-drawer-header>
        <z-drawer-title>Edit profile</z-drawer-title>
        <z-drawer-description>Make changes to your profile here. Click save when you're done.</z-drawer-description>
      </z-drawer-header>

      <div class="p-4">
        <zard-demo-drawer-profile-form />
      </div>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerResponsiveComponent {
  private readonly dialogService = inject(ZardDialogService);
  private readonly isMobile = injectIsMobile();

  readonly visible = signal(false);

  /** Same content, two surfaces: a dialog where there is room, a drawer where there is not. */
  open() {
    if (this.isMobile()) {
      this.visible.set(true);
      return;
    }

    this.dialogService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoDrawerProfileFormComponent,
      zOkText: null,
      zCancelText: null,
    });
  }
}
