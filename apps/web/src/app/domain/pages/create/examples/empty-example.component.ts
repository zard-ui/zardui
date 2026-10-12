import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideCircleDashed, lucideFolder, lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardEmptyComponent } from '@zard/components/empty';
import { ZardInputComponent } from '@zard/components/input';
import { ZardInputGroupImports } from '@zard/components/input-group';
import { ZardKbdComponent } from '@zard/components/kbd';

import { ExampleImports } from './example.component';

/** shadcn/ui's `empty-example`, in zard. */
@Component({
  selector: 'z-empty-example',
  imports: [
    NgIcon,
    ExampleImports,
    ZardButtonComponent,
    ZardEmptyComponent,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardKbdComponent,
  ],
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideCircleDashed, lucideFolder, lucidePlus })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper zClass="grid-cols-1!">
      <z-example zTitle="Basic">
        <z-empty
          zTitle="No projects yet"
          zDescription="You haven't created any projects yet. Get started by creating your first project."
          [zActions]="[projectActions, learnMore]"
        />
      </z-example>

      <z-example zTitle="With Muted Background">
        <z-empty
          class="bg-muted"
          zTitle="No results found"
          zDescription="No results found for your search. Try adjusting your search terms."
          [zActions]="[tryAgain, learnMore]"
        />
      </z-example>

      <z-example zTitle="With Border">
        <z-empty
          class="border"
          zTitle="404 - Not Found"
          zDescription="The page you're looking for doesn't exist. Try searching for what you need below."
          [zActions]="[search, needHelp]"
        />
      </z-example>

      <z-example zTitle="With Icon">
        <z-empty
          class="border"
          zIcon="lucideFolder"
          zTitle="Nothing to see here"
          [zDescription]="noPosts"
          [zActions]="[newPost]"
        />
      </z-example>

      <z-example zTitle="With Muted Background Alt">
        <z-empty
          class="bg-muted/50"
          zTitle="404 - Not Found"
          zDescription="The page you're looking for doesn't exist. Try searching for what you need below."
          [zActions]="[search, needHelp]"
        />
      </z-example>

      <z-example zTitle="In Card">
        <z-empty
          zIcon="lucideFolder"
          zTitle="No projects yet"
          zDescription="You haven't created any projects yet. Get started by creating your first project."
          [zActions]="[projectActions, learnMore]"
        />
      </z-example>
    </z-example-wrapper>

    <ng-template #projectActions>
      <div class="flex gap-2">
        <a z-button href="#" (click)="$event.preventDefault()">Create project</a>
        <button type="button" z-button zType="outline">Import project</button>
      </div>
    </ng-template>

    <ng-template #learnMore>
      <a z-button zType="link" href="#" class="text-muted-foreground" (click)="$event.preventDefault()">
        Learn more
        <ng-icon name="lucideArrowUpRight" />
      </a>
    </ng-template>

    <ng-template #tryAgain>
      <button type="button" z-button>Try again</button>
    </ng-template>

    <ng-template #search>
      <z-input-group class="w-3/4">
        <input z-input placeholder="Try searching for pages..." />
        <z-input-group-addon>
          <ng-icon name="lucideCircleDashed" />
        </z-input-group-addon>
        <z-input-group-addon zAlign="inline-end">
          <z-kbd>/</z-kbd>
        </z-input-group-addon>
      </z-input-group>
    </ng-template>

    <ng-template #needHelp>
      <div data-slot="empty-description" class="cn-empty-description">
        Need help?
        <a href="#" (click)="$event.preventDefault()">Contact support</a>
      </div>
    </ng-template>

    <ng-template #noPosts>
      No posts have been created yet. Get started by
      <a href="#" (click)="$event.preventDefault()">creating your first post</a>
      .
    </ng-template>

    <ng-template #newPost>
      <button type="button" z-button zType="outline">
        <ng-icon name="lucidePlus" data-icon="inline-start" />
        New Post
      </button>
    </ng-template>
  `,
})
export class EmptyExampleComponent {}
