import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardEmptyComponent } from '@zard/components/empty';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group';
import { ZardSpinnerComponent } from '@zard/components/spinner';

import { ExampleImports } from './example.component';

/** shadcn/ui's `spinner-example`, in zard. */
@Component({
  selector: 'z-spinner-example',
  imports: [
    ExampleImports,
    NgIcon,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardEmptyComponent,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowRight })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <div class="flex items-center gap-6">
          <z-spinner />
          <z-spinner class="size-6" />
        </div>
      </z-example>

      <z-example zTitle="In Buttons">
        <div class="flex flex-wrap items-center gap-4">
          <button type="button" z-button>
            <z-spinner data-icon="inline-start" />
            Submit
          </button>
          <button type="button" z-button zDisabled>
            <z-spinner data-icon="inline-start" />
            Disabled
          </button>
          <button type="button" z-button zType="outline" zDisabled>
            <z-spinner data-icon="inline-start" />
            Outline
          </button>
          <button type="button" z-button zType="outline" zSize="icon" zDisabled>
            <z-spinner data-icon="inline-start" />
            <span class="sr-only">Loading...</span>
          </button>
        </div>
      </z-example>

      <z-example zTitle="In Badges" zClass="items-center justify-center">
        <div class="flex flex-wrap items-center justify-center gap-4">
          <z-badge>
            <z-spinner data-icon="inline-start" />
            Badge
          </z-badge>
          <z-badge zType="secondary">
            <z-spinner data-icon="inline-start" />
            Badge
          </z-badge>
          <z-badge zType="destructive">
            <z-spinner data-icon="inline-start" />
            Badge
          </z-badge>
          <z-badge zType="outline">
            <z-spinner data-icon="inline-start" />
            Badge
          </z-badge>
        </div>
      </z-example>

      <z-example zTitle="In Input Group">
        <div z-field>
          <label z-field-label for="input-group-spinner">Input Group</label>
          <z-input-group>
            <input z-input id="input-group-spinner" />
            <z-input-group-addon>
              <z-spinner />
            </z-input-group-addon>
          </z-input-group>
        </div>
      </z-example>

      <z-example zTitle="In Empty State" zContainerClass="lg:col-span-full">
        <z-empty
          class="min-h-[300px]"
          [zImage]="spinnerMedia"
          zTitle="No projects yet"
          zDescription="You haven't created any projects yet. Get started by creating your first project."
          [zActions]="[emptyActions]"
        />
      </z-example>
    </z-example-wrapper>

    <ng-template #spinnerMedia>
      <!-- zard's empty has no icon media slot for arbitrary content: this is the box shadcn's EmptyMedia draws. -->
      <div data-slot="empty-icon" data-variant="icon" class="cn-empty-icon">
        <z-spinner />
      </div>
    </ng-template>

    <ng-template #emptyActions>
      <div class="flex gap-2">
        <a z-button href="#">Create project</a>
        <button type="button" z-button zType="outline">Import project</button>
      </div>
      <a z-button zType="link" href="#" class="text-muted-foreground">
        Learn more
        <ng-icon name="lucideArrowRight" />
      </a>
    </ng-template>
  `,
})
export class SpinnerExampleComponent {}
