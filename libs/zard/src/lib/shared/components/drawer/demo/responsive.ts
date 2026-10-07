import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import { ZardDrawerService } from '@/shared/components/drawer/drawer.service';
import { ZardInputComponent } from '@/shared/components/input';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

import { injectIsMobile } from './support/is-mobile';

@Component({
  selector: 'z-demo-drawer-profile-form',
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

/** Same content, two surfaces: a dialog where there is room, a drawer where there is not. */
@Component({
  selector: 'z-demo-drawer-responsive',
  imports: [
    ZardButtonComponent,
    ZardDialogImports,
    ZardDrawerImports,
    ZardTabsImports,
    ZardDemoDrawerProfileFormComponent,
  ],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Edit Profile</button>

        @if (isMobile()) {
          <z-drawer [(zVisible)]="visible">
            <z-drawer-header>
              <z-drawer-title>Edit profile</z-drawer-title>
              <z-drawer-description>
                Make changes to your profile here. Click save when you're done.
              </z-drawer-description>
            </z-drawer-header>
            <div class="p-4">
              <z-demo-drawer-profile-form />
            </div>
          </z-drawer>
        } @else {
          <z-dialog [(zVisible)]="visible">
            <z-dialog-header>
              <z-dialog-title>Edit profile</z-dialog-title>
              <z-dialog-description>
                Make changes to your profile here. Click save when you're done.
              </z-dialog-description>
            </z-dialog-header>
            <z-demo-drawer-profile-form />
          </z-dialog>
        }
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">Edit Profile</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerResponsiveComponent {
  private readonly dialogService = inject(ZardDialogService);
  private readonly drawerService = inject(ZardDrawerService);
  private readonly isMobileViewport = injectIsMobile();

  readonly visible = signal(false);
  readonly isMobile = this.isMobileViewport;

  open() {
    if (this.isMobile()) {
      this.drawerService.create({
        zTitle: 'Edit profile',
        zDescription: `Make changes to your profile here. Click save when you're done.`,
        zContent: ZardDemoDrawerProfileFormComponent,
        zHideFooter: true,
      });
      return;
    }

    this.dialogService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoDrawerProfileFormComponent,
      zHideFooter: true,
    });
  }
}
