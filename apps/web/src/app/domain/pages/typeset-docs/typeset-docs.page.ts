import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TYPESET_ACCESSIBILITY } from '@generated/documentation/typeset/accessibility';
import { TYPESET_ANATOMY } from '@generated/documentation/typeset/anatomy';
import { TYPESET_CLI_INSTALL } from '@generated/documentation/typeset/cli-install';
import { TYPESET_CUSTOM_THEMES } from '@generated/documentation/typeset/custom-themes';
import { TYPESET_FONTS_EXAMPLE } from '@generated/documentation/typeset/fonts-example';
import { TYPESET_INLINE_OVERRIDE } from '@generated/documentation/typeset/inline-override';
import { TYPESET_MULTIPLE_PRESETS } from '@generated/documentation/typeset/multiple-presets';
import { TYPESET_OPT_OUT } from '@generated/documentation/typeset/opt-out';
import { TYPESET_OVERRIDES_EXAMPLE } from '@generated/documentation/typeset/overrides-example';
import { TYPESET_PRESET_EXAMPLE } from '@generated/documentation/typeset/preset-example';
import { TYPESET_RESPONSIVE_TABLE } from '@generated/documentation/typeset/responsive-table';
import { TYPESET_USAGE_WRAPPER } from '@generated/documentation/typeset/usage-wrapper';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

import { CalloutComponent } from '@doc/domain/components/callout/callout.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

@Component({
  selector: 'z-typeset-docs',
  standalone: true,
  imports: [
    RouterModule,
    CalloutComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    CodeBlockComponent,
    CodeTabsComponent,
  ],
  templateUrl: './typeset-docs.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypesetDocsPage implements OnInit {
  private readonly seoService = inject(SeoService);

  readonly activeAnchor = signal<string | undefined>(undefined);

  readonly installTabs: CodeTabData = TYPESET_CLI_INSTALL;
  readonly usageWrapperBlock: CodeBlockData = TYPESET_USAGE_WRAPPER;
  readonly presetExampleBlock: CodeBlockData = TYPESET_PRESET_EXAMPLE;
  readonly anatomyBlock: CodeBlockData = TYPESET_ANATOMY;
  readonly multiplePresetsBlock: CodeBlockData = TYPESET_MULTIPLE_PRESETS;
  readonly inlineOverrideBlock: CodeBlockData = TYPESET_INLINE_OVERRIDE;
  readonly fontsExampleBlock: CodeBlockData = TYPESET_FONTS_EXAMPLE;
  readonly customThemesBlock: CodeBlockData = TYPESET_CUSTOM_THEMES;
  readonly accessibilityBlock: CodeBlockData = TYPESET_ACCESSIBILITY;
  readonly responsiveTableBlock: CodeBlockData = TYPESET_RESPONSIVE_TABLE;
  readonly overridesBlock: CodeBlockData = TYPESET_OVERRIDES_EXAMPLE;
  readonly optOutBlock: CodeBlockData = TYPESET_OPT_OUT;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'principles', label: 'Principles', type: 'custom' },
      { id: 'features', label: 'Features', type: 'custom' },
      { id: 'installation', label: 'Installation', type: 'custom' },
      { id: 'custom-typesets', label: 'Custom typesets', type: 'custom' },
      { id: 'fonts', label: 'Fonts', type: 'custom' },
      { id: 'custom-themes', label: 'Custom themes', type: 'custom' },
      { id: 'accessibility', label: 'Accessibility and dark mode', type: 'custom' },
      { id: 'responsive-table', label: 'Responsive table', type: 'custom' },
      { id: 'overrides', label: 'Overrides', type: 'custom' },
      { id: 'opting-out', label: 'Opting out', type: 'custom' },
      { id: 'streaming', label: 'Streaming', type: 'custom' },
      { id: 'prior-art', label: 'Prior art', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Typeset',
      'A styling system for HTML and rendered markdown, from blog posts to streaming chat. One CSS file you own, governed by three controls: size, leading and flow.',
      '/docs/typeset',
      'og-typeset.jpg',
    );
  }
}
