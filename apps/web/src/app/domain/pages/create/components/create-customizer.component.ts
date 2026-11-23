import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardSheetImports } from '@zard/components/sheet/sheet.imports';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

import { CreateGlyphComponent } from './create-glyph.component';
import { CreateMenuComponent } from './create-menu.component';
import { CreatePickerComponent } from './create-picker.component';
import { CreateThemeEditorComponent } from './create-theme-editor.component';
import { copyText } from '../lib/clipboard';
import {
  accentLabel,
  accentSections,
  baseColorSections,
  changeFor,
  colorDot,
  fontFamily,
  fontLabel,
  fontSections,
  headingFamily,
  headingLabel,
  iconLibraryLabel,
  iconSections,
  menuLabel,
  menuSections,
  radiusLabel,
  radiusSections,
  styleLabel,
  styleSections,
  themeSections,
  type PickerId,
} from '../lib/create-options';
import type { PickerEvent } from '../lib/picker.types';
import { CreateShellService } from '../services/create-shell.service';
import { CreateStateService, type LockKey } from '../services/create-state.service';

const COPIED_MS = 2000;

/**
 * The customizer card: always dark, glass, with one row per design option, the menu on top and the preset tools
 * below. On a phone it is a horizontally scrolling row of cards under the preview.
 */
@Component({
  selector: 'z-create-customizer',
  imports: [
    CreatePickerComponent,
    CreateGlyphComponent,
    CreateMenuComponent,
    CreateThemeEditorComponent,
    ZardButtonComponent,
    ZardSheetImports,
    ZardSwitchComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section
      #card
      class="dark bg-card/90 text-foreground ring-foreground/10 isolate z-10 flex max-h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl text-sm ring-1 backdrop-blur-xl md:h-full md:gap-3 md:pt-3"
      aria-label="Customize the design"
    >
      <div class="hidden border-b px-3 pb-3 md:block">
        <z-create-menu />
      </div>

      <div
        class="flex min-h-0 flex-1 [scrollbar-width:none] flex-row gap-2.5 overflow-x-auto p-2.5 md:flex-col md:gap-3.25 md:overflow-x-hidden md:overflow-y-auto md:px-3 md:py-px [&::-webkit-scrollbar]:hidden"
      >
        <z-create-picker
          label="Style"
          [display]="styleText()"
          [sections]="styleOptions()"
          [disabled]="custom()"
          [locked]="isLocked('style')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('style', $event)"
          (lockToggled)="state.toggleLock('style')"
        >
          <z-create-glyph slot="glyph" kind="style" [value]="design().style" />
        </z-create-picker>
        <div class="relative -mx-3 -my-2 hidden h-5 shrink-0 md:block" role="presentation">
          <div class="bg-border absolute inset-x-0 top-1/2 h-px"></div>
        </div>

        <div
          class="ring-foreground/10 flex w-40 shrink-0 flex-row items-center justify-between gap-2 rounded-xl p-3 ring-1 md:w-full md:rounded-lg md:px-2.5 md:py-2"
          data-testid="custom-theme"
        >
          <label class="flex min-w-0 flex-col" for="create-custom-theme">
            <span class="text-muted-foreground text-xs leading-4">Theme</span>
            <span class="text-foreground text-sm leading-5 font-medium">Custom colors</span>
          </label>
          <z-switch
            zId="create-custom-theme"
            zSize="sm"
            [zChecked]="custom()"
            (zCheckedChange)="state.setCustom($event)"
          />
        </div>
        @if (custom()) {
          @if (mobile()) {
            <button
              type="button"
              class="ring-foreground/10 hover:bg-muted w-36 shrink-0 rounded-xl p-3 text-left ring-1"
              (click)="editorOpen.set(true)"
            >
              <span class="text-muted-foreground block text-xs leading-4">Colors</span>
              <span class="text-foreground block text-sm leading-5 font-medium">Edit theme</span>
            </button>
          } @else {
            <!-- The editor and its color pickers are fetched only once Custom is turned on. -->
            @defer {
              <z-create-theme-editor />
            }
          }
        } @else {
          <z-create-picker
            label="Base Color"
            [display]="baseText()"
            [sections]="baseOptions()"
            [locked]="isLocked('baseColor')"
            [mobile]="mobile()"
            [anchor]="card"
            (picked)="pick('baseColor', $event)"
            (lockToggled)="state.toggleLock('baseColor')"
          >
            <z-create-glyph slot="glyph" kind="dot" [value]="dot(design().baseColor)" />
          </z-create-picker>
          <z-create-picker
            label="Theme"
            maxHeight="max-h-92"
            [display]="themeText()"
            [sections]="themeOptions()"
            [locked]="isLocked('theme')"
            [mobile]="mobile()"
            [anchor]="card"
            (picked)="pick('theme', $event)"
            (lockToggled)="state.toggleLock('theme')"
          >
            <z-create-glyph slot="glyph" kind="dot" [value]="dot(design().theme)" />
          </z-create-picker>
          <z-create-picker
            label="Chart Color"
            maxHeight="max-h-92"
            [display]="chartText()"
            [sections]="chartOptions()"
            [locked]="isLocked('chartColor')"
            [mobile]="mobile()"
            [anchor]="card"
            (picked)="pick('chartColor', $event)"
            (lockToggled)="state.toggleLock('chartColor')"
          >
            <z-create-glyph slot="glyph" kind="dot" [value]="dot(design().chartColor)" />
          </z-create-picker>
        }
        <div class="relative -mx-3 -my-2 hidden h-5 shrink-0 md:block" role="presentation">
          <div class="bg-border absolute inset-x-0 top-1/2 h-px"></div>
        </div>

        <z-create-picker
          label="Heading"
          longValue
          maxHeight="max-h-96"
          [display]="headingText()"
          [sections]="headingOptions()"
          [disabled]="custom()"
          [locked]="isLocked('fontHeading')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('fontHeading', $event)"
          (lockToggled)="state.toggleLock('fontHeading')"
        >
          <z-create-glyph slot="glyph" kind="aa" [value]="headingGlyph()" />
        </z-create-picker>
        <z-create-picker
          label="Font"
          longValue
          maxHeight="max-h-96"
          [display]="fontText()"
          [sections]="fontOptions()"
          [disabled]="custom()"
          [locked]="isLocked('font')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('font', $event)"
          (lockToggled)="state.toggleLock('font')"
        >
          <z-create-glyph slot="glyph" kind="aa" [value]="fontGlyph()" />
        </z-create-picker>
        <div class="relative -mx-3 -my-2 hidden h-5 shrink-0 md:block" role="presentation">
          <div class="bg-border absolute inset-x-0 top-1/2 h-px"></div>
        </div>

        <z-create-picker
          label="Icon Library"
          [display]="iconText()"
          [sections]="iconOptions()"
          [disabled]="custom()"
          [locked]="isLocked('iconLibrary')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('iconLibrary', $event)"
          (lockToggled)="state.toggleLock('iconLibrary')"
        >
          <z-create-glyph slot="glyph" kind="icons" [value]="design().iconLibrary" />
        </z-create-picker>
        <z-create-picker
          label="Radius"
          [display]="radiusText()"
          [sections]="radiusOptions()"
          [disabled]="state.constraints().radiusLocked"
          [locked]="isLocked('radius')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('radius', $event)"
          (lockToggled)="state.toggleLock('radius')"
        >
          <z-create-glyph slot="glyph" kind="radius" />
        </z-create-picker>
        <div class="relative -mx-3 -my-2 hidden h-5 shrink-0 md:block" role="presentation">
          <div class="bg-border absolute inset-x-0 top-1/2 h-px"></div>
        </div>

        <z-create-picker
          label="Menu"
          longValue
          [display]="menuText()"
          [sections]="menuOptions()"
          [disabled]="custom()"
          [locked]="isLocked('menu')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('menu', $event)"
          (lockToggled)="state.toggleLock('menu')"
        >
          <z-create-glyph slot="glyph" kind="menu" />
        </z-create-picker>
        <z-create-picker
          label="Menu Accent"
          class="max-md:pr-3"
          [display]="accentText()"
          [sections]="accentOptions()"
          [locked]="isLocked('menuAccent')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('menuAccent', $event)"
          (lockToggled)="state.toggleLock('menuAccent')"
        >
          <z-create-glyph slot="glyph" kind="accent" [value]="design().menuAccent" />
        </z-create-picker>
      </div>

      <div
        class="bg-muted/50 flex min-w-0 gap-2 border-t p-2.5 md:flex-col md:p-3 [&>button]:min-w-0 md:[&>button]:w-full"
      >
        <button
          type="button"
          z-button
          zType="outline"
          class="hover:bg-muted! min-w-0 flex-1 rounded-lg bg-transparent! px-2! text-sm! max-md:h-10! md:flex-none"
          data-testid="copy-preset"
          [disabled]="custom()"
          [attr.title]="copyLabel()"
          (click)="copyPreset()"
        >
          <span class="block min-w-0 truncate">{{ copyLabel() }}</span>
        </button>
        <button
          type="button"
          z-button
          zType="outline"
          class="hover:bg-muted! max-w-20 min-w-0 flex-1 rounded-lg bg-transparent! px-2! text-sm! max-md:h-10! sm:max-w-none md:flex-none"
          (click)="state.openPresetOpen.set(true)"
        >
          <span class="truncate">{{ mobile() ? 'Open' : 'Open Preset' }}</span>
        </button>
        <button
          type="button"
          z-button
          zType="outline"
          class="hover:bg-muted! max-w-20 min-w-0 flex-1 rounded-lg bg-transparent! px-2! text-sm! max-md:h-10! sm:max-w-none md:flex-none"
          [disabled]="custom()"
          (click)="state.shuffle()"
        >
          <span class="truncate">Shuffle</span>
        </button>
      </div>
      <div class="bg-muted/50 hidden border-t p-3 md:-mt-3 md:block">
        <button type="button" z-button class="hover:bg-primary/80! w-full rounded-lg" (click)="shell.openGetCode()">
          Get Code
        </button>
      </div>
    </section>

    @if (mobile() && custom()) {
      @defer {
        <z-sheet zSide="bottom" class="dark max-h-[70vh]" [(zVisible)]="editorOpen">
          <z-sheet-header>
            <z-sheet-title>Custom colors</z-sheet-title>
            <z-sheet-description>Every color of the theme. A custom theme is installed by hand.</z-sheet-description>
          </z-sheet-header>
          <div class="no-scrollbar min-h-0 overflow-y-auto px-4 pb-4">
            <z-create-theme-editor />
          </div>
        </z-sheet>
      }
    }
  `,
})
export class CreateCustomizerComponent {
  protected readonly state = inject(CreateStateService);
  protected readonly shell = inject(CreateShellService);
  private readonly document = inject(DOCUMENT);

  /** Whether the customizer is the phone-sized row: menus open above the card. */
  readonly mobile = input(false);

  protected readonly design = this.state.design;
  protected readonly custom = this.state.isCustom;
  /** The phone's color editor: a bottom sheet, the customizer there being a row of cards. */
  protected readonly editorOpen = signal(false);
  private readonly constraints = this.state.constraints;

  protected readonly styleOptions = computed(() => styleSections(this.design()));
  protected readonly baseOptions = computed(() => baseColorSections(this.design()));
  protected readonly themeOptions = computed(() => themeSections('theme', this.design(), this.constraints()));
  protected readonly chartOptions = computed(() => themeSections('chartColor', this.design(), this.constraints()));
  protected readonly headingOptions = computed(() => fontSections('fontHeading', this.design()));
  protected readonly fontOptions = computed(() => fontSections('font', this.design()));
  protected readonly iconOptions = computed(() => iconSections(this.design()));
  protected readonly radiusOptions = computed(() => radiusSections(this.design(), this.constraints()));
  protected readonly menuOptions = computed(() => menuSections(this.design(), this.constraints()));
  protected readonly accentOptions = computed(() => accentSections(this.design(), this.constraints()));

  protected readonly styleText = computed(() => styleLabel(this.design()));
  protected readonly baseText = computed(() => this.capitalize(this.design().baseColor));
  protected readonly themeText = computed(() => this.capitalize(this.design().theme));
  protected readonly chartText = computed(() => this.capitalize(this.design().chartColor));
  protected readonly headingText = computed(() => headingLabel(this.design()));
  protected readonly fontText = computed(() => fontLabel(this.design().font));
  protected readonly iconText = computed(() => iconLibraryLabel(this.design()));
  protected readonly radiusText = computed(() => radiusLabel(this.design()));
  protected readonly menuText = computed(() => menuLabel(this.design()));
  protected readonly accentText = computed(() => accentLabel(this.design()));
  protected readonly headingGlyph = computed(() => headingFamily(this.design()) ?? '');
  protected readonly fontGlyph = computed(() => fontFamily(this.design().font) ?? '');

  private readonly copied = signal(false);
  protected readonly copyLabel = computed(() => {
    if (this.custom()) return 'Custom theme';
    return this.copied() ? 'Copied' : `--preset ${this.state.preset()}`;
  });

  private copiedTimer: ReturnType<typeof setTimeout> | null = null;

  protected dot(id: string): string {
    return colorDot(id);
  }

  protected isLocked(key: LockKey): boolean {
    return this.state.isLocked(key);
  }

  protected pick(picker: PickerId, event: PickerEvent): void {
    this.state.commit(changeFor(picker, event));
  }

  protected async copyPreset(): Promise<void> {
    const ok = await copyText(this.document, `--preset ${this.state.preset()}`);
    if (!ok) return;

    this.copied.set(true);
    if (this.copiedTimer) clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(false), COPIED_MS);
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
