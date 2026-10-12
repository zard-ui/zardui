import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBluetooth, lucideTrash2 } from '@ng-icons/lucide';

import { ZardAlertDialogImports } from '@zard/components/alert-dialog/alert-dialog.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDialogImports } from '@zard/components/dialog/dialog.imports';

import { ExampleImports } from './example.component';

/** shadcn/ui's `alert-dialog-example`, in zard. */
@Component({
  selector: 'z-alert-dialog-example',
  imports: [ExampleImports, NgIcon, ZardAlertDialogImports, ZardButtonComponent, ZardDialogImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBluetooth, lucideTrash2 })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic" zClass="items-center">
        <button type="button" z-button zType="outline" (click)="basic.set(true)">Default</button>
        <z-alert-dialog [(zVisible)]="basic">
          <z-alert-dialog-header>
            <z-alert-dialog-title>Are you absolutely sure?</z-alert-dialog-title>
            <z-alert-dialog-description>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
            <button type="button" z-button z-alert-dialog-close>Continue</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-example>

      <z-example zTitle="Small" zClass="items-center">
        <button type="button" z-button zType="outline" (click)="small.set(true)">Small</button>
        <z-alert-dialog zSize="sm" [(zVisible)]="small">
          <z-alert-dialog-header>
            <z-alert-dialog-title>Allow accessory to connect?</z-alert-dialog-title>
            <z-alert-dialog-description>
              Do you want to allow the USB accessory to connect to this device?
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Don't allow</button>
            <button type="button" z-button z-alert-dialog-close>Allow</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-example>

      <z-example zTitle="With Media" zClass="items-center">
        <button type="button" z-button zType="outline" (click)="withMedia.set(true)">Default (Media)</button>
        <z-alert-dialog [(zVisible)]="withMedia">
          <z-alert-dialog-header>
            <z-alert-dialog-media>
              <ng-icon name="lucideBluetooth" />
            </z-alert-dialog-media>
            <z-alert-dialog-title>Are you absolutely sure?</z-alert-dialog-title>
            <z-alert-dialog-description>
              This will permanently delete your account and remove your data from our servers.
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
            <button type="button" z-button z-alert-dialog-close>Continue</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-example>

      <z-example zTitle="Small With Media" zClass="items-center">
        <button type="button" z-button zType="outline" (click)="smallWithMedia.set(true)">Small (Media)</button>
        <z-alert-dialog zSize="sm" [(zVisible)]="smallWithMedia">
          <z-alert-dialog-header>
            <z-alert-dialog-media>
              <ng-icon name="lucideBluetooth" />
            </z-alert-dialog-media>
            <z-alert-dialog-title>Allow accessory to connect?</z-alert-dialog-title>
            <z-alert-dialog-description>
              Do you want to allow the USB accessory to connect to this device?
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Don't allow</button>
            <button type="button" z-button z-alert-dialog-close>Allow</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-example>

      <z-example zTitle="Destructive" zClass="items-center">
        <button type="button" z-button zType="destructive" (click)="destructive.set(true)">Delete Chat</button>
        <z-alert-dialog zSize="sm" [(zVisible)]="destructive">
          <z-alert-dialog-header>
            <z-alert-dialog-media
              class="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
            >
              <ng-icon name="lucideTrash2" />
            </z-alert-dialog-media>
            <z-alert-dialog-title>Delete chat?</z-alert-dialog-title>
            <z-alert-dialog-description>
              This will permanently delete this chat conversation. View
              <a href="#" (click)="$event.preventDefault()">Settings</a>
              delete any memories saved during this chat.
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="ghost" z-alert-dialog-close>Cancel</button>
            <button type="button" z-button zType="destructive" z-alert-dialog-close>Delete</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-example>

      <z-example zTitle="In Dialog" zClass="items-center">
        <button type="button" z-button zType="outline" (click)="dialog.set(true)">Open Dialog</button>
        <z-dialog [(zVisible)]="dialog">
          <z-dialog-header>
            <z-dialog-title>Alert Dialog Example</z-dialog-title>
            <z-dialog-description>Click the button below to open an alert dialog.</z-dialog-description>
          </z-dialog-header>
          <z-dialog-footer>
            <button type="button" z-button (click)="inDialog.set(true)">Open Alert Dialog</button>
            <z-alert-dialog zSize="sm" [(zVisible)]="inDialog">
              <z-alert-dialog-header>
                <z-alert-dialog-title>Are you absolutely sure?</z-alert-dialog-title>
                <z-alert-dialog-description>
                  This action cannot be undone. This will permanently delete your account and remove your data from our
                  servers.
                </z-alert-dialog-description>
              </z-alert-dialog-header>
              <z-alert-dialog-footer>
                <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
                <button type="button" z-button z-alert-dialog-close>Continue</button>
              </z-alert-dialog-footer>
            </z-alert-dialog>
          </z-dialog-footer>
        </z-dialog>
      </z-example>
    </z-example-wrapper>
  `,
})
export class AlertDialogExampleComponent {
  protected readonly basic = signal(false);
  protected readonly small = signal(false);
  protected readonly withMedia = signal(false);
  protected readonly smallWithMedia = signal(false);
  protected readonly destructive = signal(false);
  protected readonly dialog = signal(false);
  protected readonly inDialog = signal(false);
}
