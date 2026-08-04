import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TABS_0 as CLI_ADD_TABS } from '@generated/pages/dark-mode/cli-add';
import { BLOCK_0 as CLI_CHANGES_BLOCK } from '@generated/pages/dark-mode/cli-changes';
import { BLOCK_0 as CLI_PROMPT_BLOCK } from '@generated/pages/dark-mode/cli-prompt';
import {
  BLOCK_0 as HEADER_COMPONENT_BLOCK,
  BLOCK_1 as HEADER_TEMPLATE_BLOCK,
} from '@generated/pages/dark-mode/header-usage';
import { BLOCK_0 as PROVIDE_ZARD_BLOCK, BLOCK_1 as APP_CONFIG_BLOCK } from '@generated/pages/dark-mode/manual-provider';
import {
  BLOCK_0 as DARK_MODE_SERVICE_BLOCK,
  BLOCK_1 as SERVICES_INDEX_BLOCK,
} from '@generated/pages/dark-mode/manual-service';
import { BLOCK_0 as DARK_VARIANT_BLOCK } from '@generated/pages/dark-mode/manual-tailwind';
import { BLOCK_0 as THEME_SCRIPT_BLOCK } from '@generated/pages/dark-mode/manual-theme-script';
import {
  BLOCK_0 as THEME_SWITCHER_BLOCK,
  BLOCK_1 as THEME_SIGNALS_BLOCK,
} from '@generated/pages/dark-mode/usage-service';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun, lucideSunMoon } from '@ng-icons/lucide';

import { StepsComponent } from '@doc/domain/components/steps/steps.component';
import { Step } from '@doc/shared/constants/install.constant';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { EDarkModes, ZardDarkMode } from '@zard/services/dark-mode';

import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { DocHeadingComponent } from '../../components/doc-heading/doc-heading.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-darkmode',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    CodeBlockComponent,
    StepsComponent,
    RouterLink,
    ZardButtonComponent,
    ZardCardImports,
    NgIcon,
    ZardButtonGroupComponent,
  ],
  templateUrl: './dark-mode.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideSunMoon, lucideSun, lucideMoon })],
})
export class DarkmodePage implements OnInit {
  activeAnchor?: string;

  readonly activeTab = signal<'manual' | 'cli'>('cli');

  readonly themeSwitcherBlock: CodeBlockData = THEME_SWITCHER_BLOCK;
  readonly themeSignalsBlock: CodeBlockData = THEME_SIGNALS_BLOCK;
  readonly headerComponentBlock: CodeBlockData = HEADER_COMPONENT_BLOCK;
  readonly headerTemplateBlock: CodeBlockData = HEADER_TEMPLATE_BLOCK;

  readonly cliSteps: Step[] = [
    {
      title: 'Run the CLI',
      subtitle: 'Add the dark mode service to your project.',
      codeTabData: CLI_ADD_TABS,
    },
    {
      title: 'Answer the prompt',
      subtitle:
        'The CLI asks where your index.html lives because it needs to inject the theme script before Angular bootstraps. Press enter to accept the default.',
      codeBlockData: CLI_PROMPT_BLOCK,
    },
    {
      title: 'Review what the CLI changed',
      subtitle: 'The command is not just a file copy — it wires the service into your app.',
      codeBlockData: CLI_CHANGES_BLOCK,
    },
    {
      // The link to the Usage section lives in the template: Step.url renders a routerLink from a
      // plain string, which percent-encodes the "#" and breaks in-page anchors.
      title: 'Add a theme toggle',
      subtitle: 'Inject the service in any component and let users switch themes.',
    },
  ];

  readonly manualSteps: Step[] = [
    {
      title: 'Add the dark variant',
      subtitle:
        'This is the TailwindCSS v4 variant that makes every dark: utility respond to the .dark class on the root element.',
      url: {
        text: 'See the full list of theme variables',
        href: '/docs/theming',
        external: false,
      },
      codeBlockData: DARK_VARIANT_BLOCK,
    },
    {
      title: 'Create the dark mode service',
      subtitle: 'Copy the service into your services folder. This is byte for byte the file the CLI installs.',
      codeBlockData: [DARK_MODE_SERVICE_BLOCK, SERVICES_INDEX_BLOCK],
    },
    {
      title: 'Prevent the flash of incorrect theme',
      subtitle:
        'Add this script immediately before </head>. It runs before Angular bootstraps, reads localStorage.theme, falls back to prefers-color-scheme when the value is system or missing, and applies .dark and data-theme to the html element — so the first paint already uses the right theme.',
      codeBlockData: THEME_SCRIPT_BLOCK,
    },
    {
      title: 'Initialize the service',
      subtitle:
        'Register provideAppInitializer as the first provider so the theme is resolved before the first component renders. If you do not use provideZard(), add the same initializer to appConfig.providers instead.',
      codeBlockData: [PROVIDE_ZARD_BLOCK, APP_CONFIG_BLOCK],
    },
    {
      title: 'Add a theme toggle',
      subtitle: 'Inject the service wherever you want to expose the switch — a header is the usual place.',
      codeBlockData: [HEADER_COMPONENT_BLOCK, HEADER_TEMPLATE_BLOCK],
    },
    {
      title: "That's it",
      subtitle: 'Your app now switches between light, dark and system themes.',
      url: {
        text: 'Browse the components',
        href: '/docs/components',
        external: false,
      },
    },
  ];

  private readonly seoService = inject(SeoService);

  protected readonly darkModeService = inject(ZardDarkMode);
  protected readonly EDarkModes = EDarkModes;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'how-it-works', label: 'How it works', type: 'core' },
      { id: 'installation', label: 'Installation', type: 'core' },
      { id: 'cli', label: 'Working with the CLI', type: 'core' },
      { id: 'usage', label: 'Usage', type: 'core' },
      { id: 'demo', label: 'Interactive Demo', type: 'custom' },
    ],
  };

  onInstallKeyDown(e: Event, tabList: HTMLElement): void {
    const event = e as KeyboardEvent;
    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]')) as HTMLElement[];
    const currentIndex = tabs.findIndex(tab => tab === event.target);

    if (currentIndex === -1) return;

    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        return;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      tabs[newIndex].focus();
      // Update active tab based on the focused tab's id
      const activeTabValue = tabs[newIndex].id === 'cli-tab' ? 'cli' : 'manual';
      this.activeTab.set(activeTabValue);
    }
  }

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Dark Mode',
      'Install and configure dark mode in your Angular app with the ZardUI CLI or manually, then switch between light, dark and system themes.',
      '/docs/dark-mode',
      'og-darkmode.jpg',
    );
  }
}
