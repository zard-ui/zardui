import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardAccordionItemComponent } from '@zard/components/accordion/accordion-item.component';
import { ZardAccordionComponent } from '@zard/components/accordion/accordion.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardSliderComponent } from '@zard/components/slider/slider.component';

import { THEME_PRESETS } from '../../data/theme-presets';
import { COLOR_GROUPS, type ThemeColorKey } from '../../models/theme.model';
import { ThemeGeneratorService } from '../../services/theme-generator.service';
import { ColorPickerFieldComponent } from '../color-picker-field/color-picker-field.component';
import { ThemePresetCardComponent } from '../theme-preset-card/theme-preset-card.component';

@Component({
  selector: 'app-theme-sidebar',
  standalone: true,
  imports: [
    FormsModule,
    ZardAccordionComponent,
    ZardAccordionItemComponent,
    ZardButtonComponent,
    ZardIconComponent,
    ZardSliderComponent,
    ColorPickerFieldComponent,
    ThemePresetCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'flex h-full flex-col' },
  templateUrl: './theme-sidebar.component.html',
})
export class ThemeSidebarComponent {
  private readonly themeService = inject(ThemeGeneratorService);

  readonly presets = THEME_PRESETS;
  readonly activePreset = this.themeService.activePreset;
  readonly currentColors = this.themeService.currentColors;
  readonly previewDarkMode = this.themeService.previewDarkMode;
  readonly theme = this.themeService.theme;

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

  onPresetSelect(name: string): void {
    this.themeService.applyPreset(name);
  }

  onColorChange(key: ThemeColorKey, value: string): void {
    const mode = this.previewDarkMode() ? 'dark' : 'light';
    this.themeService.updateVariable(key, value, mode);
  }

  onRadiusChange(value: number): void {
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
}
