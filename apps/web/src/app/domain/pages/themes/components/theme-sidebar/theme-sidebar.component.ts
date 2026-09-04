import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideCopy,
  lucideDownload,
  lucideFileText,
  lucideMoon,
  lucidePalette,
  lucideRotateCcw,
  lucideSquare,
  lucideSun,
} from '@ng-icons/lucide';

import { ZardAccordionItemComponent } from '@zard/components/accordion/accordion-item.component';
import { ZardAccordionComponent } from '@zard/components/accordion/accordion.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardSliderComponent } from '@zard/components/slider/slider.component';

import { THEME_PRESETS } from '../../data/theme-presets';
import { COLOR_GROUPS, type ThemeColorKey } from '../../models/theme.model';
import { ThemeGeneratorService } from '../../services/theme-generator.service';
import { ColorPickerFieldComponent } from '../color-picker-field/color-picker-field.component';
import { ThemePresetCardComponent } from '../theme-preset-card/theme-preset-card.component';

@Component({
  selector: 'z-theme-sidebar',
  imports: [
    FormsModule,
    ZardAccordionComponent,
    ZardAccordionItemComponent,
    ZardButtonComponent,
    NgIcon,
    ZardSliderComponent,
    ColorPickerFieldComponent,
    ThemePresetCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'flex h-full flex-col' },
  templateUrl: './theme-sidebar.component.html',
  viewProviders: [
    provideIcons({
      lucideMoon,
      lucideSun,
      lucideSquare,
      lucidePalette,
      lucideCheck,
      lucideCopy,
      lucideRotateCcw,
      lucideFileText,
      lucideDownload,
    }),
  ],
})
export class ThemeSidebarComponent {
  private readonly themeService = inject(ThemeGeneratorService);

  /**
   * `z-slider` takes no accessible-name input, and `aria-labelledby` on the
   * host element does not reach the inner `[role="slider"]` thumb the
   * accessible-name computation actually looks at — confirmed by a Lighthouse
   * `aria-input-field-name` failure on this exact control. `thumbRefs()` and
   * `nativeElement` are both public on the slider components, so this sets the
   * name directly rather than widening the shared component's API for one
   * caller.
   */
  private readonly radiusSlider = viewChild<ZardSliderComponent>('radiusSlider');

  readonly presets = THEME_PRESETS;
  readonly activePreset = this.themeService.activePreset;
  readonly currentColors = this.themeService.currentColors;
  readonly previewDarkMode = this.themeService.previewDarkMode;
  readonly theme = this.themeService.theme;
  readonly isDirty = this.themeService.isDirty;

  readonly colorGroups = [
    { key: 'base', label: 'Base Colors', colors: COLOR_GROUPS.base },
    { key: 'form', label: 'Form Colors', colors: COLOR_GROUPS.form },
    { key: 'chart', label: 'Chart Colors', colors: COLOR_GROUPS.chart },
    { key: 'sidebar', label: 'Sidebar Colors', colors: COLOR_GROUPS.sidebar },
  ];

  readonly radiusValue = computed(() => {
    const radius = this.theme().radius;
    const match = radius.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : 0.5;
  });

  readonly copySuccess = signal(false);
  readonly copyStylesSuccess = signal(false);

  constructor() {
    effect(() => {
      const thumb = this.radiusSlider()?.thumbRefs()[0];
      thumb?.nativeElement.setAttribute('aria-label', 'Radius');
    });
  }

  onPresetSelect(name: string): void {
    this.themeService.applyPreset(name);
  }

  /** Back to the values of the preset this theme started from. */
  reset(): void {
    this.themeService.reset();
  }

  onColorChange(key: ThemeColorKey, value: string): void {
    const mode = this.previewDarkMode() ? 'dark' : 'light';
    this.themeService.updateVariable(key, value, mode);
  }

  onRadiusChange(values: number[]): void {
    const value = values[0];
    this.themeService.updateRadius(`${value}rem`);
  }

  toggleDarkMode(): void {
    this.themeService.togglePreviewDarkMode();
  }

  async copyToClipboard(): Promise<void> {
    const success = await this.themeService.copyToClipboard();
    if (success) {
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    }
  }

  async copyStylesCss(): Promise<void> {
    const success = await this.themeService.copyStylesCss();
    if (success) {
      this.copyStylesSuccess.set(true);
      setTimeout(() => this.copyStylesSuccess.set(false), 2000);
    }
  }

  downloadStylesCss(): void {
    this.themeService.downloadStylesCss();
  }
}
