import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { THEMING_ADDING_COLORS_EXAMPLE } from '@generated/documentation/theming/adding-colors-example';
import { THEMING_BASE_COLORS_GRAY } from '@generated/documentation/theming/base-colors-gray';
import { THEMING_BASE_COLORS_NEUTRAL } from '@generated/documentation/theming/base-colors-neutral';
import { THEMING_BASE_COLORS_SLATE } from '@generated/documentation/theming/base-colors-slate';
import { THEMING_BASE_COLORS_STONE } from '@generated/documentation/theming/base-colors-stone';
import { THEMING_BASE_COLORS_ZINC } from '@generated/documentation/theming/base-colors-zinc';
import { THEMING_CONVENTION_EXAMPLE } from '@generated/documentation/theming/convention-example';
import { THEMING_CSS_VARIABLES_INTRO } from '@generated/documentation/theming/css-variables-intro';
import { THEMING_CSS_VARIABLES_V4 } from '@generated/documentation/theming/css-variables-v4';
import { THEMING_OTHER_COLOR_FORMATS } from '@generated/documentation/theming/other-color-formats';
import { THEMING_ROUTE_THEME } from '@generated/documentation/theming/route-theme';
import { THEMING_SCOPED_TOKENS } from '@generated/documentation/theming/scoped-tokens';
import { THEMING_UTILITY_CLASSES_INTRO } from '@generated/documentation/theming/utility-classes-intro';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

import { BaseColorPreviewComponent } from './components/base-color-preview/base-color-preview.component';
import { ConventionPreviewComponent } from './components/convention-preview/convention-preview.component';
import { RadiusPreviewComponent } from './components/radius-preview/radius-preview.component';
import { ThemeAnatomyComponent } from './components/theme-anatomy/theme-anatomy.component';
import { TokenTableComponent } from './components/token-table/token-table.component';
import { TroubleshootingListComponent } from './components/troubleshooting-list/troubleshooting-list.component';
import { OKLCH_REASONS } from './data/anatomy.data';
import { THEME_TOKENS } from './data/tokens.data';
import { ThemingClipboardService } from './services/theming-clipboard.service';

@Component({
  selector: 'z-theming',
  standalone: true,
  imports: [
    RouterModule,
    CalloutComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    CodeBlockComponent,
    BaseColorPreviewComponent,
    ConventionPreviewComponent,
    RadiusPreviewComponent,
    ThemeAnatomyComponent,
    TokenTableComponent,
    TroubleshootingListComponent,
  ],
  templateUrl: './theming.page.html',
  // Scoped to the page so the "last copied" state does not leak into other routes.
  providers: [ThemingClipboardService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemingPage implements OnInit {
  private readonly seoService = inject(SeoService);

  readonly activeAnchor = signal<string | undefined>(undefined);

  readonly cssVarsIntroBlock: CodeBlockData = THEMING_CSS_VARIABLES_INTRO;
  readonly cssVarsV4Block: CodeBlockData = THEMING_CSS_VARIABLES_V4;
  readonly utilityClassesIntroBlock: CodeBlockData = THEMING_UTILITY_CLASSES_INTRO;
  readonly otherColorFormatsBlock: CodeBlockData = THEMING_OTHER_COLOR_FORMATS;
  readonly conventionExample: CodeBlockData = THEMING_CONVENTION_EXAMPLE;
  readonly addingColorsExample: CodeBlockData[] = THEMING_ADDING_COLORS_EXAMPLE;
  readonly scopedTokensExample: CodeBlockData[] = THEMING_SCOPED_TOKENS;
  readonly routeThemeExample: CodeBlockData[] = THEMING_ROUTE_THEME;

  /** Full `src/styles.css` per base color, handed to the preview so each tab can expand it. */
  readonly baseColorBlocks: Record<string, CodeBlockData> = {
    neutral: THEMING_BASE_COLORS_NEUTRAL,
    stone: THEMING_BASE_COLORS_STONE,
    zinc: THEMING_BASE_COLORS_ZINC,
    gray: THEMING_BASE_COLORS_GRAY,
    slate: THEMING_BASE_COLORS_SLATE,
  };

  readonly tokenCount = THEME_TOKENS.length;
  readonly oklchReasons = OKLCH_REASONS;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'how-it-works', label: 'How it works', type: 'custom' },
      { id: 'convention', label: 'Convention', type: 'custom' },
      { id: 'token-reference', label: 'Token reference', type: 'custom' },
      { id: 'radius', label: 'Radius & scale', type: 'custom' },
      { id: 'base-colors', label: 'Base colors', type: 'custom' },
      { id: 'dark-mode', label: 'Dark mode', type: 'custom' },
      { id: 'customizing', label: 'Customizing', type: 'custom' },
      { id: 'troubleshooting', label: 'Troubleshooting', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Theming',
      'How ZardUI theming works: OKLCH design tokens, the @theme inline mapping, the five base colors, dark mode, scoped overrides and a full token reference.',
      '/docs/theming',
      'og-theming.jpg',
    );
  }
}
