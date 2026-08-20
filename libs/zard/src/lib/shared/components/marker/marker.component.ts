import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { markerContentVariants, markerIconVariants, markerVariants, type ZardMarkerVariants } from './marker.variants';

@Component({
  selector: 'z-marker, [z-marker]',
  template: '<ng-content />',
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
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(markerVariants({ zVariant: this.zVariant() }), this.class()),
  );
}

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
