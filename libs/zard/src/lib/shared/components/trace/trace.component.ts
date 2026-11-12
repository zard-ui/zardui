import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import {
  ZardCollapsibleContentComponent,
  ZardCollapsibleDirective,
  ZardCollapsibleTriggerDirective,
} from '@/shared/components/collapsible/collapsible.component';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  traceChevronVariants,
  traceCollapsibleContentVariants,
  traceCollapsibleTriggerVariants,
  traceCollapsibleVariants,
  traceDescriptionVariants,
  traceIconVariants,
  traceLineVariants,
  traceTitleVariants,
  traceVariants,
  type ZardTraceStatusVariants,
} from './trace.variants';

@Component({
  selector: 'z-trace, [z-trace]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'trace',
    '[class]': 'classes()',
  },
  exportAs: 'zTrace',
})
export class ZardTraceComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(traceVariants(), this.class()));
}

/**
 * One row. It is never interactive on its own, so it renders as a span-like box and is not a tab stop:
 * wrap it in a collapsible trigger, a link or a dialog/sheet/drawer/popover trigger to make it do something.
 */
@Component({
  selector: 'z-trace-line, [z-trace-line]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'trace-line',
    '[attr.data-status]': 'zStatus()',
    '[class]': 'classes()',
  },
  exportAs: 'zTraceLine',
})
export class ZardTraceLineComponent {
  readonly zStatus = input<ZardTraceStatusVariants>();
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(traceLineVariants({ zStatus: this.zStatus() }), this.class()),
  );
}

@Component({
  selector: 'z-trace-icon, [z-trace-icon]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'trace-icon',
    'aria-hidden': 'true',
    '[class]': 'classes()',
  },
  exportAs: 'zTraceIcon',
})
export class ZardTraceIconComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(traceIconVariants(), this.class()));
}

@Component({
  selector: 'z-trace-title, [z-trace-title]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'trace-title',
    '[class]': 'classes()',
  },
  exportAs: 'zTraceTitle',
})
export class ZardTraceTitleComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(traceTitleVariants(), this.class()));
}

@Component({
  selector: 'z-trace-description, [z-trace-description]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'trace-description',
    '[class]': 'classes()',
  },
  exportAs: 'zTraceDescription',
})
export class ZardTraceDescriptionComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(traceDescriptionVariants(), this.class()));
}

/** An expandable row. State, ids and `aria-*` come from `z-collapsible`, applied here as a host directive. */
@Component({
  selector: 'z-trace-collapsible, [z-trace-collapsible]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  hostDirectives: [{ directive: ZardCollapsibleDirective, inputs: ['zOpen'], outputs: ['zOpenChange'] }],
  exportAs: 'zTraceCollapsible',
})
export class ZardTraceCollapsibleComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(traceCollapsibleVariants(), this.class()));
}

/**
 * Wraps its content in a real `<button>`, so the line inside never nests an interactive element, and appends
 * the chevron. The host itself is layout-neutral (`display: contents`); `class` styles the button.
 */
@Component({
  selector: 'z-trace-collapsible-trigger, [z-trace-collapsible-trigger]',
  imports: [NgIcon, ZardCollapsibleTriggerDirective, ZardTraceIconComponent],
  template: `
    <button z-collapsible-trigger type="button" [class]="classes()">
      <ng-content />
      <z-trace-icon>
        <ng-icon name="lucideChevronRight" [class]="chevronClasses" />
      </z-trace-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronRight })],
  host: {
    'data-slot': 'trace-collapsible-trigger',
    class: 'contents',
  },
  exportAs: 'zTraceCollapsibleTrigger',
})
export class ZardTraceCollapsibleTriggerComponent {
  readonly class = input<ClassValue>('');

  protected readonly chevronClasses = traceChevronVariants();
  protected readonly classes = computed(() => mergeClasses(traceCollapsibleTriggerVariants(), this.class()));
}

/**
 * The detail revealed by the trigger. Closed content stays out of the DOM unless `zKeepMounted` is set; it
 * leaves once the collapse animation has finished, never mid-way.
 */
@Component({
  selector: 'z-trace-collapsible-content, [z-trace-collapsible-content]',
  imports: [ZardCollapsibleContentComponent],
  template: `
    <z-collapsible-content (transitionend)="onTransitionEnd($event)">
      <div data-slot="trace-collapsible-content-inner" [class]="innerClasses()">
        @if (mounted()) {
          <ng-content />
        }
      </div>
    </z-collapsible-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'trace-collapsible-content',
    class: 'block min-w-0',
  },
  exportAs: 'zTraceCollapsibleContent',
})
export class ZardTraceCollapsibleContentComponent {
  private readonly collapsible = inject(ZardCollapsibleDirective);

  readonly zKeepMounted = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  /** Flips to `true` once a close transition has ended; opening flips it back. */
  private readonly settledClosed = signal(!this.collapsible.open());

  protected readonly mounted = computed(() => this.zKeepMounted() || this.collapsible.open() || !this.settledClosed());
  protected readonly innerClasses = computed(() => mergeClasses(traceCollapsibleContentVariants(), this.class()));

  constructor() {
    effect(() => {
      if (this.collapsible.open()) {
        this.settledClosed.set(false);
      }
    });
  }

  protected onTransitionEnd(event: TransitionEvent): void {
    if (event.target === event.currentTarget && event.propertyName !== 'visibility' && !this.collapsible.open()) {
      this.settledClosed.set(true);
    }
  }
}
