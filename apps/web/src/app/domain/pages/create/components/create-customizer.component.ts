import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';

import { CreateGlyphComponent } from './create-glyph.component';
import { CreateMenuComponent } from './create-menu.component';
import { CreatePickerComponent } from './create-picker.component';
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
  imports: [CreatePickerComponent, CreateGlyphComponent, CreateMenuComponent, ZardButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section
      #card
      class="dark bg-card/90 text-foreground ring-foreground/10 isolate z-10 flex max-h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl ring-1 backdrop-blur-xl md:h-full"
      aria-label="Customize the design"
    >
      <div class="hidden border-b p-2.5 md:block">
        <z-create-menu />
      </div>

      <div
        class="flex min-h-0 flex-1 [scrollbar-width:none] flex-row gap-2.5 overflow-x-auto p-2.5 md:flex-col md:gap-3.25 md:overflow-x-hidden md:overflow-y-auto [&::-webkit-scrollbar]:hidden"
      >
        <z-create-picker
          label="Style"
          [display]="styleText()"
          [sections]="styleOptions()"
          [locked]="isLocked('style')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('style', $event)"
          (hovered)="hover('style', $event)"
          (cleared)="state.clearPreview()"
          (lockToggled)="state.toggleLock('style')"
        >
          <z-create-glyph slot="glyph" kind="style" [value]="design().style" />
        </z-create-picker>
        <div class="bg-border -mx-2.5 hidden h-px shrink-0 md:block"></div>

        <z-create-picker
          label="Base Color"
          [display]="baseText()"
          [sections]="baseOptions()"
          [locked]="isLocked('baseColor')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('baseColor', $event)"
          (hovered)="hover('baseColor', $event)"
          (cleared)="state.clearPreview()"
          (lockToggled)="state.toggleLock('baseColor')"
        >
          <z-create-glyph slot="glyph" kind="dot" [value]="dot('base', design().baseColor)" />
        </z-create-picker>
        <z-create-picker
          label="Theme"
          [display]="themeText()"
          [sections]="themeOptions()"
          [locked]="isLocked('theme')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('theme', $event)"
          (hovered)="hover('theme', $event)"
          (cleared)="state.clearPreview()"
          (lockToggled)="state.toggleLock('theme')"
        >
          <z-create-glyph slot="glyph" kind="dot" [value]="dot('theme', design().theme)" />
        </z-create-picker>
        <z-create-picker
          label="Chart Color"
          [display]="chartText()"
          [sections]="chartOptions()"
          [locked]="isLocked('chartColor')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('chartColor', $event)"
          (hovered)="hover('chartColor', $event)"
          (cleared)="state.clearPreview()"
          (lockToggled)="state.toggleLock('chartColor')"
        >
          <z-create-glyph slot="glyph" kind="dot" [value]="dot('chart', design().chartColor)" />
        </z-create-picker>
        <div class="bg-border -mx-2.5 hidden h-px shrink-0 md:block"></div>

        <z-create-picker
          label="Heading"
          [display]="headingText()"
          [sections]="headingOptions()"
          [locked]="isLocked('fontHeading')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('fontHeading', $event)"
          (hovered)="hover('fontHeading', $event)"
          (cleared)="state.clearPreview()"
          (lockToggled)="state.toggleLock('fontHeading')"
        >
          <z-create-glyph slot="glyph" kind="aa" [value]="headingGlyph()" />
        </z-create-picker>
        <z-create-picker
          label="Font"
          [display]="fontText()"
          [sections]="fontOptions()"
          [locked]="isLocked('font')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('font', $event)"
          (hovered)="hover('font', $event)"
          (cleared)="state.clearPreview()"
          (lockToggled)="state.toggleLock('font')"
        >
          <z-create-glyph slot="glyph" kind="aa" [value]="fontGlyph()" />
        </z-create-picker>
        <div class="bg-border -mx-2.5 hidden h-px shrink-0 md:block"></div>

        <z-create-picker
          label="Icon Library"
          [display]="iconText()"
          [sections]="iconOptions()"
          [locked]="isLocked('iconLibrary')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('iconLibrary', $event)"
          (hovered)="hover('iconLibrary', $event)"
          (cleared)="state.clearPreview()"
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
          (hovered)="hover('radius', $event)"
          (cleared)="state.clearPreview()"
          (lockToggled)="state.toggleLock('radius')"
        >
          <z-create-glyph slot="glyph" kind="radius" />
        </z-create-picker>
        <div class="bg-border -mx-2.5 hidden h-px shrink-0 md:block"></div>

        <z-create-picker
          label="Menu"
          [display]="menuText()"
          [sections]="menuOptions()"
          [locked]="isLocked('menu')"
          [mobile]="mobile()"
          [anchor]="card"
          (picked)="pick('menu', $event)"
          (hovered)="hover('menu', $event)"
          (cleared)="state.clearPreview()"
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
          (hovered)="hover('menuAccent', $event)"
          (cleared)="state.clearPreview()"
          (lockToggled)="state.toggleLock('menuAccent')"
        >
          <z-create-glyph slot="glyph" kind="accent" [value]="design().menuAccent" />
        </z-create-picker>
      </div>

      <div class="flex min-w-0 gap-2 border-t p-2.5 md:flex-col [&>button]:min-w-0 md:[&>button]:w-full">
        <button
          type="button"
          z-button
          zType="outline"
          class="hover:bg-muted! min-w-0 flex-1 bg-transparent! px-2! text-sm! md:flex-none"
          data-testid="copy-preset"
          [attr.title]="copyLabel()"
          (click)="copyPreset()"
        >
          <span class="block min-w-0 truncate">{{ copyLabel() }}</span>
        </button>
        <button
          type="button"
          z-button
          zType="outline"
          class="hover:bg-muted! max-w-20 min-w-0 flex-1 bg-transparent! px-2! text-sm! sm:max-w-none md:flex-none"
          (click)="state.openPresetOpen.set(true)"
        >
          <span class="truncate">{{ mobile() ? 'Open' : 'Open Preset' }}</span>
        </button>
        <button
          type="button"
          z-button
          zType="outline"
          class="hover:bg-muted! max-w-20 min-w-0 flex-1 bg-transparent! px-2! text-sm! sm:max-w-none md:flex-none"
          (click)="state.shuffle()"
        >
          <span class="truncate">Shuffle</span>
        </button>
      </div>
      <div class="hidden p-2.5 pt-0 md:block">
        <button type="button" z-button class="w-full" (click)="shell.openGetCode()">Get Code</button>
      </div>
    </section>
  `,
})
export class CreateCustomizerComponent {
  protected readonly state = inject(CreateStateService);
  protected readonly shell = inject(CreateShellService);
  private readonly document = inject(DOCUMENT);

  /** Whether the customizer is the phone-sized row: menus open above, and hover preview is off. */
  readonly mobile = input(false);

  protected readonly design = this.state.design;
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
  protected readonly copyLabel = computed(() => (this.copied() ? 'Copied' : `--preset ${this.state.preset()}`));
  private copiedTimer: ReturnType<typeof setTimeout> | null = null;

  protected dot(kind: 'base' | 'theme' | 'chart', id: string): string {
    return colorDot(kind, id);
  }

  protected isLocked(key: LockKey): boolean {
    return this.state.isLocked(key);
  }

  protected pick(picker: PickerId, event: PickerEvent): void {
    this.state.commit(changeFor(picker, event));
  }

  protected hover(picker: PickerId, event: PickerEvent): void {
    this.state.preview(changeFor(picker, event));
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
