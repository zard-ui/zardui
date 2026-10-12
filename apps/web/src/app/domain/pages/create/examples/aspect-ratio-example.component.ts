import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAspectRatioComponent } from '@zard/components/aspect-ratio/aspect-ratio.component';

import { ExampleImports } from './example.component';

const EXAMPLES: readonly { title: string; ratio: number; class: string }[] = [
  { title: '16:9', ratio: 16 / 9, class: 'items-center justify-center' },
  { title: '21:9', ratio: 21 / 9, class: 'items-center justify-center' },
  { title: '1:1', ratio: 1, class: 'items-start' },
  { title: '9:16', ratio: 9 / 16, class: 'items-center justify-center' },
];

/** shadcn/ui's `aspect-ratio-example`, in zard. */
@Component({
  selector: 'z-aspect-ratio-example',
  imports: [ExampleImports, ZardAspectRatioComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper zClass="max-w-4xl 2xl:max-w-4xl">
      @for (example of examples; track example.title) {
        <z-example [zTitle]="example.title" [zClass]="example.class">
          <!-- w-full: shadcn's ratio box is a div, which the example card stretches; a custom element it does not -->
          <z-aspect-ratio
            [zRatio]="example.ratio"
            class="bg-muted style-lyra:rounded-none style-luma:rounded-3xl style-sera:rounded-none w-full rounded-lg"
          >
            <img
              src="https://avatar.vercel.sh/shadcn1"
              alt="Photo"
              class="style-lyra:rounded-none style-luma:rounded-3xl style-sera:rounded-none absolute inset-0 h-full w-full rounded-lg object-cover grayscale dark:brightness-20"
            />
          </z-aspect-ratio>
        </z-example>
      }
    </z-example-wrapper>
  `,
})
export class AspectRatioExampleComponent {
  protected readonly examples = EXAMPLES;
}
