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
  signal,
  untracked,
} from '@angular/core';

export function isTemplateRef<C = unknown>(value: unknown): value is TemplateRef<C> {
  return value instanceof TemplateRef;
}

export interface ZardStringTemplateOutletContext {
  [key: string]: unknown;
}

@Directive({
  selector: '[zStringTemplateOutlet]',
  exportAs: 'zStringTemplateOutlet',
})
export class ZardStringTemplateOutletDirective<T = unknown> implements OnDestroy {
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef<void>);

  private embeddedViewRef: EmbeddedViewRef<ZardStringTemplateOutletContext> | null = null;
  private readonly context: ZardStringTemplateOutletContext = {};

  #isFirstChange = true;
  #lastOutletWasTemplate = false;
  #lastTemplateRef: TemplateRef<void> | null = null;
  readonly #lastContext = signal<ZardStringTemplateOutletContext | undefined>(undefined);

  readonly zStringTemplateOutletContext = input<ZardStringTemplateOutletContext | undefined>(undefined);
  readonly zStringTemplateOutlet = input.required<T | TemplateRef<void>>();

  #hasContextShapeChanged(context: ZardStringTemplateOutletContext | undefined): boolean {
    if (!context) {
      return false;
    }
    const prevCtxKeys = Object.keys(untracked(this.#lastContext) || {});
    const currCtxKeys = Object.keys(context || {});

    if (prevCtxKeys.length === currCtxKeys.length) {
      for (const propName of currCtxKeys) {
        if (prevCtxKeys.indexOf(propName) === -1) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }

  #shouldViewBeRecreated(
    stringTemplateOutlet: TemplateRef<void> | T,
    stringTemplateOutletContext: ZardStringTemplateOutletContext | undefined,
  ): boolean {
    const isTemplate = isTemplateRef(stringTemplateOutlet);

    const shouldOutletRecreate =
      this.#isFirstChange ||
      isTemplate !== this.#lastOutletWasTemplate ||
      (isTemplate && stringTemplateOutlet !== this.#lastTemplateRef);

    if (this.#isFirstChange && !isTemplateRef(stringTemplateOutlet)) {
      this.#isFirstChange = false;
    }

    if (stringTemplateOutletContext !== undefined) {
      this.#lastContext.set(stringTemplateOutletContext);
    }

    const shouldContextRecreate = this.#hasContextShapeChanged(stringTemplateOutletContext);

    this.#lastOutletWasTemplate = isTemplate;
    this.#lastTemplateRef = isTemplate ? stringTemplateOutlet : null;

    return shouldContextRecreate || shouldOutletRecreate;
  }

  readonly #viewEffect: EffectRef = effect(() => {
    const stringTemplateOutlet = this.zStringTemplateOutlet();
    const stringTemplateOutletContext = this.zStringTemplateOutletContext();

    if (!this.#isFirstChange && isTemplateRef(stringTemplateOutlet)) {
      this.#isFirstChange = true;
    }

    if (!isTemplateRef(stringTemplateOutlet)) {
      this.context['$implicit'] = stringTemplateOutlet as string;
    }

    const recreateView = this.#shouldViewBeRecreated(stringTemplateOutlet, stringTemplateOutletContext);
    if (recreateView) {
      this.#recreateView(
        stringTemplateOutlet as TemplateRef<ZardStringTemplateOutletContext>,
        stringTemplateOutletContext,
      );
    } else {
      this.#updateContext(stringTemplateOutlet, stringTemplateOutletContext);
    }
  });

  #recreateView(
    outlet: TemplateRef<ZardStringTemplateOutletContext>,
    context: ZardStringTemplateOutletContext | undefined,
  ): void {
    this.viewContainer.clear();
    if (isTemplateRef(outlet)) {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(outlet, context);
    } else {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }
  }

  #updateContext(outlet: TemplateRef<void> | T, context: ZardStringTemplateOutletContext | undefined): void {
    const newCtx = isTemplateRef(outlet) ? context : this.context;
    let oldCtx = this.embeddedViewRef?.context;

    if (!oldCtx) {
      oldCtx = newCtx;
    } else if (newCtx && typeof newCtx === 'object') {
      for (const propName of Object.keys(newCtx)) {
        oldCtx[propName] = newCtx[propName];
      }
    }
    this.#lastContext.set(oldCtx);
  }

  static ngTemplateContextGuard<T>(
    _dir: ZardStringTemplateOutletDirective<T>,
    _ctx: unknown,
  ): _ctx is ZardStringTemplateOutletContext {
    return true;
  }

  ngOnDestroy(): void {
    this.#viewEffect.destroy();
    this.viewContainer.clear();
    this.embeddedViewRef = null;
  }
}
