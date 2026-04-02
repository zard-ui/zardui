import { Component, inject, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { THEMING_ADDING_COLORS_EXAMPLE } from '@generated/documentation/theming/adding-colors-example';
import { THEMING_APP_CONFIG } from '@generated/documentation/theming/app.config';
import { THEMING_BASE_COLORS_GRAY } from '@generated/documentation/theming/base-colors-gray';
import { THEMING_BASE_COLORS_NEUTRAL } from '@generated/documentation/theming/base-colors-neutral';
import { THEMING_BASE_COLORS_SLATE } from '@generated/documentation/theming/base-colors-slate';
import { THEMING_BASE_COLORS_STONE } from '@generated/documentation/theming/base-colors-stone';
import { THEMING_BASE_COLORS_ZINC } from '@generated/documentation/theming/base-colors-zinc';
import { THEMING_CONVENTION_EXAMPLE } from '@generated/documentation/theming/convention-example';
import { THEMING_VARIABLES_LIST } from '@generated/documentation/theming/variables-list';
import { BLOCK_0 as CSS_VARS_INTRO_BLOCK } from '@generated/pages/theming/css-variables-intro';
import { BLOCK_0 as CSS_VARS_V4_BLOCK } from '@generated/pages/theming/css-variables-v4';
import { BLOCK_0 as OTHER_COLOR_FORMATS_BLOCK } from '@generated/pages/theming/other-color-formats';
import { BLOCK_0 as UTILITY_CLASSES_INTRO_BLOCK } from '@generated/pages/theming/utility-classes-intro';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

@Component({
  selector: 'z-theming',
  standalone: true,
  imports: [
    RouterModule,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    CodeBlockComponent,
  ],
  templateUrl: './theming.page.html',
})
export class ThemingPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  readonly appConfig: CodeBlockData = THEMING_APP_CONFIG;
  readonly cssVarsIntroBlock: CodeBlockData = CSS_VARS_INTRO_BLOCK;
  readonly cssVarsV4Block: CodeBlockData = CSS_VARS_V4_BLOCK;
  readonly utilityClassesIntroBlock: CodeBlockData = UTILITY_CLASSES_INTRO_BLOCK;
  readonly otherColorFormatsBlock: CodeBlockData = OTHER_COLOR_FORMATS_BLOCK;
  readonly conventionExample: CodeBlockData = THEMING_CONVENTION_EXAMPLE;
  readonly variablesList: CodeBlockData = THEMING_VARIABLES_LIST;
  readonly addingColorsExample: CodeBlockData[] = THEMING_ADDING_COLORS_EXAMPLE;
  readonly baseColorsNeutral: CodeBlockData = THEMING_BASE_COLORS_NEUTRAL;
  readonly baseColorsStone: CodeBlockData = THEMING_BASE_COLORS_STONE;
  readonly baseColorsZinc: CodeBlockData = THEMING_BASE_COLORS_ZINC;
  readonly baseColorsGray: CodeBlockData = THEMING_BASE_COLORS_GRAY;
  readonly baseColorsSlate: CodeBlockData = THEMING_BASE_COLORS_SLATE;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'css-variables', label: 'CSS Variables', type: 'custom' },
      { id: 'utility-classes', label: 'Utility Classes', type: 'custom' },
      { id: 'convention', label: 'Convention', type: 'custom' },
      { id: 'variables-list', label: 'Variables List', type: 'custom' },
      { id: 'adding-new-colors', label: 'Adding New Colors', type: 'custom' },
      { id: 'base-colors', label: 'Base Colors', type: 'custom' },
      { id: 'other-formats', label: 'Other Formats', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Theming',
      'Customize your Zard UI theme with CSS variables and Tailwind CSS. Learn how to add custom colors, use utility classes, and create your own design system.',
      '/docs/theming',
      'og-theming.jpg',
    );
  }
}
