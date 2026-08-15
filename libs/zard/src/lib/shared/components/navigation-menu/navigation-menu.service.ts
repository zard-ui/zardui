import { computed, Injectable, signal, type TemplateRef } from '@angular/core';

/** Direction the content slides in from when moving between two triggers. */
export type ZardNavigationMenuMotion = 'from-start' | 'from-end' | null;

export interface ZardNavigationMenuActiveTrigger {
  /** Index of the trigger within the list, used to derive the slide direction. */
  index: number;
  template: TemplateRef<void>;
  element: HTMLElement;
}

/**
 * Scoped to each `<z-navigation-menu>` root — it holds which trigger owns the shared viewport,
 * the direction of the last transition and the geometry the indicator follows.
 */
@Injectable()
export class ZardNavigationMenuService {
  private readonly activeTrigger = signal<ZardNavigationMenuActiveTrigger | null>(null);
  private readonly previousIndex = signal<number | null>(null);
  private nextIndex = 0;
  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly viewport = signal(true);
  readonly hoverDelay = signal(100);
  /** Host of the root, used by the indicator to position itself against the active trigger. */
  readonly rootElement = signal<HTMLElement | null>(null);

  readonly active = this.activeTrigger.asReadonly();
  readonly isOpen = computed(() => this.activeTrigger() !== null);
  readonly activeTemplate = computed(() => this.activeTrigger()?.template ?? null);

  readonly motion = computed<ZardNavigationMenuMotion>(() => {
    const current = this.activeTrigger();
    const previous = this.previousIndex();

    if (!current || previous === null || previous === current.index) return null;

    return previous < current.index ? 'from-end' : 'from-start';
  });

  /** Called once per trigger on init so the service can derive the slide direction later. */
  registerTrigger(): number {
    return this.nextIndex++;
  }

  open(trigger: ZardNavigationMenuActiveTrigger): void {
    this.cancelScheduledClose();

    const current = this.activeTrigger();

    if (current?.index === trigger.index) {
      // Same trigger: refresh its template without replaying the slide.
      if (current.template !== trigger.template) {
        this.activeTrigger.set(trigger);
      }
      return;
    }

    this.previousIndex.set(current?.index ?? null);
    this.activeTrigger.set(trigger);
  }

  close(index?: number): void {
    this.cancelScheduledClose();

    const current = this.activeTrigger();
    if (!current) return;
    if (index !== undefined && current.index !== index) return;

    // Cleared so the next opening fades in instead of sliding from a stale position.
    this.previousIndex.set(null);
    this.activeTrigger.set(null);
  }

  /**
   * Closing is deferred so the pointer can travel from the trigger to the viewport without the
   * popup disappearing underneath it. Any `open()` or `cancelScheduledClose()` calls this off.
   */
  scheduleClose(index?: number): void {
    this.cancelScheduledClose();
    this.closeTimeout = setTimeout(() => {
      this.closeTimeout = null;
      this.close(index);
    }, this.hoverDelay());
  }

  cancelScheduledClose(): void {
    if (this.closeTimeout === null) return;

    clearTimeout(this.closeTimeout);
    this.closeTimeout = null;
  }

  isActive(index: number): boolean {
    return this.activeTrigger()?.index === index;
  }
}
