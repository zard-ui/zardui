import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  PLATFORM_ID,
  signal,
  TemplateRef,
  ViewContainerRef,
  viewChild,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideALargeSmall, lucideMoveHorizontal, lucideMoveVertical, lucideUnfoldVertical } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDrawerService } from '@zard/components/drawer/drawer.service';
import { ZardPopoverImports } from '@zard/components/popover/popover.imports';
import { ZardDarkMode } from '@zard/services/dark-mode';

import { MONO_FONTS, TEXT_FONTS } from '../../data/fonts.data';
import { FLOW_CHOICES, LEADING_CHOICES, MEASURE_CHOICES, SCALE_CHOICES } from '../../data/options.data';
import { INHERIT_HEADING, type TypesetFont, type TypesetSlot } from '../../models/typeset.model';
import { TypesetGeneratorService } from '../../services/typeset-generator.service';
import { injectIsMobile } from '../../utils/inject-is-mobile';
import { TypesetCodePanelComponent } from '../typeset-code-panel/typeset-code-panel.component';
import { TypesetControlComponent, type TypesetControlGroup } from '../typeset-control/typeset-control.component';

/**
 * Families, split the way a type list reads: by classification, in one menu.
 *
 * Each entry carries its own `family`, so the list is set in the faces it is
 * offering. It costs a `.woff2` per family the first time the menu opens —
 * the only way to choose a typeface is to see it.
 */
function fontGroups(fonts: readonly TypesetFont[], lead?: TypesetControlGroup<string>): TypesetControlGroup<string>[] {
  const groups = [
    { label: 'Sans', type: 'sans' },
    { label: 'Serif', type: 'serif' },
    { label: 'Mono', type: 'mono' },
  ]
    .map(group => ({
      label: group.label,
      options: fonts
        .filter(font => font.type === group.type)
        .map(font => ({ value: font.id, label: font.label, family: font.family })),
    }))
    .filter(group => group.options.length > 0);

  return lead ? [lead, ...groups] : groups;
}

/**
 * The panel that holds every choice.
 *
 * Two shapes, one component: a column beside the preview from `md` up, and a
 * strip under it below that — the controls turn into a horizontal scroller, the
 * separators and the menu go away, and the footer holds the two buttons side by
 * side. A phone has no room for a fourteen-rem column and no patience for a
 * dialog you have to open before you can change a font.
 */
@Component({
  selector: 'z-typeset-customizer',
  standalone: true,
  imports: [NgIcon, TypesetCodePanelComponent, TypesetControlComponent, ZardButtonComponent, ...ZardPopoverImports],
  providers: [
    provideIcons({
      lucideALargeSmall,
      lucideMoveHorizontal,
      lucideMoveVertical,
      lucideUnfoldVertical,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block max-h-full min-h-0', '(document:keydown)': 'onShortcut($event)' },
  template: `
    <div class="bg-card/90 flex max-h-full min-h-0 flex-col overflow-hidden rounded-2xl border backdrop-blur-xl">
      <header class="hidden shrink-0 border-b px-2.5 py-3 md:block">
        <button
          type="button"
          class="ring-foreground/10 hover:bg-muted aria-expanded:bg-muted focus-visible:ring-foreground/50 flex h-9 w-full items-center justify-between gap-2 rounded-lg px-2 text-sm font-medium ring-1 transition-colors focus-visible:outline-none"
          zPopover
          zPlacement="right"
          zAlign="start"
          [zSideOffset]="20"
          [zContent]="menu"
          [zVisible]="menuOpen()"
          (zVisibleChange)="onMenuVisible($event)"
        >
          Menu

          <!--
            Two bars that span the width of the box. lucideEqual has the same two
            bars, but short: it comes out 3px narrower than the original.
          -->
          <svg
            class="size-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M3 8h18" />
            <path d="M3 16h18" />
          </svg>
        </button>
      </header>

      <!-- On a phone the row scrolls sideways; on a desktop it stacks. -->
      <div
        class="no-scrollbar min-h-0 flex-1 overflow-x-auto overflow-y-hidden md:overflow-x-hidden md:overflow-y-auto"
      >
        <div class="flex flex-row gap-2.5 px-3 py-3 md:flex-col md:gap-3.25 md:px-2.5 md:py-2.5">
          <!-- Below 28rem the measure goes: it is the choice that changes the prose least. -->
          <div class="shrink-0 max-[28rem]:hidden">
            <z-typeset-control
              label="Measure"
              [onPhone]="isMobile()"
              [groups]="measureGroups"
              [value]="service.state().measure"
              [display]="measureLabel()"
              (valueChange)="service.setMeasure($event)"
            >
              <ng-icon slot="icon" name="lucideMoveHorizontal" class="size-4.5" />
            </z-typeset-control>
          </div>

          <div class="bg-border -mx-2.5 hidden h-px md:block"></div>

          <z-typeset-control
            label="Heading"
            lockable
            [onPhone]="isMobile()"
            [groups]="headingGroups()"
            [value]="service.state().heading"
            [display]="service.headingFont().label"
            [locked]="isLocked('heading')"
            (valueChange)="service.setHeading($event)"
            (lockedChange)="toggleLock('heading')"
          >
            <span slot="icon" class="text-base leading-none" [style.font-family]="service.headingFont().family">
              Aa
            </span>
          </z-typeset-control>

          <z-typeset-control
            label="Body"
            lockable
            [onPhone]="isMobile()"
            [groups]="bodyGroups"
            [value]="service.state().body"
            [display]="service.bodyFont().label"
            [locked]="isLocked('body')"
            (valueChange)="service.setBody($event)"
            (lockedChange)="toggleLock('body')"
          >
            <span slot="icon" class="text-base leading-none" [style.font-family]="service.bodyFont().family">Aa</span>
          </z-typeset-control>

          <z-typeset-control
            label="Mono"
            lockable
            [onPhone]="isMobile()"
            [groups]="monoGroups"
            [value]="service.state().mono"
            [display]="service.monoFont().label"
            [locked]="isLocked('mono')"
            (valueChange)="service.setMono($event)"
            (lockedChange)="toggleLock('mono')"
          >
            <span slot="icon" class="text-base leading-none" [style.font-family]="service.monoFont().family">Aa</span>
          </z-typeset-control>

          <div class="bg-border -mx-2.5 hidden h-px md:block"></div>

          <z-typeset-control
            label="Size"
            lockable
            [onPhone]="isMobile()"
            [groups]="scaleGroups"
            [value]="service.state().scale"
            [display]="scaleLabel()"
            [locked]="isLocked('scale')"
            (valueChange)="service.setScale($event)"
            (lockedChange)="toggleLock('scale')"
          >
            <ng-icon slot="icon" name="lucideALargeSmall" class="size-4.5" />
          </z-typeset-control>

          <z-typeset-control
            label="Leading"
            lockable
            [onPhone]="isMobile()"
            [groups]="leadingGroups"
            [value]="service.state().leading"
            [display]="leadingLabel()"
            [locked]="isLocked('leading')"
            (valueChange)="service.setLeading($event)"
            (lockedChange)="toggleLock('leading')"
          >
            <ng-icon slot="icon" name="lucideUnfoldVertical" class="size-4.5" />
          </z-typeset-control>

          <z-typeset-control
            label="Flow"
            lockable
            [onPhone]="isMobile()"
            [groups]="flowGroups"
            [value]="service.state().flow"
            [display]="flowLabel()"
            [locked]="isLocked('flow')"
            (valueChange)="service.setFlow($event)"
            (lockedChange)="toggleLock('flow')"
          >
            <ng-icon slot="icon" name="lucideMoveVertical" class="size-4.5" />
          </z-typeset-control>

          <!-- The trailing padding collapses inside a scroller; this gap gives it back. -->
          <div class="w-0.5 shrink-0 md:hidden" aria-hidden="true"></div>
        </div>
      </div>

      <!--
        Both buttons stay transparent: zard's outline paints a background in the
        dark, and over the footer strip that would become a step in colour the
        original does not have. Shuffle carries no icon either — the original is
        just the word, centred.
      -->
      <div class="bg-muted/50 flex shrink-0 flex-row-reverse gap-2 border-t px-2.5 py-3 md:flex-col">
        <button
          z-button
          zType="outline"
          class="hover:bg-muted dark:hover:bg-muted min-w-0 flex-1 bg-transparent md:w-full md:flex-none dark:bg-transparent"
          (click)="shuffle()"
        >
          <span class="w-full truncate text-center font-medium">Shuffle</span>
        </button>

        <!-- Above xl the code panel sits alongside; here it is a sheet. -->
        <button
          z-button
          zType="outline"
          class="hover:bg-muted dark:hover:bg-muted min-w-0 flex-1 bg-transparent md:w-full md:flex-none xl:hidden dark:bg-transparent"
          (click)="openCode()"
        >
          <span class="w-full truncate text-center font-medium">Get code</span>
        </button>
      </div>
    </div>

    <ng-template #menu>
      <z-popover class="w-52 gap-0 rounded-xl p-1.5">
        <!--
          The tabindex is what lets the open menu hold focus itself, and that is
          what keeps the list quiet on open — see onMenuVisible below. The data
          attribute is how that lookup finds THIS menu: the overlay container is
          shared, and a dropdown left open elsewhere carries the menu role too.
        -->
        <div
          role="menu"
          aria-label="Typeset options"
          tabindex="-1"
          class="outline-none"
          data-typeset-menu
          (keydown)="onMenuKeydown($event)"
        >
          <button type="button" role="menuitem" [class]="menuItemClass" (click)="menuOpen.set(false); shuffle()">
            Shuffle
            <span class="text-muted-foreground text-xs tracking-widest">R</span>
          </button>

          <button type="button" role="menuitem" [class]="menuItemClass" (click)="menuOpen.set(false); toggleTheme()">
            Light/Dark
            <span class="text-muted-foreground text-xs tracking-widest">D</span>
          </button>

          <div class="bg-border -mx-1.5 my-1.5 h-px"></div>

          <button
            type="button"
            role="menuitem"
            [class]="menuItemClass"
            [disabled]="!service.canUndo()"
            (click)="menuOpen.set(false); service.undo()"
          >
            Undo
            <span class="text-muted-foreground text-xs tracking-widest">{{ undoShortcut }}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            [class]="menuItemClass"
            [disabled]="!service.canRedo()"
            (click)="menuOpen.set(false); service.redo()"
          >
            Redo
            <span class="text-muted-foreground text-xs tracking-widest">{{ redoShortcut }}</span>
          </button>

          <div class="bg-border -mx-1.5 my-1.5 h-px"></div>

          <button type="button" role="menuitem" [class]="menuItemClass" (click)="menuOpen.set(false); reset()">
            Reset
            <span class="text-muted-foreground text-xs tracking-widest">⇧R</span>
          </button>
        </div>
      </z-popover>
    </ng-template>

    <ng-template #codeTemplate>
      <div class="flex h-[70svh] min-h-0 flex-col md:h-full">
        <z-typeset-code-panel />
      </div>
    </ng-template>
  `,
})
export class TypesetCustomizerComponent {
  protected readonly service = inject(TypesetGeneratorService);
  protected readonly isMobile = injectIsMobile();

  private readonly document = inject(DOCUMENT);
  private readonly darkMode = inject(ZardDarkMode);
  private readonly drawerService = inject(ZardDrawerService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly codeTemplate = viewChild.required<TemplateRef<unknown>>('codeTemplate');

  /** The menu names the key the reader actually has: ⌘ on a Mac, Ctrl everywhere else. */
  private readonly onApple = this.isBrowser && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

  protected readonly undoShortcut = this.onApple ? '⌘Z' : 'Ctrl+Z';
  protected readonly redoShortcut = this.onApple ? '⇧⌘Z' : 'Ctrl+Shift+Z';

  protected readonly menuOpen = signal(false);

  /** One menu item. It lives here because there are six of them and the list is long. */
  protected readonly menuItemClass =
    'hover:bg-accent focus:bg-accent flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50';

  /*
   * A padlock is a session preference, not a choice: it stays out of the URL on
   * purpose, so a shared link opens with the preset rather than with whatever
   * the author happened to be holding while building it.
   */
  private readonly lockedSlots = signal<ReadonlySet<TypesetSlot>>(new Set());

  protected readonly measureGroups: TypesetControlGroup<number>[] = [
    { options: MEASURE_CHOICES.map(choice => ({ value: choice.value, label: `${choice.value}ch` })) },
  ];

  protected readonly scaleGroups: TypesetControlGroup<number>[] = [{ options: SCALE_CHOICES }];
  protected readonly leadingGroups: TypesetControlGroup<number>[] = [{ options: LEADING_CHOICES }];
  protected readonly flowGroups: TypesetControlGroup<string>[] = [{ options: FLOW_CHOICES }];

  /*
   * The option that hands the heading back to the body does not announce itself:
   * it repeats the body font's name, at the top of the list and apart from the
   * catalog. That is what the original does — the list is of typefaces, and
   * "same as body" is not a typeface.
   */
  protected readonly headingGroups = computed(() =>
    fontGroups(TEXT_FONTS, {
      separated: true,
      options: [
        { value: INHERIT_HEADING, label: this.service.bodyFont().label, family: this.service.bodyFont().family },
      ],
    }),
  );

  protected readonly bodyGroups = fontGroups(TEXT_FONTS);
  protected readonly monoGroups = fontGroups(MONO_FONTS);

  protected readonly measureLabel = computed(() => `${this.service.state().measure}ch`);
  protected readonly scaleLabel = computed(() => labelOf(SCALE_CHOICES, this.service.state().scale));
  protected readonly leadingLabel = computed(() => labelOf(LEADING_CHOICES, this.service.state().leading));
  protected readonly flowLabel = computed(() => labelOf(FLOW_CHOICES, this.service.state().flow));

  protected isLocked(slot: TypesetSlot): boolean {
    return this.lockedSlots().has(slot);
  }

  protected toggleLock(slot: TypesetSlot): void {
    this.lockedSlots.update(locked => {
      const next = new Set(locked);
      if (!next.delete(slot)) next.add(slot);
      return next;
    });
  }

  protected shuffle(): void {
    this.service.randomize(this.lockedSlots());
  }

  /** Reset clears the padlocks too — otherwise a defaulted row still reads as held. */
  protected reset(): void {
    this.lockedSlots.set(new Set());
    this.service.reset();
  }

  /*
   * The CDK overlay mounts the menu at the end of the `body`. Without moving
   * focus there on open, a keyboard user opens a menu they cannot walk.
   *
   * Focus lands on the menu itself, not on its first item: an item takes
   * `focus:bg-accent` with it, and a menu that opens with a row already lit
   * reads as a choice already made. The first arrow key picks a row.
   */
  protected onMenuVisible(open: boolean): void {
    this.menuOpen.set(open);
    if (!open || !this.isBrowser) return;

    setTimeout(() => {
      const menu = this.document.querySelector<HTMLElement>('.cdk-overlay-container [data-typeset-menu]');
      menu?.focus();
    });
  }

  /**
   * Up and down walk the menu, the way a `role="menu"` is expected to behave.
   *
   * With nothing lit yet, down enters at the top and up enters at the bottom —
   * so either key reaches the item nearest it in one press.
   */
  protected onMenuKeydown(event: KeyboardEvent): void {
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (step === 0) return;

    event.preventDefault();

    const items = menuItemsOf(event.currentTarget as HTMLElement);
    const current = items.indexOf(this.document.activeElement as HTMLElement);
    const entry = step === 1 ? 0 : items.length - 1;
    const next = current === -1 ? entry : (current + step + items.length) % items.length;
    items[next]?.focus();
  }

  protected toggleTheme(): void {
    this.darkMode.toggleTheme();
  }

  /**
   * The shortcuts the menu advertises.
   *
   * Undo takes the modifier everyone already presses; the rest are bare keys,
   * so any other modifier is left to the browser — Ctrl+R is a reload. Typing
   * in a field is never a shortcut, or the code panel would shuffle the preset
   * while someone edits a snippet.
   */
  protected onShortcut(event: KeyboardEvent): void {
    if (isTyping(event.target)) return;

    const key = event.key.toLowerCase();

    if ((event.metaKey || event.ctrlKey) && key === 'z') {
      event.preventDefault();

      if (event.shiftKey) this.service.redo();
      else this.service.undo();

      return;
    }

    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (key !== 'r' && key !== 'd') return;

    event.preventDefault();

    if (key === 'd') this.toggleTheme();
    else if (event.shiftKey) this.reset();
    else this.shuffle();
  }

  /** The code, from a sheet: up from the bottom on a phone, in from the side otherwise. */
  protected openCode(): void {
    this.drawerService.create({
      zTitle: 'Get code',
      zDescription: 'Everything you need to put this typeset in your project.',
      zContent: this.codeTemplate(),
      zViewContainerRef: this.viewContainerRef,
      zPlacement: this.isMobile() ? 'bottom' : 'right',
      zHandle: this.isMobile(),
      zHideFooter: true,
    });
  }
}

function menuItemsOf(menu: HTMLElement): HTMLElement[] {
  return Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'));
}

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function labelOf<T extends string | number>(
  choices: readonly { readonly value: T; readonly label: string }[],
  value: T,
): string {
  return choices.find(choice => choice.value === value)?.label ?? String(value);
}
