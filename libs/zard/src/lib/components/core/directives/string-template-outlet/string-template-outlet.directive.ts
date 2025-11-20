import {
  Directive,
  type EmbeddedViewRef,
  inject,
  input,
  type OnDestroy,
  TemplateRef,
  ViewContainerRef,
  effect,
  type EffectRef,
} from '@angular/core';

// eslint-disable-next-line
type zAny = any;

export function isTemplateRef<T>(value: TemplateRef<T> | zAny): value is TemplateRef<T> {
  return value instanceof TemplateRef;
}

export class ZardStringTemplateOutletContext<T> {
  $implicit?: T;
}

@Directive({
  selector: '[zStringTemplateOutlet]',
  standalone: true,
  exportAs: 'zStringTemplateOutlet',
})
export class ZardStringTemplateOutletDirective<_T = unknown> implements OnDestroy {
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly defaultTemplateRef = inject(TemplateRef<zAny>);

  private embeddedViewRef: EmbeddedViewRef<zAny> | null = null;
  private currentTemplateRef: TemplateRef<zAny> | null = null;
  private readonly defaultContext = new ZardStringTemplateOutletContext<_T>();

  // Signal-based inputs
  readonly zStringTemplateOutletContext = input<zAny | null>(null);
  readonly zStringTemplateOutlet = input<zAny | TemplateRef<zAny>>(null);

  // Effect to manage view recreation and updates
  private readonly viewEffect: EffectRef = effect(() => {
    const contextInput = this.zStringTemplateOutletContext();
    const outletInput = this.zStringTemplateOutlet();

    const isCustomTemplate = isTemplateRef(outletInput);

    // Determine the template and context to use
    const templateToUse = isCustomTemplate ? outletInput : this.defaultTemplateRef;
    const contextToUse = isCustomTemplate ? contextInput : this.defaultContext;

    // --- View Management Logic (Reactive to Signal Changes) ---

    // Check if the template has changed compared to the one currently rendered
    if (this.currentTemplateRef !== templateToUse) {
      this.recreateView(templateToUse, contextToUse);
    } else {
      // Template is the same, just update the context
      this.updateContext(contextToUse);
    }

    // If using the default template, update the $implicit property on the default context
    if (!isCustomTemplate && contextToUse) {
      contextToUse.$implicit = outletInput;
    }
  });

  // --- Helper Methods ---

  private recreateView(template: TemplateRef<zAny>, context: zAny): void {
    this.viewContainer.clear();
    // 1. Create the new view
    this.embeddedViewRef = this.viewContainer.createEmbeddedView(template, context);
    // 2. Store the reference to the template used (THE FIX)
    this.currentTemplateRef = template;
  }

  private updateContext(newCtx: zAny): void {
    const oldCtx = this.embeddedViewRef?.context;
    if (newCtx && oldCtx) {
      // Only copy properties from the new context to the old context object
      for (const propName of Object.keys(newCtx)) {
        oldCtx[propName] = newCtx[propName];
      }
    }
  }

  static ngTemplateContextGuard<T>(
    _dir: ZardStringTemplateOutletDirective<T>,
    _ctx: ZardStringTemplateOutletContext<T>,
  ): _ctx is ZardStringTemplateOutletContext<T> {
    return true;
  }

  ngOnDestroy(): void {
    this.viewEffect.destroy();
    this.viewContainer.clear();
    this.embeddedViewRef = null;
    this.currentTemplateRef = null;
  }
}
