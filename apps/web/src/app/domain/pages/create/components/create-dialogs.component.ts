import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
  type AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardAlertDialogImports } from '@zard/components/alert-dialog/alert-dialog.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCommandImports } from '@zard/components/command';
import { ZardCommandComponent } from '@zard/components/command/command.component';
import { ZardDialogImports } from '@zard/components/dialog/dialog.imports';
import { ZardDrawerImports } from '@zard/components/drawer/drawer.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';

import { injectIsMobile } from '../../typeset/utils/inject-is-mobile';
import { COMPONENT_LIST, loadBlockItems, PREVIEW_ITEM, type CreateItem } from '../lib/create-items';
import { CreateStateService } from '../services/create-state.service';

const WELCOME_KEY = 'zard-create-welcome';

/** The item palette. A child of the dialog so it only exists — and only takes focus — while the dialog is open. */
@Component({
  selector: 'z-create-navigate-content',
  imports: [ZardCommandImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-command #cmd="zCommand" (zCommandSelected)="select($event.value)">
      <z-command-input placeholder="Search" />
      <z-command-list>
        @if (cmd.isEmpty()) {
          <div class="py-6 text-center text-sm">No items found.</div>
        }
        @for (group of groups(); track group.title) {
          <z-command-option-group [zLabel]="group.title">
            @for (item of group.items; track item.id) {
              <z-command-option [zLabel]="item.label" [zValue]="item.id" />
            }
          </z-command-option-group>
        }
      </z-command-list>
    </z-command>
  `,
})
export class CreateNavigateContentComponent implements AfterViewInit {
  private readonly state = inject(CreateStateService);
  private readonly command = viewChild.required(ZardCommandComponent);

  private readonly blocks = signal<readonly CreateItem[]>([]);

  protected readonly groups = computed(() => [
    // shadcn/ui's order: the blocks (the overview first), then the components.
    { title: 'Blocks', items: [PREVIEW_ITEM, ...this.blocks()] },
    { title: 'Components', items: COMPONENT_LIST },
  ]);

  constructor() {
    void loadBlockItems().then(items => this.blocks.set(items));
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.command().focus(), 0);
  }

  protected select(value: unknown): void {
    this.state.setItem(String(value));
    this.state.navigateOpen.set(false);
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
      class="dark gap-0 p-0 sm:max-w-lg"
      [zVisible]="state.navigateOpen()"
      [zClosable]="false"
      (zVisibleChange)="state.navigateOpen.set($event)"
    >
      <z-dialog-header class="sr-only">
        <z-dialog-title>Navigate</z-dialog-title>
        <z-dialog-description>Preview a component or a block on its own.</z-dialog-description>
      </z-dialog-header>
      @if (state.navigateOpen()) {
        <z-create-navigate-content />
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
          <button type="submit" z-button class="h-10" [disabled]="!valid()">Open</button>
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
            <button type="submit" z-button [disabled]="!valid()">Open</button>
          </z-dialog-footer>
        </form>
      </z-dialog>
    }

    <ng-template #presetField>
      <label class="sr-only" for="create-preset-code">Preset code</label>
      <input
        z-input
        id="create-preset-code"
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

    <z-alert-dialog [zVisible]="state.resetOpen()" (zVisibleChange)="state.resetOpen.set($event)" class="dark">
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
      class="dark max-w-92 gap-0 overflow-hidden p-0 sm:max-w-sm"
      [zClosable]="false"
      [zVisible]="welcome()"
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
      <div class="p-4 pt-0">
        <button type="button" z-button class="w-full" (click)="onWelcome(false)">Get Started</button>
      </div>
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

  protected readonly welcome = signal(false);

  constructor() {
    afterNextRender(() => {
      const storage = this.document.defaultView?.localStorage;
      try {
        if (!storage?.getItem(WELCOME_KEY)) this.welcome.set(true);
      } catch {
        // Storage can be blocked; the dialog then simply never shows.
      }
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
    this.welcome.set(open);
    if (open) return;

    try {
      this.document.defaultView?.localStorage.setItem(WELCOME_KEY, 'true');
    } catch {
      // Nothing to do without storage.
    }
  }
}
