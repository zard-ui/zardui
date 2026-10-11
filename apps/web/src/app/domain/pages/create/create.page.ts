import { ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  ViewEncapsulation,
  type OnDestroy,
  type OnInit,
} from '@angular/core';

import { SeoService } from '@doc/shared/services/seo.service';

import { CreateCustomizerComponent } from './components/create-customizer.component';
import { CreateDialogsComponent } from './components/create-dialogs.component';
import { CreateGetCodeComponent } from './components/create-get-code.component';
import { CreatePreviewComponent } from './components/create-preview.component';
import { shortcutAction } from './lib/create-shortcuts';
import { CreateShellService } from './services/create-shell.service';
import { CreateStateService } from './services/create-state.service';
import { injectIsMobile } from '../typeset/utils/inject-is-mobile';

/** Defined in the global stylesheet: the document stops scrolling, the builder owns the viewport. */
const SCROLL_LOCK_CLASS = 'scroll-locked';

/**
 * `/create`: the project builder. A dark glass customizer on the left, the live preview on the right; below `md`
 * the preview is on top and the customizer a horizontal row of cards.
 *
 * The state service is scoped to the page so it dies with it: a navigation away and back starts from the URL, not
 * from stale locks and history.
 */
@Component({
  selector: 'z-create-page',
  imports: [CreateCustomizerComponent, CreateDialogsComponent, CreateGetCodeComponent, CreatePreviewComponent],
  providers: [CreateStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './create-fonts.css',
  host: { '(window:keydown)': 'onKeydown($event)' },
  template: `
    <section
      class="relative z-10 flex h-[calc(100svh-var(--header-height))] min-h-0 flex-col overflow-hidden [--customizer-width:--spacing(48)] [--gap:--spacing(4)] md:[--gap:--spacing(6)] 2xl:[--customizer-width:--spacing(56)]"
      aria-label="Project builder"
    >
      <h1 class="sr-only">Create your zard/ui project</h1>
      <div
        class="flex min-h-0 flex-1 flex-col gap-(--gap) p-(--gap) pt-[calc(var(--gap)*0.25)] md:flex-row-reverse"
        data-slot="designer"
      >
        <z-create-preview />
        <z-create-customizer
          class="w-full shrink-0 self-start md:h-full md:max-h-full md:min-h-0 md:w-(--customizer-width)"
          [mobile]="mobile()"
        />
      </div>
    </section>

    <z-create-dialogs />
    <z-create-get-code />
  `,
})
export class CreatePage implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly seo = inject(SeoService);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly state = inject(CreateStateService);
  private readonly shell = inject(CreateShellService);

  protected readonly mobile = injectIsMobile();

  ngOnInit(): void {
    this.document.documentElement.classList.add(SCROLL_LOCK_CLASS);
    this.viewportScroller.scrollToPosition([0, 0]);
    this.seo.setDocsSeo(
      'Create',
      'Pick a style, base color, theme, fonts, icons and radius, see them live on real components, and take away one command that scaffolds a project configured that way.',
      '/create',
      'og-typeset-generator.jpg',
    );
  }

  ngOnDestroy(): void {
    this.document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
    this.shell.getCodeOpen.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const action = shortcutAction(event);
    if (!action) return;

    // With a dialog open the keyboard belongs to it — except ⇧R, which answers an open "Reset?" question.
    const dialogOpen = this.shell.getCodeOpen() || this.state.navigateOpen() || this.state.openPresetOpen();
    const answersReset = action === 'reset' && this.state.resetOpen();
    if ((dialogOpen || this.state.resetOpen()) && !answersReset && action !== 'navigate') return;

    event.preventDefault();
    this.state.run(action);
  }
}
