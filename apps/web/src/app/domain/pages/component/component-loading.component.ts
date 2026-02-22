import { Component, input } from '@angular/core';

import { ZardSkeletonComponent } from '@zard/components/skeleton/skeleton.component';

@Component({
  selector: 'z-component-loading',
  standalone: true,
  imports: [ZardSkeletonComponent],
  template: `
    <!-- Overview: real title + description + skeleton code box -->
    <div class="flex flex-col gap-5">
      <div class="flex flex-col">
        <h1 class="scroll-m-20 text-4xl font-semibold tracking-tight first-letter:uppercase sm:text-3xl xl:text-4xl">
          {{ name() }}
        </h1>
        <p class="text-muted-foreground text-base leading-7 [&:not(:first-child)]:mt-6">
          {{ description() }}
        </p>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex gap-4">
          <z-skeleton class="h-5 w-16" />
          <z-skeleton class="h-5 w-12" />
        </div>
        <z-skeleton class="h-[450px] w-full rounded-lg" />
      </div>
    </div>

    <!-- Installation -->
    <div class="flex flex-col gap-4">
      <h2 class="text-2xl font-semibold">Installation</h2>
      <div class="flex gap-4">
        <z-skeleton class="h-5 w-10" />
        <z-skeleton class="h-5 w-16" />
      </div>
      <z-skeleton class="h-24 w-full rounded-lg" />
    </div>

    <!-- Examples -->
    <div class="flex flex-col gap-4">
      <h2 class="text-2xl font-semibold">Examples</h2>
      @for (item of [1, 2]; track item) {
        <div class="flex flex-col gap-4">
          <z-skeleton class="h-6 w-24" />
          <div class="flex gap-4">
            <z-skeleton class="h-5 w-16" />
            <z-skeleton class="h-5 w-12" />
          </div>
          <z-skeleton class="h-[450px] w-full rounded-lg" />
        </div>
      }
    </div>

    <!-- API -->
    <div class="flex flex-col gap-3">
      <h2 class="text-2xl font-semibold">API</h2>
      <z-skeleton class="h-4 w-full max-w-lg" />
      <z-skeleton class="h-4 w-full max-w-md" />
      <z-skeleton class="h-32 w-full rounded-lg" />
    </div>
  `,
  host: {
    class: 'flex flex-col gap-8',
  },
})
export class ComponentLoadingComponent {
  readonly name = input.required<string>();
  readonly description = input.required<string>();
}
