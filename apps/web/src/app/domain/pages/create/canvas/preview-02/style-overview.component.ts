import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ZardCardImports } from '@zard/components/card/card.imports';
import { fontById } from '@zard/design';

import { PreviewDesignContext } from '../../lib/preview-design.context';

const VARIANTS = [
  '--background',
  '--foreground',
  '--primary',
  '--secondary',
  '--muted',
  '--accent',
  '--border',
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
] as const;

@Component({
  selector: 'z-preview-02-style-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-content class="style-lyra:gap-4 style-mira:gap-4 flex flex-col gap-6">
        <div class="flex flex-col gap-1">
          <div
            class="cn-font-heading style-lyra:text-lg style-mira:text-lg style-sera:text-lg style-sera:font-semibold style-sera:tracking-wide style-sera:uppercase text-2xl font-medium"
          >
            {{ title() }}
          </div>
          <div
            class="text-muted-foreground style-lyra:text-sm style-mira:text-sm style-sera:text-sm style-sera:leading-relaxed line-clamp-2 text-base"
          >
            Designers love packing quirky glyphs into test phrases. This is a preview of the typography styles.
          </div>
        </div>
        <div class="grid grid-cols-6 gap-3">
          @for (variant of variants; track variant) {
            <div class="flex flex-col flex-wrap items-center gap-2">
              <div
                class="after:border-border style-sera:rounded-none style-sera:after:rounded-none relative aspect-square w-full rounded-lg bg-(--color) after:absolute after:inset-0 after:rounded-lg after:border after:mix-blend-darken dark:after:mix-blend-lighten"
                [style.--color]="'var(' + variant + ')'"
              ></div>
              <div
                class="style-lyra:max-w-10 style-mira:max-w-10 hidden max-w-14 truncate font-mono text-[0.60rem] md:block"
              >
                {{ variant }}
              </div>
            </div>
          }
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class Preview02StyleOverviewComponent {
  private readonly context = inject(PreviewDesignContext);

  protected readonly variants = VARIANTS;

  protected readonly title = computed(() => {
    const design = this.context.design();
    const font = fontById(design.font);
    const heading = fontById(design.fontHeading);
    const name = heading?.label && heading.label !== font?.label ? heading.label : font?.label;
    return `${this.context.styleLabel()} - ${name ?? ''}`;
  });
}
