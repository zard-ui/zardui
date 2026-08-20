import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { markerContentVariants, markerIconVariants, markerVariants, type ZardMarkerVariants } from './marker.variants';

@Component({
  selector: 'z-marker-icon, [z-marker-icon]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'marker-icon',
    'aria-hidden': 'true',
    '[class]': 'classes()',
  },
  exportAs: 'zMarkerIcon',
})
export class ZardMarkerIconComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(markerIconVariants(), this.class()));
}

@Component({
  selector: 'z-marker-content, [z-marker-content]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'marker-content',
    '[class]': 'classes()',
  },
  exportAs: 'zMarkerContent',
})
export class ZardMarkerContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(markerContentVariants(), this.class()));
}

@Component({
  selector: 'z-marker, [z-marker]',
  imports: [NgIcon, ZardMarkerContentComponent, ZardMarkerIconComponent, ZardStringTemplateOutletDirective],
  template: `
    @let icon = zIcon();

    <ng-content select="z-marker-icon, [z-marker-icon]" />
    @if (icon && !hasIcon()) {
      <z-marker-icon>
        <ng-container *zStringTemplateOutlet="icon">
          <ng-icon [name]="iconName()!" class="size-4!" />
        </ng-container>
      </z-marker-icon>
    }

    <ng-content select="z-marker-content, [z-marker-content]" />
    @if (!hasContent()) {
      <z-marker-content>
        <ng-content />
      </z-marker-content>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'marker',
    '[attr.data-variant]': 'zVariant()',
    '[class]': 'classes()',
  },
  exportAs: 'zMarker',
})
export class ZardMarkerComponent {
  readonly zVariant = input<ZardMarkerVariants>('default');
  readonly zIcon = input<TemplateRef<void> | string>();
  readonly class = input<ClassValue>('');

  /**
   * A marker with no projected `z-marker-content` builds the row itself, so
   * `<z-marker zIcon="lucideSearch">Explored 4 files</z-marker>` is one tag. Project a
   * slot and it wins: that is what unlocks a `class` override such as `shimmer`, or an
   * icon that is a whole component like `z-spinner`.
   */
  private readonly projectedIcon = contentChild(ZardMarkerIconComponent, { descendants: false });
  private readonly projectedContent = contentChild(ZardMarkerContentComponent, { descendants: false });

  protected readonly hasIcon = computed(() => !!this.projectedIcon());
  protected readonly hasContent = computed(() => !!this.projectedContent());
  protected readonly classes = computed(() =>
    mergeClasses(markerVariants({ zVariant: this.zVariant() }), this.class()),
  );

  protected readonly iconName = computed((): string | undefined => {
    const icon = this.zIcon();
    return icon instanceof TemplateRef ? undefined : icon;
  });
}
