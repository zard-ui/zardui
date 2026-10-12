import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardSelectImports } from '@zard/components/select/select.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';

const INVITES = [
  { email: 'alex@example.com', role: 'Editor' },
  { email: 'sam@example.com', role: 'Viewer' },
] as const;

@Component({
  selector: 'z-preview-02-invite-team',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardCardImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardSelectImports,
    ZardSeparatorComponent,
  ],
  viewProviders: [provideIcons({ lucideCopy, lucidePlus })],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Invite Team" />
        <z-card-description zDescription="Add members to your workspace" />
      </z-card-header>
      <z-card-content class="flex flex-col gap-4">
        <div class="flex flex-col gap-3">
          @for (invite of invites; track invite.email) {
            <div class="flex items-center gap-2">
              <input z-input [value]="invite.email" class="flex-1" aria-label="Email" />
              <z-select
                class="w-24"
                [zValue]="invite.role.toLowerCase()"
                zPosition="popper"
                zAlign="end"
                aria-label="Role"
              >
                <z-select-group>
                  <z-select-item zValue="admin">Admin</z-select-item>
                  <z-select-item zValue="editor">Editor</z-select-item>
                  <z-select-item zValue="viewer">Viewer</z-select-item>
                </z-select-group>
              </z-select>
            </div>
          }
        </div>
        <button type="button" z-button zType="outline">
          <ng-icon name="lucidePlus" data-icon="inline-start" />
          Add another
        </button>
        <z-separator />
        <z-field>
          <label z-field-label for="p2-invite-link">Or share invite link</label>
          <z-input-group>
            <input z-input id="p2-invite-link" value="https://app.co/invite/x8f2k" readonly />
            <z-input-group-addon zAlign="inline-end">
              <button type="button" z-input-group-button zSize="icon-xs" aria-label="Copy link">
                <ng-icon name="lucideCopy" />
              </button>
            </z-input-group-addon>
          </z-input-group>
        </z-field>
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button class="w-full">Send Invites</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02InviteTeamComponent {
  protected readonly invites = INVITES;
}
