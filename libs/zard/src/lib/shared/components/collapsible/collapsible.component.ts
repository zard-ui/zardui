import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { collapsibleContentVariants, collapsibleVariants } from '@/shared/components/collapsible/collapsible.variants';
import { ZardIdDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-collapsible, [z-collapsible]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [ZardIdDirective],
  host: {
    'data-slot': 'collapsible',
    '[class]': 'classes()',
    '[attr.data-state]': "open() ? 'open' : 'closed'",
    '[attr.data-disabled]': "zDisabled() ? '' : null",
  },
  exportAs: 'zCollapsible',
})
export class ZardCollapsibleComponent {
  private readonly uniqueId = inject(ZardIdDirective);

  readonly zOpen = input(false, { transform: booleanAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  readonly zOpenChange = output<boolean>();

  private readonly internalOpen = signal(false);

  /** Current state of the panel. Readonly for consumers — drive it through `zOpen` or `toggle()`. */
  readonly open = this.internalOpen.asReadonly();

  /** Stable id of the projected content, wired into the trigger's `aria-controls`. */
  readonly contentId = computed(() => `${this.uniqueId.id()}-content`);

  protected readonly classes = computed(() => mergeClasses(collapsibleVariants(), this.class()));

  constructor() {
    effect(() => {
      this.internalOpen.set(this.zOpen());
    });
  }

  toggle(): void {
    this.setOpen(!this.internalOpen());
  }

  setOpen(open: boolean): void {
    if (this.zDisabled() || this.internalOpen() === open) {
      return;
    }

    this.internalOpen.set(open);
    this.zOpenChange.emit(open);
  }
}

@Directive({
  selector: '[z-collapsible-trigger]',
  host: {
    'data-slot': 'collapsible-trigger',
    type: 'button',
    '[attr.aria-controls]': 'collapsible.contentId()',
    '[attr.aria-expanded]': 'collapsible.open()',
    '[attr.data-state]': "collapsible.open() ? 'open' : 'closed'",
    '[attr.data-disabled]': "collapsible.zDisabled() ? '' : null",
    '[attr.disabled]': 'collapsible.zDisabled() ? true : null',
    '(click)': 'collapsible.toggle()',
  },
  exportAs: 'zCollapsibleTrigger',
})
export class ZardCollapsibleTriggerDirective {
  protected readonly collapsible = inject(ZardCollapsibleComponent);
}

@Component({
  selector: 'z-collapsible-content',
  template: `
    <div class="overflow-hidden">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'collapsible-content',
    '[class]': 'classes()',
    '[id]': 'collapsible.contentId()',
    '[attr.data-state]': "collapsible.open() ? 'open' : 'closed'",
  },
  exportAs: 'zCollapsibleContent',
})
export class ZardCollapsibleContentComponent {
  protected readonly collapsible = inject(ZardCollapsibleComponent);

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(collapsibleContentVariants({ isOpen: this.collapsible.open() }), this.class()),
  );
}
