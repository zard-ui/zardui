import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideComponent, lucideEye, lucideLayoutGrid, lucideSearchX } from '@ng-icons/lucide';

import { ZardAlertDialogImports } from '@zard/components/alert-dialog/alert-dialog.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCommandImports } from '@zard/components/command';
import { ZardCommandComponent } from '@zard/components/command/command.component';
import { ZardDialogImports } from '@zard/components/dialog/dialog.imports';
import { ZardDrawerImports } from '@zard/components/drawer/drawer.imports';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';
import { ZardInputComponent } from '@zard/components/input/input.component';

import { injectIsMobile } from '../../typeset/utils/inject-is-mobile';
import { COMPONENT_LIST, groupByCategory, loadBlockItems, PREVIEW_ITEM, type CreateItem } from '../lib/create-items';
import { CreateStateService } from '../services/create-state.service';

const WELCOME_KEY = 'zard-create-welcome';

type NavigateView = 'root' | 'blocks' | 'components';

/**
 * The item palette. A child of the dialog so it only exists — and only takes focus — while the dialog is open.
 *
 * It opens on cards: Blocks, Components and the overview. The search sits on top from the start but only works once
 * a list is open; Back, under the search, or Backspace in an empty search returns to the cards. Blocks are grouped by
 * family, maps by gallery category. Each list is its own `z-command`, so its search starts empty and its options never
 * race the filter (NG0950).
 */
@Component({
  selector: 'z-create-navigate-content',
  imports: [FormsModule, NgIcon, ZardButtonComponent, ZardCommandImports, ZardEmptyComponent],
  viewProviders: [provideIcons({ lucideChevronLeft, lucideComponent, lucideEye, lucideLayoutGrid, lucideSearchX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown.backspace)': 'onBackspace($event)', '[attr.data-view]': 'view()' },
  template: `
    @if (view() === 'root') {
      <z-command>
        <z-command-input placeholder="Pick a list to search it" [ngModel]="''" [disabled]="true" />
        <div class="grid grid-cols-2 gap-2 p-2" role="group" aria-label="Lists" data-testid="navigate-cards">
          @for (card of cards(); track card.view; let first = $first) {
            <button
              type="button"
              class="hover:bg-muted focus-visible:ring-ring/50 ring-foreground/10 flex flex-col items-start gap-2 rounded-lg p-3 text-start ring-1 outline-none focus-visible:ring-2"
              [attr.data-navigate-card]="card.view"
              [attr.data-first-card]="first ? '' : null"
              (click)="open(card.view)"
            >
              <ng-icon [name]="card.icon" class="text-muted-foreground size-5" aria-hidden="true" />
              <span class="flex w-full items-center justify-between gap-2">
                <span class="text-sm font-medium">{{ card.label }}</span>
                <span class="text-muted-foreground text-xs tabular-nums">{{ card.count }}</span>
              </span>
              <span class="text-muted-foreground text-xs leading-snug">{{ card.description }}</span>
            </button>
          }
          <button
            type="button"
            class="hover:bg-muted focus-visible:ring-ring/50 ring-foreground/10 col-span-2 flex items-center gap-2 rounded-lg px-3 py-2 text-start text-sm ring-1 outline-none focus-visible:ring-2"
            data-navigate-card="preview"
            (click)="go(previewId)"
          >
            <ng-icon name="lucideEye" class="text-muted-foreground size-4" aria-hidden="true" />
            <span class="font-medium">Preview</span>
            <span class="text-muted-foreground text-xs">The overview canvases</span>
          </button>
        </div>
      </z-command>
    } @else {
      <z-command #cmd="zCommand" (zCommandSelected)="go(asId($event.value))">
        <z-command-input [placeholder]="view() === 'blocks' ? 'Search blocks' : 'Search components'" />
        <div class="flex items-center gap-1 border-b px-1.5 py-1">
          <button
            type="button"
            z-button
            zType="ghost"
            zSize="sm"
            class="gap-1 px-2"
            data-testid="navigate-back"
            (click)="back()"
          >
            <ng-icon name="lucideChevronLeft" aria-hidden="true" />
            Back
          </button>
          <span class="text-muted-foreground text-xs" data-testid="navigate-title">{{ title() }}</span>
        </div>
        <z-command-list>
          @if (cmd.isEmpty()) {
            <z-empty
              class="py-8"
              zIcon="lucideSearchX"
              zTitle="No results"
              [zDescription]="'Nothing in ' + title() + ' matches your search.'"
              data-testid="navigate-empty"
            />
          }
          @if (view() === 'blocks') {
            @for (group of blockGroups(); track group.category) {
              <z-command-option-group [zLabel]="group.category">
                @for (item of group.items; track item.id) {
                  <z-command-option [zLabel]="item.label" [zValue]="item.id" [zCommand]="group.category" />
                }
              </z-command-option-group>
            }
          } @else {
            @for (item of components; track item.id) {
              <z-command-option [zLabel]="item.label" [zValue]="item.id" />
            }
          }
        </z-command-list>
      </z-command>
    }
  `,
})
export class CreateNavigateContentComponent {
  private readonly state = inject(CreateStateService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly command = viewChild(ZardCommandComponent);

  /** Already loaded by the owner: options that appear after the command exists race its filter (NG0950). */
  readonly blocks = input.required<readonly CreateItem[]>();

  protected readonly view = signal<NavigateView>('root');
  protected readonly title = computed(() => (this.view() === 'blocks' ? 'Blocks' : 'Components'));
  protected readonly previewId = PREVIEW_ITEM.id;
  protected readonly components = COMPONENT_LIST;
  protected readonly blockGroups = computed(() => groupByCategory(this.blocks()));
  protected readonly cards = computed(() => [
    {
      view: 'blocks' as const,
      label: 'Blocks',
      icon: 'lucideLayoutGrid',
      count: this.blocks().length,
      description: 'Pages and sections, maps included, by category.',
    },
    {
      view: 'components' as const,
      label: 'Components',
      icon: 'lucideComponent',
      count: COMPONENT_LIST.length,
      description: 'Every example of one component.',
    },
  ]);

  constructor() {
    // On the cards the first card takes the focus; in a list, its search field does.
    // The dialog moves the focus in when it opens; the first card takes it once that is done.
    afterNextRender(() => setTimeout(() => this.focusFirstCard(), 0));
  }

  protected asId(value: unknown): string {
    return String(value);
  }

  protected open(view: Exclude<NavigateView, 'root'>): void {
    this.view.set(view);
    // Rendered and focused within the click itself: keys typed right after it land in the search, not on a card that
    // is going away.
    this.changeDetector.detectChanges();
    this.host.nativeElement.querySelector<HTMLInputElement>('input[role="combobox"]:not(:disabled)')?.focus();
  }

  protected go(id: string): void {
    this.state.setItem(id);
    this.state.navigateOpen.set(false);
  }

  protected back(): void {
    this.view.set('root');
    afterNextRender(() => this.focusFirstCard(), { injector: this.injector });
  }

  private focusFirstCard(): void {
    this.host.nativeElement.querySelector<HTMLElement>('[data-first-card]')?.focus();
  }

  /** Backspace in an empty search field goes back to the cards, as in a file path. */
  protected onBackspace(event: Event): void {
    if (this.view() === 'root' || this.command()?.searchTerm()) return;
    event.preventDefault();
    this.back();
  }
}

/** Every dialog of the page: Navigate, Open Preset (a drawer on a phone), Reset and the one-time Welcome. */
@Component({
  selector: 'z-create-dialogs',
  imports: [
    FormsModule,
    NgTemplateOutlet,
    ZardAlertDialogImports,
    ZardButtonComponent,
    ZardDialogImports,
    ZardDrawerImports,
    ZardInputComponent,
    CreateNavigateContentComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-dialog
      class="gap-0 p-0 sm:max-w-sm"
      [zVisible]="state.navigateOpen()"
      [zClosable]="false"
      (zVisibleChange)="state.navigateOpen.set($event)"
    >
      <z-dialog-header class="sr-only">
        <z-dialog-title>Navigate</z-dialog-title>
        <z-dialog-description>Preview a component or a block on its own.</z-dialog-description>
      </z-dialog-header>
      @if (state.navigateOpen() && blocks(); as loaded) {
        <z-create-navigate-content [blocks]="loaded" />
      }
    </z-dialog>

    @if (mobile()) {
      <z-drawer class="dark" [zVisible]="state.openPresetOpen()" (zVisibleChange)="onPresetVisible($event)">
        <z-drawer-header>
          <z-drawer-title>Open Preset</z-drawer-title>
          <z-drawer-description>Paste a preset code to load a saved configuration.</z-drawer-description>
        </z-drawer-header>
        <form class="grid gap-4 px-4 pb-4" (ngSubmit)="openPreset()">
          <ng-container *ngTemplateOutlet="presetField" />
          <button type="submit" z-button class="h-10" [zDisabled]="!valid()">Open</button>
          <button type="button" z-button zType="outline" class="h-10" z-drawer-close>Cancel</button>
        </form>
      </z-drawer>
    } @else {
      <z-dialog class="dark" [zVisible]="state.openPresetOpen()" (zVisibleChange)="onPresetVisible($event)">
        <z-dialog-header>
          <z-dialog-title>Open Preset</z-dialog-title>
          <z-dialog-description>Paste a preset code to load a saved configuration.</z-dialog-description>
        </z-dialog-header>
        <form class="grid gap-4" (ngSubmit)="openPreset()">
          <ng-container *ngTemplateOutlet="presetField" />
          <z-dialog-footer>
            <button type="button" z-button zType="outline" z-dialog-close>Cancel</button>
            <button type="submit" z-button [zDisabled]="!valid()">Open</button>
          </z-dialog-footer>
        </form>
      </z-dialog>
    }

    <ng-template #presetField>
      <label class="sr-only" for="create-preset-code">Preset code</label>
      <input
        z-input
        id="create-preset-code"
        cdkFocusInitial
        name="preset"
        autocomplete="off"
        autocapitalize="none"
        spellcheck="false"
        [placeholder]="'Z0 or --preset Z0'"
        [attr.aria-invalid]="invalid()"
        [ngModel]="input()"
        (ngModelChange)="input.set($event)"
      />
    </ng-template>

    <z-alert-dialog [zVisible]="state.resetOpen()" (zVisibleChange)="state.resetOpen.set($event)" zSize="sm">
      <z-alert-dialog-header>
        <z-alert-dialog-title>Reset to defaults?</z-alert-dialog-title>
        <z-alert-dialog-description>
          This will reset all customization options to the defaults of the current style.
        </z-alert-dialog-description>
      </z-alert-dialog-header>
      <z-alert-dialog-footer>
        <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
        <button type="button" z-button (click)="confirmReset()">Reset</button>
      </z-alert-dialog-footer>
    </z-alert-dialog>

    <z-dialog
      class="max-w-92 gap-0 overflow-hidden p-0 sm:max-w-sm"
      [zClosable]="false"
      [zVisible]="state.welcomeOpen()"
      (zVisibleChange)="onWelcome($event)"
    >
      <div class="flex aspect-2/1 w-full items-center justify-center bg-neutral-950 text-neutral-100">
        <img src="/images/zard.svg" alt="" class="h-9 invert" />
      </div>
      <z-dialog-header class="gap-1 p-4">
        <z-dialog-title class="text-left text-base">Build your own zard/ui</z-dialog-title>
        <z-dialog-description class="text-foreground text-left leading-relaxed">
          Customize everything from the ground up. Pick your style, font, color scheme, icons and more, then take it
          home with one command.
        </z-dialog-description>
        <z-dialog-description class="text-foreground mt-2 text-left font-medium">
          Available for Angular, Nx and Analog.
        </z-dialog-description>
      </z-dialog-header>
      <z-dialog-footer class="m-0 flex-col-reverse">
        <button type="button" z-button class="w-full" (click)="onWelcome(false)">Get Started</button>
      </z-dialog-footer>
    </z-dialog>
  `,
})
export class CreateDialogsComponent {
  protected readonly state = inject(CreateStateService);
  private readonly document = inject(DOCUMENT);
  protected readonly mobile = injectIsMobile();

  protected readonly input = signal('');
  protected readonly valid = computed(() => CreateStateService.canOpen(this.input()));
  protected readonly invalid = computed(() => this.input().trim() !== '' && !this.valid());

  /** The block items, loaded once the page is idle so Navigate opens with its whole list. */
  protected readonly blocks = signal<readonly CreateItem[] | null>(null);

  constructor() {
    afterNextRender(() => {
      const storage = this.document.defaultView?.localStorage;
      try {
        if (!storage?.getItem(WELCOME_KEY)) this.state.welcomeOpen.set(true);
      } catch {
        // Storage can be blocked; the dialog then simply never shows.
      }

      loadBlockItems().then(
        items => this.blocks.set(items),
        () => this.blocks.set([]),
      );
    });
  }

  protected onPresetVisible(open: boolean): void {
    this.state.openPresetOpen.set(open);
    if (!open) this.input.set('');
  }

  protected openPreset(): void {
    if (!this.valid()) return;
    this.state.setPreset(this.input());
    this.onPresetVisible(false);
  }

  protected confirmReset(): void {
    this.state.reset();
    this.state.resetOpen.set(false);
  }

  /** Remembers that the welcome was seen, however it was dismissed. */
  protected onWelcome(open: boolean): void {
    this.state.welcomeOpen.set(open);
    if (open) return;

    try {
      this.document.defaultView?.localStorage.setItem(WELCOME_KEY, 'true');
    } catch {
      // Nothing to do without storage.
    }
  }
}
