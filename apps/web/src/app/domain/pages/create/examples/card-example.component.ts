import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCaptions, lucidePlus } from '@ng-icons/lucide';

import { ZardAvatarImports } from '@zard/components/avatar';
import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';
import { ZardToggleGroupComponent, type ZardToggleGroupItem } from '@zard/components/toggle-group';

import { ExampleImports } from './example.component';

const SPACING_OPTIONS = [
  { className: '[--card-spacing:--spacing(4)]', label: '16px', value: '4' },
  { className: '[--card-spacing:--spacing(5)]', label: '20px', value: '5' },
  { className: '[--card-spacing:--spacing(6)]', label: '24px', value: '6' },
  { className: '[--card-spacing:--spacing(8)]', label: '32px', value: '8' },
] as const;

const SPACING_ITEMS: ZardToggleGroupItem[] = SPACING_OPTIONS.map(({ value, label }) => ({ value, label }));

const IMAGE_URL =
  'https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

/** shadcn/ui's `card-example`, in zard. */
@Component({
  selector: 'z-card-example',
  imports: [
    NgIcon,
    ExampleImports,
    ZardAvatarImports,
    ZardButtonComponent,
    ZardCardImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardToggleGroupComponent,
  ],
  viewProviders: [provideIcons({ lucideCaptions, lucidePlus })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Default Size">
        <z-card zSize="default" class="mx-auto w-full max-w-sm">
          <z-card-header>
            <z-card-title zTitle="Default Card" />
            <z-card-description zDescription="This card uses the default size variant." />
          </z-card-header>
          <z-card-content>
            <p>The card component supports a size prop that defaults to "default" for standard spacing and sizing.</p>
          </z-card-content>
          <z-card-footer>
            <button type="button" z-button zType="outline" class="w-full">Action</button>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Small Size">
        <z-card zSize="sm" class="mx-auto w-full max-w-sm">
          <z-card-header>
            <z-card-title zTitle="Small Card" />
            <z-card-description zDescription="This card uses the small size variant." />
          </z-card-header>
          <z-card-content>
            <p>The card component supports a size prop that can be set to "sm" for a more compact appearance.</p>
          </z-card-content>
          <z-card-footer>
            <button type="button" z-button zType="outline" zSize="sm" class="w-full">Action</button>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Content Edge to Edge">
        <z-card class="mx-auto w-full max-w-sm">
          <z-card-header>
            <z-card-title zTitle="Terms of Service" />
            <z-card-description zDescription="Review the terms before accepting the agreement." />
          </z-card-header>
          <z-card-content class="-mb-(--card-spacing) px-0">
            <div
              class="bg-muted/50 max-h-48 space-y-4 overflow-y-scroll border-t px-(--card-spacing) py-4 text-sm leading-relaxed"
            >
              <p>
                These terms govern your use of the workspace, including access to shared documents, project files, and
                collaboration tools.
              </p>
              <p>
                You are responsible for the content you upload and for ensuring that your team has the appropriate
                permissions to view or edit it.
              </p>
              <p>
                We may update features or limits as the service evolves. When those changes materially affect your
                workflow, we will notify your workspace administrators.
              </p>
              <p>
                By continuing, you agree to keep your account credentials secure and to follow your organization's
                acceptable use policies.
              </p>
            </div>
          </z-card-content>
          <z-card-footer class="justify-end gap-2">
            <button type="button" z-button zType="outline">Decline</button>
            <button type="button" z-button>Accept</button>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Custom Spacing">
        <div class="mx-auto grid w-full max-w-sm gap-4">
          <z-toggle-group
            zMode="single"
            zType="outline"
            zSize="sm"
            class="justify-center"
            [zItems]="spacingItems"
            [zValue]="spacing()"
            (valueChange)="onSpacingChange($event)"
          />
          <z-card [class]="selectedSpacing()">
            <z-card-header>
              <z-card-title zTitle="Release Health" />
              <z-card-description zDescription="Track readiness across launch signals." />
            </z-card-header>
            <z-card-content>
              <div
                class="bg-muted/50 style-lyra:rounded-none style-sera:rounded-none grid gap-2 rounded-lg p-3 text-sm"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="text-muted-foreground">Checks passed</span>
                  <span class="font-medium">24 / 26</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <span class="text-muted-foreground">Open blockers</span>
                  <span class="font-medium">2</span>
                </div>
              </div>
            </z-card-content>
          </z-card>
        </div>
      </z-example>

      <z-example zTitle="Header with Border">
        <z-card class="mx-auto w-full max-w-sm">
          <z-card-header class="border-b">
            <z-card-title zTitle="Header with Border" />
            <z-card-description zDescription="This is a card with a header that has a bottom border." />
          </z-card-header>
          <z-card-content>
            <p>
              The header has a border-b class applied, creating a visual separation between the header and content
              sections.
            </p>
          </z-card-content>
        </z-card>
      </z-example>

      <z-example zTitle="Footer with Border">
        <z-card class="mx-auto w-full max-w-sm">
          <z-card-content>
            <p>
              The footer has a border-t class applied, creating a visual separation between the content and footer
              sections.
            </p>
          </z-card-content>
          <z-card-footer class="border-t">
            <button type="button" z-button zType="outline" class="w-full">Footer with Border</button>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Header with Border (Small)">
        <z-card zSize="sm" class="mx-auto w-full max-w-sm">
          <z-card-header class="border-b">
            <z-card-title zTitle="Header with Border" />
            <z-card-description zDescription="This is a small card with a header that has a bottom border." />
          </z-card-header>
          <z-card-content>
            <p>
              The header has a border-b class applied, creating a visual separation between the header and content
              sections.
            </p>
          </z-card-content>
        </z-card>
      </z-example>

      <z-example zTitle="Footer with Border (Small)">
        <z-card zSize="sm" class="mx-auto w-full max-w-sm">
          <z-card-content>
            <p>
              The footer has a border-t class applied, creating a visual separation between the content and footer
              sections.
            </p>
          </z-card-content>
          <z-card-footer class="border-t">
            <button type="button" z-button zType="outline" zSize="sm" class="w-full">Footer with Border</button>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="With Image">
        <z-card zSize="default" class="relative mx-auto w-full max-w-sm pt-0">
          <div class="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color"></div>
          <img
            [src]="imageUrl"
            alt="Photo by mymind on Unsplash"
            title="Photo by mymind on Unsplash"
            class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
          />
          <z-card-header>
            <z-card-title zTitle="Beautiful Landscape" />
            <z-card-description zDescription="A stunning view that captures the essence of natural beauty." />
          </z-card-header>
          <z-card-footer>
            <button type="button" z-button class="w-full">
              <ng-icon name="lucidePlus" data-icon="inline-start" />
              Button
            </button>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="With Image (Small)">
        <z-card zSize="sm" class="relative mx-auto w-full max-w-sm pt-0">
          <div class="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color"></div>
          <img
            [src]="imageUrl"
            alt="Photo by mymind on Unsplash"
            title="Photo by mymind on Unsplash"
            class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
          />
          <z-card-header>
            <z-card-title zTitle="Beautiful Landscape" />
            <z-card-description zDescription="A stunning view that captures the essence of natural beauty." />
          </z-card-header>
          <z-card-footer>
            <button type="button" z-button zSize="sm" class="w-full">
              <ng-icon name="lucidePlus" data-icon="inline-start" />
              Button
            </button>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Login">
        <z-card class="mx-auto w-full max-w-sm">
          <z-card-header>
            <z-card-title zTitle="Login to your account" />
            <z-card-description zDescription="Enter your email below to login to your account" />
          </z-card-header>
          <z-card-content>
            <form (submit)="$event.preventDefault()">
              <div z-field-group>
                <div z-field>
                  <label z-field-label for="email">Email</label>
                  <input z-input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div z-field>
                  <div class="flex items-center">
                    <label z-field-label for="password">Password</label>
                    <a href="#" class="ml-auto inline-block underline-offset-4 hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                  <input z-input id="password" type="password" required />
                </div>
              </div>
            </form>
          </z-card-content>
          <z-card-footer class="flex-col gap-2">
            <button type="submit" z-button class="w-full">Login</button>
            <button type="button" z-button zType="outline" class="w-full">Login with Google</button>
            <div class="style-nova:mt-2 mt-4 text-center">
              Don't have an account?
              <a href="#" class="underline underline-offset-4">Sign up</a>
            </div>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Meeting Notes">
        <z-card class="mx-auto w-full max-w-sm">
          <z-card-header>
            <z-card-title zTitle="Meeting Notes" />
            <z-card-description zDescription="Transcript from the meeting with the client." />
            <z-card-action>
              <button type="button" z-button zType="outline" zSize="sm">
                <ng-icon name="lucideCaptions" data-icon="inline-start" />
                Transcribe
              </button>
            </z-card-action>
          </z-card-header>
          <z-card-content>
            <p>Client requested dashboard redesign with focus on mobile responsiveness.</p>
            <ol class="mt-4 flex list-decimal flex-col gap-2 pl-6">
              <li>New analytics widgets for daily/weekly metrics</li>
              <li>Simplified navigation menu</li>
              <li>Dark mode support</li>
              <li>Timeline: 6 weeks</li>
              <li>Follow-up meeting scheduled for next Tuesday</li>
            </ol>
          </z-card-content>
          <z-card-footer>
            <z-avatar-group>
              <z-avatar zSrc="https://github.com/shadcn.png" zAlt="@shadcn" zFallback="CN" />
              <z-avatar zSrc="https://github.com/maxleiter.png" zAlt="@maxleiter" zFallback="LR" />
              <z-avatar zSrc="https://github.com/evilrabbit.png" zAlt="@evilrabbit" zFallback="ER" />
              <z-avatar-group-count [zCount]="8" />
            </z-avatar-group>
          </z-card-footer>
        </z-card>
      </z-example>
    </z-example-wrapper>
  `,
})
export class CardExampleComponent {
  protected readonly imageUrl = IMAGE_URL;
  protected readonly spacingItems = SPACING_ITEMS;
  protected readonly spacing = signal('4');
  protected readonly selectedSpacing = computed(
    () => SPACING_OPTIONS.find(option => option.value === this.spacing())?.className ?? '',
  );

  protected onSpacingChange(value: string | string[]): void {
    const next = Array.isArray(value) ? value[0] : value;
    if (next) {
      this.spacing.set(next);
    }
  }
}
