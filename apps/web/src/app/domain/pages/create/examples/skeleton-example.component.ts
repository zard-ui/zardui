import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card';
import { ZardSkeletonComponent } from '@zard/components/skeleton';

import { ExampleImports } from './example.component';

/** shadcn/ui's `skeleton-example`, in zard. */
@Component({
  selector: 'z-skeleton-example',
  imports: [ExampleImports, ZardCardImports, ZardSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Avatar">
        <div class="flex w-full items-center gap-4">
          <z-skeleton class="size-10 shrink-0 rounded-full" />
          <div class="grid gap-2">
            <z-skeleton class="h-4 w-[150px]" />
            <z-skeleton class="h-4 w-[100px]" />
          </div>
        </div>
      </z-example>

      <z-example zTitle="Card">
        <z-card class="w-full">
          <z-card-header>
            <z-skeleton class="h-4 w-2/3" />
            <z-skeleton class="h-4 w-1/2" />
          </z-card-header>
          <z-card-content>
            <z-skeleton class="aspect-square w-full" />
          </z-card-content>
        </z-card>
      </z-example>

      <z-example zTitle="Text">
        <div class="flex w-full flex-col gap-2">
          <z-skeleton class="h-4 w-full" />
          <z-skeleton class="h-4 w-full" />
          <z-skeleton class="h-4 w-3/4" />
        </div>
      </z-example>

      <z-example zTitle="Form">
        <div class="flex w-full flex-col gap-7">
          <div class="flex flex-col gap-3">
            <z-skeleton class="h-4 w-20" />
            <z-skeleton class="h-10 w-full" />
          </div>
          <div class="flex flex-col gap-3">
            <z-skeleton class="h-4 w-24" />
            <z-skeleton class="h-10 w-full" />
          </div>
          <z-skeleton class="h-9 w-24" />
        </div>
      </z-example>

      <z-example zTitle="Table">
        <div class="flex w-full flex-col gap-2">
          @for (row of rows; track row) {
            <div class="flex gap-4">
              <z-skeleton class="h-4 flex-1" />
              <z-skeleton class="h-4 w-24" />
              <z-skeleton class="h-4 w-20" />
            </div>
          }
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class SkeletonExampleComponent {
  protected readonly rows = [1, 2, 3] as const;
}
