import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCircleAlert } from '@ng-icons/lucide';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';
import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';

import { ExampleImports } from './example.component';

/** shadcn/ui's `alert-example`, in zard. */
@Component({
  selector: 'z-alert-example',
  imports: [ExampleImports, ZardAlertComponent, ZardBadgeComponent, ZardButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleAlert })],
  template: `
    <z-example-wrapper zClass="lg:grid-cols-1">
      <z-example zTitle="Basic" zClass="style-sera:bg-transparent">
        <div class="mx-auto flex w-full max-w-lg flex-col gap-4">
          <z-alert zTitle="Success! Your changes have been saved." />
          <z-alert
            zTitle="Success! Your changes have been saved."
            zDescription="This is an alert with title and description."
          />
          <z-alert zDescription="This one has a description only. No title. No icon." />
        </div>
      </z-example>

      <z-example zTitle="With Icons" zClass="style-sera:bg-transparent">
        <!-- prettier-ignore -->
        <ng-template #titleWithLink>
          Let's try one with icon, title and a
          <a href="#" (click)="$event.preventDefault()">link</a>.
        </ng-template>
        <!-- prettier-ignore -->
        <ng-template #descriptionWithLinks>
          This one has an icon and a description only. No title.
          <a href="#" (click)="$event.preventDefault()">But it has a link</a>
          and a
          <a href="#" (click)="$event.preventDefault()">second link</a>.
        </ng-template>
        <div class="mx-auto flex w-full max-w-lg flex-col gap-4">
          <z-alert zIcon="lucideCircleAlert" [zTitle]="titleWithLink" />
          <z-alert zIcon="lucideCircleAlert" [zDescription]="descriptionWithLinks" />
          <z-alert
            zIcon="lucideCircleAlert"
            zTitle="Success! Your changes have been saved"
            zDescription="This is an alert with icon, title and description."
          />
          <z-alert
            zIcon="lucideCircleAlert"
            zTitle="This is a very long alert title that demonstrates how the component handles extended text content and potentially wraps across multiple lines"
          />
          <z-alert
            zIcon="lucideCircleAlert"
            zDescription="This is a very long alert description that demonstrates how the component handles extended text content and potentially wraps across multiple lines"
          />
          <z-alert
            zIcon="lucideCircleAlert"
            zTitle="This is an extremely long alert title that spans multiple lines to demonstrate how the component handles very lengthy headings while maintaining readability and proper text wrapping behavior"
            zDescription="This is an equally long description that contains detailed information about the alert. It shows how the component can accommodate extensive content while preserving proper spacing, alignment, and readability across different screen sizes and viewport widths. This helps ensure the user experience remains consistent regardless of the content length."
          />
        </div>
      </z-example>

      <z-example zTitle="Destructive" zClass="style-sera:bg-transparent">
        <ng-template #paymentDescription>
          <p>
            Please verify your
            <a href="#" (click)="$event.preventDefault()">billing information</a>
            and try again.
          </p>
          <ul class="list-inside list-disc">
            <li>Check your card details</li>
            <li>Ensure sufficient funds</li>
            <li>Verify billing address</li>
          </ul>
        </ng-template>
        <div class="mx-auto flex w-full max-w-lg flex-col gap-4">
          <z-alert
            zType="destructive"
            zIcon="lucideCircleAlert"
            zTitle="Something went wrong!"
            zDescription="Your session has expired. Please log in again."
          />
          <z-alert
            zType="destructive"
            zIcon="lucideCircleAlert"
            zTitle="Unable to process your payment."
            [zDescription]="paymentDescription"
          />
        </div>
      </z-example>

      <z-example zTitle="With Actions" zClass="style-sera:bg-transparent">
        <ng-template #undoAction>
          <button type="button" z-button zSize="xs">Undo</button>
        </ng-template>
        <ng-template #badgeAction>
          <z-badge zType="secondary">Badge</z-badge>
        </ng-template>
        <div class="mx-auto flex w-full max-w-lg flex-col gap-4">
          <z-alert
            zIcon="lucideCircleAlert"
            zTitle="The selected emails have been marked as spam."
            [zAction]="undoAction"
          />
          <z-alert
            zIcon="lucideCircleAlert"
            zTitle="The selected emails have been marked as spam."
            zDescription="This is a very long alert title that demonstrates how the component handles extended text content."
            [zAction]="badgeAction"
          />
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class AlertExampleComponent {}
